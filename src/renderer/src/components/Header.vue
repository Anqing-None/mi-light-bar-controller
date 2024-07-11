<template>
  <header class="flex justify-between items-center pr-2">
    <div class="flex justify-center items-center flex-grow">
      <div class="tooltip tooltip-bottom" :data-tip="connectState ? '已连接' : '未连接'">
        <IconsMi @click="checkConnection" class="block w-6 h-6 mr-2 cursor-pointer" :style="{ filter: connectState ? '' : 'grayscale(1)' }" />
      </div>
      <h1 class="text-xl">
        <span>米家显示器挂灯1S PC 控制器 </span>
        <span class="text-xs align-bottom italic">v 1.0.0</span>
      </h1>
    </div>
    <div>
      <ThemeButton class="ml-8" />
      <div class="btn btn-sm">
        <IconsSetting class="w-4 h-4 fill-black dark:fill-white" />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import IconsMi from '@/components/icons/Mi.vue';
import IconsSetting from '@/components/icons/Setting.vue';
import ThemeButton from '@/components/ThemeButton.vue';

const { connectState, checkConnection } = inject<any>('app');
</script>
