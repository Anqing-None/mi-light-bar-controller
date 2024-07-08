<template>
  <div class="h-full mx-auto pt-12 px-6 max-w-screen-lg flex flex-col items-center gap-4">
    <div role="alert" class="alert alert-error">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>未连接到显示器挂灯，请查看配置是否正确。</span>
      <button @click="configModalRef.showModal()" class="btn btn-xs">配置</button>
    </div>
    <!-- <img :src="qrcode" alt="QR Code" /> -->
    <header class="flex justify-center items-center">
      <div class="tooltip" :data-tip="connectState ? '已连接' : '未连接'">
        <IconsMi @click="checkConnection" class="w-6 h-6 mr-2 cursor-pointer" :style="{ filter: connectState ? '' : 'grayscale(1)' }" />
      </div>
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

    <dialog ref="configModalRef" id="my_modal_3" class="modal">
      <div class="modal-box">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-bold">连接挂灯</h3>
          <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost">✕</button>
          </form>
        </div>

        <div class="flex-grow flex flex-col pt-4 gap-4">
          <label for="IP" class="relative px-2 block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
            <input v-model="IP" type="text" id="IP" class="peer w-full h-10 border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0" placeholder="请输入挂灯IP地址" />

            <span
              class="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-base-200 p-0.5 text-xs text-gray-700 dark:text-white transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs"
            >
              挂灯IP地址
            </span>
          </label>

          <label for="token" class="relative px-2 block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
            <input v-model="token" type="text" id="token" class="peer w-full h-10 border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0" placeholder="请输入挂灯token地址" />

            <span
              class="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-base-200 p-0.5 text-xs text-gray-700 dark:text-white transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs"
            >
              挂灯token
            </span>
          </label>
        </div>

        <div>
          若不知道您的设备IP与Token，登陆米家账号获取

        </div>

        <div class="flex justify-end gap-2 mt-5">
          <div class="btn btn-sm">测试连接</div>
          <div class="btn btn-primary btn-sm">确认</div>
        </div>
      </div>

      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
    <div class="absolute left-2 bottom-2 z-10">
      <div class="drawer">
        <input id="my-drawer" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content">
          <!-- Page content here -->
          <label for="my-drawer" class="absolute left-2 bottom-2 btn btn-circle btn-xs drawer-button"><IconsSetting class="w-4 h-4 dark:fill-white" /></label>
        </div>
        <div class="drawer-side">
          <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
          <div class="w-2/3 min-h-full flex flex-col p-4 bg-base-200 text-base-content">
            <h1 class="text-lg font-bold">设置</h1>
            <div class="flex-grow flex flex-col justify-between">
              <div class="flex-grow flex flex-col pt-4 gap-4">
                <label for="IP" class="relative px-2 block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                  <input v-model="IP" type="text" id="IP" class="peer w-full h-10 border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0" placeholder="请输入挂灯IP地址" />

                  <span
                    class="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-base-200 p-0.5 text-xs text-gray-700 dark:text-white transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs"
                  >
                    挂灯IP地址
                  </span>
                </label>

                <label for="token" class="relative px-2 block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                  <input v-model="token" type="text" id="token" class="peer w-full h-10 border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0" placeholder="请输入挂灯token地址" />

                  <span
                    class="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-base-200 p-0.5 text-xs text-gray-700 dark:text-white transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs"
                  >
                    挂灯token
                  </span>
                </label>
              </div>
              <div class="flex justify-end gap-2">
                <div class="btn btn-sm">测试连接</div>
                <div class="btn btn-primary btn-sm">确认</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useQRCode } from '@vueuse/integrations/useQRCode';
import { watchDebounced, useLocalStorage } from '@vueuse/core';
import IconsMi from '@/components/icons/Mi.vue';
import IconsSetting from '@/components/icons/Setting.vue';
import ThemeButton from '@/components/ThemeButton.vue';
import TemperatureCard from './components/TemperatureCard.vue';
const { turnOn, turnOff, setLightness, setColorTemp, testConnection, getInitState, getLoginUrl, loginWithQRCode, loginWithPassword } = window.api;

const configModalRef = ref();
const lightIsON = ref(false);
const lightness = ref(40);
const colorTemperature = ref(2700);
const connectState = ref(false);
const IP = useLocalStorage('IP', '');
const token = useLocalStorage('token', '');

const qrcodeText = ref('text-to-encode');
const qrcode = useQRCode(qrcodeText);

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
  // qrcodeText.value = await getLoginUrl();
});

async function checkConnection() {
  const res = await testConnection(IP.value, token.value);
  connectState.value = res;
}

// onMounted(async () => {
//   await checkConnection();
// });
</script>
