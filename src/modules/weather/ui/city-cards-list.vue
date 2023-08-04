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
.weather-card_list {
  display: grid;
  gap: 24px;
}

.weather-card-settings_list {
  display: grid;
  gap: 16px;
}

.city_settings {
  background-color: #272829;
  padding: 8px;
  color: #fff6e0;
  border-radius: 8px;
  padding: 8px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.delete_wrapper {
  width: 20px;
  height: 20px;
  border: none;
  background: none;
  outline: none;
  padding: 0;
  &:hover {
    color: red;
  }
}

.slide {
  &-move,
  &-enter-active,
  &-leave-active {
    transition: all 0.8s cubic-bezier(0.55, 0, 0.1, 1);
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
  &-leave-active {
    transition: all 0.5s ease;
  }
}
</style>
