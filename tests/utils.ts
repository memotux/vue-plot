import { h } from "vue"
import { expect, it } from "vitest"
import { mount } from "@vue/test-utils"
import { frame, text } from "@observablehq/plot"
import { Plot, PlotRenderer } from "../src"

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
      h('PlotText', { data: ['Hello, world!'], options: { frameAnchor: 'middle' } })
    ])
  }
})

const PlotRendererWithProps = mount(PlotRenderer, {
  attachTo: document.body,
  props: {
    width: 688,
    className: 'plot',
    marks: [
      frame(),
      text(["Hello, world!"], { frameAnchor: "middle" })
    ]
  }
})
const PlotRendererWithChildren = mount(PlotRenderer, {
  attachTo: document.body,
  props: {
    width: 688,
    className: 'plot'
  },
  slots: {
    default: () => {
      return [
        h('PlotFrame'),
        h('PlotText', { data: ['Hello, world!'], frameAnchor: 'middle' })
      ]
    }
  }
})


const components = { PlotWithProps, PlotWithChildren, PlotRendererWithProps, PlotRendererWithChildren }

export function testComponent(component: 'PlotWithProps' | 'PlotWithChildren' | 'PlotRendererWithProps' | 'PlotRendererWithChildren', isRenderer: boolean = false) {
  it('one svg', () => {
    expect(components[component].findAll('svg').length).toBe(1)
  })
  it('plot', () => {
    expect(components[component].find('svg').isVisible()).toBe(true)
  })

  const plot = components[component].find('svg')

  it('text', () => {
    const text = plot.find('text')

    expect(text.isVisible()).toBe(true)
    expect(text.text()).toBe('Hello, world!')
  })
  it('frame', () => {
    const frame = plot.find('[aria-label=frame]')

    expect(frame.isVisible()).toBe(true)
  })

  it('change plot options', async () => {
    const className = 'plot-class'

    if (isRenderer) {
      await components[component].setProps({
        className
      })
    } else {
      await components[component].setProps({
        options: {
          className
        }
      })
    }

    const plot = components[component].get('svg')

    expect(plot.classes()).include(className)
  })
}