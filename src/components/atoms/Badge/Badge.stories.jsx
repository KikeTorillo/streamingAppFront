import React from 'react';
import { Badge } from './Badge';

export default {
  title: 'Components/Atoms/Badge',
  component: Badge,
};

export const Basic = {
  args: {
    children: 'Badge',
  },
};

export const Variants = () => (
  <div style={{ display: 'flex', gap: '0.5rem' }}>
    {['primary','secondary','success','warning','danger','info','neutral'].map(v => (
      <Badge key={v} variant={v}>{v}</Badge>
    ))}
  </div>
);
