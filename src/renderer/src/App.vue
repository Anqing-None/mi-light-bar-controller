<template>
  <div class="py-4">
    <Header></Header>
    <div class="grid-stack p-2">
      <!-- power card -->
      <div class="grid-stack-item" gs-w="2" gs-h="2" gs-x="0" gs-y="0">
        <div class="grid-stack-item-content">
          <div class="w-full h-full flex flex-col gap-2 justify-center items-center bg-gray-100 dark:bg-neutral-800 rounded-lg">
            <span class="text-xl leading-7 font-bold">开关</span>
            <input type="checkbox" class="toggle toggle-success" checked v-model="lightIsON" />
          </div>
        </div>
      </div>

      <!-- lightness card -->
      <div class="grid-stack-item" gs-w="5" gs-h="2" gs-x="2" gs-y="0">
        <div class="grid-stack-item-content">
          <div class="w-full h-full flex flex-col gap-2 justify-center items-center bg-gray-100 dark:bg-neutral-800 rounded-lg">
            <h2 class="flex gap-2 items-center w-4/5 text-xl leading-7 font-bold text-left">
              亮度
              <!-- <span>{{ lightness }}%</span> -->
              <ElInputNumber class="w-2 inline-block" v-model="lightness" :min="0" :max="100" :step="5" controls-position="right" :disabled="!lightIsON" />
              %
            </h2>
            <input
              class="range w-4/5"
              :class="{
                'cursor-not-allowed': !lightIsON,
                'bg-gray-100': !lightIsON,
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
      <div class="grid-stack-item" gs-w="7" gs-h="4" gs-x="0" gs-y="2">
        <div class="grid-stack-item-content">
          <TemperatureCard v-model:temperature="colorTemperature" />
        </div>
      </div>

      <!-- mode card -->
      <div class="grid-stack-item" gs-w="5" gs-h="4" gs-x="7" gs-y="0">
        <div class="grid-stack-item-content">
          <div class="w-full h-full p-4 flex flex-col gap-2 bg-gray-100 dark:bg-neutral-800 rounded-lg">
            <h2 class="text-xl leading-7 font-bold text-left">模式切换</h2>

            <div>
              <form>
                <fieldset class="grid gap-2 grid-cols-2">
                  <input class="btn bg-base-100" id="1" name="mode" type="radio" aria-label="Radio" :disabled="!lightIsON" />
                  <input class="btn bg-base-100" id="2" name="mode" type="radio" aria-label="Radio" :disabled="!lightIsON" />
                  <input class="btn bg-base-100" id="3" name="mode" type="radio" aria-label="Radio" :disabled="!lightIsON" />
                  <input class="btn bg-base-100" id="4" name="mode" type="radio" aria-label="Radio" :disabled="!lightIsON" />
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div class="grid-stack-item" gs-w="5" gs-h="2" gs-x="7" gs-y="4">
        <div class="grid-stack-item-content">
          <div class="w-full h-full p-4 flex flex-col items-center bg-gray-100 dark:bg-neutral-800 rounded-lg">
            <div class="form-control w-full">
              <label class="label justify-between cursor-pointer">
                <span class="label-text">跟随电脑开启</span>
                <input type="checkbox" class="toggle toggle-success" checked />
              </label>
            </div>

            <div class="form-control w-full">
              <label class="label cursor-pointer">
                <span class="label-text">跟随电脑关闭</span>
                <input type="checkbox" class="toggle toggle-success" checked />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="fixed bottom-2 left-0 right-0 text-center text-xs">Made with 🩷 by <a class="text-blue-500" href="https://github.com/Anqing-None" target="_blank">Anqing</a>.</div>

    <div class="fixed w-full h-full top-0 left-0 right-0 bottom-0 bg-black/70 z-10 flex justify-center items-center">
      <div class="btn" @click="configModalRef.showModal()">连接挂灯后即可使用...</div>
    </div>
    <ConfigModal ref="configModalRef"></ConfigModal>
  </div>
</template>

<script setup lang="ts">
import 'gridstack/dist/gridstack.min.css';
import { GridStack } from 'gridstack';
import { onMounted, ref, provide } from 'vue';
import { ElInputNumber } from 'element-plus';
import { useQRCode } from '@vueuse/integrations/useQRCode';
import { watchDebounced, useLocalStorage } from '@vueuse/core';
import TemperatureCard from './components/TemperatureCard.vue';
import Header from './components/Header.vue';
import ConfigModal from './components/ConfigModal.vue';
const { turnOn, turnOff, setLightness, setColorTemp, testConnection, getInitState, getLoginUrl, loginWithQRCode, loginWithPassword } = window.api;

const configModalRef = ref();
const lightIsON = ref(false);
const lightness = ref(40);
const colorTemperature = ref(2700);
const connectState = ref(false);
const IP = useLocalStorage('IP', '');
const token = useLocalStorage('token', '');
const configModalVisible = ref(false);

const qrcodeText = ref('text-to-encode');
const qrcode = useQRCode(qrcodeText);
let grid: GridStack | null = null;

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

onMounted(async () => {
  grid = GridStack.init({ float: true, cellHeight: '70px', minRow: 1 });
});

async function checkConnection() {
  const res = await testConnection(IP.value, token.value);
  connectState.value = res;
}

// onMounted(async () => {
//   await checkConnection();
// });

provide('app', { connectState, checkConnection });
</script>

<style scoped>
.grid-stack > .grid-stack-item > .grid-stack-item-content {
  overflow: hidden;
}
</style>
