<script setup lang="ts">
defineProps<{
  variant?: 'dark' | 'light'
  size?: 'sm' | 'md' | 'lg'
}>()
</script>

<template>
  <div
    class="inline-flex items-center gap-2.5 select-none"
    :class="{
      'gap-2': size === 'sm',
      'gap-2.5': !size || size === 'md',
      'gap-3': size === 'lg',
    }"
  >
    <!-- DP monogram logo image -->
    <img
      src="/logo.png"
      alt="Duyên Phượng logo"
      :width="size === 'sm' ? 30 : size === 'lg' ? 42 : 36"
      :height="size === 'sm' ? 30 : size === 'lg' ? 42 : 36"
      class="rounded-lg object-contain"
    />

    <!-- Text -->
    <div class="flex flex-col leading-none">
      <span
        class="font-semibold tracking-[1.5px] uppercase"
        :class="{
          'text-[12px]': size === 'sm',
          'text-[14px]': !size || size === 'md',
          'text-[17px]': size === 'lg',
          'text-white': variant === 'light',
          'text-[#1A1A1A]': variant !== 'light',
        }"
      >
        Duyên Phượng
      </span>
      <span
        class="font-medium tracking-[0.5px] mt-0.5"
        :class="{
          'text-[7px]': size === 'sm',
          'text-[8px]': !size || size === 'md',
          'text-[9px]': size === 'lg',
          'text-white/50': variant === 'light',
          'text-[#999]': variant !== 'light',
        }"
      >
        NHÀ PHÂN PHỐI
      </span>
    </div>
  </div>
</template>
