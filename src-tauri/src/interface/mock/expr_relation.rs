use crate::models::expr_relation::ExpressionRelation;

pub fn get_expr_relations() -> Vec<ExpressionRelation> {
    vec![
        ExpressionRelation {
            allele_name: "eT1(III)".to_string(),
            expressing_phenotype_name: "eT1IIIhet_aneuploid".to_string(),
            expressing_phenotype_wild: false,
            altering_phenotype_name: Some("eT1Vhet_aneuploid".to_string()),
            altering_phenotype_wild: Some(false),
            altering_condition: None,
            is_suppressing: true,
        },
        ExpressionRelation {
            allele_name: "eT1(III)".to_string(),
            expressing_phenotype_name: "eT1IIIhomozygote_aneuploid".to_string(),
            expressing_phenotype_wild: false,
            altering_phenotype_name: Some("eT1Vhomozygote_aneuploid".to_string()),
            altering_phenotype_wild: Some(false),
            altering_condition: None,
            is_suppressing: true,
        },
        ExpressionRelation {
            allele_name: "eT1(V)".to_string(),
            expressing_phenotype_name: "eT1Vhet_aneuploid".to_string(),
            expressing_phenotype_wild: false,
            altering_phenotype_name: Some("eT1IIIhet_aneuploid".to_string()),
            altering_phenotype_wild: Some(false),
            altering_condition: None,
            is_suppressing: true,
        },
        ExpressionRelation {
            allele_name: "eT1(V)".to_string(),
            expressing_phenotype_name: "eT1Vhomozygote_aneuploid".to_string(),
            expressing_phenotype_wild: false,
            altering_phenotype_name: Some("eT1IIIhomozygote_aneuploid".to_string()),
            altering_phenotype_wild: Some(false),
            altering_condition: None,
            is_suppressing: true,
        },
        ExpressionRelation {
            allele_name: "n765".to_string(),
            expressing_phenotype_name: "lin-15B".to_string(),
            expressing_phenotype_wild: false,
            altering_phenotype_name: None,
            altering_phenotype_wild: None,
            altering_condition: Some("25C".to_string()),
            is_suppressing: false,
        },
        ExpressionRelation {
            allele_name: "oxEx219999".to_string(),
            expressing_phenotype_name: "paralyzed".to_string(),
            expressing_phenotype_wild: false,
            altering_phenotype_name: None,
            altering_phenotype_wild: None,
            altering_condition: Some("Histamine".to_string()),
            is_suppressing: false,
        },
        ExpressionRelation {
            allele_name: "oxIs644".to_string(),
            expressing_phenotype_name: "YFP(pharynx)".to_string(),
            expressing_phenotype_wild: false,
            altering_phenotype_name: Some("Flp".to_string()),
            altering_phenotype_wild: Some(true),
            altering_condition: None,
            is_suppressing: false,
        },
    ]
}
pub fn get_filtered_expr_relations() -> Vec<ExpressionRelation> {
    vec![ExpressionRelation {
        allele_name: "oxEx219999".to_string(),
        expressing_phenotype_name: "paralyzed".to_string(),
        expressing_phenotype_wild: false,
        altering_phenotype_name: None,
        altering_phenotype_wild: None,
        altering_condition: Some("Histamine".to_string()),
        is_suppressing: false,
    }]
}
pub fn get_filtered_expr_relations_many_and_clauses() -> Vec<ExpressionRelation> {
    vec![ExpressionRelation {
        allele_name: "oxEx219999".to_string(),
        expressing_phenotype_name: "paralyzed".to_string(),
        expressing_phenotype_wild: false,
        altering_phenotype_name: None,
        altering_phenotype_wild: None,
        altering_condition: Some("Histamine".to_string()),
        is_suppressing: false,
    }]
}
pub fn search_expr_relations_by_allele_name() -> Vec<ExpressionRelation> {
    vec![
        ExpressionRelation {
            allele_name: "n765".to_string(),
            expressing_phenotype_name: "lin-15B".to_string(),
            expressing_phenotype_wild: false,
            altering_phenotype_name: None,
            altering_phenotype_wild: None,
            altering_condition: Some("25C".to_string()),
            is_suppressing: false,
        },
        ExpressionRelation {
            allele_name: "oxIs644".to_string(),
            expressing_phenotype_name: "YFP(pharynx)".to_string(),
            expressing_phenotype_wild: false,
            altering_phenotype_name: Some("Flp".to_string()),
            altering_phenotype_wild: Some(true),
            altering_condition: None,
            is_suppressing: false,
        },
    ]
}
pub fn search_expr_relations_by_allele_name_and_expressing_phenotype() -> Vec<ExpressionRelation> {
    vec![ExpressionRelation {
        allele_name: "oxIs644".to_string(),
        expressing_phenotype_name: "YFP(pharynx)".to_string(),
        expressing_phenotype_wild: false,
        altering_phenotype_name: Some("Flp".to_string()),
        altering_phenotype_wild: Some(true),
        altering_condition: None,
        is_suppressing: false,
    }]
}
