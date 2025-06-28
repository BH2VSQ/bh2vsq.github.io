<script setup lang="ts">
import { onMounted, ref } from 'vue'

const sponsorSvgText = ref('')
onMounted(async () => {
  const sponsorSvg = 'https://sponsors.yunyoujun.cn/sponsors.svg'
  const svgRes = await fetch(sponsorSvg)
  sponsorSvgText.value = await svgRes.text()
})
</script>

<template>
  <SponsorIntro />
</template>

<style lang="scss">
.svg-container {
  // width: 100%;
  svg {
    height: auto;
  }
}
</style>
