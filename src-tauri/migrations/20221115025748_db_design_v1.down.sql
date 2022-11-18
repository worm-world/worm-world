-- Add down migration script here
PRAGMA foreign_keys = OFF;

DROP TABLE crosses;
DROP TABLE genes;
DROP TABLE phenotypes;
DROP TABLE strains;
DROP TABLE trees;
DROP TABLE allele_exprs;
DROP TABLE alleles;
DROP TABLE cross_parents;
DROP TABLE tree_strains;
DROP TABLE expr_relations;
DROP TABLE variation_info;
DROP TABLE sched_crosses;
DROP TABLE sched_trees;
DROP TABLE strain_alleles;

PRAGMA foreign_keys = ON;