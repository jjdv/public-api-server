const areArrayValuesEqual = <T>(arr1: T[], arr2: T[]) =>
  arr1.length === arr2.length && arr1.every(element => arr2.includes(element));

export default areArrayValuesEqual;
