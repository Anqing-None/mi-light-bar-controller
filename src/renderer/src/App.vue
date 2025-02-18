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
              <ElInputNumber class="w-2 inline-block" @change="() => (selectedModeId = '')" v-model.number="lightness" :min="0" :max="100" :step="5" controls-position="right" />
              %
            </h2>
            <input @change="() => (selectedModeId = '')" class="range range-primary w-4/5" type="range" min="0" max="100" v-model.number="lightness" />
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
          <div class="w-full h-full p-4 flex flex-col gap-4 bg-gray-100 dark:bg-neutral-800 rounded-lg">
            <h2 class="text-xl leading-7 font-bold text-left">模式切换</h2>
            <div class="grid gap-4 grid-cols-2">
              <div v-for="mode in modeList" class="btn hover:btn-primary hover:text-white" :class="{ 'btn-primary text-white': mode.id === selectedModeId }" @click="selectedModeId = mode.id">
                {{ mode.name }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid-stack-item" gs-w="5" gs-h="2" gs-x="7" gs-y="4">
        <div class="grid-stack-item-content">
          <div class="w-full h-full p-4 flex flex-col items-center bg-gray-100 dark:bg-neutral-800 rounded-lg">
            <div class="form-control w-full">
              <label class="label justify-between cursor-pointer">
                <span class="label-text">跟随软件开启</span>
                <input v-model="isStartWithSystem" type="checkbox" class="toggle toggle-success" checked />
              </label>
            </div>

            <div class="form-control w-full">
              <label class="label cursor-pointer">
                <span class="label-text">跟随软件关闭</span>
                <input v-model="isCloseWithSystem" type="checkbox" class="toggle toggle-success" checked />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="fixed bottom-2 left-0 right-0 text-center text-xs">Made with 🩷 by <a class="text-blue-500" href="https://github.com/Anqing-None" target="_blank">Anqing</a>.</div>

    <div v-if="false" class="fixed w-full h-full top-0 left-0 right-0 bottom-0 bg-black/70 z-10 flex justify-center items-center">
      <div class="btn" @click="configModalRef.showModal()">连接挂灯后即可使用...</div>
    </div>
    <ConfigModal ref="configModalRef"></ConfigModal>
  </div>
</template>

<script setup lang="ts">
import 'gridstack/dist/gridstack.min.css';
import { GridStack } from 'gridstack';
import { onMounted, onBeforeMount, ref, provide } from 'vue';
import { ElInputNumber } from 'element-plus';
import { watchDebounced, useLocalStorage } from '@vueuse/core';
import TemperatureCard from './components/TemperatureCard.vue';
import Header from './components/Header.vue';
import ConfigModal from './components/ConfigModal.vue';
import { getInitState, setPower, setBright, set_CT } from '@/api/control';

const { testConnection, loginWithQRCode, loginWithAccount, setStartWithSystem, setCloseWithApp, execCommand } = window.api;

const configModalRef = ref();
const IP = useLocalStorage('IP', '');
const token = useLocalStorage('token', '');
const lightIsON = ref(false);
const lightness = useLocalStorage('lightness', 40);
const colorTemperature = useLocalStorage('colorTemperature', 2700);
const connectState = ref(false);
const isStartWithSystem = useLocalStorage('isStartWithSystem', false);
const isCloseWithSystem = useLocalStorage('isCloseWithSystem', false);

const modeList = [
  {
    id: '1',
    name: '办公',
    params: {
      lightness: 100,
      colorTemperature: 4500,
    },
  },
  {
    id: '2',
    name: '阅读',
    params: {
      lightness: 1000,
      colorTemperature: 5000,
    },
  },
  {
    id: '3',
    name: '休闲',
    params: {
      lightness: 50,
      colorTemperature: 4000,
    },
  },
  {
    id: '4',
    name: '电脑',
    params: {
      lightness: 50,
      colorTemperature: 2700,
    },
  },
  {
    id: '5',
    name: '温馨',
    params: {
      lightness: 60,
      colorTemperature: 3500,
    },
  },
  {
    id: '6',
    name: '闪烁',
    params: {
      lightness: 100,
      colorTemperature: 5800,
    },
  },
];

const selectedModeId = useLocalStorage('selectedModeId', '');

watchDebounced(
  selectedModeId,
  (id) => {
    const mode = modeList.find((m) => m.id === id);
    if (!mode) return;
    lightness.value = mode.params.lightness;
    colorTemperature.value = mode.params.colorTemperature;
  },
  { debounce: 300 },
);

watchDebounced(
  lightIsON,
  (isON) => {
    const state = isON ? 'on' : 'off';
    setPower(state);
  },
  { debounce: 300 },
);

watchDebounced(
  lightness,
  (value) => {
    setBright(value);
  },
  { debounce: 300 },
);

watchDebounced(
  colorTemperature,
  (value) => {
    set_CT(value);
  },
  { debounce: 300 },
);

async function checkConnection() {
  if (IP.value === '' || token.value === '') {
    connectState.value = false;
    return { id: 1, error: { message: 'IP and token can not be empty.', code: -1 } };
  }

  const res = await testConnection(IP.value, token.value);
  connectState.value = Object.hasOwn(res, 'result');
  return res;
}

function openSettingModal() {
  configModalRef.value.showModal();
}

provide('app', { connectState, selectedModeId, IP, token, checkConnection, loginWithQRCode, openSettingModal, loginWithAccount });

onBeforeMount(async () => {
  if (IP.value === '' || token.value === '') return;
  const res = await checkConnection();

  const isSucessed = Object.hasOwn(res, 'result');

  console.log('onBeforeMount test connection', res);

  if (isSucessed) {
    const res = await getInitState();

    if (Object.hasOwn(res, 'result')) {
      const [power, bright, ct] = (res as ResultSuccess).result;
      // 如果灯是打开的状态，同步灯的参数到界面
      if (power === 'on') {
        lightIsON.value = true;
        lightness.value = +bright;
        colorTemperature.value = +ct;
      } else if(isStartWithSystem.value) {
        // 如果灯是关闭的，且配置了跟随电脑开启，使用软件的参数开启灯
        setPower('on').then(() => lightIsON.value = true)
        setBright(lightness.value);
        set_CT(colorTemperature.value);
      }
    }
  }
});

onMounted(async () => {
  GridStack.init({ float: true, cellHeight: '70px', minRow: 1 });

  // update state
  setStartWithSystem(isStartWithSystem.value);
  setCloseWithApp(isCloseWithSystem.value);
});
</script>

<style scoped>
.grid-stack > .grid-stack-item > .grid-stack-item-content {
  overflow: hidden;
}
</style>
