export const formatTime = (time) => {
  if (!time) return '0:00';

  // If time is already in MM:SS format
  if (typeof time === 'string' && time.includes(':')) {
    const [minutes, seconds] = time.split(':');
    return `${minutes}:${seconds.padStart(2, '0')}`;
  }

  // If time is in seconds (number or string)
  const totalSeconds = parseInt(time, 10);
  if (isNaN(totalSeconds)) return '0:00';

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};
