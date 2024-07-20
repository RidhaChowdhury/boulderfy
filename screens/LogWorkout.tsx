import React, { useRef, useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Layout, Text, Input, Button, Datepicker, Card, Icon, IconElement, IconProps, IndexPath, Divider } from '@ui-kitten/components';
import { Route, boulderGrades, topRopeGrades, attemptColors, gradeColors, tagColors } from './constants';
import { RouteCardFooter } from './components/RouteCardFooter';
import { AddRouteModal } from './components/AddRouteModal';
import { styles } from '../styles';

const PlusIcon = (props: IconProps): IconElement => (
  <Icon {...props} name='plus-outline' />
);

const EditIcon = (props: IconProps): IconElement => (
  <Icon {...props} name='edit-2-outline' />
);

const TrashIcon = (props: IconProps): IconElement => (
  <Icon {...props} name='trash-2-outline' />
);

const LogWorkoutScreen: React.FC = () => {
  const [date, setDate] = useState(new Date());
  const [location, setLocation] = useState('');
  const [routes, setRoutes] = useState<Route[]>([{'attempts': ['fail','fail','fail','fail','fail','fail','fail','fail','fail',], 'name': 'Route 1', 'grade': 'V1', 'color': '#FF0000', 'tags': ['crimpy', 'overhang']}]);
  const [selectedIndexes, setSelectedIndexes] = useState<IndexPath[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [editRouteIndex, setEditRouteIndex] = useState<number | null>(null);
  const [isTopRope, setIsTopRope] = useState(false);

  const scrollViewRefs = useRef<Array<ScrollView | null>>([]);

  const handleAddRoute = (name: string, grade: string, color: string, tags: string[]) => {
    const newRoute = { name, grade, color, tags, attempts: [] };
    if (editRouteIndex !== null) {
      const updatedRoutes = [...routes];
      updatedRoutes[editRouteIndex] = newRoute;
      setRoutes(updatedRoutes);
    } else {
      setRoutes([...routes, newRoute]);
    }
    setModalVisible(false);
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

    // Scroll to end after state update
    setTimeout(() => {
      scrollViewRefs.current[index]?.scrollToEnd({ animated: true });
    }, 0);
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
    setModalVisible(true);
    setEditRouteIndex(null); // Reset the edit index
  };

  const handleEditRoute = (index: number) => {
    setEditRouteIndex(index);
    setModalVisible(true);
  };

  const handleDeleteRoute = (index: number) => {
    const updatedRoutes = routes.filter((_, i) => i !== index);
    setRoutes(updatedRoutes);
  };

  const handleHideModal = () => {
    setModalVisible(false);
    setEditRouteIndex(null);
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
      <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {routes.length === 0 ? (
          <Text category='p1' style={styles.noRoutesText}>No routes added yet. Press the plus button to add a new route.</Text>
        ) : (
          routes.map((route, index) => (
            <React.Fragment key={index}> 
              {index > 0 && <Divider style={{backgroundColor: '#323f67'}} />}
              <Card style={styles.routeContainer} disabled={true}>
                <View style={styles.headerFields}>
                  <View style={styles.customHeader}>
                    <View style={styles.headerContainer}>
                      <View style={[styles.colorCircle, { backgroundColor: route.color || '#FFFFFF' }]} >
                        <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '800' }}>{route.grade}</Text>
                      </View>
                      <Text category='h3' style={styles.headerText}>{route.name}</Text>
                    </View>
                  </View>
                  <View style={styles.headerButtons}>
                    <Button style={styles.editButton} accessoryLeft={EditIcon} onPress={() => handleEditRoute(index)} />
                    <Button style={styles.editButton} accessoryLeft={TrashIcon} onPress={() => handleDeleteRoute(index)} />
                  </View>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 8, gap:8}}>
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
                  />
                </View>
              </Card>
            </React.Fragment>
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
        route={editRouteIndex !== null ? routes[editRouteIndex] : undefined}
        isTopRope={isTopRope}
        setIsTopRope={setIsTopRope}
      />
    </Layout>
  );
};

export default LogWorkoutScreen;
