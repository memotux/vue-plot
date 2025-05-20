import { h } from "vue"
import { mount } from "@vue/test-utils"
import { describe, it, expect, afterAll } from "vitest"
import Plot from "../src/components/Plot.vue"
import basic from "./basic"

describe('Plot with marks as children', () => {
  const component = mount(Plot, {
    attachTo: document.body,
    slots: {
      default: () => ([
        h('PlotFrame'),
        h('PlotText', { data: ['Hello, world!'], frameAnchor: 'middle' })
      ])
    }
  })

  basic(component)

  it('renders visible text', () => {
    const text = component.find('text')

    expect(text.isVisible()).toBe(true)
    expect(text.text()).toBe('Hello, world!')
  })

  afterAll(() => component.unmount())
})