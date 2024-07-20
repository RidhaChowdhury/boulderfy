import React from 'react';
import { View, ViewProps } from 'react-native';
import { Button, ButtonGroup, Icon, IconElement, IconProps } from '@ui-kitten/components';
import { styles } from '../../styles';
import { attemptColors } from '../constants';

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

const UndoIcon = (props: IconProps): IconElement => (
  <Icon
    {...props}
    name='undo'
  />
);

type FooterProps = ViewProps & {
  addAttempt: (attempt: string) => void;
  undoAttempt: () => void;
  status: string;
  attempts: string[];
};

export const RouteCardFooter = ({ addAttempt, undoAttempt, status, attempts, ...props }: FooterProps): React.ReactElement => {
  const renderStatusButton = () => {
    switch (status) {
      case 'initial':
        return <Button style={{ backgroundColor: attemptColors.flash }} accessoryLeft={FlashIcon} onPress={() => addAttempt('flash')} />;
      case 'checked':
        return <Button style={{ backgroundColor: attemptColors.send }} accessoryLeft={CheckIcon} onPress={() => addAttempt('send')} />;
      case 'done':
        return <Button style={{ backgroundColor: attemptColors.repeat }} accessoryLeft={DoneAllIcon} onPress={() => addAttempt('send')} />;
      default:
        return <Button style={{ backgroundColor: attemptColors.flash }} accessoryLeft={FlashIcon} onPress={() => addAttempt('flash')} />;
    }
  };

  return (
    <View
      {...props}
      style={[props.style, styles.footerContainer]}
    >
      <ButtonGroup style={styles.buttonGroup} size='small'>
        {/* <Button accessoryLeft={UndoIcon} onPress={undoAttempt} disabled={attempts.length === 0}           style={attempts.length === 0 ? styles.disabledUndoButton : styles.undoButton} /> */}
        <Button style={{ backgroundColor: attemptColors.fail }} accessoryLeft={CancelIcon} onPress={() => addAttempt('fail')} />
        {renderStatusButton()}
      </ButtonGroup>
    </View>
  );
};
