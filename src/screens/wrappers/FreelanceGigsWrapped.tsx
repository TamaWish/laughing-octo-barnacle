import React from 'react';
import AppShell from '../../components/AppShell';
import FreelanceGigsScreen from '../FreelanceGigsScreen';

export default function FreelanceGigsWrapped(props: any) {
  return (
    <AppShell navigation={props.navigation}>
      <FreelanceGigsScreen {...props} />
    </AppShell>
  );
}