import { describe, it, expect, vi } from 'vitest'
import { render, screen, within, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../src/App.jsx'

const getOpenChatButton = () =>
  screen.getAllByRole('button', { name: /Открыть Чат/i })[0]

describe('App integration', () => {
  it('сохраняет работу формы после интеграции виджета', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(getOpenChatButton()).toBeTruthy()

    await user.type(screen.getByLabelText(/Email/i), 'user@example.com')
    await user.type(screen.getByLabelText(/Пароль/i), 'secret')
    await user.type(screen.getByLabelText(/Адрес/i), 'Невский проспект, 12')
    await user.type(screen.getByLabelText(/Город/i), 'Санкт-Петербург')
    await user.selectOptions(screen.getByLabelText(/Страна/i), 'Россия')
    await user.click(screen.getByLabelText(/Принять правила/i))

    await user.click(screen.getByRole('button', { name: /Зарегистрироваться/i }))

    const table = screen.getByRole('table')
    expect(within(table).getByText('user@example.com')).toBeTruthy()
    expect(within(table).getByText('Россия')).toBeTruthy()
    expect(within(table).getByText('true')).toBeTruthy()

    await user.click(screen.getByRole('button', { name: /Назад/i }))
    expect(screen.getByLabelText(/Email/i).value).toBe('user@example.com')
  })

  it('открывает чат и показывает шаги внутри приложения', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(getOpenChatButton())
    const dialog = screen.getByRole('dialog', { name: /виртуальный помощник/i })
    expect(dialog).toBeTruthy()

    await user.click(screen.getByRole('button', { name: /Начать/i }))
    expect(screen.getByText(/Выбери тему, которая интересует больше всего/i)).toBeTruthy()
  })

  it('передаёт шаги дочернему элементу-виджету', () => {
    const stepsSpy = vi.fn()
    const CustomWidget = ({ steps: receivedSteps }) => {
      stepsSpy(receivedSteps)
      return <div data-testid="custom-widget">Мой виджет</div>
    }

    render(
      <App>
        <CustomWidget />
      </App>
    )

    expect(screen.getByTestId('custom-widget')).toBeTruthy()
    expect(stepsSpy).toHaveBeenCalled()
    expect(Array.isArray(stepsSpy.mock.calls.at(-1)?.[0])).toBe(true)
  })

  it('восстанавливает пользовательский виджет после ошибки благодаря WidgetErrorBoundary', async () => {
    const ProblemWidget = () => {
      throw new Error('boom')
    }
    const StableWidget = () => <div data-testid="custom-widget">stable widget</div>

    const { rerender } = render(<App widget={<ProblemWidget />} />)

    expect(screen.queryByTestId('custom-widget')).toBeNull()

    rerender(<App widget={<StableWidget />} />)

    await waitFor(() => {
      expect(screen.getByTestId('custom-widget')).toBeTruthy()
    })
  })
})
