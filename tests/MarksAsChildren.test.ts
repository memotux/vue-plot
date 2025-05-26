import { defineComponent, h } from "vue"
import { mount } from "@vue/test-utils"
import { describe, it, expect, afterAll } from "vitest"
import Plot from "../src/components/Plot.vue"
import basic from "./basic"

describe('Plot with marks as children', () => {
  const App = defineComponent({
    props: {
      text: String
    },
    setup(props) {
      return () => h(Plot, null, () => ([
        h('PlotFrame'),
        h('PlotText', { data: [props.text], frameAnchor: 'middle' })
      ]))
    }
  })

  const component = mount(App, {
    props: {
      text: 'Hello, world!'
    }
  })

  basic(component)

  it('renders visible text', () => {
    const text = component.find('text')

    expect(text.isVisible()).toBe(true)
    expect(text.text()).toBe('Hello, world!')
  })

  it('update child props', async () => {
    await component.setProps({
      text: 'Hello, Tux!'
    })

    expect(component.findAll('text').length).toBe(1)
    expect(component.get('text').text()).toBe('Hello, Tux!')
  })

  afterAll(() => component.unmount())
})