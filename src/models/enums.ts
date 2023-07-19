export enum Dominance {
  Recessive,
  SemiDominant,
  Dominant,
}

export enum Sex {
  Hermaphrodite,
  Male,
}

export const sexToString = (sex: Sex): string => {
  switch (sex) {
    case Sex.Hermaphrodite:
      return 'hermaphrodite';
    case Sex.Male:
      return 'male';
  }
};

export const stringToSex = (sex: string): Sex => {
  switch (sex) {
    case 'male':
      return Sex.Male;
    case 'hermaphrodite':
      return Sex.Hermaphrodite;
    default:
      return Sex.Hermaphrodite;
  }
};
