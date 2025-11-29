import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AppPage } from './pageObjects/AppPage.jsx'
import App from '../src/App.jsx'

describe('Интеграция приложения и виджета', () => {
  it('сохраняет заполненную форму после взаимодействия с чатом', async () => {
    const user = userEvent.setup()
    render(<App />)
    const page = new AppPage()

    await page.fillForm(user, {
      email: 'user@example.com',
      password: 'secret',
      address: 'Невский проспект, 12',
      city: 'Санкт-Петербург',
      country: 'Россия',
      acceptRules: true,
    })

    await page.openChat(user)
    await page.startChat(user)
    expect(page.dialog).toBeTruthy()

    await page.submitForm(user)

    expect(page.resultHas('user@example.com')).toBe(true)
    expect(page.resultHas('Россия')).toBe(true)
    expect(page.resultHas('true')).toBe(true)
  })

  it('передаёт шаги дочернему компоненту-виджету', () => {
    const stepsSpy = vi.fn()
    const CustomWidget = ({ steps: receivedSteps }) => {
      stepsSpy(receivedSteps)
      return <div data-testid="custom-widget">Мой виджет</div>
    }

    render(<App><CustomWidget /></App>)
    const page = new AppPage()

    expect(screen.getByTestId('custom-widget')).toBeTruthy()
    expect(stepsSpy).toHaveBeenCalled()
    expect(Array.isArray(stepsSpy.mock.calls.at(-1)?.[0])).toBe(true)
  })

  it('строит пользовательский виджет из функции и прокидывает шаги', () => {
    const Factory = ({ steps }) => <div data-testid="factory-widget">{steps.length}</div>
    render(<App widget={Factory} />)
    const page = new AppPage()

    expect(screen.getByTestId('factory-widget').textContent).toMatch(/\d+/)
  })

  it('использует запасной виджет, если кандидат сломан', () => {
    const throwingChildren = new Proxy([() => <div>Custom widget</div>], {
      get(target, prop, receiver) {
        if (prop === Symbol.iterator) {
          throw new Error('iterator failure')
        }
        return Reflect.get(target, prop, receiver)
      },
    })

    render(<App>{throwingChildren}</App>)
    const page = new AppPage()

    expect(page.openChatButton).toBeTruthy()
  })

  it('перестраивает пользовательский виджет после ошибки', async () => {
    const ProblemWidget = () => {
      throw new Error('boom')
    }
    const StableWidget = () => <div data-testid="custom-widget">stable widget</div>

    const { rerender } = render(<App widget={<ProblemWidget />} />)
    const page = new AppPage()
    page.setRerender(rerender)

    expect(screen.queryByTestId('custom-widget')).toBeNull()

    page.rerender(<App widget={<StableWidget />} />)

    expect(screen.getByTestId('custom-widget')).toBeTruthy()
  })
})
