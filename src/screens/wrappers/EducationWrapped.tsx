import React from 'react';
import AppShell from '../../components/AppShell';
import EducationScreen from '../EducationScreen';

export default function EducationWrapped(props: any) {
  return (
    <AppShell navigation={props.navigation}>
      <EducationScreen {...props} />
    </AppShell>
  );
}
