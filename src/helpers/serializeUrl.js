export const serializeUrl = (filters) => {
  const params = new URLSearchParams();

  for (const key in filters) {
    if (filters.hasOwnProperty(key)) {
      const element = filters[key];
      if (Array.isArray(element)) element.forEach((item) => params.append(key, item));
      else params.set(key, element);
    }
  }
  return params.toString();
};
