import './normalize.css'
import './style.css'

import { defineCustomElement } from 'vue'

import WeatherMain from './modules/weather/weather-main.ce.vue'

const WeatherElement = defineCustomElement(WeatherMain)

customElements.define('weather-widget', WeatherElement)
