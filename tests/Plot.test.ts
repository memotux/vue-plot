import { describe, it, expect } from 'vitest'
import { mount } from "@vue/test-utils";
import { Plot } from '../src/main.ts'
import { frame, text } from "@observablehq/plot";

describe('renders Plot component', () => {
  const component = mount(Plot, {
    attachTo: document.body,
    props: {
      marks: [
        frame(),
        text(["Hello, world!"], { frameAnchor: "middle" })
      ]
    },
  })
  const plot = component.find('.plot')

  it('renders plot', () => {
    expect(plot.exists()).toBe(true)
  })
  it('renders text', () => {
    const text = plot.find('text')

    expect(text.exists()).toBe(true)
    expect(text.text()).toBe('Hello, world!')
  })
  it('renders frame', () => {
    const frame = plot.find('[aria-label=frame]')

    expect(frame.exists()).toBe(true)
  })
})