<script setup lang="ts">
import { url } from '@/constants';
import PressureIcon from '@/icons/pressure-icon.svg';
import WindIcon from '@/icons/wind-icon.svg';
import { formatThousands } from '@/modules/weather/utils';
import { computed } from 'vue';
import { WeatherData } from '../types';


const getWeatherImg = (str: string) => `${url}/img/wn/${str}@2x.png`
const props = defineProps<{weather: WeatherData}>()

const imgComputed = computed(() => getWeatherImg(props.weather.weather[0].icon ?? ''))


</script>
<template>
  <div class="weather-city_card">
    <p>{{ props.weather.name }}, {{ props.weather.sys.country }}</p>
    <div class="withImgContainer">
      <img :src="imgComputed" width="100" height="100" />
      <p>{{ Math.floor(props?.weather.main.temp) }} &#8451;</p>
    </div>
    <p style="text-wrap: balance">Feels like: {{ Math.floor(props.weather.main.feels_like) }} &#8451;.
      {{ props.weather.weather[0].main }}. {{ props.weather.weather[0].description }} </p>
    <div class="grid_description">
      <div class="description_item">
        <div class="wind-icon_wrapper">
          <WindIcon />
        </div>
        <p>{{ props.weather.wind.speed }} m/s</p>
      </div>
      <div class="description_item">
        <div class="wind-icon_wrapper">
          <PressureIcon />
        </div>
        <p>{{ props.weather.main.pressure }} hPa</p>
      </div>
      <div class="description_item">
        <p>Humidity: {{ props.weather.main.humidity }}%</p>
      </div>
      <div class="description_item">
        <p>Visibility {{ formatThousands(props.weather.visibility) }} km</p>
      </div>
    </div>
  </div>
</template>

<style scoped>


.withImgContainer {
  display: flex;
  align-items: center;
}

.withImgContainer p {
  font-size: 24px;
}
.wind-icon_wrapper {
  width: 24px;
  height: 24px;
}

.grid_description {
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-top: 24px;
  gap: 16px;
  width: 100%;
  justify-items: center;
}

.description_item {
  display: flex;
  gap: 16px;
}

.weather-city_card {
  display: flex;
  flex-direction: column;
  max-width: 600px;
  width: 100%;
  justify-self: center;
  border: 1px solid white;
  border-radius: 16px;
  padding: 16px;
  align-items: center;
}
</style>
