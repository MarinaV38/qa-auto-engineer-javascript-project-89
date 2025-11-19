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

  get chatArea() {
    return this.dialog?.querySelector('#chat') ?? null
  }

  get chatButtons() {
    return Array.from(this.chatArea?.querySelectorAll('button') ?? [])
  }

  async clickOption(user, label) {
    const button = screen.getByRole('button', { name: new RegExp(label, 'i') })
    await user.click(button)
    return button
  }

  responseMessagesByText(text) {
    return screen
      .getAllByText(new RegExp(text, 'i'))
      .filter(node => node.tagName !== 'BUTTON')
  }
}
