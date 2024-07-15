import React from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text } from '@ui-kitten/components';
import LogWorkoutScreen from './LogWorkout';

export default () => (
  <ApplicationProvider {...eva} theme={eva.dark}>
    <LogWorkoutScreen />
  </ApplicationProvider>
);