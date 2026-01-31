// eslint.config.mjs
import eslint from '@eslint/js';
import tseslint from '@typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    ignores: ['node_modules', 'dist', 'mongo', '**/assignment-4.ts', '**/assignment-5.ts']
  },
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': 'off',
      'quotes': ['error', 'single'],
      'semi': ['error', 'always']
    }
  }
);
