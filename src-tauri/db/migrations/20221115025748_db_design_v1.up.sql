
        
-- Reproductions are crosses or self-fertilizations
BEGIN TRANSACTION;

DROP TABLE Users;

PRAGMA foreign_keys = OFF;

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
  phys_loc   TEXT NULL    ,
  gen_loc    TEXT NULL    ,
  PRIMARY KEY (name)
);

CREATE TABLE phenotypes
(
  name           TEXT    NOT NULL,
  description    TEXT    NULL    ,
  male_mating    INTEGER NULL    ,
  female_sterile INTEGER NULL     DEFAULT 0,
  arrested       INTEGER NULL     DEFAULT 0,
  lethal         INTEGER NULL     DEFAULT 0,
  growth_rate    REAL    NULL    ,
  short_name     TEXT    NULL    ,
  env_reqs       TEXT    NULL    ,
  is_condition   INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (name)
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

-- Relationship between alleles and the phenotypes they create
CREATE TABLE allele_exprs
(
  allele_name          TEXT NOT NULL,
  expressing_phenotype TEXT NOT NULL,
  dominance            TEXT NULL    ,
  PRIMARY KEY (allele_name, expressing_phenotype),
  FOREIGN KEY (allele_name) REFERENCES alleles (name),
  FOREIGN KEY (expressing_phenotype) REFERENCES phenotypes (short_name)
);

CREATE TABLE alleles
(
  name      TEXT NOT NULL,
  contents       NULL    ,
  gene_name TEXT NULL    ,
  PRIMARY KEY (name),
  FOREIGN KEY (gene_name) REFERENCES genes (name)
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
CREATE TABLE expr_reqs
(
  allele_name          TEXT NOT NULL,
  expressing_phenotype TEXT NOT NULL,
  required_phenotype   TEXT NOT NULL,
  FOREIGN KEY (required_phenotype) REFERENCES phenotypes (short_name),
  FOREIGN KEY (allele_name, expressing_phenotype) REFERENCES allele_exprs (allele_name, expressing_phenotype)
);

-- Relationship between alleles and the phenotypes that suppress their expression
CREATE TABLE expr_sups
(
  expressing_phenotype  TEXT NOT NULL,
  allele_name           TEXT NOT NULL,
  suppressing_phenotype TEXT NOT NULL,
  FOREIGN KEY (suppressing_phenotype) REFERENCES phenotypes (short_name),
  FOREIGN KEY (allele_name, expressing_phenotype) REFERENCES allele_exprs (allele_name, expressing_phenotype)
);

CREATE TABLE sched_repros
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
        
COMMIT TRANSACTION;