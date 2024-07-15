import React, { useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, ViewProps } from 'react-native';
import { Layout, Text, Input, Button, Datepicker, Select, SelectItem, IndexPath, Card, Icon, IconElement, IconProps, ButtonGroup } from '@ui-kitten/components';

type Route = {
  name: string;
  grade: string;
  attempts: string[];
};

const ICONS_PER_ROW = 5; // Adjust this number as needed

const grades = ['V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10'];

const CancelIcon = (props: IconProps): IconElement => (
  <Icon
    {...props}
    name='close'
  />
);

const FlashIcon = (props: IconProps): IconElement => (
  <Icon
    {...props}
    name='flash-outline'
  />
);

const CheckIcon = (props: IconProps): IconElement => (
  <Icon
    {...props}
    name='checkmark'
  />
);

const DoneAllIcon = (props: IconProps): IconElement => (
  <Icon
    {...props}
    name='done-all-outline'
  />
);

type FooterProps = ViewProps & {
  addAttempt: (attempt: string) => void;
  status: string;
};

const Footer = ({ addAttempt, status, ...props }: FooterProps): React.ReactElement => {
  const renderStatusButton = () => {
    switch (status) {
      case 'initial':
        return <Button accessoryLeft={FlashIcon} onPress={() => addAttempt('flash')} />;
      case 'checked':
        return <Button accessoryLeft={CheckIcon} onPress={() => addAttempt('send')} />;
      case 'done':
        return <Button accessoryLeft={DoneAllIcon} onPress={() => addAttempt('send')} />;
      default:
        return <Button accessoryLeft={FlashIcon} onPress={() => addAttempt('flash')} />;
    }
  };

  return (
    <View
      {...props}
      style={[props.style, styles.footerContainer]}
    >
      <ButtonGroup style={styles.buttonGroup}>
        <Button accessoryLeft={CancelIcon} onPress={() => addAttempt('fail')} />
        {renderStatusButton()}
      </ButtonGroup>
    </View>
  );
};

const LogWorkoutScreen = () => {
  const [date, setDate] = useState(new Date());
  const [location, setLocation] = useState('');
  const [routes, setRoutes] = useState<Route[]>([{ name: '', grade: 'V0', attempts: [] }]);
  const [selectedIndexes, setSelectedIndexes] = useState<IndexPath[]>(routes.map(() => new IndexPath(0)));

  const addRoute = () => {
    setRoutes([...routes, { name: '', grade: 'V0', attempts: [] }]);
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
      // If it's the first checkmark, add it as is
      if (!currentAttempts.includes('send') && !currentAttempts.includes('repeat') && !currentAttempts.includes('flash')) {
        currentAttempts.push('send');
      } else {
        // If there's already a checkmark or done-all, add 'repeat'
        currentAttempts.push('repeat');
      }
    } else if (attempt === 'flash') {
      // If it's a flash, it's an immediate success
      newRoutes[index].attempts = ['flash'];
    } else {
      // For 'fail' or any other attempt, just add it to the list
      currentAttempts.push(attempt);
    }
  
    setRoutes(newRoutes);
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
        {routes.map((route, index) => (
          <Card key={index} style={styles.routeContainer} disabled={true} footer={() => <Footer addAttempt={(attempt) => addAttempt(index, attempt)} status={getStatus(route.attempts)} />}>
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
                  fill={
                    attempt === 'fail' ? '#FF999F' :
                    attempt === 'flash' ? '#FFD700' :
                    (attempt === 'repeat' || attempt === 'send') ? '#99D3B4' :
                    '#FFFFFF'
                  }
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
  attemptsLabel: {
    marginTop: 16,
    marginBottom: 8,
  },
  attemptsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  attemptIcon: {
    width: 24,
    height: 24,
    marginRight: 4,
    marginBottom: 4,
  },
  dotIcon: {
    opacity: 0.3, // Make the dots more subtle
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
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  footerControl: {
    marginHorizontal: 2,
  },
  buttonGroup: {
    margin: 2,
  },
});

export default LogWorkoutScreen;
