import { expect, it } from "vitest"
import type { VueWrapper } from "@vue/test-utils"

export default (component: VueWrapper) => {
  it.each([
    ['only one children', (plot: VueWrapper) => {
      expect(plot.element.children.length).toBe(1)
    }],
    ['only one svg', (plot: VueWrapper) => {
      expect(plot.findAll('svg').length).toBe(1)
    }],
    ['visible plot', (plot: VueWrapper) => {
      expect(plot.find('svg').isVisible()).toBe(true)
    }],
    ['visible frame', (plot: VueWrapper) => {
      const frame = plot.find('[aria-label=frame]')

      expect(frame.isVisible()).toBe(true)
    }],
    ['with updated props', async (plot: VueWrapper) => {
      const className = 'plot-class'

      await plot.setProps({
        className,
        width: 688,
      })

      const svg = plot.get('svg')

      expect(svg.classes()).include(className)
      expect(svg.attributes().viewBox).toBe('0 0 688 60')
    }]
  ])('renders %s', (_: string, test) => {
    test(component)
  })
} 