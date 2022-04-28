module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	parserOptions: {
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true,
		},
	},
	env: {
		es6: true,
		browser: true,
		node: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:import/typescript',
		'plugin:react-hooks/recommended',
	],
	rules: {
		'import/extensions': 'off',
		'react/prop-types': 'off',
		'react/require-default-props': 'off',
		'comma-dangle': ['error', 'always-multiline'],
		'react-hooks/rules-of-hooks': 'error',
		'react-hooks/exhaustive-deps': 'warn',
		'import/prefer-default-export': 'off',
		'no-console': 'warn',
		quotes: ['error', 'single'],
	},
};
