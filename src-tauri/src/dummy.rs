#[cfg(test)]
pub mod testdata {
    use crate::models::{
        allele::Allele, allele_expr::AlleleExpression, chromosome::Chromosome,
        condition::Condition, expr_relation::ExpressionRelation, gene::Gene, phenotype::Phenotype,
        variation_info::VariationInfo,
    };
    pub fn get_alleles() -> Vec<Allele> {
        vec![
            Allele {
                name: "cn64".to_string(),
                contents: None,
                systematic_gene_name: Some("T14B4.7".to_string()),
                variation_name: None,
            },
            Allele {
                name: "ed3".to_string(),
                contents: None,
                systematic_gene_name: Some("M142.1".to_string()),
                variation_name: None,
            },
            Allele {
                name: "md299".to_string(),
                contents: None,
                systematic_gene_name: Some("F27D9.1".to_string()),
                variation_name: None,
            },
            Allele {
                name: "n765".to_string(),
                contents: None,
                systematic_gene_name: Some("ZK662.4".to_string()),
                variation_name: None,
            },
            Allele {
                name: "ox1059".to_string(),
                contents: None,
                systematic_gene_name: Some("C10C6.1".to_string()),
                variation_name: None,
            },
            Allele {
                name: "oxEx219999".to_string(),
                contents: Some("[Primb-1::HisCl1::SL2::GFP]".to_string()),
                systematic_gene_name: None,
                variation_name: Some("oxEx219999".to_string()),
            },
            Allele {
                name: "oxEx2254".to_string(),
                contents: Some(
                    "[Psnt-1::Flp, Punc-122::GAP-43::mScarlet, cbr-unc-119(+), NeoR]".to_string(),
                ),
                systematic_gene_name: None,
                variation_name: Some("oxEx2254".to_string()),
            },
            Allele {
                name: "oxIs12".to_string(),
                contents: Some("[Punc-47::GFP; lin-15(+)]".to_string()),
                systematic_gene_name: None,
                variation_name: Some("oxIs12".to_string()),
            },
            Allele {
                name: "oxIs644".to_string(),
                contents: Some("[Peft-3::FRT-UTR-FRT::mYFP::unc-54UTR; lin-15(+)]".to_string()),
                systematic_gene_name: None,
                variation_name: Some("oxIs644".to_string()),
            },
            Allele {
                name: "oxSi1168".to_string(),
                contents: Some("[Psnt-1:Flp, *ttTi5605]".to_string()),
                systematic_gene_name: None,
                variation_name: Some("oxSi1168".to_string()),
            },
            Allele {
                name: "oxTi302".to_string(),
                contents: Some("[Peft-3::mCherry; cbr-unc-119(+)]".to_string()),
                systematic_gene_name: None,
                variation_name: Some("oxTi302".to_string()),
            },
            Allele {
                name: "oxTi75".to_string(),
                contents: Some("[Peft-3::GFP-NLS; unc-18(+)]".to_string()),
                systematic_gene_name: None,
                variation_name: Some("oxTi75".to_string()),
            },
            Allele {
                name: "tmC5".to_string(),
                contents: Some("[Pmyo-2::YFP]".to_string()),
                systematic_gene_name: None,
                variation_name: Some("tmC5".to_string()),
            },
        ]
    }
    pub fn get_filtered_alleles() -> Vec<Allele> {
        vec![
            Allele {
                name: "cn64".to_string(),
                contents: None,
                systematic_gene_name: Some("T14B4.7".to_string()),
                variation_name: None,
            },
            Allele {
                name: "md299".to_string(),
                contents: None,
                systematic_gene_name: Some("F27D9.1".to_string()),
                variation_name: None,
            },
        ]
    }
    pub fn get_alleles_with_content() -> Vec<Allele> {
        vec![
            Allele {
                name: "oxEx219999".to_string(),
                contents: Some("[Primb-1::HisCl1::SL2::GFP]".to_string()),
                systematic_gene_name: None,
                variation_name: Some("oxEx219999".to_string()),
            },
            Allele {
                name: "oxEx2254".to_string(),
                contents: Some(
                    "[Psnt-1::Flp, Punc-122::GAP-43::mScarlet, cbr-unc-119(+), NeoR]".to_string(),
                ),
                systematic_gene_name: None,
                variation_name: Some("oxEx2254".to_string()),
            },
            Allele {
                name: "oxIs12".to_string(),
                contents: Some("[Punc-47::GFP; lin-15(+)]".to_string()),
                systematic_gene_name: None,
                variation_name: Some("oxIs12".to_string()),
            },
            Allele {
                name: "oxIs644".to_string(),
                contents: Some("[Peft-3::FRT-UTR-FRT::mYFP::unc-54UTR; lin-15(+)]".to_string()),
                systematic_gene_name: None,
                variation_name: Some("oxIs644".to_string()),
            },
            Allele {
                name: "oxSi1168".to_string(),
                contents: Some("[Psnt-1:Flp, *ttTi5605]".to_string()),
                systematic_gene_name: None,
                variation_name: Some("oxSi1168".to_string()),
            },
            Allele {
                name: "oxTi302".to_string(),
                contents: Some("[Peft-3::mCherry; cbr-unc-119(+)]".to_string()),
                systematic_gene_name: None,
                variation_name: Some("oxTi302".to_string()),
            },
            Allele {
                name: "oxTi75".to_string(),
                contents: Some("[Peft-3::GFP-NLS; unc-18(+)]".to_string()),
                systematic_gene_name: None,
                variation_name: Some("oxTi75".to_string()),
            },
            Allele {
                name: "tmC5".to_string(),
                contents: Some("[Pmyo-2::YFP]".to_string()),
                systematic_gene_name: None,
                variation_name: Some("tmC5".to_string()),
            },
        ]
    }
    pub fn get_alleles_with_null_content() -> Vec<Allele> {
        vec![
            Allele {
                name: "cn64".to_string(),
                contents: None,
                systematic_gene_name: Some("T14B4.7".to_string()),
                variation_name: None,
            },
            Allele {
                name: "ed3".to_string(),
                contents: None,
                systematic_gene_name: Some("M142.1".to_string()),
                variation_name: None,
            },
            Allele {
                name: "md299".to_string(),
                contents: None,
                systematic_gene_name: Some("F27D9.1".to_string()),
                variation_name: None,
            },
            Allele {
                name: "n765".to_string(),
                contents: None,
                systematic_gene_name: Some("ZK662.4".to_string()),
                variation_name: None,
            },
            Allele {
                name: "ox1059".to_string(),
                contents: None,
                systematic_gene_name: Some("C10C6.1".to_string()),
                variation_name: None,
            },
        ]
    }
    pub fn get_allele_exprs() -> Vec<AlleleExpression> {
        vec![
            AlleleExpression {
                allele_name: "cn64".to_string(),
                expressing_phenotype_name: "dpy-10".to_string(),
                expressing_phenotype_wild: false,
                dominance: Some(0),
            },
            AlleleExpression {
                allele_name: "cn64".to_string(),
                expressing_phenotype_name: "rol".to_string(),
                expressing_phenotype_wild: false,
                dominance: Some(1),
            },
            AlleleExpression {
                allele_name: "ed3".to_string(),
                expressing_phenotype_name: "unc-119".to_string(),
                expressing_phenotype_wild: false,
                dominance: Some(0),
            },
            AlleleExpression {
                allele_name: "md299".to_string(),
                expressing_phenotype_name: "unc-18".to_string(),
                expressing_phenotype_wild: false,
                dominance: Some(0),
            },
            AlleleExpression {
                allele_name: "n765".to_string(),
                expressing_phenotype_name: "lin-15B".to_string(),
                expressing_phenotype_wild: false,
                dominance: Some(0),
            },
            AlleleExpression {
                allele_name: "ox1059".to_string(),
                expressing_phenotype_name: "YFP(pharynx)".to_string(),
                expressing_phenotype_wild: false,
                dominance: Some(2),
            },
            AlleleExpression {
                allele_name: "ox1059".to_string(),
                expressing_phenotype_name: "lin-15A".to_string(),
                expressing_phenotype_wild: true,
                dominance: Some(2),
            },
            AlleleExpression {
                allele_name: "ox1059".to_string(),
                expressing_phenotype_name: "lin-15B".to_string(),
                expressing_phenotype_wild: true,
                dominance: Some(2),
            },
            AlleleExpression {
                allele_name: "oxEx219999".to_string(),
                expressing_phenotype_name: "paralyzed".to_string(),
                expressing_phenotype_wild: false,
                dominance: Some(2),
            },
            AlleleExpression {
                allele_name: "oxEx2254".to_string(),
                expressing_phenotype_name: "Flp".to_string(),
                expressing_phenotype_wild: true,
                dominance: Some(2),
            },
            AlleleExpression {
                allele_name: "oxEx2254".to_string(),
                expressing_phenotype_name: "NeoR".to_string(),
                expressing_phenotype_wild: false,
                dominance: Some(2),
            },
            AlleleExpression {
                allele_name: "oxEx2254".to_string(),
                expressing_phenotype_name: "mScarlet(coel)".to_string(),
                expressing_phenotype_wild: false,
                dominance: Some(2),
            },
            AlleleExpression {
                allele_name: "oxEx2254".to_string(),
                expressing_phenotype_name: "unc-119".to_string(),
                expressing_phenotype_wild: true,
                dominance: Some(2),
            },
            AlleleExpression {
                allele_name: "oxIs12".to_string(),
                expressing_phenotype_name: "GFP-NLS".to_string(),
                expressing_phenotype_wild: false,
                dominance: Some(2),
            },
            AlleleExpression {
                allele_name: "oxIs12".to_string(),
                expressing_phenotype_name: "unc-18".to_string(),
                expressing_phenotype_wild: true,
                dominance: Some(2),
            },
            AlleleExpression {
                allele_name: "oxIs644".to_string(),
                expressing_phenotype_name: "YFP(pharynx)".to_string(),
                expressing_phenotype_wild: false,
                dominance: Some(2),
            },
            AlleleExpression {
                allele_name: "oxIs644".to_string(),
                expressing_phenotype_name: "mCherry".to_string(),
                expressing_phenotype_wild: false,
                dominance: Some(2),
            },
            AlleleExpression {
                allele_name: "oxIs644".to_string(),
                expressing_phenotype_name: "unc-119".to_string(),
                expressing_phenotype_wild: false,
                dominance: Some(2),
            },
            AlleleExpression {
                allele_name: "oxSi1168".to_string(),
                expressing_phenotype_name: "Flp".to_string(),
                expressing_phenotype_wild: true,
                dominance: Some(2),
            },
            AlleleExpression {
                allele_name: "oxSi1168".to_string(),
                expressing_phenotype_name: "NeoR".to_string(),
                expressing_phenotype_wild: false,
                dominance: Some(2),
            },
            AlleleExpression {
                allele_name: "oxSi1168".to_string(),
                expressing_phenotype_name: "mScarlet(coel)".to_string(),
                expressing_phenotype_wild: false,
                dominance: Some(2),
            },
            AlleleExpression {
                allele_name: "oxSi1168".to_string(),
                expressing_phenotype_name: "unc-119".to_string(),
                expressing_phenotype_wild: true,
                dominance: Some(2),
            },
            AlleleExpression {
                allele_name: "oxTi302".to_string(),
                expressing_phenotype_name: "mCherry".to_string(),
                expressing_phenotype_wild: false,
                dominance: Some(2),
            },
            AlleleExpression {
                allele_name: "oxTi302".to_string(),
                expressing_phenotype_name: "unc-119".to_string(),
                expressing_phenotype_wild: true,
                dominance: Some(2),
            },
            AlleleExpression {
                allele_name: "oxTi75".to_string(),
                expressing_phenotype_name: "GFP-NLS".to_string(),
                expressing_phenotype_wild: false,
                dominance: Some(2),
            },
            AlleleExpression {
                allele_name: "oxTi75".to_string(),
                expressing_phenotype_name: "unc-18".to_string(),
                expressing_phenotype_wild: true,
                dominance: Some(2),
            },
            AlleleExpression {
                allele_name: "tmC5".to_string(),
                expressing_phenotype_name: "YFP(pharynx)".to_string(),
                expressing_phenotype_wild: false,
                dominance: Some(2),
            },
            AlleleExpression {
                allele_name: "tmC5".to_string(),
                expressing_phenotype_name: "mec-3".to_string(),
                expressing_phenotype_wild: false,
                dominance: Some(0),
            },
            AlleleExpression {
                allele_name: "tmC5".to_string(),
                expressing_phenotype_name: "paralyzed".to_string(),
                expressing_phenotype_wild: false,
                dominance: Some(0),
            },
            AlleleExpression {
                allele_name: "tmC5".to_string(),
                expressing_phenotype_name: "unc-31".to_string(),
                expressing_phenotype_wild: false,
                dominance: Some(0),
            },
        ]
    }
    pub fn get_filtered_allele_exprs() -> Vec<AlleleExpression> {
        vec![
            AlleleExpression {
                allele_name: "cn64".to_string(),
                expressing_phenotype_name: "dpy-10".to_string(),
                expressing_phenotype_wild: false,
                dominance: Some(0),
            },
            AlleleExpression {
                allele_name: "cn64".to_string(),
                expressing_phenotype_name: "rol".to_string(),
                expressing_phenotype_wild: false,
                dominance: Some(1),
            },
        ]
    }
    pub fn get_wild_unc119_allele_exprs() -> Vec<AlleleExpression> {
        vec![
            AlleleExpression {
                allele_name: "oxEx2254".to_string(),
                expressing_phenotype_name: "unc-119".to_string(),
                expressing_phenotype_wild: true,
                dominance: Some(2),
            },
            AlleleExpression {
                allele_name: "oxSi1168".to_string(),
                expressing_phenotype_name: "unc-119".to_string(),
                expressing_phenotype_wild: true,
                dominance: Some(2),
            },
            AlleleExpression {
                allele_name: "oxTi302".to_string(),
                expressing_phenotype_name: "unc-119".to_string(),
                expressing_phenotype_wild: true,
                dominance: Some(2),
            },
        ]
    }
    pub fn get_allele_exprs_multi_order_by() -> Vec<AlleleExpression> {
        vec![
            AlleleExpression {
                allele_name: "cn64".to_string(),
                expressing_phenotype_name: "dpy-10".to_string(),
                expressing_phenotype_wild: false,
                dominance: Some(0),
            },
            AlleleExpression {
                allele_name: "n765".to_string(),
                expressing_phenotype_name: "lin-15B".to_string(),
                expressing_phenotype_wild: false,
                dominance: Some(0),
            },
            AlleleExpression {
                allele_name: "tmC5".to_string(),
                expressing_phenotype_name: "mec-3".to_string(),
                expressing_phenotype_wild: false,
                dominance: Some(0),
            },
            AlleleExpression {
                allele_name: "tmC5".to_string(),
                expressing_phenotype_name: "paralyzed".to_string(),
                expressing_phenotype_wild: false,
                dominance: Some(0),
            },
            AlleleExpression {
                allele_name: "ed3".to_string(),
                expressing_phenotype_name: "unc-119".to_string(),
                expressing_phenotype_wild: false,
                dominance: Some(0),
            },
            AlleleExpression {
                allele_name: "md299".to_string(),
                expressing_phenotype_name: "unc-18".to_string(),
                expressing_phenotype_wild: false,
                dominance: Some(0),
            },
            AlleleExpression {
                allele_name: "tmC5".to_string(),
                expressing_phenotype_name: "unc-31".to_string(),
                expressing_phenotype_wild: false,
                dominance: Some(0),
            },
            AlleleExpression {
                allele_name: "cn64".to_string(),
                expressing_phenotype_name: "rol".to_string(),
                expressing_phenotype_wild: false,
                dominance: Some(1),
            },
            AlleleExpression {
                allele_name: "oxEx2254".to_string(),
                expressing_phenotype_name: "Flp".to_string(),
                expressing_phenotype_wild: true,
                dominance: Some(2),
            },
            AlleleExpression {
                allele_name: "oxSi1168".to_string(),
                expressing_phenotype_name: "Flp".to_string(),
                expressing_phenotype_wild: true,
                dominance: Some(2),
            },
            AlleleExpression {
                allele_name: "oxIs12".to_string(),
                expressing_phenotype_name: "GFP-NLS".to_string(),
                expressing_phenotype_wild: false,
                dominance: Some(2),
            },
            AlleleExpression {
                allele_name: "oxTi75".to_string(),
                expressing_phenotype_name: "GFP-NLS".to_string(),
                expressing_phenotype_wild: false,
                dominance: Some(2),
            },
            AlleleExpression {
                allele_name: "ox1059".to_string(),
                expressing_phenotype_name: "lin-15A".to_string(),
                expressing_phenotype_wild: true,
                dominance: Some(2),
            },
            AlleleExpression {
                allele_name: "ox1059".to_string(),
                expressing_phenotype_name: "lin-15B".to_string(),
                expressing_phenotype_wild: true,
                dominance: Some(2),
            },
            AlleleExpression {
                allele_name: "oxIs644".to_string(),
                expressing_phenotype_name: "mCherry".to_string(),
                expressing_phenotype_wild: false,
                dominance: Some(2),
            },
            AlleleExpression {
                allele_name: "oxTi302".to_string(),
                expressing_phenotype_name: "mCherry".to_string(),
                expressing_phenotype_wild: false,
                dominance: Some(2),
            },
            AlleleExpression {
                allele_name: "oxEx2254".to_string(),
                expressing_phenotype_name: "mScarlet(coel)".to_string(),
                expressing_phenotype_wild: false,
                dominance: Some(2),
            },
            AlleleExpression {
                allele_name: "oxSi1168".to_string(),
                expressing_phenotype_name: "mScarlet(coel)".to_string(),
                expressing_phenotype_wild: false,
                dominance: Some(2),
            },
            AlleleExpression {
                allele_name: "oxEx2254".to_string(),
                expressing_phenotype_name: "NeoR".to_string(),
                expressing_phenotype_wild: false,
                dominance: Some(2),
            },
            AlleleExpression {
                allele_name: "oxSi1168".to_string(),
                expressing_phenotype_name: "NeoR".to_string(),
                expressing_phenotype_wild: false,
                dominance: Some(2),
            },
            AlleleExpression {
                allele_name: "oxEx219999".to_string(),
                expressing_phenotype_name: "paralyzed".to_string(),
                expressing_phenotype_wild: false,
                dominance: Some(2),
            },
            AlleleExpression {
                allele_name: "oxEx2254".to_string(),
                expressing_phenotype_name: "unc-119".to_string(),
                expressing_phenotype_wild: true,
                dominance: Some(2),
            },
            AlleleExpression {
                allele_name: "oxIs644".to_string(),
                expressing_phenotype_name: "unc-119".to_string(),
                expressing_phenotype_wild: false,
                dominance: Some(2),
            },
            AlleleExpression {
                allele_name: "oxSi1168".to_string(),
                expressing_phenotype_name: "unc-119".to_string(),
                expressing_phenotype_wild: true,
                dominance: Some(2),
            },
            AlleleExpression {
                allele_name: "oxTi302".to_string(),
                expressing_phenotype_name: "unc-119".to_string(),
                expressing_phenotype_wild: true,
                dominance: Some(2),
            },
            AlleleExpression {
                allele_name: "oxIs12".to_string(),
                expressing_phenotype_name: "unc-18".to_string(),
                expressing_phenotype_wild: true,
                dominance: Some(2),
            },
            AlleleExpression {
                allele_name: "oxTi75".to_string(),
                expressing_phenotype_name: "unc-18".to_string(),
                expressing_phenotype_wild: true,
                dominance: Some(2),
            },
            AlleleExpression {
                allele_name: "ox1059".to_string(),
                expressing_phenotype_name: "YFP(pharynx)".to_string(),
                expressing_phenotype_wild: false,
                dominance: Some(2),
            },
            AlleleExpression {
                allele_name: "oxIs644".to_string(),
                expressing_phenotype_name: "YFP(pharynx)".to_string(),
                expressing_phenotype_wild: false,
                dominance: Some(2),
            },
            AlleleExpression {
                allele_name: "tmC5".to_string(),
                expressing_phenotype_name: "YFP(pharynx)".to_string(),
                expressing_phenotype_wild: false,
                dominance: Some(2),
            },
        ]
    }
    pub fn get_variation_info() -> Vec<VariationInfo> {
        vec![
            VariationInfo {
                allele_name: "oxEx219999".to_string(),
                chromosome: None,
                phys_loc: None,
                gen_loc: None,
            },
            VariationInfo {
                allele_name: "oxEx2254".to_string(),
                chromosome: None,
                phys_loc: None,
                gen_loc: None,
            },
            VariationInfo {
                allele_name: "oxIs12".to_string(),
                chromosome: Some(Chromosome::X),
                phys_loc: None,
                gen_loc: None,
            },
            VariationInfo {
                allele_name: "oxIs644".to_string(),
                chromosome: None,
                phys_loc: None,
                gen_loc: None,
            },
            VariationInfo {
                allele_name: "oxSi1168".to_string(),
                chromosome: Some(Chromosome::Ii),
                phys_loc: Some(8420158),
                gen_loc: Some(0.77),
            },
            VariationInfo {
                allele_name: "oxTi302".to_string(),
                chromosome: Some(Chromosome::I),
                phys_loc: Some(10166146),
                gen_loc: Some(4.72),
            },
            VariationInfo {
                allele_name: "oxTi75".to_string(),
                chromosome: Some(Chromosome::Ii),
                phys_loc: None,
                gen_loc: Some(-1.46),
            },
            VariationInfo {
                allele_name: "tmC5".to_string(),
                chromosome: Some(Chromosome::Iv),
                phys_loc: None,
                gen_loc: None,
            },
        ]
    }
    pub fn get_filtered_variation_info() -> Vec<VariationInfo> {
        vec![
            VariationInfo {
                allele_name: "oxSi1168".to_string(),
                chromosome: Some(Chromosome::Ii),
                phys_loc: Some(8420158),
                gen_loc: Some(0.77),
            },
            VariationInfo {
                allele_name: "oxTi302".to_string(),
                chromosome: Some(Chromosome::I),
                phys_loc: Some(10166146),
                gen_loc: Some(4.72),
            },
        ]
    }
    pub fn get_filtered_variation_gen_loc_range() -> Vec<VariationInfo> {
        vec![
            VariationInfo {
                allele_name: "oxSi1168".to_string(),
                chromosome: Some(Chromosome::Ii),
                phys_loc: Some(8420158),
                gen_loc: Some(0.77),
            },
            VariationInfo {
                allele_name: "oxTi302".to_string(),
                chromosome: Some(Chromosome::I),
                phys_loc: Some(10166146),
                gen_loc: Some(4.72),
            },
        ]
    }
    pub fn get_expr_relations() -> Vec<ExpressionRelation> {
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
            ExpressionRelation {
                allele_name: "tmC5".to_string(),
                expressing_phenotype_name: "paralyzed".to_string(),
                expressing_phenotype_wild: false,
                altering_phenotype_name: None,
                altering_phenotype_wild: None,
                altering_condition: Some("Histamine".to_string()),
                is_suppressing: false,
            },
        ]
    }
    pub fn get_filtered_expr_relations() -> Vec<ExpressionRelation> {
        vec![
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
                allele_name: "tmC5".to_string(),
                expressing_phenotype_name: "paralyzed".to_string(),
                expressing_phenotype_wild: false,
                altering_phenotype_name: None,
                altering_phenotype_wild: None,
                altering_condition: Some("Histamine".to_string()),
                is_suppressing: false,
            },
        ]
    }
    pub fn get_filtered_expr_relations_many_and_clauses() -> Vec<ExpressionRelation> {
        vec![ExpressionRelation {
            allele_name: "tmC5".to_string(),
            expressing_phenotype_name: "paralyzed".to_string(),
            expressing_phenotype_wild: false,
            altering_phenotype_name: None,
            altering_phenotype_wild: None,
            altering_condition: Some("Histamine".to_string()),
            is_suppressing: false,
        }]
    }
    pub fn get_genes() -> Vec<Gene> {
        vec![
            Gene {
                systematic_name: "T14B4.7".to_string(),
                descriptive_name: Some("dpy-10".to_string()),
                chromosome: Some(Chromosome::Ii),
                phys_loc: Some(6710149),
                gen_loc: Some(0.0),
            },
            Gene {
                systematic_name: "C10C6.1".to_string(),
                descriptive_name: Some("kin-4".to_string()),
                chromosome: Some(Chromosome::Iv),
                phys_loc: Some(11425742),
                gen_loc: Some(4.98),
            },
            Gene {
                systematic_name: "ZK662.4".to_string(),
                descriptive_name: Some("lin-15B".to_string()),
                chromosome: Some(Chromosome::X),
                phys_loc: Some(15726123),
                gen_loc: Some(22.95),
            },
            Gene {
                systematic_name: "M142.1".to_string(),
                descriptive_name: Some("unc-119".to_string()),
                chromosome: Some(Chromosome::Iii),
                phys_loc: Some(10902641),
                gen_loc: Some(5.59),
            },
            Gene {
                systematic_name: "F27D9.1".to_string(),
                descriptive_name: Some("unc-18".to_string()),
                chromosome: Some(Chromosome::X),
                phys_loc: Some(7682896),
                gen_loc: Some(-1.35),
            },
        ]
    }
    pub fn get_filtered_genes() -> Vec<Gene> {
        vec![
            Gene {
                systematic_name: "C10C6.1".to_string(),
                descriptive_name: Some("kin-4".to_string()),
                chromosome: Some(Chromosome::Iv),
                phys_loc: Some(11425742),
                gen_loc: Some(4.98),
            },
            Gene {
                systematic_name: "ZK662.4".to_string(),
                descriptive_name: Some("lin-15B".to_string()),
                chromosome: Some(Chromosome::X),
                phys_loc: Some(15726123),
                gen_loc: Some(22.95),
            },
            Gene {
                systematic_name: "F27D9.1".to_string(),
                descriptive_name: Some("unc-18".to_string()),
                chromosome: Some(Chromosome::X),
                phys_loc: Some(7682896),
                gen_loc: Some(-1.35),
            },
        ]
    }
    pub fn get_filtered_genes_alternate_ordering() -> Vec<Gene> {
        vec![
            Gene {
                systematic_name: "C10C6.1".to_string(),
                descriptive_name: Some("kin-4".to_string()),
                chromosome: Some(Chromosome::Iv),
                phys_loc: Some(11425742),
                gen_loc: Some(4.98),
            },
            Gene {
                systematic_name: "F27D9.1".to_string(),
                descriptive_name: Some("unc-18".to_string()),
                chromosome: Some(Chromosome::X),
                phys_loc: Some(7682896),
                gen_loc: Some(-1.35),
            },
            Gene {
                systematic_name: "ZK662.4".to_string(),
                descriptive_name: Some("lin-15B".to_string()),
                chromosome: Some(Chromosome::X),
                phys_loc: Some(15726123),
                gen_loc: Some(22.95),
            },
        ]
    }
    pub fn get_filtered_genes_and_clause() -> Vec<Gene> {
        vec![Gene {
            systematic_name: "F27D9.1".to_string(),
            descriptive_name: Some("unc-18".to_string()),
            chromosome: Some(Chromosome::X),
            phys_loc: Some(7682896),
            gen_loc: Some(-1.35),
        }]
    }
    pub fn get_filtered_genes_and_or_clause() -> Vec<Gene> {
        vec![
            Gene {
                systematic_name: "ZK662.4".to_string(),
                descriptive_name: Some("lin-15B".to_string()),
                chromosome: Some(Chromosome::X),
                phys_loc: Some(15726123),
                gen_loc: Some(22.95),
            },
            Gene {
                systematic_name: "M142.1".to_string(),
                descriptive_name: Some("unc-119".to_string()),
                chromosome: Some(Chromosome::Iii),
                phys_loc: Some(10902641),
                gen_loc: Some(5.59),
            },
            Gene {
                systematic_name: "F27D9.1".to_string(),
                descriptive_name: Some("unc-18".to_string()),
                chromosome: Some(Chromosome::X),
                phys_loc: Some(7682896),
                gen_loc: Some(-1.35),
            },
        ]
    }

    pub fn get_conditions() -> Vec<Condition> {
        vec![
            Condition {
                name: "15C".to_string(),
                description: None,
                male_mating: Some(3),
                lethal: Some(false),
                female_sterile: Some(false),
                arrested: Some(false),
                maturation_days: Some(4.0),
            },
            Condition {
                name: "25C".to_string(),
                description: None,
                male_mating: Some(3),
                lethal: Some(false),
                female_sterile: Some(false),
                arrested: Some(false),
                maturation_days: Some(3.0),
            },
            Condition {
                name: "Histamine".to_string(),
                description: None,
                male_mating: Some(3),
                lethal: Some(false),
                female_sterile: Some(false),
                arrested: Some(false),
                maturation_days: Some(3.0),
            },
            Condition {
                name: "Tetracycline".to_string(),
                description: None,
                male_mating: Some(3),
                lethal: Some(false),
                female_sterile: Some(false),
                arrested: Some(false),
                maturation_days: Some(3.0),
            },
        ]
    }
    pub fn get_filtered_conditions() -> Vec<Condition> {
        vec![
            Condition {
                name: "25C".to_string(),
                description: None,
                male_mating: Some(3),
                lethal: Some(false),
                female_sterile: Some(false),
                arrested: Some(false),
                maturation_days: Some(3.0),
            },
            Condition {
                name: "Histamine".to_string(),
                description: None,
                male_mating: Some(3),
                lethal: Some(false),
                female_sterile: Some(false),
                arrested: Some(false),
                maturation_days: Some(3.0),
            },
            Condition {
                name: "Tetracycline".to_string(),
                description: None,
                male_mating: Some(3),
                lethal: Some(false),
                female_sterile: Some(false),
                arrested: Some(false),
                maturation_days: Some(3.0),
            },
        ]
    }
    pub fn get_filtered_conditions_not_3_maturation_days() -> Vec<Condition> {
        vec![Condition {
            name: "15C".to_string(),
            description: None,
            male_mating: Some(3),
            lethal: Some(false),
            female_sterile: Some(false),
            arrested: Some(false),
            maturation_days: Some(4.0),
        }]
    }
    pub fn get_altering_conditions() -> Vec<Condition> {
        vec![Condition {
            name: "25C".to_string(),
            description: None,
            male_mating: Some(3),
            lethal: Some(false),
            female_sterile: Some(false),
            arrested: Some(false),
            maturation_days: Some(3.0),
        }]
    }
    pub fn get_phenotypes() -> Vec<Phenotype> {
        vec![
            Phenotype {
                name: "Flp".to_string(),
                wild: true,
                short_name: "Flp(+)".to_string(),
                description: None,
                male_mating: Some(3),
                lethal: Some(false),
                female_sterile: Some(false),
                arrested: Some(false),
                maturation_days: Some(3.0),
            },
            Phenotype {
                name: "GFP".to_string(),
                wild: false,
                short_name: "GFP".to_string(),
                description: None,
                male_mating: Some(3),
                lethal: Some(false),
                female_sterile: Some(false),
                arrested: Some(false),
                maturation_days: Some(3.0),
            },
            Phenotype {
                name: "GFP(GABA)".to_string(),
                wild: false,
                short_name: "GFP(GABA)".to_string(),
                description: None,
                male_mating: Some(3),
                lethal: Some(false),
                female_sterile: Some(false),
                arrested: Some(false),
                maturation_days: Some(3.0),
            },
            Phenotype {
                name: "GFP-NLS".to_string(),
                wild: false,
                short_name: "GFP-NLS".to_string(),
                description: None,
                male_mating: Some(3),
                lethal: Some(false),
                female_sterile: Some(false),
                arrested: Some(false),
                maturation_days: Some(3.0),
            },
            Phenotype {
                name: "HygR".to_string(),
                wild: false,
                short_name: "HygR".to_string(),
                description: None,
                male_mating: Some(3),
                lethal: Some(false),
                female_sterile: Some(false),
                arrested: Some(false),
                maturation_days: Some(3.0),
            },
            Phenotype {
                name: "NeoR".to_string(),
                wild: false,
                short_name: "NeoR".to_string(),
                description: None,
                male_mating: Some(3),
                lethal: Some(false),
                female_sterile: Some(false),
                arrested: Some(false),
                maturation_days: Some(3.0),
            },
            Phenotype {
                name: "YFP(pharynx)".to_string(),
                wild: false,
                short_name: "YFP(pharynx)".to_string(),
                description: None,
                male_mating: Some(3),
                lethal: Some(false),
                female_sterile: Some(false),
                arrested: Some(false),
                maturation_days: Some(3.0),
            },
            Phenotype {
                name: "YFP-NLS".to_string(),
                wild: false,
                short_name: "YFP-NLS".to_string(),
                description: None,
                male_mating: Some(3),
                lethal: Some(false),
                female_sterile: Some(false),
                arrested: Some(false),
                maturation_days: Some(3.0),
            },
            Phenotype {
                name: "dpy-10".to_string(),
                wild: false,
                short_name: "dpy".to_string(),
                description: None,
                male_mating: Some(0),
                lethal: Some(false),
                female_sterile: Some(false),
                arrested: Some(false),
                maturation_days: Some(4.0),
            },
            Phenotype {
                name: "lethal".to_string(),
                wild: false,
                short_name: "lethal".to_string(),
                description: None,
                male_mating: Some(0),
                lethal: Some(true),
                female_sterile: Some(false),
                arrested: Some(false),
                maturation_days: None,
            },
            Phenotype {
                name: "lin-15A".to_string(),
                wild: false,
                short_name: "muv".to_string(),
                description: None,
                male_mating: Some(3),
                lethal: Some(false),
                female_sterile: Some(false),
                arrested: Some(false),
                maturation_days: Some(3.0),
            },
            Phenotype {
                name: "lin-15A".to_string(),
                wild: true,
                short_name: "muv".to_string(),
                description: None,
                male_mating: Some(3),
                lethal: Some(false),
                female_sterile: Some(false),
                arrested: Some(false),
                maturation_days: Some(3.0),
            },
            Phenotype {
                name: "lin-15B".to_string(),
                wild: false,
                short_name: "muv".to_string(),
                description: None,
                male_mating: None,
                lethal: None,
                female_sterile: None,
                arrested: None,
                maturation_days: None,
            },
            Phenotype {
                name: "lin-15B".to_string(),
                wild: true,
                short_name: "muv".to_string(),
                description: None,
                male_mating: None,
                lethal: None,
                female_sterile: None,
                arrested: None,
                maturation_days: None,
            },
            Phenotype {
                name: "mCherry".to_string(),
                wild: false,
                short_name: "mCherry".to_string(),
                description: None,
                male_mating: Some(3),
                lethal: Some(false),
                female_sterile: Some(false),
                arrested: Some(false),
                maturation_days: Some(3.0),
            },
            Phenotype {
                name: "mScarlet(coel)".to_string(),
                wild: false,
                short_name: "mScarlet(coel)".to_string(),
                description: None,
                male_mating: Some(3),
                lethal: Some(false),
                female_sterile: Some(false),
                arrested: Some(false),
                maturation_days: Some(3.0),
            },
            Phenotype {
                name: "mec-3".to_string(),
                wild: false,
                short_name: "mec".to_string(),
                description: None,
                male_mating: None,
                lethal: None,
                female_sterile: None,
                arrested: None,
                maturation_days: None,
            },
            Phenotype {
                name: "paralyzed".to_string(),
                wild: false,
                short_name: "paralyzed".to_string(),
                description: None,
                male_mating: Some(0),
                lethal: Some(false),
                female_sterile: Some(false),
                arrested: Some(false),
                maturation_days: None,
            },
            Phenotype {
                name: "rol".to_string(),
                wild: false,
                short_name: "rol".to_string(),
                description: None,
                male_mating: Some(0),
                lethal: Some(false),
                female_sterile: Some(false),
                arrested: Some(false),
                maturation_days: Some(3.0),
            },
            Phenotype {
                name: "unc-119".to_string(),
                wild: false,
                short_name: "unc".to_string(),
                description: None,
                male_mating: Some(0),
                lethal: Some(false),
                female_sterile: Some(false),
                arrested: Some(false),
                maturation_days: Some(4.0),
            },
            Phenotype {
                name: "unc-119".to_string(),
                wild: true,
                short_name: "unc".to_string(),
                description: None,
                male_mating: None,
                lethal: None,
                female_sterile: None,
                arrested: None,
                maturation_days: None,
            },
            Phenotype {
                name: "unc-18".to_string(),
                wild: false,
                short_name: "unc".to_string(),
                description: None,
                male_mating: Some(1),
                lethal: Some(false),
                female_sterile: Some(false),
                arrested: Some(false),
                maturation_days: Some(4.0),
            },
            Phenotype {
                name: "unc-18".to_string(),
                wild: true,
                short_name: "unc".to_string(),
                description: None,
                male_mating: None,
                lethal: None,
                female_sterile: None,
                arrested: None,
                maturation_days: None,
            },
            Phenotype {
                name: "unc-31".to_string(),
                wild: false,
                short_name: "unc".to_string(),
                description: None,
                male_mating: None,
                lethal: None,
                female_sterile: None,
                arrested: None,
                maturation_days: None,
            },
            Phenotype {
                name: "unc-5".to_string(),
                wild: false,
                short_name: "unc".to_string(),
                description: None,
                male_mating: Some(0),
                lethal: Some(false),
                female_sterile: Some(false),
                arrested: Some(false),
                maturation_days: Some(4.0),
            },
        ]
    }
    pub fn get_filtered_phenotypes() -> Vec<Phenotype> {
        vec![
            Phenotype {
                name: "lethal".to_string(),
                wild: false,
                short_name: "lethal".to_string(),
                description: None,
                male_mating: Some(0),
                lethal: Some(true),
                female_sterile: Some(false),
                arrested: Some(false),
                maturation_days: None,
            },
            Phenotype {
                name: "paralyzed".to_string(),
                wild: false,
                short_name: "paralyzed".to_string(),
                description: None,
                male_mating: Some(0),
                lethal: Some(false),
                female_sterile: Some(false),
                arrested: Some(false),
                maturation_days: None,
            },
        ]
    }

    pub fn get_phenotypes_maturation_less_equal_3() -> Vec<Phenotype> {
        vec![
            Phenotype {
                name: "Flp".to_string(),
                wild: true,
                short_name: "Flp(+)".to_string(),
                description: None,
                male_mating: Some(3),
                lethal: Some(false),
                female_sterile: Some(false),
                arrested: Some(false),
                maturation_days: Some(3.0),
            },
            Phenotype {
                name: "GFP".to_string(),
                wild: false,
                short_name: "GFP".to_string(),
                description: None,
                male_mating: Some(3),
                lethal: Some(false),
                female_sterile: Some(false),
                arrested: Some(false),
                maturation_days: Some(3.0),
            },
            Phenotype {
                name: "GFP(GABA)".to_string(),
                wild: false,
                short_name: "GFP(GABA)".to_string(),
                description: None,
                male_mating: Some(3),
                lethal: Some(false),
                female_sterile: Some(false),
                arrested: Some(false),
                maturation_days: Some(3.0),
            },
            Phenotype {
                name: "GFP-NLS".to_string(),
                wild: false,
                short_name: "GFP-NLS".to_string(),
                description: None,
                male_mating: Some(3),
                lethal: Some(false),
                female_sterile: Some(false),
                arrested: Some(false),
                maturation_days: Some(3.0),
            },
            Phenotype {
                name: "HygR".to_string(),
                wild: false,
                short_name: "HygR".to_string(),
                description: None,
                male_mating: Some(3),
                lethal: Some(false),
                female_sterile: Some(false),
                arrested: Some(false),
                maturation_days: Some(3.0),
            },
            Phenotype {
                name: "lin-15A".to_string(),
                wild: false,
                short_name: "muv".to_string(),
                description: None,
                male_mating: Some(3),
                lethal: Some(false),
                female_sterile: Some(false),
                arrested: Some(false),
                maturation_days: Some(3.0),
            },
            Phenotype {
                name: "lin-15A".to_string(),
                wild: true,
                short_name: "muv".to_string(),
                description: None,
                male_mating: Some(3),
                lethal: Some(false),
                female_sterile: Some(false),
                arrested: Some(false),
                maturation_days: Some(3.0),
            },
            Phenotype {
                name: "mCherry".to_string(),
                wild: false,
                short_name: "mCherry".to_string(),
                description: None,
                male_mating: Some(3),
                lethal: Some(false),
                female_sterile: Some(false),
                arrested: Some(false),
                maturation_days: Some(3.0),
            },
            Phenotype {
                name: "mScarlet(coel)".to_string(),
                wild: false,
                short_name: "mScarlet(coel)".to_string(),
                description: None,
                male_mating: Some(3),
                lethal: Some(false),
                female_sterile: Some(false),
                arrested: Some(false),
                maturation_days: Some(3.0),
            },
            Phenotype {
                name: "NeoR".to_string(),
                wild: false,
                short_name: "NeoR".to_string(),
                description: None,
                male_mating: Some(3),
                lethal: Some(false),
                female_sterile: Some(false),
                arrested: Some(false),
                maturation_days: Some(3.0),
            },
            Phenotype {
                name: "rol".to_string(),
                wild: false,
                short_name: "rol".to_string(),
                description: None,
                male_mating: Some(0),
                lethal: Some(false),
                female_sterile: Some(false),
                arrested: Some(false),
                maturation_days: Some(3.0),
            },
            Phenotype {
                name: "YFP(pharynx)".to_string(),
                wild: false,
                short_name: "YFP(pharynx)".to_string(),
                description: None,
                male_mating: Some(3),
                lethal: Some(false),
                female_sterile: Some(false),
                arrested: Some(false),
                maturation_days: Some(3.0),
            },
            Phenotype {
                name: "YFP-NLS".to_string(),
                wild: false,
                short_name: "YFP-NLS".to_string(),
                description: None,
                male_mating: Some(3),
                lethal: Some(false),
                female_sterile: Some(false),
                arrested: Some(false),
                maturation_days: Some(3.0),
            },
        ]
    }
    pub fn get_altering_phenotypes() -> Vec<Phenotype> {
        vec![Phenotype {
            name: "Flp".to_string(),
            wild: true,
            short_name: "Flp(+)".to_string(),
            description: None,
            male_mating: Some(3),
            lethal: Some(false),
            female_sterile: Some(false),
            arrested: Some(false),
            maturation_days: Some(3.0),
        }]
    }
}
