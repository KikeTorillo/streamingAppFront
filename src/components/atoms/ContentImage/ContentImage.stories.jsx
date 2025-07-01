import React from 'react';
import { ContentImage } from './ContentImage';

export default {
  title: 'Components/Atoms/ContentImage',
  component: ContentImage,
};

export const Basic = {
  args: {
    src: 'https://via.placeholder.com/300x450',
    alt: 'Poster',
  },
};

export const AspectRatios = () => (
  <div style={{ display: 'flex', gap: '1rem' }}>
    {['1/1','2/3','16/9'].map(ratio => (
      <ContentImage key={ratio} src='https://via.placeholder.com/300x450' aspectRatio={ratio} alt={ratio} />
    ))}
  </div>
);
