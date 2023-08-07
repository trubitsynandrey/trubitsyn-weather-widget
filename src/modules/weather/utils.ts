import { apiKey, mainUrl } from '@/constants'
import { makeFetch } from '@/utils/make-fetch'

import { LatLon, WeatherData } from './types'

export const getTheLatLonByName = async (name: string) => {
  const data = await makeFetch<LatLon[]>(
    `${mainUrl}geo/1.0/direct?q=${name}&limit=1&appid=${apiKey}`,
  )

  return { lat: data[0].lat, lon: data[0].lon }
}

export const getTheWeatherByLatLon = async ({ lat, lon }: LatLon) => {
  const data = await makeFetch<WeatherData>(
    `${mainUrl}data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,
  )

  return data
}

export const formatThousands = (num: number) => {
  const formattedNum = parseFloat((num / 1000).toFixed(1)).toString()

  if (!formattedNum.includes('.')) {
    return formattedNum + ',0'
  } else {
    return formattedNum.replace('.', ',')
  }
}

export const localStorageSetWeather = (weatherCards: WeatherData[]) => {
  localStorage.setItem('weatherCards', JSON.stringify(weatherCards))
}
