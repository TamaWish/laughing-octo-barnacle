import React from 'react';
import AppShell from '../../components/AppShell';
import RelationshipsScreen from '../RelationshipsScreen';

export default function RelationshipsWrapped(props: any) {
  return (
    <AppShell navigation={props.navigation}>
      <RelationshipsScreen {...props} />
    </AppShell>
  );
}