<script setup>
import coverImage from '../../assets/images/the-healthy-your-cover.png'

defineProps({ compact: Boolean })
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
