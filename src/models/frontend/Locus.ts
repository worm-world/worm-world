export interface Locus {
    name: string;
    chromosome?: string;
    /** Physical location of the gene/variation on a chromosome */
    physLoc: GeneLocation;
    /** Gene/variation's genetic distance from the middle of a chromosome */
    geneticLoc: GeneLocation;
}