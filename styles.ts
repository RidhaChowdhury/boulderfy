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
    marginTop: 8,
  },
  undoButton: {
    opacity: 0.7, // Adjust the opacity as needed to make it dimmer
  },
});
