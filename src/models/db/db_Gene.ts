/**
 * @PrimaryKey {name}
 */
export default interface Gene {
  name: String;
  chromosome: String;
  /** Physical location of the gene on a chromosome */
  physLoc: Number;
  /** Gene's genetic distance from the middle of a chromosome */
  geneticLoc: Number;
}
