
        
-- Reproductions are crosses or self-fertilizations
PRAGMA foreign_keys = OFF;

CREATE TABLE conditions
(
  name            TEXT    NOT NULL,
  description     TEXT    NULL    ,
  male_mating     INTEGER NULL    ,
  lethal          INTEGER NULL    ,
  female_sterile  INTEGER NULL    ,
  arrested        INTEGER NULL    ,
  maturation_days REAL    NULL    ,
  PRIMARY KEY (name)
);

-- Reproductions are crosses or self-fertilizations
CREATE TABLE crosses
(
  id INTEGER NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE genes
(
  name       TEXT NOT NULL,
  chromosome TEXT NULL    ,
  phys_loc   INTEGER NULL    ,
  gen_loc    REAL NULL    ,
  PRIMARY KEY (name)
);

-- If not recessive and and not wild, we know it will be suppressed by its phenotype equivalent
CREATE TABLE phenotypes
(
  name            TEXT    NOT NULL,
  wild            INTEGER NOT NULL,
  short_name      TEXT    NOT NULL,
  description     TEXT    NULL    ,
  male_mating     INTEGER NULL    ,
  lethal          INTEGER NULL    ,
  female_sterile  INTEGER NULL    ,
  arrested        INTEGER NULL    ,
  maturation_days REAL    NULL    ,
  PRIMARY KEY (name,wild)
);

CREATE TABLE strains
(
  name  TEXT NOT NULL,
  notes TEXT NULL    ,
  PRIMARY KEY (name)
);

CREATE TABLE trees
(
  id          INTEGER NOT NULL,
  name        TEXT    NULL    ,
  last_edited TEXT    NULL    ,
  PRIMARY KEY (id)
);

CREATE TABLE variation_info
(
  allele_name        TEXT    NOT NULL,
  chromosome TEXT    NULL    ,
  phys_loc   INTEGER NULL    ,
  gen_loc    REAL    NULL    ,
  PRIMARY KEY (allele_name)
);

-- Relationship between alleles and the phenotypes they create
CREATE TABLE allele_exprs
(
  allele_name          TEXT NOT NULL,
  expressing_phenotype_name TEXT NOT NULL,
  expressing_phenotype_wild INTEGER NOT NULL,
  dominance            INTEGER NULL    ,
  PRIMARY KEY (allele_name, expressing_phenotype_name, expressing_phenotype_wild),
  FOREIGN KEY (allele_name) REFERENCES alleles (name),
  FOREIGN KEY (expressing_phenotype_name, expressing_phenotype_wild) REFERENCES phenotypes (name, wild)
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

-- This is the list of parents involved in each repro (1 or 2)
CREATE TABLE cross_parents
(
  cross_id  INTEGER NOT NULL,
  strain_id INTEGER NOT NULL,
  PRIMARY KEY (cross_id, strain_id),
  FOREIGN KEY (cross_id) REFERENCES crosses (id),
  FOREIGN KEY (strain_id) REFERENCES tree_strains (id)
);

CREATE TABLE tree_strains
(
  id              INTEGER NOT NULL,
  tree_id         INTEGER NOT NULL,
  strain          TEXT    NOT NULL,
  sex             INTEGER NOT NULL,
  -- The reproduction that produced this
  parent_cross_id INTEGER NULL    ,
  PRIMARY KEY (id),
  FOREIGN KEY (tree_id) REFERENCES trees (id),
  FOREIGN KEY (strain) REFERENCES strains (name),
  FOREIGN KEY (parent_cross_id) REFERENCES crosses (id)
);

-- Relationship between alleles and the phenotypes they require to express
CREATE TABLE expr_relations
(
  allele_name          TEXT NOT NULL,
  expressing_phenotype_name TEXT NOT NULL,
  expressing_phenotype_wild INTEGER NOT NULL,

  altering_phenotype_name   TEXT NULL    ,
  altering_phenotype_wild   INTEGER NULL    ,
  altering_condition   TEXT NULL    ,
  -- if suppressing, the altering phenotype supresses an allele's expression
  -- if not suppressing, the altering phenotype is required for allele to express
  is_suppressing        INTEGER NOT NULL, 
  FOREIGN KEY (altering_phenotype_name, altering_phenotype_wild) REFERENCES phenotypes (name, wild),
  FOREIGN KEY (allele_name, expressing_phenotype_name, expressing_phenotype_wild) REFERENCES allele_exprs (allele_name, expressing_phenotype_name, expressing_phenotype_wild),
  FOREIGN KEY (altering_condition) REFERENCES conditions (name)
  PRIMARY KEY (allele_name, expressing_phenotype_name, expressing_phenotype_wild, altering_phenotype_name, altering_phenotype_wild, altering_condition)
);

CREATE TABLE sched_crosses
(
  scheduled_tree_id INTEGER NOT NULL,
  cross_id          INTEGER NOT NULL,
  date              TEXT    NULL    ,
  completed         INTEGER NULL    ,
  PRIMARY KEY (scheduled_tree_id, cross_id),
  FOREIGN KEY (scheduled_tree_id) REFERENCES sched_trees (id),
  FOREIGN KEY (cross_id) REFERENCES crosses (id)
);

CREATE TABLE sched_trees
(
  id      INTEGER NOT NULL,
  tree_id INTEGER NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (tree_id) REFERENCES trees (id)
);

CREATE TABLE strain_alleles
(
  strain TEXT NOT NULL,
  name   TEXT NOT NULL,
  FOREIGN KEY (strain) REFERENCES strains (name),
  FOREIGN KEY (name) REFERENCES alleles (name)
);

PRAGMA foreign_keys = ON;

DROP TABLE Users;