<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'

import { apiKey, mainUrl } from '@/constants'
import SettingsIcon from '@/icons/settings-icon.svg'
import { WeatherData } from '@/modules/weather/types'
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

const weatherRef = ref<WeatherData[]>([])

const townToAdd = ref('')

const isLoading = ref(false)

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
  isLoading.value = true

  try {
    const latLon = await getTheLatLonByName(name)
    // eslint-disable-next-line no-console
    console.log(latLon, 'latlon')
    const newWeather = await getTheWeatherByLatLon(latLon)
    weatherRef.value = [...weatherRef.value, newWeather]
    townToAdd.value = ''
  } catch (e) {
    /* empty */
  } finally {
    isLoading.value = false
  }
}

const openPopUp = () => {
  modalRef.value.openPopup()
}

const handleDrag = () => {
  weatherRef?.value?.forEach((post, i) => (post.order = i))
}

onMounted(async () => {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      async function (position) {
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude

        const weather = await getTheWeatherByLatLon({ lat: latitude, lon: longitude })
        weatherRef.value = [...weatherRef.value, weather]
        // eslint-disable-next-line no-console
        console.log(weather, 'weather')
      },
      async function () {
        const latLonDataDefault = await getTheLatLonByName('London')
        const weatherDefault = await getTheWeatherByLatLon(latLonDataDefault)
        weatherRef.value = [...weatherRef.value, weatherDefault]
        // eslint-disable-next-line no-console
        console.log(weatherDefault, 'weatherDefault')
      },
    )
  }
})
</script>

<template>
  <div class="container">
    <div v-if="!weatherRef.length">loading...</div>
    <div v-else class="weather-card_list">
      <WeatherCard v-for="weather in weatherRef" :weather="weather" :key="weather.name" />
    </div>
  </div>
  <div class="settings_wrapper" @click="openPopUp">
    <SettingsIcon />
  </div>

  <Modal ref="modalRef">
    <div class="modal_inners">
      <VueDraggableNext
        tag="ul"
        class="weather-card-settings_list"
        :list="weatherRef"
        @update="handleDrag"
      >
        <TransitionGroup name="slide">
          <div class="city_settings" draggable="true" v-for="item in weatherRef" :key="item.name">
            {{ item.name }}, {{ item.sys.country }}
          </div>
        </TransitionGroup>
      </VueDraggableNext>
      <form @submit.prevent="() => getWeatherOnSubmit(townToAdd)">
        <Input
          v-model="townToAdd"
          name="Add city weather"
          placeholder="Enter really existing city"
          :disabled="isLoading"
        />
      </form>
    </div>
  </Modal>
</template>

<style scoped>
.settings_wrapper {
  width: 24px;
  height: 24px;
  top: 24px;
  right: 24px;
  position: absolute;
  cursor: pointer;
}

.city_settings {
  background-color: #272829;
  padding: 8px;
  color: #fff6e0;
  border-radius: 8px;
}

.modal_inners {
  padding-top: 40px;
  display: grid;
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
  gap: 16px;
}

.weather-card_list {
  display: grid;
  gap: 24px;
}

.weather-card-settings_list {
  display: grid;
  gap: 16px;
}

.slide-move,
.slide-enter-active,
.slide-leave-active {
  transition: all 0.8s cubic-bezier(0.55, 0, 0.1, 1);
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.slide-leave-active {
  transition: all 0.5s ease;
}
</style>
