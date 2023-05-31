use crate::models::allele_expr::AlleleExpression;

pub fn get_allele_exprs() -> Vec<AlleleExpression> {
    vec![
        AlleleExpression {
            allele_name: "cn64".to_string(),
            expressing_phenotype_name: "dpy-10".to_string(),
            expressing_phenotype_wild: false,
            dominance: 0,
        },
        AlleleExpression {
            allele_name: "cn64".to_string(),
            expressing_phenotype_name: "rol".to_string(),
            expressing_phenotype_wild: false,
            dominance: 1,
        },
        AlleleExpression {
            allele_name: "eT1(III)".to_string(),
            expressing_phenotype_name: "eT1IIIhet_aneuploid".to_string(),
            expressing_phenotype_wild: false,
            dominance: 1,
        },
        AlleleExpression {
            allele_name: "eT1(III)".to_string(),
            expressing_phenotype_name: "eT1IIIhomozygote_aneuploid".to_string(),
            expressing_phenotype_wild: false,
            dominance: 0,
        },
        AlleleExpression {
            allele_name: "eT1(V)".to_string(),
            expressing_phenotype_name: "eT1Vhet_aneuploid".to_string(),
            expressing_phenotype_wild: false,
            dominance: 1,
        },
        AlleleExpression {
            allele_name: "eT1(V)".to_string(),
            expressing_phenotype_name: "eT1Vhomozygote_aneuploid".to_string(),
            expressing_phenotype_wild: false,
            dominance: 0,
        },
        AlleleExpression {
            allele_name: "ed3".to_string(),
            expressing_phenotype_name: "unc-119".to_string(),
            expressing_phenotype_wild: false,
            dominance: 0,
        },
        AlleleExpression {
            allele_name: "md299".to_string(),
            expressing_phenotype_name: "unc-18".to_string(),
            expressing_phenotype_wild: false,
            dominance: 0,
        },
        AlleleExpression {
            allele_name: "n765".to_string(),
            expressing_phenotype_name: "lin-15B".to_string(),
            expressing_phenotype_wild: false,
            dominance: 0,
        },
        AlleleExpression {
            allele_name: "ox1059".to_string(),
            expressing_phenotype_name: "YFP(pharynx)".to_string(),
            expressing_phenotype_wild: false,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "ox1059".to_string(),
            expressing_phenotype_name: "lin-15A".to_string(),
            expressing_phenotype_wild: true,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "ox1059".to_string(),
            expressing_phenotype_name: "lin-15B".to_string(),
            expressing_phenotype_wild: true,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "oxEx219999".to_string(),
            expressing_phenotype_name: "paralyzed".to_string(),
            expressing_phenotype_wild: false,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "oxEx2254".to_string(),
            expressing_phenotype_name: "Flp".to_string(),
            expressing_phenotype_wild: true,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "oxEx2254".to_string(),
            expressing_phenotype_name: "NeoR".to_string(),
            expressing_phenotype_wild: false,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "oxEx2254".to_string(),
            expressing_phenotype_name: "mScarlet(coel)".to_string(),
            expressing_phenotype_wild: false,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "oxEx2254".to_string(),
            expressing_phenotype_name: "unc-119".to_string(),
            expressing_phenotype_wild: true,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "oxIs12".to_string(),
            expressing_phenotype_name: "GFP-NLS".to_string(),
            expressing_phenotype_wild: false,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "oxIs12".to_string(),
            expressing_phenotype_name: "unc-18".to_string(),
            expressing_phenotype_wild: true,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "oxIs644".to_string(),
            expressing_phenotype_name: "YFP(pharynx)".to_string(),
            expressing_phenotype_wild: false,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "oxIs644".to_string(),
            expressing_phenotype_name: "mCherry".to_string(),
            expressing_phenotype_wild: false,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "oxIs644".to_string(),
            expressing_phenotype_name: "unc-119".to_string(),
            expressing_phenotype_wild: false,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "oxSi1168".to_string(),
            expressing_phenotype_name: "Flp".to_string(),
            expressing_phenotype_wild: true,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "oxSi1168".to_string(),
            expressing_phenotype_name: "NeoR".to_string(),
            expressing_phenotype_wild: false,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "oxSi1168".to_string(),
            expressing_phenotype_name: "mScarlet(coel)".to_string(),
            expressing_phenotype_wild: false,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "oxSi1168".to_string(),
            expressing_phenotype_name: "unc-119".to_string(),
            expressing_phenotype_wild: true,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "oxTi302".to_string(),
            expressing_phenotype_name: "mCherry".to_string(),
            expressing_phenotype_wild: false,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "oxTi302".to_string(),
            expressing_phenotype_name: "unc-119".to_string(),
            expressing_phenotype_wild: true,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "oxTi75".to_string(),
            expressing_phenotype_name: "GFP-NLS".to_string(),
            expressing_phenotype_wild: false,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "oxTi75".to_string(),
            expressing_phenotype_name: "unc-18".to_string(),
            expressing_phenotype_wild: true,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "tmC5".to_string(),
            expressing_phenotype_name: "mec-3".to_string(),
            expressing_phenotype_wild: false,
            dominance: 0,
        },
        AlleleExpression {
            allele_name: "tmC5".to_string(),
            expressing_phenotype_name: "unc-31".to_string(),
            expressing_phenotype_wild: false,
            dominance: 0,
        },
        AlleleExpression {
            allele_name: "tmC5[F36H1.3(tmIs1220)]".to_string(),
            expressing_phenotype_name: "YFP(pharynx)".to_string(),
            expressing_phenotype_wild: false,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "tmC5[F36H1.3(tmIs1220)]".to_string(),
            expressing_phenotype_name: "mec-3".to_string(),
            expressing_phenotype_wild: false,
            dominance: 0,
        },
        AlleleExpression {
            allele_name: "tmC5[F36H1.3(tmIs1220)]".to_string(),
            expressing_phenotype_name: "unc-31".to_string(),
            expressing_phenotype_wild: false,
            dominance: 0,
        },
    ]
}
pub fn get_filtered_allele_exprs() -> Vec<AlleleExpression> {
    vec![
        AlleleExpression {
            allele_name: "cn64".to_string(),
            expressing_phenotype_name: "dpy-10".to_string(),
            expressing_phenotype_wild: false,
            dominance: 0,
        },
        AlleleExpression {
            allele_name: "cn64".to_string(),
            expressing_phenotype_name: "rol".to_string(),
            expressing_phenotype_wild: false,
            dominance: 1,
        },
    ]
}
pub fn get_wild_unc119_allele_exprs() -> Vec<AlleleExpression> {
    vec![
        AlleleExpression {
            allele_name: "oxEx2254".to_string(),
            expressing_phenotype_name: "unc-119".to_string(),
            expressing_phenotype_wild: true,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "oxSi1168".to_string(),
            expressing_phenotype_name: "unc-119".to_string(),
            expressing_phenotype_wild: true,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "oxTi302".to_string(),
            expressing_phenotype_name: "unc-119".to_string(),
            expressing_phenotype_wild: true,
            dominance: 2,
        },
    ]
}
pub fn get_allele_exprs_multi_order_by() -> Vec<AlleleExpression> {
    vec![
        AlleleExpression {
            allele_name: "cn64".to_string(),
            expressing_phenotype_name: "dpy-10".to_string(),
            expressing_phenotype_wild: false,
            dominance: 0,
        },
        AlleleExpression {
            allele_name: "eT1(III)".to_string(),
            expressing_phenotype_name: "eT1IIIhomozygote_aneuploid".to_string(),
            expressing_phenotype_wild: false,
            dominance: 0,
        },
        AlleleExpression {
            allele_name: "eT1(V)".to_string(),
            expressing_phenotype_name: "eT1Vhomozygote_aneuploid".to_string(),
            expressing_phenotype_wild: false,
            dominance: 0,
        },
        AlleleExpression {
            allele_name: "n765".to_string(),
            expressing_phenotype_name: "lin-15B".to_string(),
            expressing_phenotype_wild: false,
            dominance: 0,
        },
        AlleleExpression {
            allele_name: "tmC5".to_string(),
            expressing_phenotype_name: "mec-3".to_string(),
            expressing_phenotype_wild: false,
            dominance: 0,
        },
        AlleleExpression {
            allele_name: "tmC5[F36H1.3(tmIs1220)]".to_string(),
            expressing_phenotype_name: "mec-3".to_string(),
            expressing_phenotype_wild: false,
            dominance: 0,
        },
        AlleleExpression {
            allele_name: "ed3".to_string(),
            expressing_phenotype_name: "unc-119".to_string(),
            expressing_phenotype_wild: false,
            dominance: 0,
        },
        AlleleExpression {
            allele_name: "md299".to_string(),
            expressing_phenotype_name: "unc-18".to_string(),
            expressing_phenotype_wild: false,
            dominance: 0,
        },
        AlleleExpression {
            allele_name: "tmC5".to_string(),
            expressing_phenotype_name: "unc-31".to_string(),
            expressing_phenotype_wild: false,
            dominance: 0,
        },
        AlleleExpression {
            allele_name: "tmC5[F36H1.3(tmIs1220)]".to_string(),
            expressing_phenotype_name: "unc-31".to_string(),
            expressing_phenotype_wild: false,
            dominance: 0,
        },
        AlleleExpression {
            allele_name: "eT1(III)".to_string(),
            expressing_phenotype_name: "eT1IIIhet_aneuploid".to_string(),
            expressing_phenotype_wild: false,
            dominance: 1,
        },
        AlleleExpression {
            allele_name: "eT1(V)".to_string(),
            expressing_phenotype_name: "eT1Vhet_aneuploid".to_string(),
            expressing_phenotype_wild: false,
            dominance: 1,
        },
        AlleleExpression {
            allele_name: "cn64".to_string(),
            expressing_phenotype_name: "rol".to_string(),
            expressing_phenotype_wild: false,
            dominance: 1,
        },
        AlleleExpression {
            allele_name: "oxEx2254".to_string(),
            expressing_phenotype_name: "Flp".to_string(),
            expressing_phenotype_wild: true,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "oxSi1168".to_string(),
            expressing_phenotype_name: "Flp".to_string(),
            expressing_phenotype_wild: true,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "oxIs12".to_string(),
            expressing_phenotype_name: "GFP-NLS".to_string(),
            expressing_phenotype_wild: false,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "oxTi75".to_string(),
            expressing_phenotype_name: "GFP-NLS".to_string(),
            expressing_phenotype_wild: false,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "ox1059".to_string(),
            expressing_phenotype_name: "lin-15A".to_string(),
            expressing_phenotype_wild: true,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "ox1059".to_string(),
            expressing_phenotype_name: "lin-15B".to_string(),
            expressing_phenotype_wild: true,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "oxIs644".to_string(),
            expressing_phenotype_name: "mCherry".to_string(),
            expressing_phenotype_wild: false,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "oxTi302".to_string(),
            expressing_phenotype_name: "mCherry".to_string(),
            expressing_phenotype_wild: false,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "oxEx2254".to_string(),
            expressing_phenotype_name: "mScarlet(coel)".to_string(),
            expressing_phenotype_wild: false,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "oxSi1168".to_string(),
            expressing_phenotype_name: "mScarlet(coel)".to_string(),
            expressing_phenotype_wild: false,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "oxEx2254".to_string(),
            expressing_phenotype_name: "NeoR".to_string(),
            expressing_phenotype_wild: false,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "oxSi1168".to_string(),
            expressing_phenotype_name: "NeoR".to_string(),
            expressing_phenotype_wild: false,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "oxEx219999".to_string(),
            expressing_phenotype_name: "paralyzed".to_string(),
            expressing_phenotype_wild: false,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "oxEx2254".to_string(),
            expressing_phenotype_name: "unc-119".to_string(),
            expressing_phenotype_wild: true,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "oxIs644".to_string(),
            expressing_phenotype_name: "unc-119".to_string(),
            expressing_phenotype_wild: false,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "oxSi1168".to_string(),
            expressing_phenotype_name: "unc-119".to_string(),
            expressing_phenotype_wild: true,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "oxTi302".to_string(),
            expressing_phenotype_name: "unc-119".to_string(),
            expressing_phenotype_wild: true,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "oxIs12".to_string(),
            expressing_phenotype_name: "unc-18".to_string(),
            expressing_phenotype_wild: true,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "oxTi75".to_string(),
            expressing_phenotype_name: "unc-18".to_string(),
            expressing_phenotype_wild: true,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "ox1059".to_string(),
            expressing_phenotype_name: "YFP(pharynx)".to_string(),
            expressing_phenotype_wild: false,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "oxIs644".to_string(),
            expressing_phenotype_name: "YFP(pharynx)".to_string(),
            expressing_phenotype_wild: false,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "tmC5[F36H1.3(tmIs1220)]".to_string(),
            expressing_phenotype_name: "YFP(pharynx)".to_string(),
            expressing_phenotype_wild: false,
            dominance: 2,
        },
    ]
}
pub fn search_allele_exprs_by_allele_name() -> Vec<AlleleExpression> {
    vec![
        AlleleExpression {
            allele_name: "md299".to_string(),
            expressing_phenotype_name: "unc-18".to_string(),
            expressing_phenotype_wild: false,
            dominance: 0,
        },
        AlleleExpression {
            allele_name: "oxEx219999".to_string(),
            expressing_phenotype_name: "paralyzed".to_string(),
            expressing_phenotype_wild: false,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "oxEx2254".to_string(),
            expressing_phenotype_name: "Flp".to_string(),
            expressing_phenotype_wild: true,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "oxEx2254".to_string(),
            expressing_phenotype_name: "mScarlet(coel)".to_string(),
            expressing_phenotype_wild: false,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "oxEx2254".to_string(),
            expressing_phenotype_name: "NeoR".to_string(),
            expressing_phenotype_wild: false,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "oxEx2254".to_string(),
            expressing_phenotype_name: "unc-119".to_string(),
            expressing_phenotype_wild: true,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "oxIs12".to_string(),
            expressing_phenotype_name: "GFP-NLS".to_string(),
            expressing_phenotype_wild: false,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "oxIs12".to_string(),
            expressing_phenotype_name: "unc-18".to_string(),
            expressing_phenotype_wild: true,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "oxTi302".to_string(),
            expressing_phenotype_name: "mCherry".to_string(),
            expressing_phenotype_wild: false,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "oxTi302".to_string(),
            expressing_phenotype_name: "unc-119".to_string(),
            expressing_phenotype_wild: true,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "tmC5[F36H1.3(tmIs1220)]".to_string(),
            expressing_phenotype_name: "mec-3".to_string(),
            expressing_phenotype_wild: false,
            dominance: 0,
        },
        AlleleExpression {
            allele_name: "tmC5[F36H1.3(tmIs1220)]".to_string(),
            expressing_phenotype_name: "unc-31".to_string(),
            expressing_phenotype_wild: false,
            dominance: 0,
        },
        AlleleExpression {
            allele_name: "tmC5[F36H1.3(tmIs1220)]".to_string(),
            expressing_phenotype_name: "YFP(pharynx)".to_string(),
            expressing_phenotype_wild: false,
            dominance: 2,
        },
    ]
}
pub fn search_allele_exprs_by_phenotype_name() -> Vec<AlleleExpression> {
    vec![
        AlleleExpression {
            allele_name: "ed3".to_string(),
            expressing_phenotype_name: "unc-119".to_string(),
            expressing_phenotype_wild: false,
            dominance: 0,
        },
        AlleleExpression {
            allele_name: "oxEx2254".to_string(),
            expressing_phenotype_name: "unc-119".to_string(),
            expressing_phenotype_wild: true,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "oxIs644".to_string(),
            expressing_phenotype_name: "unc-119".to_string(),
            expressing_phenotype_wild: false,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "oxSi1168".to_string(),
            expressing_phenotype_name: "unc-119".to_string(),
            expressing_phenotype_wild: true,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "oxTi302".to_string(),
            expressing_phenotype_name: "unc-119".to_string(),
            expressing_phenotype_wild: true,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "md299".to_string(),
            expressing_phenotype_name: "unc-18".to_string(),
            expressing_phenotype_wild: false,
            dominance: 0,
        },
        AlleleExpression {
            allele_name: "oxIs12".to_string(),
            expressing_phenotype_name: "unc-18".to_string(),
            expressing_phenotype_wild: true,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "oxTi75".to_string(),
            expressing_phenotype_name: "unc-18".to_string(),
            expressing_phenotype_wild: true,
            dominance: 2,
        },
        AlleleExpression {
            allele_name: "tmC5".to_string(),
            expressing_phenotype_name: "unc-31".to_string(),
            expressing_phenotype_wild: false,
            dominance: 0,
        },
        AlleleExpression {
            allele_name: "tmC5[F36H1.3(tmIs1220)]".to_string(),
            expressing_phenotype_name: "unc-31".to_string(),
            expressing_phenotype_wild: false,
            dominance: 0,
        },
    ]
}
