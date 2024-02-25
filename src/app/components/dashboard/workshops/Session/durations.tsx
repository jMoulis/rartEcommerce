export const minuteToMillisecondes = (minutes: number) => {
  const secondsPerMinute = 60;
  const millisecondsPerSecond = 1000;
  return minutes * secondsPerMinute * millisecondsPerSecond;
};

export const hourToMillisecondes = (hours: number) => {
  const minutePerHour = 60;
  const secondsPerMinute = 60;
  const millisecondsPerSecond = 1000;
  return hours * minutePerHour * secondsPerMinute * millisecondsPerSecond;
};
export const millisecondsToMins = (milliseconds: number) => {
  const secondsPerMinute = 60;
  const millisecondsPerSecond = 1000;
  return milliseconds / millisecondsPerSecond / secondsPerMinute;
};

export const getDurations = (t: any) => [
  {
    label: t('commons.select'),
    value: '',
  },
  {
    label: '15 min',
    value: minuteToMillisecondes(15),
  },
  {
    label: '30 min',
    value: minuteToMillisecondes(30),
  },
  {
    label: '45 min',
    value: minuteToMillisecondes(45),
  },
  {
    label: '1 h',
    value: hourToMillisecondes(1),
  },
  {
    label: '1h 30',
    value: hourToMillisecondes(1.5),
  },
  {
    label: '2 h',
    value: hourToMillisecondes(2),
  },
  {
    label: '2h 30',
    value: hourToMillisecondes(2.5),
  },
  {
    label: '3 h',
    value: hourToMillisecondes(3),
  },
];
