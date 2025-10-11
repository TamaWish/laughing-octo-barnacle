import React from 'react';
import AppShell from '../../components/AppShell';
import ActivitiesScreen from '../ActivitiesScreen';

export default function ActivitiesWrapped(props: any) {
  return (
    <AppShell navigation={props.navigation}>
      <ActivitiesScreen {...props} />
    </AppShell>
  );
}
