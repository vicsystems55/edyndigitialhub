<script setup>
defineProps({ compact: Boolean })

const imageModules = import.meta.glob('../../assets/images/*.{png,jpg,jpeg,webp,avif}', { eager: true, import: 'default' })
const coverImage = imageModules['../../assets/images/the-healthy-your-cover.jpg'] || ''
</script>

<template>
  <div class="book-cover" :class="{ 'book-cover--compact': compact }">
    <img v-if="coverImage" :src="coverImage" alt="The Healthy You book cover" />
    <div v-else class="book-cover-placeholder">
      <span>EDYN PUBLICATIONS</span>
      <h3>The<br /><em>Healthy</em><br />You</h3>
      <i></i>
      <p>Princess Oluwatoyin Emmanuel</p>
    </div>
  </div>
</template>
