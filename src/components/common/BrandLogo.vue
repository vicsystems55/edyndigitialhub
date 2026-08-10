<script setup>
defineProps({ compact: Boolean, light: Boolean })
</script>

<template>
  <RouterLink to="/" class="brand-logo" aria-label="Edyn Digital Hub home">
    <img class="brand-image" src="../../assets/images/logo.png" alt="" aria-hidden="true" />
    <span v-if="!compact" class="brand-words" :class="{ 'text-white': light }">
      <strong>EDYN</strong>
      <small>DIGITAL HUB</small>
    </span>
  </RouterLink>
</template>
