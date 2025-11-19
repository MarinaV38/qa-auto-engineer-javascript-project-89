import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

if (!window.HTMLElement.prototype.scrollIntoView) {
  window.HTMLElement.prototype.scrollIntoView = () => {}
}

afterEach(() => {
  cleanup()
})
