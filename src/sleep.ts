const hInSec = 3600;
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
    (nyHour > 8 && nyHour < 16 ? 1 : nyHour > 16 && nyHour < 20 ? 0.5 : 2)
  );
};
