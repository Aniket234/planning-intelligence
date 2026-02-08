import React, { useState } from 'react';
import Boot from './components/layout/Boot';
import Shell from './app/Shell';
import { AppProvider } from './app/context';

export default function App() {
  const [boot, setBoot] = useState(true);
  return (
    <AppProvider>
      <style>{`
        :root { --pi-zoom: 1.08; }
        body { zoom: var(--pi-zoom); }
        @media (max-width: 900px) { body { zoom: 1.0; } }
      `}</style>
      {boot ? <Boot onComplete={() => setBoot(false)} /> : <Shell />}
    </AppProvider>
  );
}
