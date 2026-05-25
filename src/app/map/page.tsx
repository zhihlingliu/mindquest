'use client';

import dynamic from 'next/dynamic';

// GameMap uses window/keyboard APIs → load client-only
const GameMap = dynamic(() => import('@/components/map/GameMap'), { ssr: false });

export default function MapPage() {
  return <GameMap />;
}
