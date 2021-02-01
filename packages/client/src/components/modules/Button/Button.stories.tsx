import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import { Button } from './Button';

export default {
  title: 'Button',
  decorators: [withKnobs],
};

export const primary = () => {
  const label = text('Label', 'See now');
  const outlined = boolean('Outlined', false);
  return <Button onClick={action('clicked')} outlined={outlined} label={label} />;
};
