'use client';

/**
 * SCREEN 2 — The temple doors.
 * A single touch; the doors open; the sanctuary receives you.
 */

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { assets } from '@/lib/assets';
import { VideoBackground } from '@/components/shrine/VideoBackground';
import { playBell } from '@/lib/audio';
import { hapticSoft } from '@/lib/haptics';

const BREATH = [0.33, 0, 0.2, 1] as const;

export function TempleDoors({ onOpened }: { onOpened: () => void }) {
  const [opening, setOpening] = useState(false);
  const doneRef = useRef(false);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    onOpened();
  };

  const open = () => {
    if (opening) return;
    setOpening(true);
    playBell('bellDeep', 0.7);
    hapticSoft();
  };

  // Guarantees passage even if onEnded never fires (asset failure).
  useEffect(() => {
    if (!opening) return;
    const t = setTimeout(finish, 9000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opening]);

  return (
    <button
      type="button"
      onClick={open}
      aria-label="Open the temple doors"
      className="relative block h-full w-full cursor-pointer text-left focus-visible:outline-none"
    >
      <VideoBackground
        src={assets.doors.opening}
        fallbackSrc={assets.shrine.loopMobile}
        loop={false}
        onEnded={opening ? finish : undefined}
      />
      {!opening && (
        <div className="absolute inset-0 z-10 flex items-end justify-center pb-[max(5rem,env(safe-area-inset-bottom))]">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.35, 0.8, 0.35] }}
            transition={{ duration: 6, repeat: Infinity, ease: BREATH }}
            className="font-body italic text-lg text-ivory/75"
          >
            Touch the doors to enter
          </motion.p>
        </div>
      )}
    </button>
  );
}
