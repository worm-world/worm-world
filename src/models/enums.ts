export enum Dominance {
  Recessive,
  SemiDominant,
  Dominant,
}

export enum Sex {
  Male,
  Hermaphrodite,
}

export const sexToString = (sex: Sex): string => {
  switch (sex) {
    case Sex.Male:
      return 'male';
    case Sex.Hermaphrodite:
      return 'hermaphrodite';
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
