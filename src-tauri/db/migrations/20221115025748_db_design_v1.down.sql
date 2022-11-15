-- Add down migration script here
BEGIN TRANSACTION;

CREATE TABLE Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name TEXT NOT NULL
);

INSERT INTO Users (id, user_name)
VALUES 
    (1, "Andrew"),
    (2, "Daniel"),
    (3, "Seth"),
    (4, "Will");

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
DROP TABLE expr_reqs;
DROP TABLE expr_sups;
DROP TABLE sched_crosses;
DROP TABLE sched_trees;
DROP TABLE strain_alleles;

PRAGMA foreign_keys = ON;

COMMIT TRANSACTION;
