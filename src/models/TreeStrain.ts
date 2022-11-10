export enum Sex {
    Male,
    Female,
    Hermaphrodite,
}

/**
 * @PrimaryKey {id}
 * @ForeignKeys {treeId: Tree.id} {strain: strain.name} {reproductionId: Reproduction.id}
 */
export default interface TreeStrain {
    id: Number,
    treeId: Number,
    strain: String,
    sex: Sex,
    reproductionId: Number,
}
