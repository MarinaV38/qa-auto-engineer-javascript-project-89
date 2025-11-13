import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../src/App.jsx'

const getOpenChatButton = () =>
  screen.getAllByRole('button', { name: /Открыть Чат/i })[0]

describe('App integration', () => {
  it('сохраняет работу формы после интеграции виджета', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(getOpenChatButton()).toBeVisible()

    await user.type(screen.getByLabelText(/Email/i), 'user@example.com')
    await user.type(screen.getByLabelText(/Пароль/i), 'secret')
    await user.type(screen.getByLabelText(/Адрес/i), 'Невский проспект, 12')
    await user.type(screen.getByLabelText(/Город/i), 'Санкт-Петербург')
    await user.selectOptions(screen.getByLabelText(/Страна/i), 'Россия')
    await user.click(screen.getByLabelText(/Принять правила/i))

    await user.click(screen.getByRole('button', { name: /Зарегистрироваться/i }))

    const table = screen.getByRole('table')
    expect(within(table).getByText('user@example.com')).toBeInTheDocument()
    expect(within(table).getByText('Россия')).toBeInTheDocument()
    expect(within(table).getByText('true')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Назад/i }))
    expect(screen.getByLabelText(/Email/i)).toHaveValue('user@example.com')
  })

  it('открывает чат и показывает шаги внутри приложения', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(getOpenChatButton())
    expect(
      screen.getByRole('dialog', { name: /виртуальный помощник/i }),
    ).toBeVisible()

    await user.click(screen.getByRole('button', { name: /Начать разговор/i }))
    expect(
      screen.getByText(/Помогу вам выбрать подходящий курс/i),
    ).toBeInTheDocument()
  })
})
