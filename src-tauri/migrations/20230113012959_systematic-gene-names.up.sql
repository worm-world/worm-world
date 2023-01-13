-- Add up migration script here
--  Changes from previous migration script: updating schema of Genes/Alleles tables
PRAGMA foreign_keys = OFF;
DELETE FROM expr_relations;
DELETE FROM allele_exprs;
DELETE FROM strain_alleles;
DROP TABLE alleles;
DROP TABLE genes;

CREATE TABLE genes
(
  systematic_name TEXT NOT NULL,
  descriptive_name TEXT NULL,
  chromosome TEXT NULL,
  phys_loc INTEGER NULL,
  gen_loc REAL NULL,
  PRIMARY KEY (systematic_name)
);

CREATE TABLE alleles
(
  name TEXT NOT NULL,
  contents TEXT NULL,
  systematic_gene_name TEXT NULL,
  variation_name TEXT NULL,
  PRIMARY KEY (name),
  FOREIGN KEY (systematic_gene_name) REFERENCES genes (systematic_name),
  FOREIGN KEY (variation_name) REFERENCES variation_info (allele_name)
);
PRAGMA foreign_keys = ON;