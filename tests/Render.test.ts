import { h } from "vue";
import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import PlotRenderer from "../src/components/PlotRenderer.vue";

describe('PlotRenderer should render', () => {
  const component = mount(PlotRenderer, {
    attachTo: document.body,
    props: {
      width: 688,
      className: 'plot-renderer'
    },
    slots: {
      default: () => {
        return [
          h('PlotFrame'),
          h('PlotText', { data: ['Hello'], frameAnchor: 'middle' })
        ]
      }
    }
  })

  it('one svg', () => {
    expect(component.findAll('svg').length).toBe(1)
  })
})