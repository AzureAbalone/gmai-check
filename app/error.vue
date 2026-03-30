<script setup lang="ts">
import { computed } from 'vue'
import { clearError, useError, useHead, useRouter } from '#imports'

const error = useError()
const router = useRouter()

const statusCode = computed(() => error.value?.statusCode || 500)
const title = computed(() => statusCode.value === 404 ? 'Không tìm thấy trang' : 'Đã xảy ra lỗi')
const message = computed(() => {
  if (statusCode.value === 404) return 'Trang bạn tìm không tồn tại.'
  if (statusCode.value === 500) return 'Đã xảy ra lỗi máy chủ.'
  return error.value?.message || 'Đã xảy ra lỗi không xác định.'
})

useHead({
  title: () => `${statusCode.value} - ${title.value}`,
})

function handleError() {
  clearError({ redirect: '/' })
}

function handleBack() {
  if (import.meta.client && window.history.length > 1) {
    router.back()
    return
  }

  handleError()
}
</script>

<template>
  <div class="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center px-6 text-center">
    <!-- Error visual -->
    <div class="mb-8">
      <span class="text-[120px] lg:text-[180px] font-bold text-[#E5E5E5] leading-none select-none font-['Newsreader']">
        {{ statusCode }}
      </span>
    </div>

    <h1 class="font-['Newsreader'] text-3xl lg:text-4xl font-medium text-[#1A1A1A] mb-4">{{ title }}</h1>
    <p class="text-base text-[#666] max-w-md mb-8">{{ message }}</p>

    <div class="flex flex-col sm:flex-row gap-4">
      <button
        class="inline-flex items-center gap-2 px-8 py-3 bg-[#1A1A1A] text-white text-sm font-semibold rounded-lg hover:bg-[#333] hover:-translate-y-0.5 active:translate-y-0 transition-all"
        @click="handleError"
      >
        <Icon name="solar:home-2-outline" size="18" aria-hidden="true" />
        Về trang chủ
      </button>
      <button
        class="inline-flex items-center gap-2 px-8 py-3 bg-white text-[#1A1A1A] text-sm font-semibold rounded-lg border border-[#E5E5E5] hover:border-[#1A1A1A] hover:-translate-y-0.5 active:translate-y-0 transition-all"
        @click="handleBack"
      >
        <Icon name="solar:arrow-left-outline" size="18" aria-hidden="true" />
        Quay lại
      </button>
    </div>
  </div>
</template>
