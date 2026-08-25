import { defineComponent, h } from "vue"
import { mount } from "@vue/test-utils"
import { describe, it, expect, afterAll } from "vitest"
import Plot from "../src/components/Plot.vue"

describe('Page with more than one plot', () => {
  const App = defineComponent({
    setup() {
      return () => h('main', [
        h(Plot, null, () => [
          h('PlotFrame'),
          h('PlotText', { data: ['Plot 01'], frameAnchor: 'middle' }),
        ]),
        h(Plot, null, () => [
          h('PlotFrame'),
          h('PlotText', { data: ['Plot 02'], frameAnchor: 'middle' }),
        ]),
      ])
    }
  })

  const component = mount(App)

  it('should render 2 Plots', () => {
    expect(component.findAll('div').length).toBe(2)
    expect(component.findAll('svg').length).toBe(2)
  })

  it('should render 1 text in each Plot', () => {
    expect(component.findAll('text').length).toBe(2)
  })

  afterAll(() => component.unmount())
})
