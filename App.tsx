import React from 'react';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import * as eva from '@eva-design/eva';
import LogWorkoutScreen from './screens/LogWorkout'; // Adjust the import as per your file structure
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default () => (
  <>
    <IconRegistry icons={EvaIconsPack} />
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ApplicationProvider {...eva} theme={eva.dark}>
        <LogWorkoutScreen />
      </ApplicationProvider>
    </GestureHandlerRootView>
  </>
);
