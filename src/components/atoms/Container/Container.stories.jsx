import React from 'react';
import { Container } from './Container';

export default {
  title: 'Components/Atoms/Container',
  component: Container,
};

export const Basic = {
  args: {
    children: <div style={{ background: '#eee', padding: '1rem' }}>Content</div>,
  },
};

export const Sizes = () => (
  <>
    {['sm','md','lg','xl'].map(size => (
      <Container key={size} size={size} style={{ border: '1px dashed #ccc', marginBottom: '0.5rem' }}>
        {size}
      </Container>
    ))}
  </>
);
