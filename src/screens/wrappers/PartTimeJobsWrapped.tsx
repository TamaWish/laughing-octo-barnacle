import React from 'react';
import AppShell from '../../components/AppShell';
import PartTimeJobsScreen from '../PartTimeJobsScreen';

export default function PartTimeJobsWrapped(props: any) {
  return (
    <AppShell navigation={props.navigation}>
      <PartTimeJobsScreen {...props} />
    </AppShell>
  );
}