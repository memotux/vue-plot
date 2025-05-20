import { describe, expect, it, afterAll } from 'vitest'
import { mount } from '@vue/test-utils';
import { frame, text } from '@observablehq/plot';
import Plot from "../src/components/Plot.vue"
import basic from './basic';

describe('Plot as figure', () => {
  const frameText = "Titles, subtitles, captions, and annotations assist inter­pretation by telling the reader what’s interesting. Don’t make the reader work to find what you already know."
  const component = mount(Plot, {
    attachTo: document.body,
    props: {
      title: "For charts, an informative title",
      subtitle: "Subtitle to follow with additional context",
      caption: "Figure 1. A chart with a title, subtitle, and caption.",
      marks: [
        frame(),
        text([frameText], { lineWidth: 30, frameAnchor: "middle" })
      ]
    }
  })

  basic(component)

  it('renders visible text', () => {
    const text = component.find('text')

    expect(text.isVisible()).toBe(true)
    expect(text.text()).toBe('Titles, subtitles, captions, and annotations assist inter­-pretation by telling the reader what’s interesting. Don’t makethe reader work to find what you already know.')
  })

  afterAll(() => component.unmount())
})

