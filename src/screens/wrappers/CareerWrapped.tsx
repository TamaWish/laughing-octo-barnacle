import React from 'react';
import AppShell from '../../components/AppShell';
import CareerScreen from '../CareerScreen';

export default function CareerWrapped(props: any) {
  return (
    <AppShell navigation={props.navigation}>
      <CareerScreen {...props} />
    </AppShell>
  );
}