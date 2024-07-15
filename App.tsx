import React from 'react';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import * as eva from '@eva-design/eva';
import LogWorkoutScreen from './LogWorkout'; // Adjust the import as per your file structure

export default () => (
  <>
    <IconRegistry icons={EvaIconsPack} />
    <ApplicationProvider {...eva} theme={eva.dark}>
      <LogWorkoutScreen />
    </ApplicationProvider>
  </>
);
