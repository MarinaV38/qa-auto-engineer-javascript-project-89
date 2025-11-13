const steps = [
  {
    id: 'welcome',
    messages: [
      'Привет! Я помогу подобрать курс.',
      'Нажми на кнопку ниже, чтобы начать.',
    ],
    buttons: [
      {
        text: 'Начать',
        nextStepId: 'choose-topic',
        type: 'button',
      },
    ],
  },
  {
    id: 'choose-topic',
    messages: ['Выбери тему, которая интересует больше всего.'],
    buttons: [
      {
        text: 'Веб-разработка',
        nextStepId: 'web',
        type: 'button',
      },
      {
        text: 'Аналитика данных',
        nextStepId: 'analytics',
        type: 'button',
      },
    ],
  },
  {
    id: 'web',
    messages: [
      'Курс по вебу включает HTML, CSS и основы React.',
      'Вернуться? Выбери пункт ниже.',
    ],
    buttons: [
      {
        text: 'Назад к выбору',
        nextStepId: 'choose-topic',
        type: 'button',
      },
    ],
  },
  {
    id: 'analytics',
    messages: [
      'Курс аналитики охватывает SQL, Python и BI-инструменты.',
      'Вернуться? Выбери пункт ниже.',
    ],
    buttons: [
      {
        text: 'Назад к выбору',
        nextStepId: 'choose-topic',
        type: 'button',
      },
    ],
  },
]

export default steps
