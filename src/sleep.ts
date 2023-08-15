export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const getInterval = () => {
  const now = new Date();
  const nyTime = new Date(
    now.toLocaleString("en-US", { timeZone: "America/New_York" })
  );
  const nyHour = nyTime.getHours();
  return (
    3600 *
    1000 *
    Math.random() *
    (nyHour > 8 && nyHour < 16 ? 0.5 : nyHour > 16 && nyHour < 20 ? 0.25 : 1)
  );
};
