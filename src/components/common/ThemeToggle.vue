<script setup>
import { onMounted, ref } from 'vue'
import { Moon, Sun } from '@lucide/vue'

const dark = ref(false)

onMounted(() => {
  dark.value = document.documentElement.classList.contains('dark')
})

function toggleTheme() {
  dark.value = !dark.value
  document.documentElement.classList.toggle('dark', dark.value)
  localStorage.setItem('edyn-theme', dark.value ? 'dark' : 'light')
}
</script>

<template>
  <button class="theme-toggle" type="button" :aria-label="`Use ${dark ? 'light' : 'dark'} mode`" @click="toggleTheme">
    <Sun v-if="dark" :size="18" />
    <Moon v-else :size="18" />
  </button>
</template>
