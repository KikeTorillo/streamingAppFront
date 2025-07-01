import React from 'react';
import { Avatar } from './Avatar';

export default {
  title: 'Components/Atoms/Avatar',
  component: Avatar,
};

export const Basic = {
  args: {
    name: 'Jane Doe',
    src: 'https://via.placeholder.com/150',
  },
};

export const Sizes = () => (
  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
    {['xs','sm','md','lg','xl','2xl'].map(size => (
      <Avatar key={size} name={size} size={size} />
    ))}
  </div>
);
