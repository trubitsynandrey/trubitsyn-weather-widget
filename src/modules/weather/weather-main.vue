<script setup lang="ts">
import { onMounted, ref } from 'vue'

import Input from '@/components/Input.vue'
import Modal from '@/components/Modal.vue'
import SettingsIcon from '@/icons/settings-icon.svg'
import { WeatherData } from '@/modules/weather/types'
import CityCardsList from '@/modules/weather/ui/city-cards-list.vue'
import WeatherCard from '@/modules/weather/ui/weather-card.vue'

import { getTheLatLonByName, getTheWeatherByLatLon } from './utils'

const modalRef = ref()

const weatherCards = ref<WeatherData[]>([])

const townToAdd = ref('')

const isLoading = ref(false)

const error = ref('')

const handleDeleteWeatherCard = (id: number) => {
  weatherCards.value = [...weatherCards.value.filter((item) => item.id !== id)]
  localStorage.setItem('weatherCards', JSON.stringify(weatherCards.value))
}

const getWeatherOnSubmit = async (name: string) => {
  if (name === '') return

  isLoading.value = true

  try {
    const latLon = await getTheLatLonByName(name)
    const newWeather = await getTheWeatherByLatLon(latLon)
    weatherCards.value = [...weatherCards.value, newWeather]
    localStorage.setItem('weatherCards', JSON.stringify(weatherCards.value))
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
  localStorage.setItem('weatherCards', JSON.stringify(weatherCards.value))
}

onMounted(async () => {
  const savedWeatherCards = localStorage.getItem('weatherCards')

  if (savedWeatherCards) {
    weatherCards.value = JSON.parse(savedWeatherCards)

    return
  }

  isLoading.value = true

  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      async function (position) {
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude

        const weather = await getTheWeatherByLatLon({ lat: latitude, lon: longitude })
        weatherCards.value = [...weatherCards.value, weather]
        localStorage.setItem('weatherCards', JSON.stringify(weatherCards.value))
        isLoading.value = false
      },
      async function () {
        const latLonDataDefault = await getTheLatLonByName('London')
        const weatherDefault = await getTheWeatherByLatLon(latLonDataDefault)
        weatherCards.value = [...weatherCards.value, weatherDefault]
        localStorage.setItem('weatherCards', JSON.stringify(weatherCards.value))
        isLoading.value = false
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
