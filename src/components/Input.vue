<script setup lang="ts">
defineProps<{
  modelValue: string
  name: string
  placeholder: string
  disabled?: boolean
  error?: string
}>()

const emit = defineEmits(['update:modelValue'])

const updateInput = (e: Event) => {
  if (e && e.target) {
    emit('update:modelValue', (e.target as HTMLInputElement).value)
  }
}
</script>

<template>
  <div class="input">
    <label>{{ name }}</label>
    <input
      :value="modelValue"
      @input="updateInput"
      class="input__input"
      :placeholder="placeholder"
      :disabled="disabled"
    />
    <p v-if="error" class="input__error">{{ error }}</p>
  </div>
</template>

<style scoped lang="scss">
.input {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  & label {
    font-weight: bold;
    margin-bottom: 8px;
  }
}

.input__input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  font-size: 16px;
  width: 100%;
  &:focus,
  &:hover {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
}

.input__error {
  color: red;
}
</style>
