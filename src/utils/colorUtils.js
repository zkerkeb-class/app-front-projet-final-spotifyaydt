// Function to generate a consistent hash from a string
const hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

// Function to generate a color from a hash
const generateColor = (hash, saturation = 50, lightness = 30) => {
  const hue = hash % 360;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

// Main function to generate gradient
export const generateGradient = (identifier) => {
  const hash = hashString(identifier);
  const color1 = generateColor(hash);
  const color2 = generateColor(hash + 120, 45, 25); // Offset hue by 120 degrees for complementary color

  return {
    backgroundColor: color1,
    backgroundImage: `linear-gradient(180deg, ${color1} 0%, ${color2} 100%)`,
  };
};
