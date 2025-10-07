import React from 'react';
import './Button.css';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

export default function Button({ children, ...rest }: Props) {
  return (
    <button className="btn" {...rest}>
      {children}
    </button>
  );
}
