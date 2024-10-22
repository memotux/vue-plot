import { expect, test } from 'vitest'
import { render } from 'vitest-browser-vue'
import { Plot } from '../src/main'
import { frame, text } from "@observablehq/plot";

test('renders', async () => {
  const { getByText } = render(Plot, {
    props: {
      marks: [
        frame(),
        text(["Hello, world!"], { frameAnchor: "middle" })
      ],
      defer: true
    },
  })

  const textEl = getByText('Hello, world!')

  await expect.element(textEl).toBeVisible()
})