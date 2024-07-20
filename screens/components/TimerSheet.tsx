import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Button, ButtonGroup, Text, CheckBox, Icon, IconProps, IconElement } from '@ui-kitten/components';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import BaseSheet from './BaseSheet';
import { TimerPicker } from 'react-native-timer-picker';

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

  const [timeControlsHeight, setTimeControlsHeight] = useState(0);
  const [settingsHeight, setSettingsHeight] = useState(0);

  const timeControlsRef = useRef<View>(null);
  const settingsRef = useRef<View>(null);

  const PauseIcon = (props: IconProps): IconElement => <Icon {...props} name='pause-circle-outline' />;
  const PlayIcon = (props: IconProps): IconElement => <Icon {...props} name='play-circle-outline' />;
  const SkipIcon = (props: IconProps): IconElement => <Icon {...props} name='skip-forward-outline' />;
  const StartRestIcon = (props: IconProps): IconElement => <Icon {...props} name='radio-button-on-outline' />;
  const RestartIcon = (props: IconProps): IconElement => <Icon {...props} name='refresh-outline' style={[props.style, { transform: [{ scaleY: -1 }] }]} />;

  useEffect(() => {
    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/threeTone2.mp3')
      );
      soundRef.current = sound;
    };

    loadSound();

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    if (autoRestEnabled && !isResting) {
      setRestTime(restDuration);
    }
  }, [autoRestEnabled, isResting, restDuration]);

  useEffect(() => {
    startSessionTimer();
    return () => {
      clearInterval(sessionInterval.current as NodeJS.Timeout);
      clearInterval(restInterval.current as NodeJS.Timeout);
    };
  }, [isPaused]);

  const sessionInterval = useRef<NodeJS.Timeout | null>(null);
  const restInterval = useRef<NodeJS.Timeout | null>(null);

  const startSessionTimer = () => {
    if (sessionInterval.current) {
      clearInterval(sessionInterval.current);
    }
    sessionInterval.current = setInterval(() => {
      setSessionTime(prevTime => prevTime + 1);
    }, 1000);
  };

  const startRestTimer = () => {
    if (restInterval.current) {
      clearInterval(restInterval.current);
    }
    restInterval.current = setInterval(() => {
      setRestTime(prevTime => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          setIsResting(false);
          if (Platform.OS !== 'web' && hapticsEnabled) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
          if (soundEnabled) {
            soundRef.current?.playAsync();
          }
          clearInterval(restInterval.current as NodeJS.Timeout);
          return restDuration;
        }
      });
    }, 1000);
  };

  const handlePausePlay = () => {
    if (isPaused) {
      startSessionTimer();
      if (isResting) {
        startRestTimer();
      }
    } else {
      clearInterval(sessionInterval.current as NodeJS.Timeout);
      clearInterval(restInterval.current as NodeJS.Timeout);
    }
    setIsPaused(!isPaused);
  };

  const handleStartSkipRest = () => {
    if (!isResting) {
      setRestTime(restDuration);
      startRestTimer();
    } else {
      clearInterval(restInterval.current as NodeJS.Timeout);
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
  };

  useEffect(() => {
    if (timeControlsRef.current && settingsRef.current) {
      timeControlsRef.current.measure((x, y, width, height) => {
        setTimeControlsHeight(height);
      });
      settingsRef.current.measure((x, y, width, height) => {
        setSettingsHeight(height);
      });
    }
  }, [timeControlsRef, settingsRef]);

  return (
    <BaseSheet visible={visible} onClose={onClose} sheetName="TimerSheet" contentRef={contentRef}>
      <View ref={contentRef}>
        <Text category='h6'>{isResting ? 'Rest Timer' : 'Session Timer'}</Text>
        <Text style={styles.timerText}>{formatTime(isResting ? restTime : sessionTime)}</Text>
        <View ref={timeControlsRef}>
          <ButtonGroup style={styles.timeControls} appearance='filled' size='medium'>
            <Button onPress={resetTime} accessoryLeft={RestartIcon} style={styles.controlButton} />
            <Button onPress={() => adjustTime(-15)} style={styles.controlButton}>-15</Button>
            <Button onPress={handlePausePlay} accessoryLeft={(props) => isPaused ? <PlayIcon {...props} /> : <PauseIcon {...props} />} style={styles.controlButton} />
            <Button onPress={() => adjustTime(15)} style={styles.controlButton}>+15</Button>
            <Button onPress={handleStartSkipRest} accessoryLeft={(props) => isResting ? <SkipIcon {...props} /> : <StartRestIcon {...props} />} style={styles.controlButton} />
          </ButtonGroup>
        </View>
        <View ref={settingsRef} style={styles.pickerContainer}>
          <Text category='s1' style={styles.label}>Rest Duration</Text>
          <TimerPicker
            padWithNItems={1}
            initialValue={{
              hours: Math.floor(restDuration / 3600),
              minutes: Math.floor((restDuration % 3600) / 60),
              seconds: Math.floor(restDuration % 60)
            }}
            hideHours={true}
            minuteLabel="m:"
            secondLabel="s"
            Audio={Audio}
            LinearGradient={LinearGradient}
            Haptics={Haptics}
            onDurationChange={handleDurationChange}
            styles={{
              theme: "dark",
              backgroundColor: "#2b3554", // Use the dark background color from your theme
              pickerItem: {
                fontSize: 34,
                color: '#FFFFFF', // White text color to match your theme
              },
              pickerLabel: {
                fontSize: 32,
                marginTop: 0,
                color: '#FFFFFF', // White text color to match your theme
              },
              pickerContainer: {
                marginRight: 6,
              },
              pickerItemContainer: {
                width: 100,
              },
              pickerLabelContainer: {
                right: -20,
                top: 0,
                bottom: 6,
                width: 40,
                alignItems: "center",
              },            }}
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
