/**
 * @PrimaryKey {name}
 * @ForeignKeys {geneName: Gene.name}
 */
export default interface Allele {
    name: String,
    geneName: String
    contents: String,
}