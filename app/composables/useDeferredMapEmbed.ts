import { ref } from 'vue'

export function useDeferredMapEmbed(initiallyLoaded = false) {
  const isMapLoaded = ref(initiallyLoaded)

  const loadMap = () => {
    isMapLoaded.value = true
  }

  return {
    isMapLoaded,
    loadMap,
  }
}
