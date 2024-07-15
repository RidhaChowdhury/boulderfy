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
  