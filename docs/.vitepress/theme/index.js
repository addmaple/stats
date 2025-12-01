import DefaultTheme from 'vitepress/theme'
import InteractiveCode from '../components/InteractiveCode.vue'
import './custom.css'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('InteractiveCode', InteractiveCode)
  }
}

