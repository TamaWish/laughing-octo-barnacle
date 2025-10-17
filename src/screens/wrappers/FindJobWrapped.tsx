import React from 'react';
import AppShell from '../../components/AppShell';
import FindJobScreen from '../FindJobScreen';

export default function FindJobWrapped(props: any) {
  return (
    <AppShell navigation={props.navigation}>
      <FindJobScreen {...props} />
    </AppShell>
  );
}