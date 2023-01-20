-- Add up migration script here
--  Changes from previous migration script: updating schema of Genes/Variation tables
ALTER TABLE genes ADD COLUMN recomb_suppressor_start INTEGER NULL;
ALTER TABLE genes ADD COLUMN recomb_suppressor_end INTEGER NULL;
ALTER TABLE variation_info ADD COLUMN recomb_suppressor_start INTEGER NULL;
ALTER TABLE variation_info ADD COLUMN recomb_suppressor_end INTEGER NULL;