PRAGMA foreign_keys = OFF;

CREATE TABLE allele_exprs (
    allele_name TEXT NOT NULL,
    expressing_phenotype_name TEXT NOT NULL,
    expressing_phenotype_wild INTEGER NOT NULL,
    dominance INTEGER NOT NULL,
    PRIMARY KEY (
        allele_name,
        expressing_phenotype_name,
        expressing_phenotype_wild
    ),
    FOREIGN KEY (allele_name) REFERENCES alleles (name),
    FOREIGN KEY (
        expressing_phenotype_name,
        expressing_phenotype_wild
    ) REFERENCES phenotypes (name, wild)
);
CREATE TABLE alleles (
    name TEXT NOT NULL,
    contents TEXT NULL,
    systematic_gene_name TEXT NULL,
    variation_name TEXT NULL,
    PRIMARY KEY (name),
    FOREIGN KEY (systematic_gene_name) REFERENCES genes (systematic_name),
    FOREIGN KEY (variation_name) REFERENCES "variations" (allele_name)
);
CREATE TABLE conditions (
    name TEXT NOT NULL,
    description TEXT NULL,
    male_mating INTEGER NULL,
    lethal INTEGER NULL,
    female_sterile INTEGER NULL,
    arrested INTEGER NULL,
    maturation_days REAL NULL,
    PRIMARY KEY (name)
);
CREATE TABLE expr_relations (
    allele_name TEXT NOT NULL,
    expressing_phenotype_name TEXT NOT NULL,
    expressing_phenotype_wild INTEGER NOT NULL,
    altering_phenotype_name TEXT NULL,
    altering_phenotype_wild INTEGER NULL,
    altering_condition TEXT NULL,
    -- if suppressing, the altering phenotype supresses an allele's expression
    -- if not suppressing, the altering phenotype is required for allele to express
    is_suppressing INTEGER NOT NULL,
    FOREIGN KEY (altering_phenotype_name, altering_phenotype_wild) REFERENCES phenotypes (name, wild),
    FOREIGN KEY (
        allele_name,
        expressing_phenotype_name,
        expressing_phenotype_wild
    ) REFERENCES allele_exprs (
        allele_name,
        expressing_phenotype_name,
        expressing_phenotype_wild
    ),
    FOREIGN KEY (altering_condition) REFERENCES conditions (name) PRIMARY KEY (
        allele_name,
        expressing_phenotype_name,
        expressing_phenotype_wild,
        altering_phenotype_name,
        altering_phenotype_wild,
        altering_condition
    )
);
CREATE TABLE genes (
    systematic_name TEXT NOT NULL,
    descriptive_name TEXT NULL,
    chromosome TEXT NULL,
    phys_loc INTEGER NULL,
    gen_loc REAL NULL,
    recomb_suppressor_start INTEGER NULL,
    recomb_suppressor_end INTEGER NULL,
    PRIMARY KEY (systematic_name)
);
CREATE TABLE phenotypes (
    name TEXT NOT NULL,
    wild INTEGER NOT NULL,
    short_name TEXT NOT NULL,
    description TEXT NULL,
    male_mating INTEGER NULL,
    lethal INTEGER NULL,
    female_sterile INTEGER NULL,
    arrested INTEGER NULL,
    maturation_days REAL NULL,
    PRIMARY KEY (name, wild)
);
CREATE TABLE strain_alleles (
    strain_name TEXT NOT NULL,
    allele_name TEXT NOT NULL,
    is_on_top INTEGER NOT NULL,
    is_on_bot INTEGER NOT NULL,
    PRIMARY KEY (strain_name, allele_name),
    FOREIGN KEY (strain_name) REFERENCES strains (name) ON UPDATE CASCADE,
    FOREIGN KEY (allele_name) REFERENCES alleles (name)
);
CREATE TABLE strains (
    name TEXT NOT NULL,
    description TEXT NULL,
    genotype TEXT NOT NULL,
    PRIMARY KEY (name)
);
CREATE TABLE task_conds (
    task_id TEXT NOT NULL,
    cond_name TEXT NOT NULL,
    PRIMARY KEY (task_id, cond_name),
    FOREIGN KEY (task_id) REFERENCES tasks (id),
    FOREIGN KEY (cond_name) REFERENCES conditions (name)
);
CREATE TABLE task_deps (
    parent_id TEXT NOT NULL,
    child_id TEXT NOT NULL,
    PRIMARY KEY (parent_id, child_id),
    FOREIGN KEY (parent_id) REFERENCES tasks (id),
    FOREIGN KEY (child_id) REFERENCES tasks (id)
);
CREATE TABLE tasks (
    id TEXT NOT NULL,
    due_date TEXT NULL,
    action INTEGER NOT NULL,
    strain1 TEXT NOT NULL,
    strain2 TEXT NULL,
    result TEXT NULL,
    notes TEXT NULL,
    completed INTEGER NOT NULL,
    cross_design_id TEXT NOT NULL,
    FOREIGN KEY (cross_design_id) REFERENCES cross_designs (id),
    PRIMARY KEY (id)
);
CREATE TABLE cross_designs (
    id TEXT NOT NULL,
    name TEXT NOT NULL,
    last_edited TEXT NOT NULL,
    data TEXT NOT NULL,
    editable INTEGER NOT NULL,
    PRIMARY KEY (id)
);
CREATE TABLE variations (
    allele_name TEXT NOT NULL,
    chromosome TEXT NULL,
    phys_loc INTEGER NULL,
    gen_loc REAL NULL,
    recomb_suppressor_start INTEGER NULL,
    recomb_suppressor_end INTEGER NULL,
    PRIMARY KEY (allele_name)
);
PRAGMA foreign_keys = ON;