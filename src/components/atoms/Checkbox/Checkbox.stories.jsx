import React from 'react';
import { Checkbox } from './Checkbox';

export default {
  title: 'Components/Atoms/Checkbox',
  component: Checkbox,
};

export const Basic = {
  args: {
    label: 'Accept',
  },
};

export const States = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
    <Checkbox label='Default' />
    <Checkbox label='Checked' checked onChange={() => {}} />
    <Checkbox label='Disabled' disabled />
  </div>
);
