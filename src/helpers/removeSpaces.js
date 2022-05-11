export const removeSpaces = (str) => {
  const splitStr = str.toLowerCase().split(' ');
  if (splitStr.length === 1) return splitStr[0];
  for (let i = 0; i < splitStr.length; i++) splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  const newStr = splitStr.join('');
  return newStr.charAt(0).toLowerCase() + newStr.slice(1);
};
