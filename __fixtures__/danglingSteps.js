const steps = [
  {
    id: 'welcome',
    messages: ['Добро пожаловать'],
    buttons: [
      {
        text: 'Продолжить',
        nextStepId: 'missing-step',
        type: 'button',
      },
    ],
  },
]

export default steps
