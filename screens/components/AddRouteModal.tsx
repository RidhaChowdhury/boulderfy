import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Input, Modal, Select, SelectItem, IndexPath, Text } from '@ui-kitten/components';
import { grades } from '../constants';

type AddRouteModalProps = {
  visible: boolean;
  onClose: () => void;
  onAddRoute: (name: string, grade: string) => void;
};

export const AddRouteModal = ({ visible, onClose, onAddRoute }: AddRouteModalProps): React.ReactElement => {
  const [routeName, setRouteName] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));

  const handleAddRoute = () => {
    const grade = grades[selectedIndex.row];
    onAddRoute(routeName, grade);
    setRouteName('');
    setSelectedIndex(new IndexPath(0));
    onClose();
  };

  return (
    <Modal visible={visible} backdropStyle={styles.backdrop}>
      <Card disabled={true}>
        <Text category='h6'>Add Route</Text>
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
          <Button onPress={handleAddRoute}>ADD</Button>
          <Button onPress={onClose} appearance='ghost'>CANCEL</Button>
        </View>
      </Card>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  fieldsContainer: {
    marginVertical: 16,
    flexDirection: 'row', // Change to row
    justifyContent: 'space-between',
    gap: 8, // Add gap between elements
  },
  routeNameInput: {
    flex: 2, // Take majority of the width
  },
  gradeSelect: {
    flex: 1, // Take less space
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
});
