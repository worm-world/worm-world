-- Add down migration script here
ALTER TABLE genes DROP COLUMN recomb_suppressor_start;
ALTER TABLE genes DROP COLUMN recomb_suppressor_end;
ALTER TABLE variation_info DROP COLUMN recomb_suppressor_start;
ALTER TABLE variation_info DROP COLUMN recomb_suppressor_end;