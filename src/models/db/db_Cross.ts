/**
 * @PrimaryKey id
 */
export interface Cross {
  id: Number;
}

/**
 * @summary Links a strain to each of it's parent (or just one if hermaphroditic)
 * @PrimaryKey {crossId, strainId}
 * @ForeignKey {crossId: Cross.id} {strainId: Strain.id}
 */
export interface CrossParent {
  crossId: Number;
  strainId: Number;
}
