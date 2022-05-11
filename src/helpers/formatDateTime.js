exports.formatDateTime = (date) => {
  let parts = new Intl.DateTimeFormat('he', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',

    timeZone: 'Asia/Jerusalem',
  })
    .formatToParts(new Date(date))
    .reduce((acc, part) => {
      acc[part.type] = part.value;
      return acc;
    }, Object.create(null));

  return `${parts.day}/${parts.month}/${parts.year}  ${parts.hour}:${parts.minute}`;
};
