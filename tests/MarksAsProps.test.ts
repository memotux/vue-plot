import { frame, text } from "@observablehq/plot"
import { mount } from "@vue/test-utils"
import { afterAll, describe, expect, it } from "vitest"
import Plot from "../src/components/Plot.vue"
import basic from "./basic"

describe('Plot with marks as props', () => {
  const component = mount(Plot, {
    attachTo: document.body,
    props: {
      marks: [
        frame(),
        text(["Hello, world!"], { frameAnchor: "middle" })
      ]
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