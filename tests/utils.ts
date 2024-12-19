import { h } from "vue"
import { expect, it } from "vitest"
import { mount } from "@vue/test-utils"
import { frame, text } from "@observablehq/plot"
import { Plot } from "../src"

const PlotWithProps = mount(Plot, {
  attachTo: document.body,
  props: {
    marks: [
      frame(),
      text(["Hello, world!"], { frameAnchor: "middle" })
    ]
  },
})

const PlotWithChildren = mount(Plot, {
  attachTo: document.body,
  slots: {
    default: () => ([
      h('PlotFrame'),
      h('PlotText', { data: ['Hello, world!'], frameAnchor: 'middle' })
    ])
  }
})

const Stubs = { PlotWithProps, PlotWithChildren }

export function testComponent(component: keyof typeof Stubs) {
  it('find one svg', () => {
    expect(Stubs[component].findAll('svg').length).toBe(1)
  })
  it('visible plot', () => {
    expect(Stubs[component].find('svg').isVisible()).toBe(true)
  })

  const plot = Stubs[component].find('svg')

  it('visible text', () => {
    const text = plot.find('text')

    expect(text.isVisible()).toBe(true)
    expect(text.text()).toBe('Hello, world!')
  })
  it('visible frame', () => {
    const frame = plot.find('[aria-label=frame]')

    expect(frame.isVisible()).toBe(true)
  })

  it('update plot props', async () => {
    const className = 'plot-class'

    await Stubs[component].setProps({
      className
    })

    const plot = Stubs[component].get('svg')

    expect(plot.classes()).include(className)
  })
}