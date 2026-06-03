import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default [
	{
		ignores: ['.output/**', '.wxt/**', 'dist/**', 'node_modules/**', 'eslint.config.js'],
	},

	js.configs.recommended,
	...tseslint.configs.strictTypeChecked,

	react.configs.flat.recommended,
	react.configs.flat['jsx-runtime'],
	reactHooks.configs.flat.recommended,

	{
		files: ['**/*.{ts,tsx}'],

		languageOptions: {
			parserOptions: {
				project: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},

		plugins: {
			'react-refresh': reactRefresh,
		},

		rules: {
			'react-refresh/only-export-components': 'warn',

			'react/prop-types': 'off',
			'react/require-default-props': 'off',

			'no-console': ['warn', { allow: ['warn', 'error'] }],

			'no-unused-vars': 'off',

			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_',
				},
			],
		},
	},
];
