<script setup lang="ts">
import { ref, watch } from 'vue'

import CloseIcon from '@/icons/close-icon.svg'

const emit = defineEmits(['close'])

const isOpen = ref(false)

const openPopup = () => {
  isOpen.value = true
}

const closePopup = () => {
  isOpen.value = false
  emit('close')
}

watch(isOpen, (newIsOpen) => {
  if (newIsOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

defineExpose({ openPopup, closePopup })
</script>

<template>
  <!-- <teleport to="#modal"> -->
  <Transition name="fade">
    <div v-show="isOpen">
      <div class="modal"></div>
      <div class="modal__inners">
        <slot></slot>
        <div class="modal__close" @click="closePopup"><CloseIcon /></div>
      </div>
    </div>
  </Transition>
  <!-- </teleport> -->
</template>

<style scoped lang="scss">
.modal {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.modal__close {
  width: 24px;
  height: 24px;
  position: absolute;
  top: 24px;
  right: 24px;
  cursor: pointer;
}

.modal__inners {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #d8d9da;
  color: black;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
