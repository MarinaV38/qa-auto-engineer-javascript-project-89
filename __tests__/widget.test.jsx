import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRequire } from 'module'
import steps from '../__fixtures__/basicSteps.js'
import noWelcomeSteps from '../__fixtures__/noWelcomeSteps.js'
import danglingSteps from '../__fixtures__/danglingSteps.js'
import { WidgetPage } from './pageObjects/WidgetPage.js'

const require = createRequire(import.meta.url)
const WidgetModule = require('@hexlet/chatbot-v2')
const Widget = WidgetModule.default ?? WidgetModule

const createPage = (customSteps = steps) => {
  const page = new WidgetPage(render, Widget)
  page.render(customSteps)
  return page
}

describe('Виджет Flowbot', () => {
  it('рендерится без ошибок и показывает кнопку запуска', () => {
    const page = createPage()

    expect(page.openButton).toBeTruthy()
  })

  it('открывает и закрывает модальное окно с чатом', async () => {
    const user = userEvent.setup()
    const page = createPage()

    await page.openChat(user)
    expect(page.isChatOpen()).toBe(true)

    await page.closeChat(user)
    await waitFor(() => {
      expect(page.isChatOpen()).toBe(false)
    })
  })

  it('переходит между шагами и скроллит к новым сообщениям', async () => {
    const user = userEvent.setup()
    const page = createPage()

    const originalScrollIntoView = window.HTMLElement.prototype.scrollIntoView
    const scrollSpy = vi.fn()
    window.HTMLElement.prototype.scrollIntoView = scrollSpy

    await page.openChat(user)
    await page.startChat(user)
    expect(page.messageExists('Выбери тему, которая интересует больше всего')).toBe(true)
    expect(scrollSpy).toHaveBeenCalled()

    await page.chooseOption(user, 'Веб-разработка')
    expect(page.messageExists('Курс по вебу включает HTML, CSS и основы React')).toBe(true)

    window.HTMLElement.prototype.scrollIntoView = originalScrollIntoView
  })

  it('не отображает пользовательские кнопки, если шаг welcome отсутствует', async () => {
    const user = userEvent.setup()
    const page = createPage(noWelcomeSteps)

    await page.openChat(user)
    expect(page.messageExists('Невалидная кнопка')).toBe(false)
  })

  it('оставляет текущий шаг, если nextStepId указывает на несуществующий шаг', async () => {
    const user = userEvent.setup()
    const page = createPage(danglingSteps)

    await page.openChat(user)
    const optionButton = await screen.findByRole('button', { name: /Продолжить/i })
    await user.click(optionButton)

    const responseMessages = page.responseMessagesByText('Продолжить')
    expect(responseMessages.length).toBeGreaterThanOrEqual(1)

    expect(optionButton.disabled).toBe(false)
  })
})
