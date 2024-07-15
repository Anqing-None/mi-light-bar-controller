<template>
  <dialog ref="configModalRef" id="configModal" class="modal">
    <div class="modal-box w-11/12 max-w-5xl select-none">
      <div class="h-full flex flex-col gap-4">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-bold">连接显示器挂灯</h3>
          <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost">✕</button>
          </form>
        </div>

        <div class="flex-grow overflow-auto flex flex-col gap-4">
          <div class="flex flex-col pt-6 gap-6">
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
            <div class="flex justify-between">
              <div @click="handleTestConnect" class="btn w-[48%]">
                <span v-if="isTestConnect" class="loading loading-spinner loading-md"></span>
                <template v-else>
                  <IconsSuccess v-if="connectState" class="w-4 h-4 text-green-400" />
                  <IconsFailed v-else class="w-4 h-4 text-red-400" />
                </template>

                测试连接
              </div>
              <div @click="closeModal" class="btn w-[48%] btn-primary">确定</div>
            </div>

            <div v-if="isShowFailedTips" class="alert alert-warning">
              <div class="flex-1">
                <span class="text-lg">注意：</span>
                <span>请确保您的电脑显示器挂灯与电脑连接同一局域网（连接相同路由器）。</span>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-2" v-if="deviceList.length">
            <h1 @click="isFoldDeviceList = !isFoldDeviceList" class="flex gap-2 items-center cursor-pointer">
              <IconsArrowDown
                class="w-6 h-6 p-1 hover:bg-base-200 transition-transform"
                :class="{
                  '-rotate-90': isFoldDeviceList,
                }"
              />
              您的设备列表（{{ deviceList.length }}）
            </h1>
            <div class="flex flex-col gap-2" :style="{ height: isFoldDeviceList ? '0' : 'auto', overflow: 'hidden' }">
              <template v-for="device in deviceList" :key="token">
                <div
                  @click="handleSelectDevice(device)"
                  class="p-4 bg-base-200 rounded-xl border border-transparent hover:border-primary cursor-pointer"
                  :class="{
                    'border-primary': selectedDeviceToken === device.token,
                  }"
                >
                  <h2 class="card-title">{{ device.name }}</h2>
                  <p class="text-nowrap overflow-hidden text-ellipsis">型号：{{ device.model }}</p>
                  <p class="text-nowrap overflow-hidden text-ellipsis">IP：{{ device.localip }}</p>
                  <p class="text-nowrap overflow-hidden text-ellipsis">token：{{ device.token }}</p>
                  <p class="text-nowrap overflow-hidden text-ellipsis">状态：{{ device.isOnline }}</p>
                </div>
              </template>
            </div>
          </div>

          <!-- Login -->
          <div class="flex-grow flex flex-col pt-4 gap-4">
            <h1 class="font-bold">若您不知道您的设备IP与Token，可在下方登录米家账号获取</h1>
            <div class="relative p-8 bg-base-200 rounded-xl dark:bg-[#101010]">
              <div class="tooltip tooltip-left absolute top-0 right-0" :data-tip="loginMethod === 'account' ? '扫码登陆' : '密码登录'">
                <div @click="toggleLoginMethod" class="w-16 h-16 bg-[#ed682d] bg-opacity-60 hover:bg-opacity-100 cursor-pointer" style="clip-path: polygon(0 0, 100% 100%, 100% 0)">
                  <QRCodeIcon v-if="loginMethod === 'account'" class="w-9 h-9 absolute top-2 right-2 scale-90 fill-black" />
                  <DesktopIcon v-else class="w-9 h-9 absolute top-2 right-2 scale-90 fill-black" />
                </div>
              </div>

              <h1 class="text-xl font-bold">登录</h1>
              <div class="mt-8">
                <div v-if="loginMethod === 'account'" class="flex flex-col gap-4">
                  <label for="username" class="relative px-2 block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                    <input v-model="username" type="text" id="username" class="peer w-full h-10 border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0" placeholder="请输入邮箱/手机号码/小米ID" />

                    <span
                      class="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-base-200 p-0.5 text-xs text-gray-700 dark:text-white transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs"
                    >
                      邮箱/手机号码/小米ID
                    </span>
                  </label>

                  <label for="password" class="relative px-2 block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                    <input v-model="password" type="password" id="password" class="peer w-full h-10 border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0" placeholder="请输入密码" />

                    <span
                      class="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-base-200 p-0.5 text-xs text-gray-700 dark:text-white transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs"
                    >
                      密码
                    </span>
                  </label>
                  <div @click="handleAccountLogin" class="btn btn-block text-lg bg-[#ed682d] text-white hover:bg-[#ff7e29]">
                    <span v-if="loginLoading" class="loading loading-spinner loading-md"></span>
                    获取设备
                  </div>
                </div>
                <div v-else class="flex flex-col gap-8">
                  <div class="text-xl text-center">扫码登录 安全快捷</div>
                  <div class="relative flex justify-center">
                    <div v-if="qrcodeLoading" class="w-50 h-50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <span class="loading loading-spinner loading-md"></span>
                    </div>
                    <div v-else class="relative">
                      <img :src="qrcode" alt="QRCode" class="w-50 h-50" />
                      <IconsMi class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 block w-12 h-12" />
                    </div>
                  </div>
                  <div class="text-xs text-center">请使用小米手机/米家等小米旗下App扫码登录</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue';
