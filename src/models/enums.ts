export enum Dominance {
  Recessive,
  SemiDominant,
  Dominant,
}

export enum Sex {
  Male,
  Female,
  Hermaphrodite,
}

export const getSexIcon = (sex: Sex): string => {
  let icon;
  switch (sex) {
    case Sex.Male:
      icon = '♂';
      break;
    case Sex.Hermaphrodite:
      icon = '⚥';
      break;
    case Sex.Female:
      icon = '♀';
      break;
  }
  return icon;
};
