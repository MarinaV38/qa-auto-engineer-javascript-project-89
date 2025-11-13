const steps = [
  {
    id: 'start',
    messages: ['Этот конфиг не содержит шага welcome.'],
    buttons: [
      {
        text: 'Невалидная кнопка',
        nextStepId: 'missing',
        type: 'button',
      },
    ],
  },
]

export default steps
