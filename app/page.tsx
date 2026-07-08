'use client';

import dynamic from 'next/dynamic';

/**
 * The whole shrine is a client experience (Web Audio, canvas particles,
 * localStorage). ssr: false prevents hydration mismatches from
 * randomised media and keeps the first paint an obsidian ground.
 */
const ShrineApp = dynamic(
  () => import('@/components/journey/ShrineApp').then((m) => m.ShrineApp),
  {
    ssr: false,
    loading: () => (
      <main
        className="fixed inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 38%, #241509 0%, #120B07 62%, #0B0704 100%)',
        }}
      />
    ),
  },
);

export default function Page() {
  return <ShrineApp />;
}
