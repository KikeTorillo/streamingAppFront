import React from 'react';
import { Card } from './Card';

export default {
  title: 'Components/Atoms/Card',
  component: Card,
};

export const Basic = {
  args: {
    children: 'Content',
  },
};

export const Variants = () => (
  <div style={{ display: 'flex', gap: '1rem' }}>
    {['default','elevated','outlined'].map(variant => (
      <Card key={variant} variant={variant}>{variant}</Card>
    ))}
  </div>
);
