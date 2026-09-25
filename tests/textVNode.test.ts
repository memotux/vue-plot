import { defineComponent, h, ref, nextTick } from "vue"
import { mount } from "@vue/test-utils"
import { vi } from "vitest"
import PlotComponent from "../src/components/Plot.vue"
import nodeOpsModule from "../src/core/nodeOps"
import * as rendererModule from "../src/core/nodeOps/renderer"

/**
 * Collect every Text node inside a subtree (including the root itself when it
 * is a Text node).
 */
function collectTextNodes(root: Node): Text[] {
  const nodes: Text[] = []

  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      nodes.push(node as Text)
    }
    Array.from(node.childNodes).forEach(child => walk(child))
  }

  walk(root)

  return nodes
}

describe('text VNode operations (createText / setText)', () => {
  describe('nodeOps unit tests', () => {
    it('createText returns a Text node with empty content when called without an argument', () => {
      const ops = nodeOpsModule()
      const node = ops.createText()

      expect(node).toBeInstanceOf(Text)
      expect(node.nodeType).toBe(Node.TEXT_NODE)
      expect(node.textContent).toBe('')
    })

    it('createText honors the text argument (Vue never calls setText on initial mount)', () => {
      const ops = nodeOpsModule()
      const node = ops.createText('Hello')

      expect(node).toBeInstanceOf(Text)
      expect(node.textContent).toBe('Hello')
    })

    it('setText writes the text onto the node', () => {
      const ops = nodeOpsModule()
      const node = ops.createText()

      ops.setText(node, 'Hello')

      expect(node.textContent).toBe('Hello')
    })

    it('setText overwrites the previous text content', () => {
      const ops = nodeOpsModule()
      const node = ops.createText()

      ops.setText(node, 'Hello')
      ops.setText(node, 'World')

      expect(node.textContent).toBe('World')
    })

    it('createText returns a fresh node on each call', () => {
      const ops = nodeOpsModule()
      const first = ops.createText()
      const second = ops.createText()

      expect(first).not.toBe(second)
    })
  })

  describe('integration through the custom renderer', () => {
    // NOTE: getPlotApp() builds the custom renderer once and captures its
    // nodeOps on the first render. A spy therefore has to be installed before
    // the first mount in this file, so this test runs first on purpose.
    it('drives createText and setText through the renderer for a raw text child', async () => {
      const createTextSpy = vi.spyOn(rendererModule, 'createText')
      const setTextSpy = vi.spyOn(rendererModule, 'setText')

      const App = defineComponent({
        setup() {
          const label = ref('Hello')
          return { label }
        },
        render() {
          // :key forces Plot to re-mount when the text changes, so the custom
          // renderer processes the new text child through its nodeOps.
          return h(PlotComponent, { key: this.label }, () => [
            h('PlotFrame'),
            this.label,
          ])
        },
      })

      let component: ReturnType<typeof mount> | undefined
      expect(() => {
        component = mount(App, { attachTo: document.body })
      }).not.toThrow()

      await nextTick()
      await nextTick()

      const container = component!.element as HTMLDivElement

      // The raw string becomes a Text VNode, so the plot renders and its text
      // child goes through the custom renderer's createText().
      expect(container.querySelectorAll('svg').length).toBe(1)
      expect(createTextSpy).toHaveBeenCalled()
      expect(createTextSpy).toHaveBeenCalledWith('Hello')
      expect(createTextSpy.mock.results.every(result => result.value instanceof Text)).toBe(true)

      component!.vm.label = 'World'
      await nextTick()
      await nextTick()

      // The update path drives the custom renderer's setText().
      expect(setTextSpy).toHaveBeenCalledWith(expect.any(Text), 'World')

      // DOM stays consistent: still exactly one svg after the update.
      expect(container.querySelectorAll('svg').length).toBe(1)

      component!.unmount()
      vi.restoreAllMocks()
    })

    it('mounts a plot with a raw text child without throwing and renders exactly one svg', async () => {
      const App = defineComponent({
        setup() {
          return () => h(PlotComponent, null, () => [
            h('PlotFrame'),
            'some text',
          ])
        },
      })

      let component: ReturnType<typeof mount> | undefined
      expect(() => {
        component = mount(App, { attachTo: document.body })
      }).not.toThrow()

      await nextTick()
      await nextTick()

      const container = component!.element as HTMLDivElement
      expect(container.querySelectorAll('svg').length).toBe(1)

      component!.unmount()
    })

    it('documents that the raw text node is dropped instead of attached to the container', async () => {
      // Current behavior: the custom renderer creates the Text node, but
      // insert() early-returns when the parent is the plot root, so the node
      // never reaches the plot container DOM.
      const App = defineComponent({
        setup() {
          return () => h(PlotComponent, null, () => [
            h('PlotFrame'),
            'some text',
          ])
        },
      })

      const component = mount(App, { attachTo: document.body })
      await nextTick()
      await nextTick()

      const container = component.element as HTMLDivElement
      const attached = collectTextNodes(container).some(node => node.textContent === 'some text')

      expect(attached).toBe(false)

      component.unmount()
    })
  })
})
