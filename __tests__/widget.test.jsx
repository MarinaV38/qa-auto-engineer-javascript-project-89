import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRequire } from 'module'
import steps from '../__fixtures__/basicSteps.js'
import noWelcomeSteps from '../__fixtures__/noWelcomeSteps.js'
import danglingSteps from '../__fixtures__/danglingSteps.js'

const require = createRequire(import.meta.url)
const WidgetModule = require('@hexlet/chatbot-v2')
const Widget = WidgetModule.default ?? WidgetModule
const renderWidget = (customSteps = steps) => render(Widget(customSteps))
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

  it('не отображает пользовательские кнопки, если шаг welcome отсутствует', async () => {
    const user = userEvent.setup()
    renderWidget(noWelcomeSteps)

    await user.click(getOpenChatButton())
    expect(
      screen.queryByRole('button', { name: /Невалидная кнопка/i }),
    ).not.toBeInTheDocument()
  })

  it('оставляет текущий шаг, если nextStepId указывает на несуществующий шаг', async () => {
    const user = userEvent.setup()
    renderWidget(danglingSteps)

    await user.click(getOpenChatButton())
    const optionButton = await screen.findByRole('button', { name: /Продолжить/i })
    await user.click(optionButton)

    const responseMessages = screen
      .getAllByText(/Продолжить/)
      .filter((node) => node.tagName !== 'BUTTON')
    expect(responseMessages.length).toBeGreaterThanOrEqual(1)

    expect(optionButton).toBeEnabled()
  })
})
