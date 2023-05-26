ALTER TABLE strain_alleles
    RENAME COLUMN allele TO name;
ALTER TABLE strains
    RENAME COLUMN description TO notes;
ALTER TABLE variations
    RENAME TO variation_info;