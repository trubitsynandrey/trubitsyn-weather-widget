<script setup lang="ts">
import { VueDraggableNext } from 'vue-draggable-next'

import DeleteIcon from '@/icons/delete-icon.svg'

import { WeatherData } from '../types'

defineEmits<{ (e: 'delete', id: number): void; (e: 'handleDrag'): void }>()
defineProps<{ cities: WeatherData[] }>()
</script>

<template>
  <VueDraggableNext
    tag="ul"
    class="weather-card-settings_list"
    :list="cities"
    @update="$emit('handleDrag')"
  >
    <TransitionGroup name="slide">
      <li class="city_settings" draggable="true" v-for="city in cities" :key="city.name">
        <div>{{ city.name }}, {{ city.sys.country }}</div>
        <button
          type="button"
          class="delete_wrapper"
          @touchstart="$emit('delete', city.id)"
          @click="$emit('delete', city.id)"
        >
          <DeleteIcon />
        </button>
      </li>
    </TransitionGroup>
  </VueDraggableNext>
</template>

<style lang="scss">
@import url('../styles/city-card-list.scss');
</style>
