import React from 'react';
import { View, ViewProps } from 'react-native';
import { Button, ButtonGroup, Icon, IconElement, IconProps } from '@ui-kitten/components';
import { styles } from '../../styles';
import { attemptColors } from '../constants';

const CancelIcon = (props: IconProps): IconElement => <Icon {...props} name='close' fill='#FFFFFF' />;
const FlashIcon = (props: IconProps): IconElement => <Icon {...props} name='flash-outline' fill='#FFFFFF'/>;
const CheckIcon = (props: IconProps): IconElement => <Icon {...props} name='checkmark' fill='#FFFFFF'/>;
const DoneAllIcon = (props: IconProps): IconElement => <Icon {...props} name='done-all-outline' fill='#FFFFFF'/>;
const UndoIcon = (props: IconProps): IconElement => <Icon {...props} name='undo' fill='#FFFFFF'/>;

type FooterProps = ViewProps & {
  addAttempt: (attempt: string) => void;
  undoAttempt: () => void;
  status: string;
  attempts: string[];
  startRestTimer: () => void; // Add the rest timer function prop
};

export const RouteCardFooter = ({ addAttempt, undoAttempt, status, attempts, startRestTimer, ...props }: FooterProps): React.ReactElement => {
  const renderStatusButton = () => {
    switch (status) {
      case 'initial':
        return <Button style={{ backgroundColor: attemptColors.flash }} accessoryLeft={FlashIcon} onPress={() => { addAttempt('flash'); startRestTimer(); }} />;
      case 'checked':
        return <Button style={{ backgroundColor: attemptColors.send }} accessoryLeft={CheckIcon} onPress={() => { addAttempt('send'); startRestTimer(); }} />;
      case 'done':
        return <Button style={{ backgroundColor: attemptColors.repeat }} accessoryLeft={DoneAllIcon} onPress={() => { addAttempt('send'); startRestTimer(); }} />;
      default:
        return <Button style={{ backgroundColor: attemptColors.flash }} accessoryLeft={FlashIcon} onPress={() => { addAttempt('flash'); startRestTimer(); }} />;
    }
  };

  return (
    <View {...props} style={[props.style, styles.footerContainer]}>
      <ButtonGroup style={styles.buttonGroup} appearance='ghost' size='small'>
        {/* <Button accessoryLeft={UndoIcon} onPress={undoAttempt} disabled={attempts.length === 0} style={attempts.length === 0 ? styles.disabledUndoButton : styles.undoButton} /> */}
        <Button style={{ backgroundColor: attemptColors.fail }} accessoryLeft={CancelIcon} onPress={() => { addAttempt('fail'); startRestTimer(); }} />
        {renderStatusButton()}
      </ButtonGroup>
    </View>
  );
};
