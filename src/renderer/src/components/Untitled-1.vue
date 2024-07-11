<div class="h-full mx-auto pt-12 px-6 max-w-screen-lg flex flex-col items-center gap-4">
  <div role="alert" class="alert alert-error">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <span>未连接到显示器挂灯，请查看配置是否正确。</span>
    <button @click="configModalRef.showModal()" class="btn btn-xs">配置</button>
  </div>
  <!-- <img :src="qrcode" alt="QR Code" /> -->

  <main class="flex flex-col gap-4">



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

  <div class="grid-stack">
    <div class="grid-stack-item">
      <div class="grid-stack-item-content">Item 1</div>
    </div>
    <div class="grid-stack-item" gs-w="2">
      <div class="grid-stack-item-content">Item 2 wider</div>
    </div>
  </div>
</div>
