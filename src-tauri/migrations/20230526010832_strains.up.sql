
DROP TABLE strains;
CREATE TABLE strains
(
  name  TEXT NOT NULL,
  description TEXT NULL,
  genotype TEXT NOT NULL,
  PRIMARY KEY (name)
);

DROP TABLE strain_alleles;
CREATE TABLE strain_alleles (
    strain_name TEXT NOT NULL,
    allele_name TEXT NOT NULL,
    is_on_top INTEGER NOT NULL,
    is_on_bot INTEGER NOT NULL,
    PRIMARY KEY (strain_name, allele_name),
    FOREIGN KEY (strain_name) REFERENCES strains (name) ON UPDATE CASCADE,
    FOREIGN KEY (allele_name) REFERENCES alleles (name)
);

ALTER TABLE variation_info
    RENAME TO variations;
DROP TABLE allele_exprs;
CREATE TABLE allele_exprs
(
  allele_name          TEXT NOT NULL,
  expressing_phenotype_name TEXT NOT NULL,
  expressing_phenotype_wild INTEGER NOT NULL,
  dominance            INTEGER NOT NULL,
  PRIMARY KEY (allele_name, expressing_phenotype_name, expressing_phenotype_wild),
  FOREIGN KEY (allele_name) REFERENCES alleles (name),
  FOREIGN KEY (expressing_phenotype_name, expressing_phenotype_wild) REFERENCES phenotypes (name, wild)
)