import QRCodeIcon from '@/components/icons//QRCode.vue';
import DesktopIcon from '@/components/icons//Desktop.vue';
import IconsMi from '@/components/icons/Mi.vue';
import IconsArrowDown from '@/components/icons/ArrowDown.vue';
import IconsSuccess from '@/components/icons/Success.vue';
import IconsFailed from '@/components/icons/Failed.vue';
import { useQRCode } from '@vueuse/integrations/useQRCode';
import { useLocalStorage } from '@vueuse/core';

interface Device {
  name: string;
  model: string;
  token: string;
  localip: string;
  isOnline: boolean;
}

const { loginWithQRCode, loginWithAccount, checkConnection, connectState } = inject<any>('app');
const configModalRef = ref();
const qrcodeText = ref('text-to-encode');
const qrcode = useQRCode(qrcodeText);
const loginMethod = ref<'qrcode' | 'account'>('account');
const qrcodeLoading = ref(false);
const IP = useLocalStorage('IP', '');
const token = useLocalStorage('token', '');
const username = useLocalStorage('username', '');
const password = useLocalStorage('password', '');
const deviceList = useLocalStorage<Device[]>('deviceList', []);
const selectedDeviceToken = useLocalStorage('selectedDeviceToken', '');
const loginLoading = ref(false);
const isFoldDeviceList = ref(false);
const isTestConnect = ref(false);
const isShowFailedTips = ref(false);

async function toggleLoginMethod() {
  loginMethod.value = loginMethod.value === 'qrcode' ? 'account' : 'qrcode';

  if (loginMethod.value === 'qrcode') {
    qrcodeLoading.value = true;
    const { lp, loginUrl } = await loginWithQRCode();

    qrcodeText.value = loginUrl;
    qrcodeLoading.value = false;

    // 等待扫描完成
    window.electron.ipcRenderer.send('listen-qrcode-scan', lp);
    window.electron.ipcRenderer.on('qrcode-success', (_, _deviceList) => {
      console.log(_deviceList);
      deviceList.value = JSON.parse(_deviceList);
    });
  }
}

async function handleAccountLogin() {
  try {
    loginLoading.value = true;
    const res = await loginWithAccount({ username: username.value, password: password.value });
    if (Array.isArray(res)) {
      deviceList.value = res;
    }
    console.log(res);
  } catch (error) {
    console.log(error);
  } finally {
    loginLoading.value = false;
  }
}

function handleSelectDevice(device: Device) {
  const { localip, token: _token } = device;

  IP.value = localip;
  token.value = _token;
}

async function handleTestConnect() {
  isTestConnect.value = true;
  const res = await checkConnection();
  isTestConnect.value = false;
  if (!res) {
    isShowFailedTips.value = true;
  }
}

const showModal = () => {
  configModalRef.value.showModal();
};

const closeModal = () => {
  configModalRef.value.close();
};

defineExpose({
  showModal,
  closeModal,
});
</script>
