import React from 'react';
import { Input } from './Input';

export default {
  title: 'Components/Atoms/Input',
  component: Input,
};

export const Basic = {
  args: {
    placeholder: 'Type here...',
  },
};

export const Password = {
  args: {
    type: 'password',
    placeholder: 'Password',
  },
};
