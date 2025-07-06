export function getShortDate(utcDate: string) {
  const date = new Date(utcDate);

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const thisWeek = date > oneWeekAgo;
  const thisYear = date.getFullYear() === new Date().getFullYear();

  let options: Intl.DateTimeFormatOptions = {};
  if (thisWeek) {
    options = { weekday: "long" };
  } else if (thisYear) {
    options = { day: "numeric", month: "short" };
  } else {
    options = { day: "numeric", month: "short", year: "numeric" };
  }

  const string = date.toLocaleDateString("en-US", options);
  return string;
}
