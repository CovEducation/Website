import React from 'react';
import { addDecorator } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import Layout from './Layout';
import '../src/scss/tailwind.scss';

addDecorator(storyFn => <Layout>{storyFn()}</Layout>);
addDecorator(
  withInfo({
    inline: true,
    propTablesExclude: [Layout],
  })
);
