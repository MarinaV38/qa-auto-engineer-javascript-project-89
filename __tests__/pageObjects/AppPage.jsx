import { screen } from '@testing-library/react'

export class AppPage {
  get openChatButton() {
    return screen.getAllByRole('button', { name: /Открыть Чат/i })[0]
  }

  async openChat(user) {
    await user.click(this.openChatButton)
  }

  get dialog() {
    return screen.queryByRole('dialog', { name: /виртуальный помощник/i })
  }

  async startChat(user) {
    const startButton = screen.getByRole('button', { name: /Начать/i })
    await user.click(startButton)
  }

  async fillForm(user, data) {
    const labelMap = {
      email: /Email/i,
      password: /Пароль/i,
      address: /Адрес/i,
      city: /Город/i,
      country: /Страна/i,
      acceptRules: /Принять правила/i,
    }
    const entries = Object.entries(data)
    for (const [field, value] of entries) {
      const isCheckbox = field === 'acceptRules'
      const control = screen.getByLabelText(labelMap[field] ?? new RegExp(field, 'i'))
      if (isCheckbox) {
        await user.click(control)
      }
      else if (control.tagName === 'SELECT') {
        await user.selectOptions(control, value)
      }
      else {
        await user.clear(control)
        await user.type(control, value)
      }
    }
  }

  async submitForm(user) {
    await user.click(screen.getByRole('button', { name: /Зарегистрироваться/i }))
  }

  formValue(label) {
    return screen.getByLabelText(new RegExp(label, 'i')).value
  }

  resultHas(text) {
    return Boolean(screen.queryByText(text))
  }

  setRerender(fn) {
    this.rerenderFn = fn
  }

  rerender(element) {
    if (!this.rerenderFn) {
      throw new Error('Rerender is not attached')
    }
    this.rerenderFn(element)
  }
}
