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

export const getSexIconUrl = (sex: Sex): string => {
  switch (sex) {
    case Sex.Male:
      return 'male.svg';
    case Sex.Hermaphrodite:
      return 'hermaphrodite.svg';
    case Sex.Female:
      return 'female.svg';
  }
};
