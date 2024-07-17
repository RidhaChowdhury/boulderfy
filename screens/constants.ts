export type Route = {
    name: string;
    grade: string;
    attempts: string[];
  };
  
  export const grades = ['V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10'];
  
  export const attemptColors: { [key: string]: string } = {
    fail: '#FF999FAA',
    flash: '#FFD700',
    repeat: '#99D3B4',
    send: '#99D3B4',
  };
  
  export const gradeColors: { [key: string]: string } = {
    V0: '#FF1493',  // Deep Pink
    V1: '#1E90FF',  // Dodger Blue
    V2: '#008000',  // Lime Green
    V3: '#32CD32',  // Green
    V4: '#FF4500',  // Orange Red
    V5: '#8B0000',  // Dark Red
    V6: '#FF0000',  // Red
    V7: '#A9A9A9',  // Dark Grey
    V8: '#FFFFFF',  // White
    V9: '#696969',  // Dim Grey
    V10: '#000000', // Black
  };