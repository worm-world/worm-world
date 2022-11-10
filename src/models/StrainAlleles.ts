/**
 * @summary Representation of the alleles that make up a strain
 * @PrimaryKey {strainName, alleleName}
 * @ForeignKeys {strainName: Strain.name} {alleleName: Allele.name}
 */
export default interface StrainAlleles {
    strainName: String,
    alleleName: String,
}