import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Layout, Text, Input, Button, Datepicker, Select, SelectItem, IndexPath, Card, Icon, IconElement, IconProps } from '@ui-kitten/components';

type Route = {
  name: string;
  grade: string;
  attempts: string;
};

const grades = ['V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10'];

const LogWorkoutScreen = () => {
  const [date, setDate] = useState(new Date());
  const [location, setLocation] = useState('');
  const [routes, setRoutes] = useState<Route[]>([{ name: '', grade: 'V0', attempts: '' }]);
  const [selectedIndexes, setSelectedIndexes] = useState<IndexPath[]>(routes.map(() => new IndexPath(0)));

  const addRoute = () => {
    setRoutes([...routes, { name: '', grade: 'V0', attempts: '' }]);
    setSelectedIndexes([...selectedIndexes, new IndexPath(0)]);
  };

  const handleRouteChange = (index: number, key: keyof Route, value: string) => {
    const newRoutes = [...routes];
    newRoutes[index][key] = value;
    setRoutes(newRoutes);
  };

  const handleGradeSelect = (index: number, nextIndex: IndexPath) => {
    const newSelectedIndexes = [...selectedIndexes];
    newSelectedIndexes[index] = nextIndex;
    setSelectedIndexes(newSelectedIndexes);

    const grade = grades[nextIndex.row];
    handleRouteChange(index, 'grade', grade);
  };

  const pulseIconRef = useRef<Icon<Partial<IconProps>>>(null);

  const PlusIcon = (props: IconProps): IconElement => (
    <Icon
      {...props}
      ref={pulseIconRef}
      animation='pulse'
      name='plus-outline'
    />
  );

  const handleAddRoute = () => {
    if (pulseIconRef.current) {
      pulseIconRef.current.startAnimation();
    }
    addRoute();
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
        {routes.map((route, index) => (
          <Card key={index} style={styles.routeContainer} disabled={true}>
            <View style={styles.keyRouteDetails}>
              <Input
                style={styles.routeNameInput}
                label='Route Name'
                placeholder='Enter route name'
                value={route.name}
                onChangeText={nextValue => handleRouteChange(index, 'name', nextValue)}
              />
              <Select
                style={styles.gradeInput}
                label='Grade'
                placeholder={grades[0]}
                value={route.grade}
                selectedIndex={selectedIndexes[index]}
                onSelect={nextIndex => handleGradeSelect(index, nextIndex as IndexPath)}>
                {grades.map((grade, idx) => (
                  <SelectItem key={idx} title={grade} />
                ))}
              </Select>
            </View>
            <Input
              style={styles.input}
              label='Attempts'
              placeholder='Enter number of attempts'
              value={route.attempts}
              keyboardType='numeric'
              onChangeText={nextValue => handleRouteChange(index, 'attempts', nextValue)}
            />
          </Card>
        ))}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button
          style={styles.circularButton}
          accessoryLeft={PlusIcon}
          onPress={handleAddRoute}
        />
        <Button style={styles.button}>Save Workout</Button>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#222B45', // Dark background color
  },
  headerFields: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
    gap: 16, // Add gap between elements
  },
  scrollView: {
    flex: 1,
    marginBottom: 60, // Ensure there is space for the buttons
  },
  keyRouteDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    gap: 16, // Add gap between elements
  },
  routeNameInput: {
    flex: 3, // Takes up most of the space
  },
  gradeInput: {
    flex: 1, // Takes up less space
  },
  routeContainer: {
    marginVertical: 8,
    padding: 16,
    borderRadius: 8,
  },
  input: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: '#222B45',
    padding: 8,
    gap: 16, // Add gap between buttons
  },
  button: {
    flex: 1,
    borderRadius: 16,
  },
  circularButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});


export default LogWorkoutScreen;
