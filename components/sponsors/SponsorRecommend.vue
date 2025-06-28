<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div flex="~ col" class="items-center">
    <div class="relative flex animate-fade-in animate-duration-1000 animate-iteration-1 items-center justify-center">
      <img
        class="fade-in xiao-yun-q z-2 m-auto inline-flex shadow-none! m-0!"
        src="alipay.png"
        alt="通过支付宝赞助"
      >
      <img
        class="fade-in xiao-yun-q z-2 m-auto inline-flex shadow-none! m-0!"
        src="wx.png"
        alt="通过微信赞助"
      >
      <img
        class="fade-in xiao-yun-q z-2 m-auto inline-flex shadow-none! m-0!"
        src="qq.png"
        alt="通过QQ赞助"
      >
    </div>
  </div>
</template>

<style>
.xiao-yun-q {
  width: 200px;
  aspect-ratio: 1;
}
</style>
