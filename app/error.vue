<script setup lang="ts">
const error = useError()

const statusCode = computed(() => error.value?.statusCode || 500)
const message = computed(() => {
  if (statusCode.value === 404) return 'Trang bạn tìm không tồn tại.'
  if (statusCode.value === 500) return 'Đã xảy ra lỗi máy chủ.'
  return error.value?.message || 'Đã xảy ra lỗi không xác định.'
})

function handleError() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center px-6 text-center">
    <!-- Error visual -->
    <div class="relative mb-8">
      <span class="text-[120px] lg:text-[180px] font-bold text-[#E5E5E5] leading-none select-none font-['Newsreader']">
        {{ statusCode }}
      </span>
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="w-20 h-20 rounded-full bg-[#0D6E6E]/10 flex items-center justify-center">
          <Icon
            :name="statusCode === 404 ? 'solar:map-point-search-bold' : 'solar:danger-triangle-bold'"
            size="40"
            class="text-[#0D6E6E]"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>

    <h1 class="font-['Newsreader'] text-3xl lg:text-4xl font-medium text-[#1A1A1A] mb-4">
      {{ statusCode === 404 ? 'Không tìm thấy trang' : 'Đã xảy ra lỗi' }}
    </h1>
    <p class="text-base text-[#888] max-w-md mb-8">{{ message }}</p>

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
        @click="$router.back()"
      >
        <Icon name="solar:arrow-left-outline" size="18" aria-hidden="true" />
        Quay lại
      </button>
    </div>
  </div>
</template>
