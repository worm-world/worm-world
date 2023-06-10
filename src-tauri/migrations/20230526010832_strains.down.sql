
DROP TABLE strains;
CREATE TABLE strains
(
  name TEXT NOT NULL,
  notes TEXT NULL,
  PRIMARY KEY (name)
);
DROP TABLE strain_alleles;
CREATE TABLE strain_alleles
(
  strain TEXT NOT NULL,
  name   TEXT NOT NULL,
  FOREIGN KEY (strain) REFERENCES strains (name),
  FOREIGN KEY (name) REFERENCES alleles (name)
);
ALTER TABLE variations
    RENAME TO variation_info;
DROP TABLE allele_exprs;
CREATE TABLE allele_exprs
(
  allele_name          TEXT NOT NULL,
  expressing_phenotype_name TEXT NOT NULL,
  expressing_phenotype_wild INTEGER NOT NULL,
  dominance            INTEGER,
  PRIMARY KEY (allele_name, expressing_phenotype_name, expressing_phenotype_wild),
  FOREIGN KEY (allele_name) REFERENCES alleles (name),
  FOREIGN KEY (expressing_phenotype_name, expressing_phenotype_wild) REFERENCES phenotypes (name, wild)
)