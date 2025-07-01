import React from 'react';
import { Select } from './Select';

const options = [
  { value: 'one', label: 'One' },
  { value: 'two', label: 'Two' },
];

export default {
  title: 'Components/Atoms/Select',
  component: Select,
};

export const Basic = {
  args: {
    options,
  },
};

export const Sizes = () => (
  <div style={{ display: 'flex', gap: '1rem' }}>
    {['sm','md','lg'].map(size => (
      <Select key={size} options={options} size={size} />
    ))}
  </div>
);
