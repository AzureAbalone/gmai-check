import { describe, expect, it } from 'vitest'

import { useDeferredMapEmbed } from '../../app/composables/useDeferredMapEmbed'

describe('useDeferredMapEmbed', () => {
  it('starts with the map unloaded', () => {
    const { isMapLoaded } = useDeferredMapEmbed()
    expect(isMapLoaded.value).toBe(false)
  })

  it('loads the map permanently after explicit interaction', () => {
    const { isMapLoaded, loadMap } = useDeferredMapEmbed()
    loadMap()
    expect(isMapLoaded.value).toBe(true)
    loadMap()
    expect(isMapLoaded.value).toBe(true)
  })
})
