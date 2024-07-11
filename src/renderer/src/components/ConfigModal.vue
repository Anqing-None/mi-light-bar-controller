<template>
  <dialog ref="configModalRef" id="configModal" class="modal">
    <div class="modal-box w-full h-full">
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-bold">连接显示器挂灯</h3>
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
        <div class="text-sm">若您不知道您的设备IP与Token，可在下方登陆米家账号获取</div>
        <div class="relative">
          <div class="qrimg absolute top-0 right-0 w-8 h-8">
            <img :src="demoQRCode" alt="QR Code" />
          </div>

          <div class="flex flex-col gap-2">
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
        </div>

        <div class="w-0 h-0 border-r-[50px] border-b-[50px] border-b-transparent border-r-[#ed682d]"></div>
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
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useQRCode } from '@vueuse/integrations/useQRCode';

// const props = defineProps<{
//   visible: boolean;
// }>();
// const emit = defineEmits(['update:visible']);

const configModalRef = ref();
const qrcodeText = ref('text-to-encode');
const qrcode = useQRCode(qrcodeText);
const demoQRCode = useQRCode('demo');

// const visible = computed({
//   get: () => props.visible,
//   set: (value) => emit('update:visible', value),
// });

// watch(visible, (value) => {
//   if (value) {
//     configModalRef.value.showModal();
//   } else {
//     configModalRef.value.close();
//   }
// });

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

<style scoped></style>
