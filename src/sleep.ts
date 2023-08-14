const hInSec = 3600;
const hourCoefficient = {
  0: 1.5,
  1: 1.6,
  2: 1.6,
  3: 1.7,
  4: 1.0,
  5: 1.0,
  6: 1.9,
  7: 1.7,
  8: 1.5,
  9: 1.5,
  10: 1.5,
  11: 1.4,
  12: 1.3,
  13: 1.2,
  14: 1.1,
  15: 1.1,
  16: 1.1,
  17: 1.1,
  18: 1.1,
  19: 1.2,
  20: 1.3,
  21: 1.4,
  22: 1.5,
  23: 1.5,
};
export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const getInterval = () => {
  const now = new Date();
  const nyTime = new Date(
    now.toLocaleString("en-US", { timeZone: "America/New_York" })
  );
  const nyHour = nyTime.getHours();
  return (
    hInSec *
    Math.random() *
    1000 *
    hourCoefficient[nyHour as keyof typeof hourCoefficient]
  );
};
