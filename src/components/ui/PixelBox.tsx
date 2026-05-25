'use client';

import { HTMLAttributes } from 'react';

type Variant = 'default' | 'gold' | 'blue';

interface PixelBoxProps extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
}

const shadowMap: Record<Variant, string> = {
  default: [
    /* top, right, bottom, left edges */
    '0 -4px 0 0 #4A5568',
    '4px 0 0 0 #4A5568',
    '0 4px 0 0 #4A5568',
    '-4px 0 0 0 #4A5568',
    /* corners */
    '4px -4px 0 0 #4A5568',
    '4px 4px 0 0 #4A5568',
    '-4px 4px 0 0 #4A5568',
    '-4px -4px 0 0 #4A5568',
    /* depth shadow */
    '8px 8px 0 0 rgba(0,0,0,0.6)',
  ].join(', '),

  gold: [
    '0 -4px 0 0 #FFD700',
    '4px 0 0 0 #FFD700',
    '0 4px 0 0 #FFD700',
    '-4px 0 0 0 #FFD700',
    '4px -4px 0 0 #FFD700',
    '4px 4px 0 0 #FFD700',
    '-4px 4px 0 0 #FFD700',
    '-4px -4px 0 0 #FFD700',
    '8px 8px 0 0 rgba(0,0,0,0.6)',
  ].join(', '),

  blue: [
    '0 -4px 0 0 #29B6F6',
    '4px 0 0 0 #29B6F6',
    '0 4px 0 0 #29B6F6',
    '-4px 0 0 0 #29B6F6',
    '4px -4px 0 0 #29B6F6',
    '4px 4px 0 0 #29B6F6',
    '-4px 4px 0 0 #29B6F6',
    '-4px -4px 0 0 #29B6F6',
    '8px 8px 0 0 rgba(0,0,0,0.6)',
  ].join(', '),
};

export default function PixelBox({
  variant = 'default',
  children,
  style,
  ...props
}: PixelBoxProps) {
  return (
    <div
      {...props}
      style={{
        background: 'var(--bg-secondary)',
        boxShadow: shadowMap[variant],
        padding: '16px',
        position: 'relative',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
