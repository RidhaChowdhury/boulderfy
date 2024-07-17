import React, { useRef, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Layout, Text, Input, Button, Datepicker, Card, Icon, IconElement, IconProps, IndexPath } from '@ui-kitten/components';
import { Route, grades, attemptColors, gradeColors } from './constants';
import { RouteCardFooter } from './components/RouteCardFooter';
import { AddRouteModal } from './components/AddRouteModal';
import { styles } from '../styles';

const PlusIcon = (props: IconProps): IconElement => (
  <Icon
    {...props}
    name='plus-outline'
  />
);

const LogWorkoutScreen = () => {
  const [date, setDate] = useState(new Date());
  const [location, setLocation] = useState('');
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedIndexes, setSelectedIndexes] = useState<IndexPath[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);

  const handleAddRoute = (name: string, grade: string) => {
    setRoutes([...routes, { name, grade, attempts: [] }]);
    setSelectedIndexes([...selectedIndexes, new IndexPath(0)]);
  };

  const handleRouteChange = (index: number, key: keyof Route, value: string | string[]) => {
    const newRoutes = [...routes];
    if (key === 'attempts') {
      newRoutes[index][key] = value as string[];
    } else {
      newRoutes[index][key] = value as string;
    }
    setRoutes(newRoutes);
  };

  const handleGradeSelect = (index: number, nextIndex: IndexPath) => {
    const newSelectedIndexes = [...selectedIndexes];
    newSelectedIndexes[index] = nextIndex;
    setSelectedIndexes(newSelectedIndexes);

    const grade = grades[nextIndex.row];
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
  };

  const undoAttempt = (index: number) => {
    const newRoutes = [...routes];
    const currentAttempts = newRoutes[index].attempts;
    if (currentAttempts.length > 0) {
      currentAttempts.pop();
      setRoutes(newRoutes);
    }
  };

  const pulseIconRef = useRef<IconElement>(null);

  const handleShowModal = () => {
    setModalVisible(true);
  };

  const handleHideModal = () => {
    setModalVisible(false);
  };

  const getStatus = (attempts: string[]) => {
    if (attempts.includes('repeat') || attempts.includes('flash')) {
      return 'done';
    } else if (attempts.length > 0) {
      return 'checked';
    } else {
      return 'initial';
    }
  };

  return (
    <Layout style={styles.container}>
      <Text category='h1'>Log Workout</Text>
      <View style={styles.headerFields}>
        <Datepicker
          style={styles.input}
          label='Date'
          date={date}
          onSelect={nextDate => setDate(nextDate)}
        />
        <Input
          style={styles.input}
          label='Location'
          placeholder='Enter location'
          value={location}
          onChangeText={nextValue => setLocation(nextValue)}
        />
      </View>
      <ScrollView style={styles.scrollView}>
        {routes.length === 0 ? (
          <Text category='p1' style={styles.noRoutesText}>No routes added yet. Press the plus button to add a new route.</Text>
        ) : (
          routes.map((route, index) => (
            <Card key={index} style={styles.routeContainer} disabled={true}>
              <View style={styles.customHeader}>
                <Text category='h6' style={styles.headerText}>{route.name}</Text>
                <Text category='s1' style={[styles.headerText, { color: gradeColors[route.grade] }]}>{route.grade}</Text>
              </View>
              <Text category='label' style={styles.attemptsLabel}>Attempts</Text>
              <View style={styles.attemptsContainer}>
                {route.attempts.map((attempt, attemptIndex) => (
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
                {[0.2, 0.1, 0.05].map((opacity, index) => (
                  <Icon
                    key={`dot-${index}`}
                    name='radio-button-off-outline'
                    style={[styles.attemptIcon, { opacity }]}
                    fill='#FFFFD0'
                  />
                ))}
              </View>
              <RouteCardFooter 
                addAttempt={(attempt: string) => addAttempt(index, attempt)} 
                undoAttempt={() => undoAttempt(index)} 
                status={getStatus(route.attempts)} 
                attempts={route.attempts} 
              />
            </Card>
          ))
        )}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button style={styles.button}>Save Workout</Button>
        <Button
          style={styles.circularButton}
          accessoryLeft={PlusIcon}
          onPress={handleShowModal}
        />
      </View>
      <AddRouteModal
        visible={isModalVisible}
        onClose={handleHideModal}
        onAddRoute={handleAddRoute}
      />
    </Layout>
  );
};

export default LogWorkoutScreen;
