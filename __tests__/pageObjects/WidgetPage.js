import { screen } from '@testing-library/react'

export class WidgetPage {
  constructor(renderFn, widgetFactory) {
    this.renderFn = renderFn
    this.widgetFactory = widgetFactory
  }

  render(steps) {
    this.renderFn(this.widgetFactory(steps))
  }

  get openButton() {
    return screen.getAllByRole('button', { name: /Открыть Чат/i })[0]
  }

  async openChat(user) {
    await user.click(this.openButton)
  }

  get dialog() {
    return screen.queryByRole('dialog', { name: /виртуальный помощник/i })
  }

  async startChat(user) {
    const startButton = screen.getByRole('button', { name: /Начать/i })
    await user.click(startButton)
  }

  async chooseOption(user, label) {
    const button = screen.getByRole('button', { name: new RegExp(label, 'i') })
    await user.click(button)
    return button
  }

  async closeChat(user) {
    const closeButton = screen.getByRole('button', { name: /close/i })
    await user.click(closeButton)
  }

  isChatOpen() {
    return Boolean(this.dialog)
  }

  messageExists(text) {
    return Boolean(screen.queryByText(new RegExp(text, 'i')))
  }

  responseMessagesByText(text) {
    return screen
      .getAllByText(new RegExp(text, 'i'))
      .filter(node => node.tagName !== 'BUTTON')
  }
}
