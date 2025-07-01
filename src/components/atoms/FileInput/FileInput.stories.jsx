import React from 'react';
import { FileInput } from './FileInput';

export default {
  title: 'Components/Atoms/FileInput',
  component: FileInput,
};

export const Basic = {
  args: {
    accept: 'image/*',
  },
};

export const Multiple = {
  args: {
    multiple: true,
  },
};
