import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story } from '@storybook/react/types-6-0';

import { Home, HomeProps } from './Home';

export default {
  title: 'Example/Page',
  component: Home,
};

const Template: Story<HomeProps> = args => <Home {...args} />;

export const LoggedIn = Template.bind({});

export const LoggedOut = Template.bind({});
