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

export const sexToString = (sex: Sex): string => {
  switch (sex) {
    case Sex.Male:
      return 'male';
    case Sex.Female:
      return 'female';
    case Sex.Hermaphrodite:
      return 'hermaphrodite';
  }
};

export const stringToSex = (sex: string): Sex => {
  switch (sex) {
    case 'male':
      return Sex.Male;
    case 'female':
      return Sex.Female;
    case 'hermaphrodite':
      return Sex.Hermaphrodite;
    default:
      return Sex.Hermaphrodite;
  }
};
