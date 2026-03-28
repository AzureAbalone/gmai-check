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
    <!-- DP monogram mark -->
    <svg
      :width="size === 'sm' ? 30 : size === 'lg' ? 42 : 36"
      :height="size === 'sm' ? 30 : size === 'lg' ? 42 : 36"
      viewBox="0 0 42 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <!-- Background rounded square -->
      <rect width="42" height="42" rx="10" :fill="variant === 'light' ? 'rgba(255,255,255,0.12)' : '#0D6E6E'" />

      <!-- Stylized "D" letter -->
      <path
        d="M12 11h5.5c6.5 0 11 4.5 11 10s-4.5 10-11 10H12V11zm4 3.5v13h1.5c4.5 0 7-3 7-6.5s-2.5-6.5-7-6.5H16z"
        :fill="variant === 'light' ? '#FFFFFF' : '#FFFFFF'"
      />

      <!-- Decorative accent dot -->
      <circle cx="32" cy="11" r="2.5" fill="#E07B54" />
    </svg>

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
