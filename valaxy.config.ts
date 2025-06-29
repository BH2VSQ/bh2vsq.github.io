import type { UserThemeConfig } from 'valaxy-theme-yun'
import { defineValaxyConfig } from 'valaxy'
import { addonLightGallery } from 'valaxy-addon-lightgallery'
// add icons what you will need
const safelist = [
  'i-ri-home-line',
]

/**
 * User Config
 */
export default defineValaxyConfig<UserThemeConfig>({
  // site config see site.config.ts

  theme: 'yun',

  themeConfig: {
    banner: {
      enable: true,
      title: '風凪的小窝',
    },
    colors: {
      primary: '#9c5cd4'
    },
    fireworks: {
      enable: true,
      colors: ['#FFE57D', '#FFCD88', '#E6F4AD']
    },
    pages: [
      {
        name: '我的小伙伴们',
        url: '/links/',
        icon: 'i-ri-genderless-line',
        color: 'dodgerblue',
      },
      {
        name: '相册',
        url: '/albums/',
        icon: 'i-ri-gallery-line',
        color: '#43abee',
      },
      {
        name: '赞助',
        url: '/sponsors/',
        icon: 'i-ri-aed-fill',
        color: '#43abee',
      }
    ],

    footer: {
      since: 2025,
      icon: {
        enable: true,
        name: 'i-ri-aed-fill',
        animated: true,
        color: '#d69b54',
        url: '/sponsors/',	//图标链接
        title: '请给我钱'		//鼠标悬停注释
      },
      beian: {
        enable: false,
        icp: '萌ICP备20250599号',
      },
    },
  },

  unocss: { safelist },
  addons: [
    addonLightGallery(),
  ],
})
