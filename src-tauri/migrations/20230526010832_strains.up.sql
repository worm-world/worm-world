ALTER TABLE strains
    RENAME notes TO description;
DROP TABLE strain_alleles;
CREATE TABLE strain_alleles (
    strain_name TEXT NOT NULL,
    allele_name TEXT NOT NULL,
    homozygous BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (strain_name, allele_name),
    FOREIGN KEY (strain_name) REFERENCES strains (name),
    FOREIGN KEY (allele_name) REFERENCES alleles (name)
);
ALTER TABLE variation_info
    RENAME TO variations;