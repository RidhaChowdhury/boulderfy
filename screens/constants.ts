export type Route = {
  name: string;
  grade: string;
  attempts: string[];
  color: string;
  tags: string[];
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
  '#CC6666', // Less bright red
  '#66CC66', // Less bright green
  '#6666CC', // Less bright blue
  '#CCCC66', // Less bright yellow
  '#CC66CC', // Less bright pink
  '#66CCCC', // Less bright cyan
  '#CC9966', // Less bright orange
  '#9966CC', // Less bright purple
  '#666666', // Less bright black (grey)
  '#CCCCCC'  // Less bright white (light grey)
];

export const gradeColors: { [key: string]: string } = {
  'V0': '#CC6699',  // Less bright pink
  'V1': '#6699CC',  // Less bright blue
  'V2': '#66CC99',  // Less bright green
  'V3': '#66CC66',  // Less bright light green
  'V4': '#CC6666',  // Less bright coral
  'V5': '#CC6666',  // Less bright dark red
  'V6': '#CC6666',  // Less bright tomato
  'V7': '#CCCCCC',  // Less bright light grey
  'V8': '#F5F5F5',  // Less bright white
  'V9': '#A9A9A9',  // Less bright dim grey
  'V10': '#696969', // Less bright dark grey
  '5.6': '#CC6699', // Less bright pink
  '5.7': '#6699CC', // Less bright blue
  '5.8': '#66CC99', // Less bright green
  '5.9': '#66CC66', // Less bright light green
  '5.10': '#CC6666', // Less bright coral
  '5.11': '#CC6666', // Less bright dark red
  '5.12': '#CC6666', // Less bright tomato
  '5.13': '#CCCCCC', // Less bright light grey
  '5.14': '#696969', // Less bright dark grey
};

export const routeTags = ['crimpy', 'dyno', 'overhang'];
export const tagColors: { [key: string]: string } = {
  crimpy: '#CC6666', // Less bright red
  dyno: '#66CC66',   // Less bright green
  overhang: '#6666CC', // Less bright blue
};
