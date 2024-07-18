import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Button, Input, Select, SelectItem, IndexPath, Text, Layout } from '@ui-kitten/components';
import BottomSheet from '@gorhom/bottom-sheet';
import { grades, holdColors } from '../constants';  // Updated variable name
import CustomHandle from './CustomHandle';

type AddRouteModalProps = {
  visible: boolean,
  onClose: () => void,
  onAddRoute: (name: string, grade: string, color: string) => void,
  route?: { name: string, grade: string, color: string },
};

export const AddRouteModal = ({
  visible,
  onClose,
  onAddRoute,
  route
}: AddRouteModalProps): React.ReactElement => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [routeName, setRouteName] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));
  const [selectedColor, setSelectedColor] = useState('#FFFFFF'); // Default color

  useEffect(() => {
    if (route) {
      setRouteName(route.name);
      const gradeIndex = grades.findIndex(g => g === route.grade);
      setSelectedIndex(new IndexPath(gradeIndex));
      setSelectedColor(route.color || '#FFFFFF');
    } else {
      setRouteName('');
      setSelectedIndex(new IndexPath(0));
      setSelectedColor('#FFFFFF');
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
    const name = routeName.trim() !== '' ? routeName : 'Unnamed Route';
    onAddRoute(name, grade, selectedColor);
    setRouteName('');
    setSelectedIndex(new IndexPath(0));
    setSelectedColor('#FFFFFF');
    onClose();
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={['25%', '50%']}
      enablePanDownToClose={true}
      handleComponent={CustomHandle}
      backgroundStyle={{ backgroundColor: '#2b3554' }}
    >
      <View style={styles.contentContainer}>
        <Text category='h6'>{route ? 'Edit Route' : 'Add Route'}</Text>
        <View style={styles.fieldsContainer}>
          <View style={styles.inputContainer}>
            <Input
              label="Route Name"
              placeholder="Enter route name"
              value={routeName}
              onChangeText={setRouteName}
              style={styles.routeNameInput}
            />
            <Select
              label="Grade"
              placeholder="Select grade"
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
          <Text style={styles.colorLabel}>Hold Color</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorPicker}>
            {holdColors.map((color, index) => (
              <Button
                key={index}
                style={[
                  styles.colorSwatch, 
                  { backgroundColor: color, borderWidth: selectedColor === color ? 2 : 0, borderColor: 'white' }
                ]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </ScrollView>
        </View>
        <View style={styles.buttonContainer}>
          <Button onPress={handleAddRoute}>{route ? 'UPDATE' : 'ADD'}</Button>
          <Button onPress={onClose} appearance="ghost">CANCEL</Button>
        </View>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#2b3554',
  },
  fieldsContainer: {
    marginVertical: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  routeNameInput: {
    flex: 1,
    marginRight: 16,  // Space between Route Name input and Grade select
  },
  gradeSelect: {
    width: 100,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4, // Adjust as needed for spacing
  },
  colorLabel: {
    fontSize: 14,  // Match the font size
    fontWeight: 'bold',  // Match the font weight
    color: '#8F9BB3',  // Gray color similar to the Route Name label
    marginBottom: 8,  // Spacing below the label
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  colorPicker: {
    flexDirection: 'row',
    minHeight: 50,
  },
  colorSwatch: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
});
