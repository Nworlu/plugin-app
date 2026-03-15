export const formatDateValue = (value: Date): string => {
  const day = `${value.getDate()}`.padStart(2, "0");
  const month = `${value.getMonth() + 1}`.padStart(2, "0");
  const year = `${value.getFullYear()}`;
  return `${day}/${month}/${year}`;
};

export const formatTimeValue = (value: Date): string => {
  const hours = value.getHours();
  const minutes = `${value.getMinutes()}`.padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  return `${formattedHours}:${minutes} ${period}`;
};
