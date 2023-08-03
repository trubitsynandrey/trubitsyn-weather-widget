<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { apiKey, mainUrl } from '@/constants'
import SettingsIcon from '@/icons/settings-icon.svg'
import { WeatherData } from '@/modules/weather/types'
import CityCardsList from '@/modules/weather/ui/city-cards-list.vue'
import WeatherCard from '@/modules/weather/ui/weather-card.vue'

import Input from './Input.vue'
import Modal from './Modal.vue'

export type Post = {
  title: string
  id: string
  body: string
  order: number
}

type LatLon = {
  lat: number
  lon: number
}

const modalRef = ref()

const weatherCards = ref<WeatherData[]>([])

const townToAdd = ref('')

const isLoading = ref(true)

const error = ref('')

const handleDeleteWeatherCard = (id: number) => {
  weatherCards.value = [...weatherCards.value.filter((item) => item.id !== id)]
}

const getTheLatLonByName = async (name: string): Promise<{ lat: number; lon: number }> => {
  const response = await fetch(`${mainUrl}geo/1.0/direct?q=${name}&limit=1&appid=${apiKey}`)
  const data = await response.json()

  return { lat: data[0].lat, lon: data[0].lon }
}

const getTheWeatherByLatLon = async ({ lat, lon }: LatLon): Promise<WeatherData> => {
  const response = await fetch(
    `${mainUrl}data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,
  )
  const data = await response.json()

  return data as WeatherData
}

const getWeatherOnSubmit = async (name: string) => {
  if (name === '') return

  isLoading.value = true

  try {
    const latLon = await getTheLatLonByName(name)
    // eslint-disable-next-line no-console
    console.log(latLon, 'latlon')
    const newWeather = await getTheWeatherByLatLon(latLon)
    weatherCards.value = [...weatherCards.value, newWeather]
  } catch (e) {
    error.value = name
    /* empty */
  } finally {
    isLoading.value = false
    townToAdd.value = ''
  }
}

const openPopUp = () => {
  modalRef.value.openPopup()
}

const handleDrag = () => {
  weatherCards?.value?.forEach((post, i) => (post.order = i))
}

onMounted(async () => {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      async function (position) {
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude

        const weather = await getTheWeatherByLatLon({ lat: latitude, lon: longitude })
        weatherCards.value = [...weatherCards.value, weather]
        isLoading.value = false
        // eslint-disable-next-line no-console
        console.log(weather, 'weather')
      },
      async function () {
        const latLonDataDefault = await getTheLatLonByName('London')
        const weatherDefault = await getTheWeatherByLatLon(latLonDataDefault)
        weatherCards.value = [...weatherCards.value, weatherDefault]
        isLoading.value = false
        // eslint-disable-next-line no-console
        console.log(weatherDefault, 'weatherDefault')
      },
    )
  }
})
</script>

<template>
  <div class="container">
    <div v-if="!weatherCards.length">{{ isLoading ? 'Loading...' : 'Nothing is here' }}</div>
    <div v-else class="weather-card_list">
      <WeatherCard v-for="weather in weatherCards" :weather="weather" :key="weather.name" />
    </div>
  </div>
  <div class="settings_wrapper" @click="openPopUp">
    <SettingsIcon />
  </div>

  <Modal ref="modalRef">
    <div class="modal_inners">
      <CityCardsList
        @handle-drag="handleDrag"
        @delete="(id) => handleDeleteWeatherCard(id)"
        :cities="weatherCards"
      />
      <form @submit.prevent="() => getWeatherOnSubmit(townToAdd)">
        <Input
          v-model="townToAdd"
          name="Add city weather"
          placeholder="Enter really existing city"
          @update:model-value="error = ''"
          :disabled="isLoading"
          :error="error ? `Probably, ${error} city doesn't exist, try again.` : undefined"
        />
        <button style="margin-top: 24px">Enter</button>
      </form>
    </div>
  </Modal>
</template>

<style scoped>
.weather-card_list {
  display: grid;
  gap: 24px;
}
.settings_wrapper {
  width: 24px;
  height: 24px;
  top: 24px;
  right: 24px;
  position: absolute;
  cursor: pointer;
}

.modal_inners {
  padding-top: 40px;
  display: grid;
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
  gap: 16px;
}
</style>
