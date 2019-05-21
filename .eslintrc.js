module.exports = {
	root: true,
	parserOptions: {
		ecmaVersion: 2017,
		sourceType: 'module'
	},
	extends: ['eslint:recommended'],
	env: {
		jest: true,
		node: true
	},
	rules: {
		"no-console": "off",
		'semi': ['error', 'never'],
		'indent': ['error', 'tab']
	}
}
