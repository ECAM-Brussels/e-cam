import Math from './Math'
import { render } from '@solidjs/testing-library'
import { test, expect } from 'vitest'

test('renders LaTeX', async () => {
  const { container } = render(() => <Math value="x^2" />)
  const katex = container.querySelectorAll('.katex')
  expect(katex.length).toBe(1)
})
