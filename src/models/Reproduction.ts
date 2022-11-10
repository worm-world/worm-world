/**
 * @PrimaryKey id
 */
export interface Reproduction {
    id: Number
}

/**
 * @summary Links a strain to each of it's parent (or just one if hermaphroditic)
 * @PrimaryKey {reproductionId, strainId}
 * @ForeignKey {reproductionId: Reproduction.id} {strainId: Strain.id}
 */
export interface ReproductionParent {
    reproductionId: Number,
    strainId: Number,
}
