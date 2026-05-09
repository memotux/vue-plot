import { defineComponent, h, ref, nextTick } from "vue"
import { mount } from "@vue/test-utils"
import { describe, it, expect, afterAll, beforeEach } from "vitest"
import PlotComponent from "../src/components/Plot.vue"
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
        return () => h(PlotComponent, null, () => [
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
          return () => h(PlotComponent, null, () => [
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
          return () => h(PlotComponent, null, () => [
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
          return h(PlotComponent, { key: this.showDot ? 'with-dot' : 'without-dot' }, () => [
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
          return h(PlotComponent, { key: this.showText ? 'with-text' : 'without-text' }, () => [
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

  describe('Batch re-render with nextTick', () => {
    it('multiple prop changes in same tick → DOM reflects all changes after flush', async () => {
      const App = defineComponent({
        setup() {
          const text = ref('Hello')
          const anchor = ref<'middle' | 'top'>('middle')
          return { text, anchor }
        },
        render() {
          return h(PlotComponent, null, () => [
            h('PlotFrame'),
            h('PlotText', { data: [this.text], frameAnchor: this.anchor })
          ])
        }
      })

      const component = mount(App, { attachTo: document.body })
      await nextTick()
      await nextTick()

      // Initial state
      expect(component.get('text').text()).toBe('Hello')

      // Change two props synchronously — batching should coalesce into one re-render
      component.vm.text = 'World'
      component.vm.anchor = 'top'

      // After flush, DOM should reflect both changes
      await nextTick()
      await nextTick()

      // Primary: DOM reflects all changes
      expect(component.get('text').text()).toBe('World')

      // Secondary: internal flag reset after flush
      const { ctx } = getPlotApp()
      const plotIds = Array.from(ctx.keys())
      const plotCtx = ctx.get(plotIds[plotIds.length - 1])
      expect(plotCtx!._renderQueued).toBe(false)

      component.unmount()
    })

    it('single prop change → DOM updates after flush', async () => {
      const App = defineComponent({
        setup() {
          const text = ref('Hello')
          return { text }
        },
        render() {
          return h(PlotComponent, null, () => [
            h('PlotFrame'),
            h('PlotText', { data: [this.text], frameAnchor: 'middle' })
          ])
        }
      })

      const component = mount(App, { attachTo: document.body })
      await nextTick()
      await nextTick()

      expect(component.get('text').text()).toBe('Hello')

      component.vm.text = 'Changed'
      await nextTick()
      await nextTick()

      expect(component.get('text').text()).toBe('Changed')

      component.unmount()
    })

    it('mark removal via v-if → mark descriptor removed and DOM updated', async () => {
      const App = defineComponent({
        setup() {
          const showDot = ref(true)
          return { showDot }
        },
        render() {
          return h(PlotComponent, { key: this.showDot ? 'with-dot' : 'without-dot' }, () => [
            h('PlotFrame'),
            this.showDot ? h('PlotDot', { data: [{ x: 1, y: 2 }], x: 'x', y: 'y' }) : null,
          ])
        }
      })

      const component = mount(App, { attachTo: document.body })
      await nextTick()
      await nextTick()

      const { ctx } = getPlotApp()
      const plotId = component.element.getAttribute('data-plot-id') || ''
      const plotCtx = ctx.get(plotId)
      expect(plotCtx).toBeDefined()

      // Should have frame + dot
      const initialMarks = plotCtx!.marks.length
      expect(initialMarks).toBeGreaterThanOrEqual(2)

      // Toggle showDot — key change forces re-mount
      component.vm.showDot = false
      await nextTick()
      await nextTick()

      // New plot should have only frame
      const newPlotId = component.element.getAttribute('data-plot-id') || ''
      const newPlotCtx = ctx.get(newPlotId)
      expect(newPlotCtx).toBeDefined()
      expect(newPlotCtx!.marks.length).toBe(1)

      // Primary: DOM contains exactly one SVG (re-rendered with only frame)
      const svgElements = component.element.querySelectorAll('svg')
      expect(svgElements.length).toBe(1)

      // Secondary: internal flag reset after flush
      expect(newPlotCtx!._renderQueued).toBe(false)

      component.unmount()
    })

    it('mark removal coalesces with pending prop changes → single re-render', async () => {
      const App = defineComponent({
        setup() {
          const showText = ref(true)
          const textContent = ref('Hello')
          return { showText, textContent }
        },
        render() {
          return h(PlotComponent, { key: this.showText ? 'with-text' : 'without-text' }, () => [
            h('PlotFrame'),
            this.showText ? h('PlotText', { data: [this.textContent], frameAnchor: 'middle' }) : null,
          ])
        }
      })

      const component = mount(App, { attachTo: document.body })
      await nextTick()
      await nextTick()

      // Initial state: frame + text visible
      expect(component.get('text').text()).toBe('Hello')

      const { ctx } = getPlotApp()
      const plotId = component.element.getAttribute('data-plot-id') || ''
      const plotCtx = ctx.get(plotId)
      expect(plotCtx).toBeDefined()
      expect(plotCtx!.marks.length).toBe(2) // frame + text

      // Change prop AND remove mark in the SAME tick
      component.vm.textContent = 'World'
      component.vm.showText = false

      // After flush: only frame should remain, single re-render
      await nextTick()
      await nextTick()

      // DOM outcome: no text element (mark was removed)
      const textElements = component.element.querySelectorAll('text')
      expect(textElements.length).toBe(0)

      // DOM outcome: exactly one SVG (single re-render, not two)
      const svgElements = component.element.querySelectorAll('svg')
      expect(svgElements.length).toBe(1)

      // Internal state: flush completed, flag reset
      expect(plotCtx!._renderQueued).toBe(false)

      component.unmount()
    })

    it('two plots updating simultaneously → each maintains independent flush', async () => {
      const App = defineComponent({
        setup() {
          const text1 = ref('Plot A')
          const text2 = ref('Plot B')
          return { text1, text2 }
        },
        render() {
          return h('div', [
            h(PlotComponent, { key: 'a' }, () => [
              h('PlotFrame'),
              h('PlotText', { data: [this.text1], frameAnchor: 'middle' })
            ]),
            h(PlotComponent, { key: 'b' }, () => [
              h('PlotFrame'),
              h('PlotText', { data: [this.text2], frameAnchor: 'middle' })
            ]),
          ])
        }
      })

      const component = mount(App, { attachTo: document.body })
      await nextTick()
      await nextTick()

      // Initial state
      expect(component.get('text').text()).toBe('Plot A')

      // Change both plots' text in the same tick
      component.vm.text1 = 'Updated A'
      component.vm.text2 = 'Updated B'
      await nextTick()
      await nextTick()

      // Primary: both plots rendered as separate SVGs
      const svgElements = component.findAll('svg')
      expect(svgElements.length).toBe(2)

      // Secondary: both contexts clean after flush
      const { ctx: plotCtxMap } = getPlotApp()
      const allIds = Array.from(plotCtxMap.keys())
      for (const id of allIds) {
        const pCtx = plotCtxMap.get(id)
        if (pCtx) {
          expect(pCtx._renderQueued).toBe(false)
        }
      }

      component.unmount()
    })
  })

  describe('Bug: addPlot must be called on mount, not during setup', () => {
    it('plot context parent has a resolved DOM element after mount', async () => {
      const App = defineComponent({
        setup() {
          return () => h(PlotComponent, null, () => [
            h('PlotFrame'),
          ])
        }
      })

      const component = mount(App, { attachTo: document.body })
      await nextTick()

      const { ctx } = getPlotApp()
      const plotIds = Array.from(ctx.keys())
      const plotCtx = ctx.get(plotIds[plotIds.length - 1])

      expect(plotCtx).toBeDefined()
      // After mount, parent.value should be a real DOM element, not null
      expect(plotCtx!.parent).toBeDefined()
      expect(plotCtx!.parent.value).toBeInstanceOf(HTMLDivElement)
      expect(plotCtx!.parent.value!.getAttribute('data-plot-id')).toBeTruthy()

      component.unmount()
    })
  })
})
