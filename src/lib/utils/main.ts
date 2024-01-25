export const hexToRgba = (hex: string, opacity: number): string => {
  // Ensure hex is a valid string and opacity is in the range 0-1

  if (!/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex) || opacity < 0 || opacity > 1) {
    return '';
  }

  let r: number, g: number, b: number;

  // If it's a three-character hex code, convert it to six-character
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};