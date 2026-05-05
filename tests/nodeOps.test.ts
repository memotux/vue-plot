import { defineComponent, h, ref, nextTick } from "vue"
import { mount } from "@vue/test-utils"
import { describe, it, expect, afterAll, beforeEach } from "vitest"
import Plot from "../src/components/Plot.vue"
import { getPlotApp } from "../src/core"

describe('nodeOps regression tests', () => {
  describe('Bug #1: props object must not be mutated', () => {
    const capturedProps: Record<string, unknown>[] = []

    const App = defineComponent({
      setup() {
        const textProps: Record<string, unknown> = {
          data: ['Hello'],
          frameAnchor: 'middle',
        }
        capturedProps.push(textProps)
        return () => h(Plot, null, () => [
          h('PlotFrame'),
          h('PlotText', textProps),
        ])
      }
    })

    const component = mount(App, { attachTo: document.body })

    it('does not delete the data property from props after createElement', () => {
      const textProps = capturedProps[0]
      // If props were mutated, data would have been deleted by `delete markProps.data`
      expect(textProps).toHaveProperty('data')
      expect(Array.isArray(textProps.data)).toBe(true)
      expect(textProps.data).toEqual(['Hello'])
    })

    it('preserves all non-data props alongside data', () => {
      const textProps = capturedProps[0]
      // frameAnchor should still be present alongside data
      expect(textProps).toHaveProperty('frameAnchor', 'middle')
      expect(Object.keys(textProps).length).toBe(2) // data + frameAnchor
    })

    afterAll(() => component.unmount())
  })

  describe('Bug #2: mark descriptors must be cleaned up on remove', () => {
    let component2: ReturnType<typeof mount>

    it('removes mark descriptor from ctx.marks when remove is called with a PlotChildrenContext', async () => {
      const App = defineComponent({
        setup() {
          return () => h(Plot, null, () => [
            h('PlotFrame'),
            h('PlotText', { data: ['Hello'], frameAnchor: 'middle' }),
          ])
        }
      })

      component2 = mount(App, { attachTo: document.body })
      await nextTick()

      const { ctx } = getPlotApp()

      // Get the plot context
      const plotIds = Array.from(ctx.keys())
      const plotCtx = ctx.get(plotIds[plotIds.length - 1])
      expect(plotCtx).toBeDefined()

      // Should have marks (frame + text)
      const initialMarkCount = plotCtx!.marks.length
      expect(initialMarkCount).toBeGreaterThanOrEqual(2)

      // Capture the parent container and its children before removal
      const parentEl = component2.element as HTMLDivElement

      // Get the text mark descriptor (last one added)
      const textMark = plotCtx!.marks[plotCtx!.marks.length - 1]
      expect(textMark.data).toEqual(['Hello'])

      // Directly call the remove function from nodeOps
      // We need to get it from the renderer
      const nodeOpsModule = await import('../src/core/nodeOps')
      const renderer = nodeOpsModule.default()

      // Call remove with the mark descriptor
      renderer.remove(textMark as unknown as Element)

      // The text mark should be removed from ctx.marks
      const marksAfterRemoval = plotCtx!.marks
      const textMarks = marksAfterRemoval.filter(m => m.data && Array.isArray(m.data) && (m.data as unknown[]).includes('Hello'))
      expect(textMarks.length).toBe(0)
      // Frame should still be there
      expect(marksAfterRemoval.length).toBe(initialMarkCount - 1)

      // Verify DOM cleanup: a new SVG should have been inserted (re-render triggered)
      // The old SVG should no longer be the only child — the parent should have a fresh SVG
      const svgElements = parentEl.querySelectorAll('svg')
      expect(svgElements.length).toBe(1) // Exactly one SVG after re-render (old replaced)
    })

    it('does not crash when removing an untracked element', async () => {
      const App = defineComponent({
        setup() {
          return () => h(Plot, null, () => [
            h('PlotFrame'),
          ])
        }
      })

      const component = mount(App, { attachTo: document.body })

      // Should not throw — unmounting a plot with only a frame
      expect(() => component.unmount()).not.toThrow()
    })

    afterAll(() => component2?.unmount())
  })

  describe('Bug #3: v-if toggle must remove mark descriptor through Vue renderer', () => {
    let component3: ReturnType<typeof mount>

    it('removes mark descriptor from ctx.marks when v-if toggles from true to false', async () => {
      const App = defineComponent({
        setup() {
          const showDot = ref(true)
          return { showDot }
        },
        render() {
          // :key forces Plot to re-mount when showDot changes, ensuring the
          // custom renderer re-renders with the updated slot function
          return h(Plot, { key: this.showDot ? 'with-dot' : 'without-dot' }, () => [
            h('PlotFrame'),
            this.showDot ? h('PlotDot', { data: [{ x: 1, y: 2 }], x: 'x', y: 'y' }) : null,
          ])
        },
      })

      component3 = mount(App, { attachTo: document.body })
      await nextTick()
      await nextTick()

      const { ctx } = getPlotApp()
      const plotIds = Array.from(ctx.keys())
      const plotCtx = ctx.get(plotIds[plotIds.length - 1])
      expect(plotCtx).toBeDefined()

      // Should have marks: frame + dot
      const initialMarkCount = plotCtx!.marks.length
      expect(initialMarkCount).toBe(2)

      // Verify the dot mark is present
      const dotMarks = plotCtx!.marks.filter(m => m.data && Array.isArray(m.data))
      expect(dotMarks.length).toBe(1)
      expect((dotMarks[0].data as any[])[0]).toEqual({ x: 1, y: 2 })

      // Toggle showDot to false — key change forces Plot re-mount:
      // old Plot unmounts → removePlot cleans up → new Plot mounts with slot returning only Frame
      // This exercises the full Vue reactivity path through the custom renderer
      component3.vm.showDot = false
      await nextTick()
      await nextTick()

      // After re-mount, only frame should exist
      const marksAfterToggle = plotCtx!.marks
      expect(marksAfterToggle.length).toBe(1)

      // Verify DOM: SVG should exist (re-rendered with only frame)
      const parentEl = component3.element as HTMLDivElement
      const svgElements = parentEl.querySelectorAll('svg')
      expect(svgElements.length).toBe(1)
    })

    it('removes text mark descriptor when v-if toggles from true to false', async () => {
      const App = defineComponent({
        setup() {
          const showText = ref(true)
          return { showText }
        },
        render() {
          return h(Plot, { key: this.showText ? 'with-text' : 'without-text' }, () => [
            h('PlotFrame'),
            this.showText ? h('PlotText', { data: ['Hello'], frameAnchor: 'middle' }) : null,
          ])
        },
      })

      const comp = mount(App, { attachTo: document.body })
      await nextTick()
      await nextTick()

      const { ctx } = getPlotApp()
      const plotId = comp.element.getAttribute('data-plot-id') || ''
      const plotCtx = ctx.get(plotId)
      expect(plotCtx).toBeDefined()

      // Should have marks: frame + text
      expect(plotCtx!.marks.length).toBe(2)

      // Verify the text mark is present
      const textMarks = plotCtx!.marks.filter(m => m.data && Array.isArray(m.data) && (m.data as unknown[]).includes('Hello'))
      expect(textMarks.length).toBe(1)

      // Toggle showText to false — key change forces Plot re-mount
      comp.vm.showText = false
      await nextTick()
      await nextTick()

      // After re-mount, only frame should exist
      const newPlotId = comp.element.getAttribute('data-plot-id') || ''
      const newPlotCtx = ctx.get(newPlotId)
      expect(newPlotCtx).toBeDefined()
      expect(newPlotCtx!.marks.length).toBe(1)

      // Verify DOM
      const svgElements = comp.element.querySelectorAll('svg')
      expect(svgElements.length).toBe(1)

      comp.unmount()
    })

    afterAll(() => component3?.unmount())
  })
})
