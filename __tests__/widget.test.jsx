import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createRequire } from 'module'
import steps from '../__fixtures__/basicSteps.js'

const require = createRequire(import.meta.url)
const WidgetModule = require('@hexlet/chatbot-v2')
const Widget = WidgetModule.default ?? WidgetModule

describe('Flowbot widget', () => {
  it('рендерится без ошибок и показывает кнопку запуска', () => {
    render(Widget(steps))

    expect(screen.getByRole('button', { name: /Открыть Чат/i })).toBeVisible()
  })
})
