import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, ButtonGroup, Text, CheckBox, Icon, IconProps, IconElement } from '@ui-kitten/components';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import BaseSheet from './BaseSheet';
import { TimerPickerModal } from 'react-native-timer-picker';

interface TimerSheetProps {
  visible: boolean;
  onClose: () => void;
  sessionTime: number;
  setSessionTime: React.Dispatch<React.SetStateAction<number>>;
  restTime: number;
  setRestTime: React.Dispatch<React.SetStateAction<number>>;
  isResting: boolean;
  setIsResting: React.Dispatch<React.SetStateAction<boolean>>;
  autoRestEnabled: boolean;
  setAutoRestEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}

const TimerSheet: React.FC<TimerSheetProps> = ({
  visible,
  onClose,
  sessionTime,
  setSessionTime,
  restTime,
  setRestTime,
  isResting,
  setIsResting,
  autoRestEnabled,
  setAutoRestEnabled,
}) => {
  const [restDuration, setRestDuration] = useState(30);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const contentRef = useRef<View>(null);
  const [showPicker, setShowPicker] = useState(false);

  const PauseIcon = (props: IconProps): IconElement => <Icon {...props} name='pause-circle-outline' />;
  const PlayIcon = (props: IconProps): IconElement => <Icon {...props} name='play-circle-outline' />;
  const SkipIcon = (props: IconProps): IconElement => <Icon {...props} name='skip-forward-outline' />;
  const StartRestIcon = (props: IconProps): IconElement => <Icon {...props} name='radio-button-on-outline' />;
  const RestartIcon = (props: IconProps): IconElement => <Icon {...props} name='refresh-outline' style={[props.style, { transform: [{ scaleY: -1 }] }]} />;

  useEffect(() => {
    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync(require('../../assets/threeTone2.mp3'));
      soundRef.current = sound;
    };

    const loadData = async () => {
      try {
        const storedAutoRestEnabled = await AsyncStorage.getItem('autoRestEnabled');
        const storedHapticsEnabled = await AsyncStorage.getItem('hapticsEnabled');
        const storedSoundEnabled = await AsyncStorage.getItem('soundEnabled');

        if (storedAutoRestEnabled) setAutoRestEnabled(JSON.parse(storedAutoRestEnabled));
        if (storedHapticsEnabled) setHapticsEnabled(JSON.parse(storedHapticsEnabled));
        if (storedSoundEnabled) setSoundEnabled(JSON.parse(storedSoundEnabled));
      } catch (e) {
        console.error('Failed to load data', e);
      }
    };

    loadSound();
    loadData();

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('autoRestEnabled', JSON.stringify(autoRestEnabled));
        await AsyncStorage.setItem('hapticsEnabled', JSON.stringify(hapticsEnabled));
        await AsyncStorage.setItem('soundEnabled', JSON.stringify(soundEnabled));
      } catch (e) {
        console.error('Failed to save data', e);
      }
    };

    saveData();
  }, [autoRestEnabled, hapticsEnabled, soundEnabled]);

  useEffect(() => {
    if (autoRestEnabled && isResting) {
      startRestTimer();
    }
  }, [autoRestEnabled, isResting]);

  useEffect(() => {
    if (!isPaused) {
      startSessionTimer();
      if (isResting) {
        startRestTimer();
      }
    }
    return () => {
      if (sessionInterval.current) clearInterval(sessionInterval.current);
      if (restInterval.current) clearInterval(restInterval.current);
    };
  }, [isPaused]);

  const sessionInterval = useRef<NodeJS.Timeout | null>(null);
  const restInterval = useRef<NodeJS.Timeout | null>(null);

  const startSessionTimer = () => {
    if (sessionInterval.current) clearInterval(sessionInterval.current!);
    sessionInterval.current = setInterval(() => {
      setSessionTime(prevTime => prevTime + 1);
    }, 1000);
  };

  const startRestTimer = () => {
    if (restInterval.current) clearInterval(restInterval.current!);
    restInterval.current = setInterval(() => {
      setRestTime(prevTime => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          clearInterval(restInterval.current!);
          setIsResting(false);
          handleTimerEnd(); // Call this to play sound, haptics, etc.
          return restDuration;
        }
      });
    }, 1000);
  };

  const handleTimerEnd = () => {
    if (Platform.OS !== 'web' && hapticsEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    if (soundEnabled) {
      soundRef.current?.playAsync();
    }
  };

  const handlePausePlay = () => {
    if (isPaused) {
      if (isResting) {
        startRestTimer(); // Restart rest timer
      } else {
        startSessionTimer(); // Restart session timer
      }
    } else {
      if (sessionInterval.current) clearInterval(sessionInterval.current!);
      if (restInterval.current) clearInterval(restInterval.current!);
    }
    setIsPaused(!isPaused);
  };

  const handleStartSkipRest = () => {
    if (isResting) {
      if (restInterval.current) clearInterval(restInterval.current!); // Clear the current interval
      setRestTime(restDuration); // Reset to full rest duration
    } else {
      setRestTime(restDuration); // Start rest timer from the full duration
      startRestTimer(); // Start the rest timer
    }
    setIsResting(!isResting);
    setIsPaused(false);
  };

  const adjustTime = (amount: number) => {
    if (isResting) {
      setRestTime(prevTime => Math.max(0, prevTime + amount));
    } else {
      setSessionTime(prevTime => Math.max(0, prevTime + amount));
    }
  };

  const resetTime = () => {
    if (isResting) {
      setRestTime(restDuration);
    } else {
      setSessionTime(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleDurationChange = ({ hours, minutes, seconds }: { hours: number, minutes: number, seconds: number }) => {
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    setRestDuration(totalSeconds);
    setRestTime(totalSeconds);
    setShowPicker(false); // Close the modal
  };

  return (
    <BaseSheet visible={visible} onClose={onClose} sheetName="TimerSheet" contentRef={contentRef}>
      <View ref={contentRef}>
        <Text category='h4' style={{marginTop: 0}}>{isResting ? 'Rest Timer' : 'Session Timer'}</Text>
        <Text style={styles.timerText}>{formatTime(isResting ? restTime : sessionTime)}</Text>
        <View>
          <ButtonGroup style={styles.timeControls} appearance='filled' size='medium'>
            <Button onPress={resetTime} accessoryLeft={RestartIcon} style={styles.controlButton} />
            <Button onPress={() => adjustTime(-15)} style={styles.controlButton}>-15</Button>
            <Button onPress={handlePausePlay} accessoryLeft={(props) => isPaused ? <PlayIcon {...props} /> : <PauseIcon {...props} />} style={styles.controlButton} />
            <Button onPress={() => adjustTime(15)} style={styles.controlButton}>+15</Button>
            <Button onPress={handleStartSkipRest} accessoryLeft={(props) => isResting ? <SkipIcon {...props} /> : <StartRestIcon {...props} />} style={styles.controlButton} />
          </ButtonGroup>
        </View>
        <View style={styles.pickerContainer}>
          <Text category='s1' style={styles.label}>Rest Duration</Text>
          <Button onPress={() => setShowPicker(true)}>Edit Rest Time</Button>
          <TimerPickerModal
            visible={showPicker}
            hideHours={true}
            setIsVisible={setShowPicker}
            onConfirm={handleDurationChange}
            modalTitle="Set Rest Duration"
            onCancel={() => setShowPicker(false)}
            closeOnOverlayPress
            Audio={Audio}
            LinearGradient={LinearGradient}
            Haptics={Haptics}
            styles={{
              theme: "dark",
              backgroundColor: "#222B45", // Eva Dark theme background color
              contentContainer: {
                borderRadius: 8,
                padding: 16,
                backgroundColor: "#222B45",
              },
              button: {
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 4,
                margin: 8,
              },
              confirmButton: {
                color: "#FFFFFF",
                backgroundColor: "#3366FF",
              },
              cancelButton: {
                color: "#FFFFFF",
              },
              pickerItem: {
                fontSize: 34,
                color: '#FFFFFF',
              },
              pickerLabel: {
                fontSize: 32,
                color: '#FFFFFF',
              },
            }}
          />
        </View>
        <View>
          <CheckBox
            checked={autoRestEnabled}
            onChange={setAutoRestEnabled}
            style={styles.checkbox}
          >
            Enable Auto Rest Timer
          </CheckBox>
          <CheckBox
            checked={soundEnabled}
            onChange={setSoundEnabled}
            style={styles.checkbox}
          >
            Sound
          </CheckBox>
          <CheckBox
            checked={hapticsEnabled}
            onChange={setHapticsEnabled}
            style={styles.checkbox}
          >
            Haptics
          </CheckBox>
        </View>
      </View>
    </BaseSheet>
  );
};

const styles = StyleSheet.create({
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginVertical: 16,
  },
  checkbox: {
    marginVertical: 8,
  },
  timeControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
    borderRadius: 32,
  },
  controlButton: {
    flex: 1,
  },
  pickerContainer: {
    marginVertical: 16,
    alignItems: 'center',
  },
  label: {
    marginBottom: 8,
  }
});

export default TimerSheet;
