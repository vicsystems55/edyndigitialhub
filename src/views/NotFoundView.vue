<script setup>
import { ArrowLeft } from '@lucide/vue'
</script>
<template><section class="placeholder-page"><div class="container"><p class="eyebrow">404 error</p><h1>Page not found</h1><p>The page you are looking for may have moved or no longer exists.</p><RouterLink to="/" class="button button-green"><ArrowLeft :size="18" /> Back home</RouterLink></div></section></template>
