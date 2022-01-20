type Format = 'YYYY-MM-DD';

export const formatUTCDate = (date: Date, format?: Format): string => {
  const year = `${date.getUTCFullYear()}`.padStart(4, '0');
  const month = `${date.getUTCMonth() + 1}`.padStart(2, '0');
  const day = `${date.getUTCDate()}`.padStart(2, '0');
  let formattedDate;

  switch(format) {
    default:
      formattedDate = `${year}-${month}-${day}`;
  }

  return formattedDate;
}
