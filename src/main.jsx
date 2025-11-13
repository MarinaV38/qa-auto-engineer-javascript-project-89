import { createRoot } from 'react-dom/client'
import Widget from '@hexlet/chatbot-v2'
import steps from '@hexlet/chatbot-v2/example-steps'
import '@hexlet/chatbot-v2/styles'

createRoot(document.getElementById('root')).render(Widget(steps))
