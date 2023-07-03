use crate::models::{chromosome_name::ChromosomeName, variation::Variation};

pub fn get_variations() -> Vec<Variation> {
    vec![
        Variation {
            allele_name: "eT1(III)".to_string(),
            chromosome: Some(ChromosomeName::Iii),
            phys_loc: None,
            gen_loc: None,
            recomb_suppressor: Some((8192365, 13783733)),
        },
        Variation {
            allele_name: "eT1(V)".to_string(),
            chromosome: Some(ChromosomeName::V),
            phys_loc: None,
            gen_loc: None,
            recomb_suppressor: Some((1, 8934697)),
        },
        Variation {
            allele_name: "oxEx219999".to_string(),
            chromosome: None,
            phys_loc: None,
            gen_loc: None,
            recomb_suppressor: None,
        },
        Variation {
            allele_name: "oxEx2254".to_string(),
            chromosome: None,
            phys_loc: None,
            gen_loc: None,
            recomb_suppressor: None,
        },
        Variation {
            allele_name: "oxIs12".to_string(),
            chromosome: Some(ChromosomeName::X),
            phys_loc: None,
            gen_loc: None,
            recomb_suppressor: None,
        },
        Variation {
            allele_name: "oxIs363".to_string(),
            chromosome: Some(ChromosomeName::Iv),
            phys_loc: None,
            gen_loc: None,
            recomb_suppressor: None,
        },
        Variation {
            allele_name: "oxIs644".to_string(),
            chromosome: None,
            phys_loc: None,
            gen_loc: None,
            recomb_suppressor: None,
        },
        Variation {
            allele_name: "oxSi1168".to_string(),
            chromosome: Some(ChromosomeName::Ii),
            phys_loc: Some(8420158),
            gen_loc: Some(0.77),
            recomb_suppressor: None,
        },
        Variation {
            allele_name: "oxTi302".to_string(),
            chromosome: Some(ChromosomeName::I),
            phys_loc: Some(10166146),
            gen_loc: Some(4.72),
            recomb_suppressor: None,
        },
        Variation {
            allele_name: "oxTi75".to_string(),
            chromosome: Some(ChromosomeName::Ii),
            phys_loc: None,
            gen_loc: Some(-1.46),
            recomb_suppressor: None,
        },
        Variation {
            allele_name: "tmC5".to_string(),
            chromosome: Some(ChromosomeName::Iv),
            phys_loc: None,
            gen_loc: None,
            recomb_suppressor: Some((6600000, 12500000)),
        },
        Variation {
            allele_name: "tmC5[F36H1.3(tmIs1220)]".to_string(),
            chromosome: Some(ChromosomeName::Iv),
            phys_loc: None,
            gen_loc: None,
            recomb_suppressor: Some((6600000, 12500000)),
        },
    ]
}
pub fn get_filtered_variations() -> Vec<Variation> {
    vec![
        Variation {
            allele_name: "oxSi1168".to_string(),
            chromosome: Some(ChromosomeName::Ii),
            phys_loc: Some(8420158),
            gen_loc: Some(0.77),
            recomb_suppressor: None,
        },
        Variation {
            allele_name: "oxTi302".to_string(),
            chromosome: Some(ChromosomeName::I),
            phys_loc: Some(10166146),
            gen_loc: Some(4.72),
            recomb_suppressor: None,
        },
    ]
}
pub fn get_filtered_variations_gen_loc_range() -> Vec<Variation> {
    vec![
        Variation {
            allele_name: "oxSi1168".to_string(),
            chromosome: Some(ChromosomeName::Ii),
            phys_loc: Some(8420158),
            gen_loc: Some(0.77),
            recomb_suppressor: None,
        },
        Variation {
            allele_name: "oxTi302".to_string(),
            chromosome: Some(ChromosomeName::I),
            phys_loc: Some(10166146),
            gen_loc: Some(4.72),
            recomb_suppressor: None,
        },
    ]
}
pub fn search_variation_by_allele_name() -> Vec<Variation> {
    vec![
        Variation {
            allele_name: "oxIs12".to_string(),
            chromosome: Some(ChromosomeName::X),
            phys_loc: None,
            gen_loc: None,
            recomb_suppressor: None,
        },
        Variation {
            allele_name: "oxIs363".to_string(),
            chromosome: Some(ChromosomeName::Iv),
            phys_loc: None,
            gen_loc: None,
            recomb_suppressor: None,
        },
        Variation {
            allele_name: "oxIs644".to_string(),
            chromosome: None,
            phys_loc: None,
            gen_loc: None,
            recomb_suppressor: None,
        },
        Variation {
            allele_name: "tmC5[F36H1.3(tmIs1220)]".to_string(),
            chromosome: Some(ChromosomeName::Iv),
            phys_loc: None,
            gen_loc: None,
            recomb_suppressor: Some((6600000, 12500000)),
        },
    ]
}
