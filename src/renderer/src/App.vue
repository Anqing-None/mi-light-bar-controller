<template>
  <div class="h-full mx-auto pt-12 px-6 max-w-screen-lg flex flex-col items-center gap-4">
    <header class="flex justify-center items-center">
      <IconsMi class="w-6 h-6 mr-2" />
      <h1 class="text-xl">
        <span>米家显示器挂灯1S PC 控制器 </span>
        <span class="text-xs align-bottom italic">v 1.0.0</span>
      </h1>
      <ThemeButton class="ml-8" />
    </header>
    <main class="flex flex-col gap-4">
      <!-- lightness card -->
      <div class="card w-[28rem] bg-base-100 shadow-xl">
        <div class="card-body">
          <div class="flex items-center gap-2 mb-2">
            <span class="card-title">开关</span>
            <input type="checkbox" class="toggle toggle-success" checked v-model="lightIsON" />
          </div>
          <h2 class="card-title">
            亮度 <span>{{ lightness }}%</span>
          </h2>
          <div class="mt-2">
            <input
              class="range"
              :class="{
                'cursor-not-allowed': !lightIsON,
                'bg-gray-300': !lightIsON,
                'range-primary': lightIsON,
              }"
              type="range"
              min="0"
              max="100"
              v-model="lightness"
              :disabled="!lightIsON"
            />
          </div>
        </div>
      </div>
      <!-- temperature card -->
      <TemperatureCard class="card w-[28rem] bg-base-100 shadow-xl" v-model:temperature="colorTemperature" />
      <!-- mode card -->
      <div class="card w-[28rem] bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">模式切换</h2>
          <div class="mt-2">
            <form>
              <fieldset class="flex gap-2">
                <input class="btn" id="1" name="mode" type="radio" aria-label="Radio" :disabled="!lightIsON" />
                <input class="btn" id="2" name="mode" type="radio" aria-label="Radio" :disabled="!lightIsON" />
                <input class="btn" id="3" name="mode" type="radio" aria-label="Radio" :disabled="!lightIsON" />
                <input class="btn" id="4" name="mode" type="radio" aria-label="Radio" :disabled="!lightIsON" />
              </fieldset>
            </form>
          </div>
        </div>
      </div>
      <!-- setting card -->
      <div class="card w-[28rem] bg-base-100 shadow-xl">
        <div class="card-body">
          <div class="mt-2">
            <div class="form-control">
              <label class="label cursor-pointer">
                <!-- <span class="label-text">开机时自动打开台灯</span> -->
                <span class="label-text">台灯跟随电脑开启</span>
                <input type="checkbox" class="toggle toggle-success" checked />
              </label>
            </div>
          </div>

          <div class="mt-2">
            <div class="form-control">
              <label class="label cursor-pointer">
                <!-- <span class="label-text">关机时自动关闭台灯</span> -->
                <span class="label-text">台灯跟随电脑关闭</span>
                <input type="checkbox" class="toggle toggle-success" checked />
              </label>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { watchDebounced } from '@vueuse/core';
import IconsMi from '@/components/icons/Mi.vue';
import ThemeButton from '@/components/ThemeButton.vue';
import TemperatureCard from './components/TemperatureCard.vue';
const { turnOn, turnOff, setLightness, setColorTemp } = window.api;

const lightIsON = ref(false);
const lightness = ref(40);
const colorTemperature = ref(2700);

watchDebounced(
  lightIsON,
  (isON) => {
    isON ? turnOn() : turnOff();
  },
  { debounce: 300 },
);

watchDebounced(
  lightness,
  (value) => {
    setLightness(value);
  },
  { debounce: 300 },
);

watchDebounced(
  colorTemperature,
  (value) => {
    setColorTemp(value);
  },
  { debounce: 300 },
);
</script>
