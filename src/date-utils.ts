const date = new Date();
export const thisMonthName = date.toLocaleDateString(undefined, {
  month: "long",
  year: "numeric",
});
const thisYear = date.getFullYear();
const thisMonthIndex = date.getMonth();
const currentMonthNumber = thisMonthIndex + 1;

const firstDayOfCurrentMonth = new Date(thisYear, thisMonthIndex, 1);
const prevMonth = new Date(firstDayOfCurrentMonth);
prevMonth.setMonth(prevMonth.getMonth() - 1);
export const lastMonthName = prevMonth.toLocaleDateString(undefined, {
  month: "long",
});

export const thisMonth = `${thisYear}-${currentMonthNumber}`;

const yearAndMonthPattern = /^20\d{2}-([1-9]|10|11|12)$/;
export function isValidMonth(yearAndMonth: string) {
  if (yearAndMonthPattern.test(yearAndMonth)) {
    const [yearNum, monthNum] = yearAndMonth.split("-").map((i) => Number(i));
    const yearIsValid = yearNum >= 2020 && yearNum <= thisYear;
    const monthIsValid =
      yearNum === thisYear ? monthNum < currentMonthNumber : true;
    return yearIsValid && monthIsValid;
  }
  return false;
}

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const startingYear = 2020;
function getMonthOptions() {
  const options = months
    .slice(0, currentMonthNumber)
    .map((m, i) => ({
      value: `${thisYear}-${i + 1}`,
      label: `${m} ${thisYear}`,
    }))
    .reverse();

  for (let year = thisYear - 1; year >= startingYear; year--) {
    for (let i = 11; i >= 0; i--) {
      options.push({
        value: `${year}-${i + 1}`,
        label: `${months[i]} ${year}`,
      });
    }
  }

  return options;
}

const allMonthOptions = getMonthOptions();
export const monthOptions = allMonthOptions.slice(1);

export const lastMonth = allMonthOptions[1].value;
