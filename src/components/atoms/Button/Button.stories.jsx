import React from 'react';
import { Button } from './Button';

export default {
  title: 'Components/Atoms/Button',
  component: Button,
};

export const Basic = {
  args: {
    children: 'Button',
  },
};

export const Variants = () => (
  <div style={{ display: 'flex', gap: '0.5rem' }}>
    {['primary','secondary','outline','ghost','danger'].map(variant => (
      <Button key={variant} variant={variant}>{variant}</Button>
    ))}
  </div>
);
