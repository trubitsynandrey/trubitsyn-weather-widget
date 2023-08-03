import { apiKey, mainUrl } from '@/constants'
import { LatLon, WeatherData } from './types'

export const getTheLatLonByName = async (): Promise<{ lat: number, lon: number }> => {
  const response = await fetch(`${mainUrl}geo/1.0/direct?q=London,Izhevsk&limit=1&appid=${apiKey}`)
  const data = await response.json()
  return { lat: data[0].lat, lon: data[0].lon }
}

export const getTheWeatherByLatLon = async ({ lat, lon }: LatLon): Promise<WeatherData> => {
  const response = await fetch(`${mainUrl}data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
  const data = await response.json()
  return data
}

export const formatThousands = (num: number) => {
  const formattedNum = parseFloat((num / 1000).toFixed(1)).toString();
  
  if (!formattedNum.includes(',')) {
    return formattedNum + ',0';
  }
  
  return formattedNum;
}