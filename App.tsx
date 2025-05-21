// App.tsx
import React from 'react';
import Navegacion from './navegacion/navegacion';
import { SuenoProvider } from './contextos/contextoSueno';

export default function App() {
  return (
    <SuenoProvider>
      <Navegacion />
    </SuenoProvider>
  );
}