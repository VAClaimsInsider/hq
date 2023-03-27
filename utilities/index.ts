export const formatDate = (date: Date | string) => {
  const dateObj = (date instanceof Date) ? date : new Date(date);
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'full' })
    .format(dateObj);
};