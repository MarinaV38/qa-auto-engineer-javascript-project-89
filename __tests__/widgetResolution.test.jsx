import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'

const renderFreshApp = async (props = {}, { mockReact } = {}) => {
  vi.resetModules()
  vi.unmock('react')
  vi.unmock('@hexlet/chatbot-v2')

  if (mockReact) {
    vi.doMock('react', mockReact)
  }

  const { default: App } = await import('../src/App.jsx')
  return render(<App {...props} />)
}

describe('App widget resolution edge cases', () => {
  afterEach(() => {
    vi.resetModules()
    vi.restoreAllMocks()
    vi.unmock('react')
    vi.unmock('@hexlet/chatbot-v2')
  })

  it('игнорирует кандидатов, которые не являются функцией или элементом', async () => {
    await renderFreshApp({ widget: 'неподдерживаемый виджет' })
    expect(screen.getByRole('button', { name: /Открыть Чат/i })).toBeTruthy()
  })

  it('строит пользовательский виджет из функции', async () => {
    const Factory = ({ steps }) => <div data-testid="factory-widget">{steps.length}</div>
    await renderFreshApp({ widget: Factory })
    expect(screen.getByTestId('factory-widget').textContent).toMatch(/\d+/)
  })

  it('пытается вызвать фабрику напрямую, если createElement не создаёт элемент', async () => {
    const mockReact = async () => {
      const actual = await vi.importActual('react')
      return {
        ...actual,
        isValidElement(value) {
          if (value?.type?.__forceFactory) {
            return false
          }
          return actual.isValidElement(value)
        },
      }
    }

    const widgetFactory = Object.assign(
      (input) => {
        if (Array.isArray(input)) {
          return <div data-testid="factory-from-array">Через массив</div>
        }
        if (input?.steps) {
          return 'не React-элемент'
        }
        return null
      },
      { __forceFactory: true },
    )

    await renderFreshApp({ widget: widgetFactory }, { mockReact })

    expect(screen.getByTestId('factory-from-array')).toBeTruthy()
  })

  it('использует запасной виджет, если resolveWidget выбрасывает ошибку', async () => {
    const throwingChildren = new Proxy([() => <div>Custom widget</div>], {
      get(target, prop, receiver) {
        if (prop === Symbol.iterator) {
          throw new Error('iterator failure')
        }
        return Reflect.get(target, prop, receiver)
      },
    })

    await renderFreshApp({ children: throwingChildren })

    expect(screen.getByRole('button', { name: /Открыть Чат/i })).toBeTruthy()
  })
})
