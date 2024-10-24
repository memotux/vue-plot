import { describe, it, expect } from 'vitest'
import { mount } from "@vue/test-utils";
import { Plot } from '../src/main'
import { frame, text } from "@observablehq/plot";

describe('Plot component renders', () => {
  const component = mount(Plot, {
    attachTo: document.body,
    props: {
      marks: [
        frame(),
        text(["Hello, world!"], { frameAnchor: "middle" })
      ]
    },
  })

  it('one svg', () => {
    expect(component.findAll('svg').length).toBe(1)
  })
  it('plot', () => {
    expect(component.find('svg').exists()).toBe(true)
  })

  const plot = component.find('svg')

  it('text', () => {
    const text = plot.find('text')

    expect(text.exists()).toBe(true)
    expect(text.text()).toBe('Hello, world!')
  })
  it('frame', () => {
    const frame = plot.find('[aria-label=frame]')

    expect(frame.exists()).toBe(true)
  })

  it('change plot options', async () => {
    const className = 'plot-class'
    await component.setProps({
      options: {
        className
      }
    })

    const plot = component.get('svg')

    expect(plot.classes()).include(className)
  })
})