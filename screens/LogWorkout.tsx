import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Layout, Text, Button, Card, Icon, IconElement, IconProps, IndexPath, Divider } from '@ui-kitten/components';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { Route, boulderGrades, topRopeGrades, attemptColors } from './constants';
import { RouteCardFooter } from './components/RouteCardFooter';
import AddRouteModal from './components/AddRouteModal';
import TimerSheet from './components/TimerSheet';
import { styles } from '../styles';

const PlusIcon = (props: IconProps): IconElement => <Icon {...props} name='plus-outline' />;
const EditIcon = (props: IconProps): IconElement => <Icon {...props} name='edit-2-outline' />;
const TrashIcon = (props: IconProps): IconElement => <Icon {...props} name='trash-2-outline' />;

const LogWorkoutScreen: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedIndexes, setSelectedIndexes] = useState<IndexPath[]>([]);
  const [isAddRouteModalVisible, setAddRouteModalVisible] = useState(false);
  const [isTimerSheetVisible, setTimerSheetVisible] = useState(false);
  const [editRouteIndex, setEditRouteIndex] = useState<number | null>(null);
  const [isTopRope, setIsTopRope] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [restTime, setRestTime] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [autoRestEnabled, setAutoRestEnabled] = useState(false);

  const scrollViewRefs = useRef<Array<ScrollView | null>>([]);
  const soundRef = useRef<Audio.Sound | null>(null);

  const getStatus = (attempts: string[]) => {
    if (attempts.includes('repeat') || attempts.includes('flash')) {
      return 'done';
    } else if (attempts.length > 0) {
      return 'checked';
    } else {
      return 'initial';
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedRoutes = await AsyncStorage.getItem('routes');
        const storedSessionTime = await AsyncStorage.getItem('sessionTime');
        const storedRestTime = await AsyncStorage.getItem('restTime');

        if (storedRoutes) setRoutes(JSON.parse(storedRoutes));
        if (storedSessionTime) setSessionTime(parseInt(storedSessionTime || '0'));
        if (storedRestTime) setRestTime(parseInt(storedRestTime || '0'));
      } catch (e) {
        console.error('Failed to load data', e);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('routes', JSON.stringify(routes));
        await AsyncStorage.setItem('sessionTime', sessionTime.toString());
        await AsyncStorage.setItem('restTime', restTime.toString());
      } catch (e) {
        console.error('Failed to save data', e);
      }
    };

    saveData();
  }, [routes, sessionTime, restTime]);

  const handleAddRoute = (name: string, grade: string, color: string, tags: string[]) => {
    const newRoute = { name, grade, color, tags, attempts: [] };
    if (editRouteIndex !== null) {
      const updatedRoutes = [...routes];
      updatedRoutes[editRouteIndex] = newRoute;
      setRoutes(updatedRoutes);
    } else {
      setRoutes([...routes, newRoute]);
    }
    setAddRouteModalVisible(false);
  };

  const handleRouteChange = (index: number, key: keyof Route, value: string | string[]) => {
    const newRoutes = [...routes];
    if (key === 'attempts') {
      newRoutes[index][key] = value as string[];
    }
    setRoutes(newRoutes);
  };

  const handleGradeSelect = (index: number, nextIndex: IndexPath) => {
    const newSelectedIndexes = [...selectedIndexes];
    newSelectedIndexes[index] = nextIndex;
    setSelectedIndexes(newSelectedIndexes);

    const grade = isTopRope ? topRopeGrades[nextIndex.row] : boulderGrades[nextIndex.row];
    handleRouteChange(index, 'grade', grade);
  };

  const addAttempt = (index: number, attempt: string) => {
    const newRoutes = [...routes];
    const currentAttempts = newRoutes[index].attempts;

    if (attempt === 'send') {
      if (!currentAttempts.includes('send') && !currentAttempts.includes('repeat') && !currentAttempts.includes('flash')) {
        currentAttempts.push('send');
      } else {
        currentAttempts.push('repeat');
      }
    } else if (attempt === 'flash') {
      newRoutes[index].attempts = ['flash'];
    } else {
      currentAttempts.push(attempt);
    }

    setRoutes(newRoutes);

    setTimeout(() => {
      scrollViewRefs.current[index]?.scrollToEnd({ animated: true });
    }, 0);

    if (autoRestEnabled) {
      setIsResting(true);
    }
  };

  const undoAttempt = (index: number) => {
    const newRoutes = [...routes];
    const currentAttempts = newRoutes[index].attempts;
    if (currentAttempts.length > 0) {
      currentAttempts.pop();
      setRoutes(newRoutes);
    }
  };

  const handleShowModal = () => {
    setAddRouteModalVisible(true);
    setEditRouteIndex(null);
  };

  const handleEditRoute = (index: number) => {
    setEditRouteIndex(index);
    setAddRouteModalVisible(true);
  };

  const handleDeleteRoute = (index: number) => {
    const updatedRoutes = routes.filter((_, i) => i !== index);
    setRoutes(updatedRoutes);
  };

  const handleHideModal = () => {
    setAddRouteModalVisible(false);
    setEditRouteIndex(null);
  };

  const toggleTimerSheet = () => {
    setTimerSheetVisible(true);
    setAddRouteModalVisible(false);
  };

  const formatSessionTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const formatRestTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <Layout style={styles.container}>
      <View style={styles.headerContainer}>
        <Text category='h2'>Log Workout</Text>
        <View style={styles.timerContainer}>
          <Text
            style={[
              styles.timerText,
              { backgroundColor: isResting ? 'rgba(50, 100, 200, 0.7)' : 'rgba(0, 0, 0, 0.3)' }
            ]}
            onPress={toggleTimerSheet}
          >
            {isResting ? formatRestTime(restTime) : formatSessionTime(sessionTime)}
          </Text>
        </View>
      </View>
      <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {routes.length === 0 ? (
          <Text category='p1' style={styles.noRoutesText}>No routes added yet. Press the plus button to add a new route.</Text>
        ) : (
          routes.map((route, index) => (
            <React.Fragment key={index}>
              {index > 0 && <Divider style={{ backgroundColor: '#323f67' }} />}
              <View style={styles.routeContainer}>
                <View style={styles.headerFields}>
                  <View style={styles.customHeader}>
                    <View style={styles.headerContainer}>
                      <View style={[styles.colorCircle, { backgroundColor: route.color + 'AA' || '#FFFFFF'}]}>
                        <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '800' }}>{route.grade}</Text>
                      </View>
                      <Text category='h5' style={styles.headerText}>
                        {route.name.length > 15 ? `${route.name.substring(0, 12)}...` : route.name}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.headerButtons}>
                    <Button style={styles.editButton} accessoryLeft={EditIcon} onPress={() => handleEditRoute(index)} />
                    <Button style={styles.editButton} accessoryLeft={TrashIcon} onPress={() => handleDeleteRoute(index)} />
                  </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <ScrollView
                    horizontal
                    style={styles.attemptsContainer}
                    ref={el => (scrollViewRefs.current[index] = el)}
                  >
                    {route.attempts.map((attempt: string, attemptIndex: number) => (
                      <Icon
                        key={attemptIndex}
                        name={
                          attempt === 'fail' ? 'close' :
                          attempt === 'flash' ? 'flash-outline' :
                          attempt === 'repeat' ? 'done-all-outline' :
                          'checkmark'
                        }
                        style={styles.attemptIcon}
                        fill={attemptColors[attempt]}
                      />
                    ))}
                    {route.attempts.length < 2 && [0.2, 0.1, 0.05].slice(0, 3 - route.attempts.length).map((opacity, index) => (
                      <Icon
                        key={`dot-${index}`}
                        name='radio-button-off-outline'
                        style={[styles.attemptIcon, { opacity }]}
                        fill='#FFFFD0'
                      />
                    ))}
                    {route.attempts.length >= 2 && (
                      <Icon
                        key={`dot-placeholder`}
                        name='radio-button-off-outline'
                        style={[styles.attemptIcon, { opacity: 0.2 }]}
                        fill='#FFFFD0'
                      />
                    )}
                  </ScrollView>
                  <RouteCardFooter 
                    addAttempt={(attempt: string) => addAttempt(index, attempt)} 
                    undoAttempt={() => undoAttempt(index)} 
                    status={getStatus(route.attempts)} 
                    attempts={route.attempts} 
                    startRestTimer={() => { if (autoRestEnabled) setIsResting(true); }}
                  />
                </View>
              </View>
            </React.Fragment>
          ))
        )}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button
          style={styles.circularButton}
          accessoryLeft={PlusIcon}
          onPress={handleShowModal}
        />
      </View>
      <AddRouteModal
        visible={isAddRouteModalVisible}
        onClose={handleHideModal}
        onAddRoute={handleAddRoute}
        route={editRouteIndex !== null ? routes[editRouteIndex] : undefined}
        isTopRope={isTopRope}
        setIsTopRope={setIsTopRope}
      />
      <TimerSheet
        visible={isTimerSheetVisible}
        onClose={() => setTimerSheetVisible(false)}
        sessionTime={sessionTime}
        setSessionTime={setSessionTime}
        restTime={restTime}
        setRestTime={setRestTime}
        isResting={isResting}
        setIsResting={setIsResting}
        autoRestEnabled={autoRestEnabled}
        setAutoRestEnabled={setAutoRestEnabled}
      />
    </Layout>
  );
};

export default LogWorkoutScreen;
