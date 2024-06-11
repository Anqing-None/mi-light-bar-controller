<template>
  <div ref="container" class="relative" :style="{ width: `${width}px`, height: `${height}px` }">
    <div class="absolute w-8 h-8 rounded-full border-4 border-gray-400 dark:border-white cursor-pointer hover:scale-125 transition-[transform]" :style="circleSelectorStyle" @mousedown="handleMouseDown"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, reactive } from 'vue';
import { colorTemperatureToRGB, lerpColor, clamp } from '@/utils/util';

const container = ref<HTMLElement>();
const width = 300;
const height = 300;
const circleSelectorPos = reactive({ x: 10, y: 10 });
const circleSelectorStyle = computed(() => {
  const top = clamp(circleSelectorPos.y, -16, height - 16);
  const left = clamp(circleSelectorPos.x, -16, width - 16);

  return {
    top: `${top}px`,
    left: `${left}px`,
  };
});

function init() {
  if (!container.value) return;

  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 300;
  const ctx = canvas.getContext('2d')!;
  container.value.appendChild(canvas);

  const k2700 = colorTemperatureToRGB(2700);
  const k6500 = colorTemperatureToRGB(6500);

  // 画布对角线的长度
  const diagonalLength = Math.sqrt(300 * 300 + 300 * 300);

  for (let i = 0; i < 300; i++) {
    for (let j = 0; j < 300; j++) {
      const dx = i;
      const dy = 300 - j;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const ratio = distance / diagonalLength;
      const color = lerpColor(k2700, k6500, ratio);
      ctx.fillStyle = color;
      ctx.fillRect(i, j, 1, 1);
    }
  }
}

function handleMouseDown(e: MouseEvent) {
  const { clientX: startX, clientY: startY } = e;

  const startCircleSelectorX = circleSelectorPos.x;
  const startCircleSelectorY = circleSelectorPos.y;

  const onMove = (ev: MouseEvent) => {
    const { clientX, clientY } = ev;
    const dx = clientX - startX;
    const dy = clientY - startY;
    circleSelectorPos.x = startCircleSelectorX + dx;
    circleSelectorPos.y = startCircleSelectorY + dy;
  };

  const onMoveEnd = () => {
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onMoveEnd);
  };

  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onMoveEnd);
}

onMounted(() => init());
</script>
