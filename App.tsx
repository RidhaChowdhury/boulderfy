import React, { useEffect } from 'react';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import * as eva from '@eva-design/eva';
import LogWorkoutScreen from './screens/LogWorkout';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SheetProvider } from './context/SheetContext';
import { StatusBar } from 'react-native';
import * as Notifications from 'expo-notifications';

export default () => {
  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('You need to enable notifications for this app to work properly!');
      }
    };

    requestPermissions();
  }, []);

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SheetProvider>
          <ApplicationProvider {...eva} theme={eva.dark}>
            <StatusBar barStyle="light-content" backgroundColor="#222B45" />
            <LogWorkoutScreen />
          </ApplicationProvider>
        </SheetProvider>
      </GestureHandlerRootView>
    </>
  );
};
