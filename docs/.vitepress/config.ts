import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/mi-light-bar-controller/',
  title: '米家显示器挂灯1s PC控制器',
  description: '在PC上控制你的米家显示器挂灯。',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/mi-light-bar.svg',
    nav: [
      { text: '主页', link: '/' },
      { text: '使用教程', link: '/tutorial' },
    ],

    sidebar: [
      {
        text: '使用教程',
        items: [{ text: '连接显示器挂灯', link: '/tutorial' }],
      },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/Anqing-None/mi-light-bar-controller' }],
  },
});
