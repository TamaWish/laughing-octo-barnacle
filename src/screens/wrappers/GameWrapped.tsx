import React from 'react';
import AppShell from '../../components/AppShell';
import GameScreen from '../GameScreen';

export default function GameWrapped(props: any) {
  return (
    <AppShell navigation={props.navigation}>
      <GameScreen {...props} />
    </AppShell>
  );
}
