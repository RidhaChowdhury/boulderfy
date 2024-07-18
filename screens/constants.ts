export type Route = {
  name: string;
  grade: string;
  attempts: string[];
  color: string;
};

export const boulderGrades = ['V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10'];
export const topRopeGrades = ['5.6', '5.7', '5.8', '5.9', '5.10', '5.11', '5.12', '5.13', '5.14'];

export const attemptColors: { [key: string]: string } = {
  fail: '#FF999FAA',
  flash: '#E6CF4C',
  repeat: '#99D3B4',
  send: '#99D3B4',
};

export const holdColors = [
  '#FF5733', // Bright red
  '#33FF57', // Neon green
  '#3357FF', // Bright blue
  '#FFFF33', // Bright yellow
  '#FF33FF', // Bright pink
  '#00FFFF', // Cyan
  '#FFA500', // Orange
  '#800080', // Purple
  '#000000', // Black
  '#FFFFFF'  // White
];

export const gradeColors: { [key: string]: string } = {
  'V0': '#FF1493',  // Deep Pink
  'V1': '#1E90FF',  // Dodger Blue
  'V2': '#008000',  // Lime Green
  'V3': '#32CD32',  // Green
  'V4': '#FF4500',  // Orange Red
  'V5': '#8B0000',  // Dark Red
  'V6': '#FF0000',  // Red
  'V7': '#A9A9A9',  // Dark Grey
  'V8': '#FFFFFF',  // White
  'V9': '#696969',  // Dim Grey
  'V10': '#000000', // Black
  '5.6': '#FF1493', // Deep Pink
  '5.7': '#1E90FF', // Dodger Blue
  '5.8': '#008000', // Lime Green
  '5.9': '#32CD32', // Green
  '5.10': '#FF4500', // Orange Red
  '5.11': '#8B0000', // Dark Red
  '5.12': '#FF0000', // Red
  '5.13': '#A9A9A9', // Dark Grey
  '5.14': '#000000', // Black
};