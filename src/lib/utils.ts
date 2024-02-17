export const arrayToStringNumberObject = (array: Array<String>) => {
  const newObject = array.reduce((obj, item, index) => {
    if (index % 2 === 0) {
      const score = array[index + 1];
      Object.assign(obj, { [item]: Number(score) });
    }
    return obj;
  }, {} as Record<string, number>);

  return newObject;
};
