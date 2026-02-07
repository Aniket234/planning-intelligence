import React, { useState } from 'react';
import Boot from './components/layout/Boot';
import Shell from './app/Shell';
import { AppProvider } from './app/context';

export default function App() {
  const [boot, setBoot] = useState(true);
  return (
    <AppProvider>
      {boot ? <Boot onComplete={() => setBoot(false)} /> : <Shell />}
    </AppProvider>
  );
}
