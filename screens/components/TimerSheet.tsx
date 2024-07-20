import React, { useState, useEffect, useRef } from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import { Button, ButtonGroup, Input, Text, CheckBox, Icon, IconProps, IconElement } from '@ui-kitten/components';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import BaseSheet from './BaseSheet'; // Import the BaseSheet component

const FlippedRefreshIcon = (props: IconProps): IconElement => (
  <Icon {...props} name='refresh-outline' style={[props.style, { transform: [{ scaleY: -1 }] }]} />
);

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

  const PauseIcon = (props: IconProps): IconElement => <Icon {...props} name='pause-circle-outline' />;
  const PlayIcon = (props: IconProps): IconElement => <Icon {...props} name='play-circle-outline' />;
  const SkipIcon = (props: IconProps): IconElement => <Icon {...props} name='skip-forward-outline' />;
  const RadioButtonOnIcon = (props: IconProps): IconElement => <Icon {...props} name='radio-button-on-outline' />;

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
    if (!isPaused) {
      startTimer();
    }

    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    };
  }, [isResting, isPaused]);

  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }
    timerInterval.current = setInterval(() => {
      setSessionTime(prevTime => prevTime + 1);
      if (isResting) {
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
            clearInterval(timerInterval.current as NodeJS.Timeout);
            return restDuration;
          }
        });
      }
    }, 1000);
  };

  const handlePausePlay = () => {
    if (isPaused) {
      startTimer();
    } else {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    }
    setIsPaused(!isPaused);
  };

  const handleStartSkipRest = () => {
    if (!isResting) {
      setRestTime(restDuration);
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

  return (
    <BaseSheet visible={visible} onClose={onClose} sheetName="TimerSheet">
      <Text category='h6'>{isResting ? 'Rest Timer' : 'Session Timer'}</Text>
      <Text style={styles.timerText}>{formatTime(isResting ? restTime : sessionTime)}</Text>
      <ButtonGroup style={styles.timeControls} appearance='filled' size='medium'>
        <Button onPress={resetTime} accessoryLeft={FlippedRefreshIcon} style={styles.controlButton} />
        <Button onPress={() => adjustTime(-15)} style={styles.controlButton}>-15</Button>
        <Button onPress={handlePausePlay} accessoryLeft={(props) => isPaused ? <PlayIcon {...props} /> : <PauseIcon {...props} />} style={styles.controlButton} />
        <Button onPress={() => adjustTime(15)} style={styles.controlButton}>+15</Button>
        <Button onPress={handleStartSkipRest} accessoryLeft={(props) => isResting ? <SkipIcon {...props} /> : <RadioButtonOnIcon {...props} />} style={styles.controlButton} />
      </ButtonGroup>
      <Input
        label="Rest Duration (seconds)"
        placeholder="Enter rest duration"
        value={String(restDuration)}
        onChangeText={value => setRestDuration(Number(value))}
        keyboardType="numeric"
        style={styles.input}
      />
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
    </BaseSheet>
  );
};

export default TimerSheet;

const styles = StyleSheet.create({
  timerText: {
    fontSize: 24,
    color: '#FFFFFF',
    textAlign: 'center',
    marginVertical: 16,
  },
  input: {
    marginVertical: 8,
  },
  timeControls: {
    flexDirection: 'row',
    marginVertical: 16,
    width: '100%',
  },
  controlButton: {
    flex: 1,
  },
  checkbox: {
    marginVertical: 8,
  },
});
