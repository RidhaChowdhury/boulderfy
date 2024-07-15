import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
  customHeader: {
    alignItems: 'flex-start', // Align text to the left
  },
  headerText: {
    color: '#FFFFFF',
    textAlign: 'left', // Align text to the left
  },
  routeContainer: {
    marginVertical: 8,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#1A2138', // Adjust as needed
  },
  input: {
    flex: 1,
  },
  attemptsLabel: {
    marginTop: 16,
    marginBottom: 8,
    color: '#FFFFFF',
    textAlign: 'left', // Align text to the left
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
    borderWidth: 0, // Remove border
    borderColor: 'transparent', // Ensure border is transparent
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
    borderTopWidth: 0, // Remove top border
  },
  footerControl: {
    marginHorizontal: 2,
  },
  buttonGroup: {
    marginTop: 8,
  },
  undoButton: {
    opacity: 0.7, // Adjust the opacity as needed to make it dimmer
  },
  disabledUndoButton: {
    backgroundColor: '#B0C4DE', // Light Steel Blue
    opacity: 0.5,
  },
  noRoutesText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#fff',
  },
});
