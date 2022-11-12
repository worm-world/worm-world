/**
 * @PrimaryKey {shortName}
 */
export default interface Phenotype {
  shortName: String;
  name: String;
  description: String;
  /** How well the male can mate. 3 denotes max mating capabilities, 0 states worm is incabable of mating  */
  maleMating: Number;
  lethal: Boolean;
  femaleSterile: Boolean;
  /** Worm maturation is stunted */
  arrested: Boolean;
  /** Generational time for to be ready to breed */
  growthRate: Number;
  /** Requirements for phenotype to be visible (i.e. temperature, chemical, etc) */
  environmentReq: String;
}
