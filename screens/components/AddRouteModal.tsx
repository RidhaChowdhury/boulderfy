import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Input, Select, SelectItem, IndexPath, Text, useTheme } from '@ui-kitten/components';
import BottomSheet from '@gorhom/bottom-sheet';
import { grades } from '../constants';
import CustomHandle from './CustomHandle'; // Import your custom handle

type AddRouteModalProps = {
  visible: boolean;
  onClose: () => void;
  onAddRoute: (name: string, grade: string) => void;
  route?: { name: string; grade: string }; // Optional route prop for editing
};

export const AddRouteModal = ({ visible, onClose, onAddRoute, route }: AddRouteModalProps): React.ReactElement => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [routeName, setRouteName] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));
  const snapPoints = ['25%', '50%'];
  const theme = useTheme();

  useEffect(() => {
    if (route) {
      setRouteName(route.name);
      const gradeIndex = grades.findIndex(g => g === route.grade);
      setSelectedIndex(new IndexPath(gradeIndex));
    } else {
      setRouteName('');
      setSelectedIndex(new IndexPath(0));
    }
  }, [route]);

  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible]);

  const handleAddRoute = () => {
    const grade = grades[selectedIndex.row];
    onAddRoute(routeName, grade);
    setRouteName('');
    setSelectedIndex(new IndexPath(0));
    onClose();
  };

  const handleSheetChanges = (index: number) => {
    if (index === -1) {
      onClose();
    }
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose={true}
      backgroundStyle={{ backgroundColor: '#2b3554' }} // Apply dark theme background color
      handleComponent={CustomHandle} // Use custom handle
    >
      <View style={styles.contentContainer}>
        <Text category='h6'>{route ? 'Edit Route' : 'Add Route'}</Text>
        <View style={styles.fieldsContainer}>
          <Input
            label='Route Name'
            placeholder='Enter route name'
            value={routeName}
            onChangeText={setRouteName}
            style={styles.routeNameInput}
          />
          <Select
            label='Grade'
            placeholder='Select grade'
            value={grades[selectedIndex.row]}
            selectedIndex={selectedIndex}
            onSelect={index => setSelectedIndex(index as IndexPath)}
            style={styles.gradeSelect}
          >
            {grades.map((grade, index) => (
              <SelectItem key={index} title={grade} />
            ))}
          </Select>
        </View>
        <View style={styles.buttonContainer}>
          <Button onPress={handleAddRoute}>{route ? 'UPDATE' : 'ADD'}</Button>
          <Button onPress={onClose} appearance='ghost'>CANCEL</Button>
        </View>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#2b3554', // Dark background color
  },
  fieldsContainer: {
    marginVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  routeNameInput: {
    flex: 1,
  },
  gradeSelect: {
    width: 100,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
});
