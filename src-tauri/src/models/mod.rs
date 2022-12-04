use ts_rs::TS;
pub trait FieldNameEnum: TS + std::hash::Hash + std::cmp::Eq {
    fn get_col_name(&self) -> String;
}
pub mod allele;
pub mod allele_expr;
pub mod condition;
pub mod cross;
pub mod expr_relation;
pub mod filter;
pub mod gene;
pub mod phenotype;
pub mod schedule_tree;
pub mod scheduled_cross;
pub mod strain;
pub mod strain_alleles;
pub mod tree;
pub mod tree_strain;
pub mod variation_info;
