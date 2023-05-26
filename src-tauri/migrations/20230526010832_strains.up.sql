-- Rename column for strain_alleles
ALTER TABLE strain_alleles
    RENAME COLUMN name TO allele;
-- Rename column for strain
ALTER TABLE strains
    RENAME COLUMN notes TO description;
-- Rename variations to variations 
ALTER TABLE variation_info
    RENAME TO variations;