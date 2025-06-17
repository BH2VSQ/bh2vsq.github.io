import { defineSiteConfig } from 'valaxy'

export default defineSiteConfig({
  url: 'https://blog.bh2vsq.cn/',
  lang: 'zh-CN',
  title: '風凪的小窝',
  subtitle: ' ',
  author: {
    name: '風凪',
    avatar: '/photo/avatar/avatar.jpg',
  },
  description: 'DE BH2VSQ',
  social: [
    {
      name: 'GitHub',
      link: 'https://github.com/BH2VSQ',
      icon: 'i-ri-github-line',
      color: '#6e5494',
    },
    {
      name: '哔哩哔哩',
      link: 'https://space.bilibili.com/188510837',
      icon: 'i-ri-bilibili-line',
      color: '#FF8EB3',
    },
    {
      name: 'E-Mail',
      link: 'mailto:bh2vsq@gmail.com',
      icon: 'i-ri-mail-line',
      color: '#8E71C1',
    },
  ],

  search: {
    enable: false,
    type: 'engine',
  },

  sponsor: {
    enable: true,
    title: '我很可爱，请给我钱！',
    description:'我很可爱，请给我钱！',
    methods: [
      {
        name: '支付宝',
        url: 'alipay.png',
        color: '#00A3EE',
        icon: 'i-ri-alipay-line',
      },
      {
        name: 'QQ 支付',
        url: 'qq.png',
        color: '#12B7F5',
        icon: 'i-ri-qq-line',
      },
      {
        name: '微信支付',
        url: 'wx.png',
        color: '#2DC100',
        icon: 'i-ri-wechat-pay-line',
      },
    ],
  },
})
