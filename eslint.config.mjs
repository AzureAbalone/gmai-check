// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  ignores: ['scripts/**'],
}, {
  rules: {
    // ─── Style ───
    'no-console': 'warn',
    'no-debugger': 'warn',

    // ─── Vue ───
    'vue/multi-word-component-names': 'off', // Nuxt pages are single-word
    'vue/html-self-closing': ['error', {
      html: { void: 'always', normal: 'always', component: 'always' },
      svg: 'always',
      math: 'always',
    }],

    // ─── TypeScript ───
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    }],
  },
})
