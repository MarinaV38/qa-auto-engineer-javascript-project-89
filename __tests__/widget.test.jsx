import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRequire } from 'module'
import steps from '../__fixtures__/basicSteps.js'

const require = createRequire(import.meta.url)
const WidgetModule = require('@hexlet/chatbot-v2')
const Widget = WidgetModule.default ?? WidgetModule
const renderWidget = () => render(Widget(steps))
const getOpenChatButton = () =>
  screen.getAllByRole('button', { name: /Открыть Чат/i })[0]

describe('Flowbot widget', () => {
  it('рендерится без ошибок и показывает кнопку запуска', () => {
    renderWidget()

    expect(getOpenChatButton()).toBeVisible()
  })

  it('открывает и закрывает модальное окно с чатом', async () => {
    const user = userEvent.setup()
    renderWidget()

    await user.click(getOpenChatButton())
    expect(
      screen.getByRole('dialog', { name: /виртуальный помощник/i }),
    ).toBeVisible()

    const closeButton = screen.getByRole('button', { name: /close/i })
    await user.click(closeButton)

    await waitFor(() => {
      expect(
        screen.queryByRole('dialog', { name: /виртуальный помощник/i }),
      ).not.toBeInTheDocument()
    })
  })

  it('переходит между шагами и скроллит к новым сообщениям', async () => {
    const user = userEvent.setup()
    renderWidget()

    const originalScrollIntoView = window.HTMLElement.prototype.scrollIntoView
    const scrollSpy = vi.fn()
    window.HTMLElement.prototype.scrollIntoView = scrollSpy

    await user.click(getOpenChatButton())
    await user.click(screen.getByRole('button', { name: /Начать/i }))
    expect(
      screen.getByText(/Выбери тему, которая интересует больше всего/i),
    ).toBeInTheDocument()
    expect(scrollSpy).toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: /Веб-разработка/i }))
    expect(
      screen.getByText(/Курс по вебу включает HTML, CSS и основы React/i),
    ).toBeInTheDocument()

    window.HTMLElement.prototype.scrollIntoView = originalScrollIntoView
  })
})
