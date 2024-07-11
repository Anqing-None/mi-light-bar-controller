<template>
  <div class="w-full h-full flex flex-col gap-2 justify-center items-center bg-gray-100 dark:bg-neutral-800 rounded-lg">
    <h2 class="w-4/5 flex gap-2 items-center text-xl leading-7 font-bold text-left">
      色温调节
      <ElInputNumber class="w-4 inline-block" v-model="temperature" :min="2700" :max="6500" :step="100" controls-position="right" />
      K
    </h2>
    <div ref="container" class="w-4/5 relative" :style="{ width: `${width}px`, height: `${height}px` }" @click="handleClick">
      <div class="absolute border-2 border-primary cursor-pointer hover:scale-105 transition-transform" :style="sliderSelectorStyle" @mousedown.stop="handleMouseDown"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue';
import { ElInputNumber } from 'element-plus';
import { clamp } from '@/utils/util';
import chroma from 'chroma-js';

const props = withDefaults(defineProps<{ temperature: number }>(), {
  temperature: 2700,
});
const emit = defineEmits(['update:temperature']);

const temperature = computed({
  get: () => props.temperature,
  set: (value: number) => {
    sliderX.value = tempToSliderX(value);
    emit('update:temperature', value);
  },
});

const container = ref<HTMLElement>();
// 6500 - 2700 = 3800 步长设置为10，所以有381个温度值，范围为2700 - 2710 - ... - 6500
const width = 381;
const height = 150;

// 色温拖拽条宽度、高度、偏移量
const sliderWidth = 10;
const sliderHeight = height + 10;
const sliderOffsetX = -sliderWidth / 2;
const sliderOffsetY = -5;
// 拖拽条位置 设置为拖拽条中点
const sliderX = ref(tempToSliderX(temperature.value));
const sliderSelectorStyle = computed(() => {
  const top = sliderOffsetY;
  // 拖拽条位置限制在容器内，范围 [-5, 381 - 5]
  const left = clamp(sliderX.value, sliderOffsetX, width + sliderOffsetX);

  return {
    width: `${sliderWidth}px`,
    height: `${sliderHeight}px`,
    top: `${top}px`,
    left: `${left}px`,
  };
});
// 色温拖拽步长
const sliderDragTempStep = 10;

watch(sliderX, (value) => {
  temperature.value = sliderXToTemp(value);
});

function tempToSliderX(temp: number) {
  return (temp - 2700) / sliderDragTempStep + sliderOffsetX;
}

function sliderXToTemp(x: number) {
  return Math.round((x - sliderOffsetX) * sliderDragTempStep + 2700);
}

function handleMouseDown(e: MouseEvent) {
  const { clientX: startClientX, clientY: startClientY } = e;
  const startSliderX = sliderX.value;

  const onMove = (ev: MouseEvent) => {
    const { clientX } = ev;
    const dx = clientX - startClientX;
    // 拖拽条位置限制在容器内，范围 [-5, 381 - 5]
    sliderX.value = clamp(startSliderX + dx, sliderOffsetX, width + sliderOffsetX);
  };

  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onMouseUp);
}

function handleClick(e: MouseEvent) {
  const { clientX } = e;
  const target = e.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();

  sliderX.value = Math.round(clientX - rect.x);
}

/**
 * 初始化canvas
 */
function init() {
  if (!container.value) return;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  container.value.appendChild(canvas);

  const startTemp = 2700;

  for (let i = 0; i < width; i++) {
    const temp = Math.round(sliderDragTempStep * i + startTemp);
    const color = chroma.temperature(temp);
    ctx.fillStyle = color.hex();
    ctx.fillRect(i, 0, 1, height);
  }
}

onMounted(() => init());
</script>
