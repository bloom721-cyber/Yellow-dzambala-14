'use client';

/**
 * The orchestrator — a linear state machine driving the ritual journey:
 *   Arrival → Temple Doors → Shrine (offerings, blessing, dedication)
 * with the sanctuary rooms (mala, journal, history, settings) reached
 * through the bottom navigation once inside.
 *
 * A single client experience (no route changes) keeps every passage a
 * soft dissolve, never a flash — and exports statically for Capacitor.
 */

import { useCallback, useEffect, useState } from 'react';
import type { ShrineView } from '@/types';
import { useShrineState } from '@/hooks/useShrineState';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useAutoHide } from '@/hooks/useAutoHide';
import { SoftFadeTransition } from '@/components/ui/SoftFadeTransition';
import { ArrivalCinematic } from '@/components/journey/ArrivalCinematic';
import { TempleDoors } from '@/components/journey/TempleDoors';
import { ShrineSanctuary } from '@/components/journey/ShrineSanctuary';
import { MalaPractice } from '@/components/mala/MalaPractice';
import { MeritJournal } from '@/components/journey/MeritJournal';
import { PracticeHistory } from '@/components/journey/PracticeHistory';
import { SettingsView } from '@/components/journey/SettingsView';
import { BottomNav } from '@/components/navigation/BottomNav';
import { startAmbient } from '@/lib/audio';

export function ShrineApp() {
  const store = useShrineState();
  const [view, setView] = useState<ShrineView>('arrival');
  const reduced = useReducedMotion(store.state.settings.reduceMotion);
  const chromeVisible = useAutoHide(9000);

  const insideTemple =
    view !== 'arrival' && view !== 'doors';

  const enterSanctuary = useCallback(() => {
    setView('shrine');
    startAmbient();
  }, []);

  // Ambient follows the settings while inside.
  useEffect(() => {
    if (insideTemple && store.state.settings.audio && store.state.settings.ambient) {
      startAmbient();
    }
  }, [insideTemple, store.state.settings.audio, store.state.settings.ambient]);

  return (
    <main className="fixed inset-0 overflow-hidden bg-obsidian">
      <SoftFadeTransition viewKey={view}>
        {view === 'arrival' && <ArrivalCinematic onEnter={() => setView('doors')} />}
        {view === 'doors' && <TempleDoors onOpened={enterSanctuary} />}
        {view === 'shrine' && (
          <ShrineSanctuary store={store} reduced={reduced} chromeVisible={chromeVisible} />
        )}
        {view === 'mala' && <MalaPractice store={store} reduced={reduced} />}
        {view === 'journal' && <MeritJournal store={store} />}
        {view === 'history' && <PracticeHistory store={store} />}
        {view === 'settings' && (
          <SettingsView store={store} onReturnToArrival={() => setView('arrival')} />
        )}
      </SoftFadeTransition>

      {insideTemple && (
        <BottomNav
          view={view}
          visible={view === 'shrine' ? chromeVisible : true}
          onNavigate={setView}
        />
      )}
    </main>
  );
}
