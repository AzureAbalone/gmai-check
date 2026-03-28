<template>
  <div class="min-h-screen bg-[#FAFAFA]">
    <!-- Skip-to-content link for accessibility -->
    <a href="#main-content" class="skip-link">Chuyển đến nội dung chính</a>
    <TheNavbar />
    <main id="main-content" role="main">
      <slot />
    </main>
    <TheFooter />
  </div>
</template>
