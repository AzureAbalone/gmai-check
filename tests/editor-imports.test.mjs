import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const root = new URL('../', import.meta.url)

async function read(path) {
  return readFile(new URL(path, root), 'utf8')
}

test('index page declares explicit imports for editor compatibility', async () => {
  const source = await read('app/pages/index.vue')

  assert.match(source, /from '#imports'/)
  assert.match(source, /from '~\/composables\/useScrollReveal'/)
})

test('products page declares explicit imports for editor compatibility', async () => {
  const source = await read('app/pages/products.vue')

  assert.match(source, /from 'vue'/)
  assert.match(source, /from '#imports'/)
  assert.match(source, /from '~\/composables\/useScrollReveal'/)
})

test('error page declares explicit imports for editor compatibility', async () => {
  const source = await read('app/error.vue')

  assert.match(source, /from 'vue'/)
  assert.match(source, /from '#imports'/)
})
