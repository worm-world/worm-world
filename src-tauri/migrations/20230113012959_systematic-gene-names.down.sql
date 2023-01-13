-- Add down migration script here
PRAGMA foreign_keys = OFF;
DELETE FROM expr_relations;
DELETE FROM allele_exprs;
DELETE FROM strain_alleles;
DROP TABLE alleles;
DROP TABLE genes;

CREATE TABLE genes
(
  name       TEXT NOT NULL,
  chromosome TEXT NULL    ,
  phys_loc   INTEGER NULL    ,
  gen_loc    REAL NULL    ,
  PRIMARY KEY (name)
);


CREATE TABLE alleles
(
  name           TEXT    NOT NULL,
  contents       TEXT    NULL    ,
  gene_name      TEXT    NULL    ,
  variation_name TEXT NULL    ,
  PRIMARY KEY (name),
  FOREIGN KEY (gene_name) REFERENCES genes (name),
  FOREIGN KEY (variation_name) REFERENCES variation_info (allele_name)
);

PRAGMA foreign_keys = ON;