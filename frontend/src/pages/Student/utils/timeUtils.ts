// export const parseDuration = (duration: string): number => {
//     // Check if duration is empty or not a string
//     if (!duration || typeof duration !== 'string') {
//       console.error('Invalid duration: Duration is empty or not a string');
//       return 0; // Fallback to 0 seconds
//     }
  
//     // Split duration into value and unit
//     const parts = duration.trim().split(' ');
//     if (parts.length !== 2) {
//       console.error(`Invalid duration format: "${duration}". Expected format: "X minutes" or "X hours"`);
//       return 0; // Fallback to 0 seconds
//     }
  
//     const [value, unit] = parts;
//     const numValue = parseInt(value);
  
//     // Check if value is a valid number
//     if (isNaN(numValue) || numValue <= 0) {
//       console.error(`Invalid duration value: "${value}" is not a valid number`);
//       return 0; // Fallback to 0 seconds
//     }
  
//     // Check unit and convert to seconds
//     if (unit.toLowerCase().includes('hour')) {
//       return numValue * 3600;
//     } else if (unit.toLowerCase().includes('minute')) {
//       return numValue * 60;
//     } else {
//       console.error(`Invalid duration unit: "${unit}". Expected "minutes" or "hours"`);
//       return 0; // Fallback to 0 seconds
//     }
//   };


export const parseDuration = (duration: string): number => {
    // Check if duration is empty or not a string
    if (!duration || typeof duration !== 'string') {
      console.error('Invalid duration: Duration is empty or not a string');
      return 0;
    }
  
    // Split duration into value and unit
    const parts = duration.trim().split(' ');
    if (parts.length !== 2) {
      console.error(`Invalid duration format: "${duration}". Expected format: "X minutes" or "X hours"`);
      return 0;
    }
  
    const [value, unit] = parts;
    const numValue = parseInt(value);
  
    // Check if value is a valid number
    if (isNaN(numValue) || numValue <= 0) {
      console.error(`Invalid duration value: "${value}" is not a valid number`);
      return 0;
    }
  
    // Check unit and convert to seconds
    if (unit.toLowerCase().includes('hour')) {
      return numValue * 3600;
    } else if (unit.toLowerCase().includes('minute')) {
      return numValue * 60;
    } else {
      console.error(`Invalid duration unit: "${unit}". Expected "minutes" or "hours"`);
      return 0;
    }
  };