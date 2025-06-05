import js from "@eslint/js";
import globals from "globals";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default [
	js.configs.recommended,
	{
		files: ["**/*.{js,mjs,cjs}"],
		languageOptions: { globals: globals.node },
		rules: {
			"no-unused-vars": "off",
		},
	},
	eslintPluginPrettierRecommended,
	{
		rules: {
			"prettier/prettier": "off",
		},
	},
];
