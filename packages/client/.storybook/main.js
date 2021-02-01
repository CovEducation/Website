const path = require('path');
module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-actions/register',
    '@storybook/addon-knobs/register',
    '@storybook/addon-notes/register',
    '@storybook/preset-scss',
    '@storybook/addon-essentials',
  ],
  webpackFinal: async config => {
    (config.module.rules = [
      ...config.module.rules,
      {
        test: /\.css$/,
        use: [
          // Loader for webpack to process CSS with PostCSS
          {
            loader: 'postcss-loader',
            options: {
              /* 
                  Enable Source Maps
                 */
              sourceMap: true,
              /*
                  Set postcss.config.js config path && ctx 
                 */
              config: {
                path: './.storybook/',
              },
            },
          },
        ],
        include: path.resolve(__dirname, '../'),
      },
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: {
              presets: [require.resolve('babel-preset-react-app')],
            },
          },
          require.resolve('react-docgen-typescript-loader'),
        ],
      },
    ]),
      config.resolve.extensions.push('.ts', '.tsx');
    return config;
  },
};
