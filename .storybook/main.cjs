const { mergeConfig } = require('vite');
const { default: tsconfigPaths } = require('vite-tsconfig-paths');

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    {
      name: '@storybook/addon-postcss',
      options: {
        postcssLoaderOptions: {
          implementation: require('postcss'),
        },
      },
    },
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  core: {},
  features: {
    storyStoreV7: true,
  },
  docsPage: {
    docs: 'automatic',
  },
  docs: {
    autodocs: true,
  },
  viteFinal(config, { configType }) {
    return mergeConfig(config, {
      plugins: [tsconfigPaths()],
    });
  },
};
