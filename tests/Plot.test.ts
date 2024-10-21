import { describe, it, expect } from 'vitest'
import { mount } from "@vue/test-utils";
import { Plot } from '../src/main.ts'
import { frame, text } from "@observablehq/plot";

describe('Plot component', () => {
  const component = mount(Plot, {
    attachTo: document.body,
    props: {
      marks: [
        frame(),
        text(["Hello, world!"], { frameAnchor: "middle" })
      ]
    },
  })

  it('render one svg', () => {
    expect(component.findAll('svg').length).toBe(1)
  })
  it('renders plot', () => {
    expect(component.find('svg').exists()).toBe(true)
  })

  const plot = component.find('svg')

  it('renders text', () => {
    const text = plot.find('text')

    expect(text.exists()).toBe(true)
    expect(text.text()).toBe('Hello, world!')
  })
  it('renders frame', () => {
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

describe('Plot with defer', () => {
  const component = mount(Plot, {
    attachTo: document.body,
    props: {
      marks: [
        frame(),
        text(["Hello, world!"], { frameAnchor: "middle" })
      ],
      defer: true
    },
  })

  it('render container with style', () => {
    expect(component.props().defer).toBe(true)
    expect(component.attributes('style')).include('width: 688px')
  })

  it('svg not exist', () => {
    expect(component.find('svg').exists()).toBe(false)
  })

  it('update on `defer` change and render svg', async () => {
    await component.setProps({
      defer: false
    })
    expect(component.props().defer).toBe(false)

    const svg = component.find('svg')
    expect(svg.exists()).toBe(true)
    expect(svg.html()).toContain('Hello, world!')
  })
})