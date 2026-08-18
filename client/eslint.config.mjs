import globals from 'globals';
import react from 'eslint-plugin-react';

export default [
  { ignores: ['build/**', 'node_modules/**'] },
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      // `google` is the Google Identity Services global loaded by GoogleOAuthProvider.
      globals: { ...globals.browser, google: 'readonly' },
    },
    plugins: { react },
    settings: { react: { version: 'detect' } },
    rules: {
      // The rule that would have caught the missing `googleLogin` in AuthModal.
      'no-undef': 'error',
      'react/jsx-no-undef': 'error',
      'react/jsx-uses-vars': 'error',
      'no-unused-vars': ['warn', { args: 'none' }],
    },
  },
];
