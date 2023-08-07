module.exports = {
  tabWidth: 2,
  useTabs: false,
  printWidth: 80,
  semi: true,
  trailingComma: 'es5',
  jsxSingleQuote: true,
  singleQuote: true,
  plugins: [require('prettier-plugin-tailwindcss')],
  tailwindConfig: 'tailwind.config.cjs',
};
