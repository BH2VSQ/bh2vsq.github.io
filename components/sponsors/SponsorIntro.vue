<script setup lang="ts">
import { useAppStore } from 'valaxy'

import { useI18n } from 'vue-i18n'

const app = useAppStore()

const { t } = useI18n()
</script>

<template>
  <div class="post-card" m="auto" p="4">
    <div flex="~ wrap" class="m-2 items-center justify-center gap-4">
      <a
        class="flex items-center justify-center border-none!"
        href="https://afdian.com/@BH2VSQ"
        target="_blank"
      >
        <SponsorBtn>
          <span>通过</span>
          <span class="flex items-center justify-center" m="x-1">
            <div i-ri-flashlight-line />爱发电
          </span>
          <span>赞助我</span>
        </SponsorBtn>
      </a>

      <a
        class="flex items-center justify-center border-none!"
        href="https://space.bilibili.com/188510837"
        target="_blank"
      >
        <SponsorBtn>
          <span>通过</span>
          <span class="flex items-center justify-center" m="x-1">
            <div i-ri-aed-fill />哔哩哔哩
          </span>
          <span>充电赞赏</span>
        </SponsorBtn>
      </a>
    </div>
  </div>
</template>
