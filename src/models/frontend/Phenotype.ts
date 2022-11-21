export interface AffectedTraits {
  /** How well the male can mate. 3 denotes max mating capabilities, 0 states worm is incabable of mating  */
  maleMating?: Number;
  lethal?: Boolean;
  femaleSterile?: Boolean;
  /** Worm maturation is stunted */
  arrested: Boolean;
  /** Generational time for to be ready to breed */
  maturationDays?: Number;
}

export interface Phenotype {
  name: String;
  shortName: String;
  wild: Boolean;
  traits: AffectedTraits;
  description?: String;
}

export interface Condition {
  name: String;
  traits: AffectedTraits;
  description?: String;
}
