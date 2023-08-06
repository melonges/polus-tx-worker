const hInSec = 3600;
const hourCoefficient = {
  0: 0.5,
  1: 0.6,
  2: 0.6,
  3: 0.7,
  4: 1.0,
  5: 1.0,
  6: 0.9,
  7: 0.7,
  8: 0.5,
  9: 0.5,
  10: 0.5,
  11: 0.4,
  12: 0.3,
  13: 0.2,
  14: 0.1,
  15: 0.1,
  16: 0.1,
  17: 0.1,
  18: 0.1,
  19: 0.2,
  20: 0.3,
  21: 0.4,
  22: 0.5,
  23: 0.5,
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
