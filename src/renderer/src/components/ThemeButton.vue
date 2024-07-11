<template>
  <div class="dropdown dropdown-end">
    <div tabindex="0" role="button" class="btn btn-sm m-1 flex justify-center items-center">
      <component :class="themeIconClass" :is="themeIconsDict[theme]"></component>
      主题
    </div>
    <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box min-w-36">
      <li @click="switchTheme('light')">
        <a> <IconsSun class="w-4 h-4 fill-black dark:fill-white" />日间 </a>
      </li>
      <li @click="switchTheme('dark')">
        <a><IconsMoon class="w-4 h-4 fill-black dark:fill-white" />夜间</a>
      </li>
      <li @click="switchTheme('os')">
        <a><IconsThemeOS class="w-4 h-4 fill-gray-300 dark:fill-slate-200" />跟随系统</a>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import IconsSun from '@/components/icons/Sun.vue';
import IconsMoon from '@/components/icons/Moon.vue';
import IconsThemeOS from '@/components/icons/ThemeOS.vue';
import { useLocalStorage, useMediaQuery } from '@vueuse/core';
import { computed, watchEffect } from 'vue';

type Theme = 'light' | 'dark' | 'os';

const themeKey = '__theme__';
const isPreferredDark = useMediaQuery('(prefers-color-scheme: dark)');
const theme = useLocalStorage<Theme>(themeKey, isPreferredDark.value ? 'dark' : 'light');
const themeIconsDict = {
  light: IconsSun,
  dark: IconsMoon,
  os: IconsThemeOS,
};
const themeIconClass = computed(() => {
  const isFollowOS = theme.value === 'os';
  return {
    'w-4': true,
    'h-4': true,
    'fill-black': true,
    'fill-gray-300': isFollowOS,
    'dark:fill-white': true,
  };
});

function setThemeClass(themeVal: Theme) {
  switch (themeVal) {
    case 'dark':
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      document.documentElement.dataset.theme = 'dark';
      break;
    case 'light':
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.documentElement.dataset.theme = 'light';

      break;
  }
}

function switchTheme(mode: Theme) {
  theme.value = mode;
}

watchEffect(() => {
  const _theme = theme.value;
  const _isPreferredDark = isPreferredDark.value;

  if (_theme === 'os') {
    _isPreferredDark ? setThemeClass('dark') : setThemeClass('light');
  } else {
    setThemeClass(_theme);
  }
});
</script>
