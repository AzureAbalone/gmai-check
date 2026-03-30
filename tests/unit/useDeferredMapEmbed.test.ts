import { describe, expect, it } from 'vitest'

import { useDeferredMapEmbed } from '../../app/composables/useDeferredMapEmbed'

describe('useDeferredMapEmbed', () => {
  it('starts with the map unloaded', () => {
    const { isMapLoaded } = useDeferredMapEmbed()
    expect(isMapLoaded.value).toBe(false)
  })

  it('starts loaded when requested', () => {
    const { isMapLoaded } = useDeferredMapEmbed(true)
    expect(isMapLoaded.value).toBe(true)
  })

  it('loads the map permanently after explicit interaction', () => {
    const { isMapLoaded, loadMap } = useDeferredMapEmbed()
    expect(loadMap()).toBe(true)
    expect(isMapLoaded.value).toBe(true)
    expect(loadMap()).toBe(false)
    expect(isMapLoaded.value).toBe(true)
  })
})
