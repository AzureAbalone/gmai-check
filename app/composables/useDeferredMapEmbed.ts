import { ref } from 'vue'

export function useDeferredMapEmbed(initiallyLoaded = false) {
  const isMapLoaded = ref(Boolean(initiallyLoaded))

  const loadMap = () => {
    if (!isMapLoaded.value) {
      isMapLoaded.value = true
      return true
    }

    return false
  }

  return {
    isMapLoaded,
    loadMap,
  }
}
