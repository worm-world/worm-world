use ts_rs::TS;
pub trait FieldNameEnum: TS + std::hash::Hash + std::cmp::Eq {
    fn get_col_name(&self) -> String;
}
pub mod allele;
pub mod allele_expr;
pub mod chromosome_name;
pub mod condition;
pub mod expr_relation;
pub mod filter;
pub mod gene;
pub mod phenotype;
pub mod strain;
pub mod strain_allele;
pub mod task;
pub mod task_cond;
pub mod task_dep;

pub mod cross_design;
pub mod variation;
