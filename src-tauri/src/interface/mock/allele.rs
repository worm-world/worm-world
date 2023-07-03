use crate::models::{allele::Allele, chromosome_name::ChromosomeName, gene::Gene};

pub fn get_alleles() -> Vec<Allele> {
    vec![
        Allele {
            name: "cn64".to_string(),
            contents: None,
            systematic_gene_name: Some("T14B4.7".to_string()),
            variation_name: None,
        },
        Allele {
            name: "e128".to_string(),
            contents: None,
            systematic_gene_name: Some("T14B4.7".to_string()),
            variation_name: None,
        },
        Allele {
            name: "e1282".to_string(),
            contents: None,
            systematic_gene_name: Some("T22B3.1".to_string()),
            variation_name: None,
        },
        Allele {
            name: "e138".to_string(),
            contents: None,
            systematic_gene_name: Some("F57H12.2".to_string()),
            variation_name: None,
        },
        Allele {
            name: "eT1(III)".to_string(),
            contents: Some("[unc-36(e873)]".to_string()),
            systematic_gene_name: None,
            variation_name: Some("eT1(III)".to_string()),
        },
        Allele {
            name: "eT1(V)".to_string(),
            contents: None,
            systematic_gene_name: None,
            variation_name: Some("eT1(V)".to_string()),
        },
        Allele {
            name: "ed3".to_string(),
            contents: None,
            systematic_gene_name: Some("M142.1".to_string()),
            variation_name: None,
        },
        Allele {
            name: "hd43".to_string(),
            contents: None,
            systematic_gene_name: Some("F56H11.1".to_string()),
            variation_name: None,
        },
        Allele {
            name: "md299".to_string(),
            contents: None,
            systematic_gene_name: Some("F27D9.1".to_string()),
            variation_name: None,
        },
        Allele {
            name: "n744".to_string(),
            contents: None,
            systematic_gene_name: Some("ZK662.4".to_string()),
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
            name: "oxIs363".to_string(),
            contents: Some("[unc-122p::GFP + unc-119(+)]".to_string()),
            systematic_gene_name: None,
            variation_name: Some("oxIs363".to_string()),
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
            contents: None,
            systematic_gene_name: None,
            variation_name: Some("tmC5".to_string()),
        },
        Allele {
            name: "tmC5[F36H1.3(tmIs1220)]".to_string(),
            contents: Some("[Pmyo-2::YFP]".to_string()),
            systematic_gene_name: None,
            variation_name: Some("tmC5[F36H1.3(tmIs1220)]".to_string()),
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
            name: "e128".to_string(),
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
pub fn get_filtered_alleles_with_gene_filter() -> Vec<(Allele, Gene)> {
    vec![
        (
            Allele {
                name: "ed3".to_string(),
                contents: None,
                systematic_gene_name: Some("M142.1".to_string()),
                variation_name: None,
            },
            Gene {
                systematic_name: "M142.1".to_string(),
                descriptive_name: Some("unc-119".to_string()),
                chromosome: Some(ChromosomeName::Iii),
                phys_loc: Some(10902641),
                gen_loc: Some(5.59),
                recomb_suppressor: None,
            },
        ),
        (
            Allele {
                name: "md299".to_string(),
                contents: None,
                systematic_gene_name: Some("F27D9.1".to_string()),
                variation_name: None,
            },
            Gene {
                systematic_name: "F27D9.1".to_string(),
                descriptive_name: Some("unc-18".to_string()),
                chromosome: Some(ChromosomeName::X),
                phys_loc: Some(7682896),
                gen_loc: Some(-1.35),
                recomb_suppressor: None,
            },
        ),
    ]
}

pub fn get_filtered_alleles_with_no_gene_filter() -> Vec<(Allele, Gene)> {
    vec![(
        Allele {
            name: "ed3".to_string(),
            contents: None,
            systematic_gene_name: Some("M142.1".to_string()),
            variation_name: None,
        },
        Gene {
            systematic_name: "M142.1".to_string(),
            descriptive_name: Some("unc-119".to_string()),
            chromosome: Some(ChromosomeName::Iii),
            phys_loc: Some(10902641),
            gen_loc: Some(5.59),
            recomb_suppressor: None,
        },
    )]
}

pub fn get_filtered_alleles_and_filtered_genes_no_allele_filter() -> Vec<(Allele, Gene)> {
    vec![(
        Allele {
            name: "ed3".to_string(),
            contents: None,
            systematic_gene_name: Some("M142.1".to_string()),
            variation_name: None,
        },
        Gene {
            systematic_name: "M142.1".to_string(),
            descriptive_name: Some("unc-119".to_string()),
            chromosome: Some(ChromosomeName::Iii),
            phys_loc: Some(10902641),
            gen_loc: Some(5.59),
            recomb_suppressor: None,
        },
    )]
}

pub fn get_alleles_with_genes() -> Vec<(Allele, Gene)> {
    vec![
        (
            Allele {
                name: "cn64".to_string(),
                contents: None,
                systematic_gene_name: Some("T14B4.7".to_string()),
                variation_name: None,
            },
            Gene {
                systematic_name: "T14B4.7".to_string(),
                descriptive_name: Some("dpy-10".to_string()),
                chromosome: Some(ChromosomeName::Ii),
                phys_loc: Some(6710149),
                gen_loc: Some(0.0),
                recomb_suppressor: None,
            },
        ),
        (
            Allele {
                name: "e128".to_string(),
                contents: None,
                systematic_gene_name: Some("T14B4.7".to_string()),
                variation_name: None,
            },
            Gene {
                systematic_name: "T14B4.7".to_string(),
                descriptive_name: Some("dpy-10".to_string()),
                chromosome: Some(ChromosomeName::Ii),
                phys_loc: Some(6710149),
                gen_loc: Some(0.0),
                recomb_suppressor: None,
            },
        ),
        (
            Allele {
                name: "e1282".to_string(),
                contents: None,
                systematic_gene_name: Some("T22B3.1".to_string()),
                variation_name: None,
            },
            Gene {
                systematic_name: "T22B3.1".to_string(),
                descriptive_name: Some("dpy-20".to_string()),
                chromosome: Some(ChromosomeName::Iv),
                phys_loc: Some(11696430),
                gen_loc: Some(5.22),
                recomb_suppressor: None,
            },
        ),
        (
            Allele {
                name: "e138".to_string(),
                contents: None,
                systematic_gene_name: Some("F57H12.2".to_string()),
                variation_name: None,
            },
            Gene {
                systematic_name: "F57H12.2".to_string(),
                descriptive_name: Some("unc-24".to_string()),
                chromosome: Some(ChromosomeName::Iv),
                phys_loc: Some(7979870),
                gen_loc: Some(3.51),
                recomb_suppressor: None,
            },
        ),
        (
            Allele {
                name: "eT1(III)".to_string(),
                contents: Some("[unc-36(e873)]".to_string()),
                systematic_gene_name: None,
                variation_name: Some("eT1(III)".to_string()),
            },
            Gene {
                systematic_name: "".to_string(),
                descriptive_name: None,
                chromosome: None,
                phys_loc: None,
                gen_loc: None,
                recomb_suppressor: None,
            },
        ),
        (
            Allele {
                name: "eT1(V)".to_string(),
                contents: None,
                systematic_gene_name: None,
                variation_name: Some("eT1(V)".to_string()),
            },
            Gene {
                systematic_name: "".to_string(),
                descriptive_name: None,
                chromosome: None,
                phys_loc: None,
                gen_loc: None,
                recomb_suppressor: None,
            },
        ),
        (
            Allele {
                name: "ed3".to_string(),
                contents: None,
                systematic_gene_name: Some("M142.1".to_string()),
                variation_name: None,
            },
            Gene {
                systematic_name: "M142.1".to_string(),
                descriptive_name: Some("unc-119".to_string()),
                chromosome: Some(ChromosomeName::Iii),
                phys_loc: Some(10902641),
                gen_loc: Some(5.59),
                recomb_suppressor: None,
            },
        ),
        (
            Allele {
                name: "hd43".to_string(),
                contents: None,
                systematic_gene_name: Some("F56H11.1".to_string()),
                variation_name: None,
            },
            Gene {
                systematic_name: "F56H11.1".to_string(),
                descriptive_name: Some("fbl-1".to_string()),
                chromosome: Some(ChromosomeName::Iv),
                phys_loc: Some(9540806),
                gen_loc: Some(4.3),
                recomb_suppressor: None,
            },
        ),
        (
            Allele {
                name: "md299".to_string(),
                contents: None,
                systematic_gene_name: Some("F27D9.1".to_string()),
                variation_name: None,
            },
            Gene {
                systematic_name: "F27D9.1".to_string(),
                descriptive_name: Some("unc-18".to_string()),
                chromosome: Some(ChromosomeName::X),
                phys_loc: Some(7682896),
                gen_loc: Some(-1.35),
                recomb_suppressor: None,
            },
        ),
        (
            Allele {
                name: "n744".to_string(),
                contents: None,
                systematic_gene_name: Some("ZK662.4".to_string()),
                variation_name: None,
            },
            Gene {
                systematic_name: "ZK662.4".to_string(),
                descriptive_name: Some("lin-15B".to_string()),
                chromosome: Some(ChromosomeName::X),
                phys_loc: Some(15726123),
                gen_loc: Some(22.95),
                recomb_suppressor: None,
            },
        ),
        (
            Allele {
                name: "n765".to_string(),
                contents: None,
                systematic_gene_name: Some("ZK662.4".to_string()),
                variation_name: None,
            },
            Gene {
                systematic_name: "ZK662.4".to_string(),
                descriptive_name: Some("lin-15B".to_string()),
                chromosome: Some(ChromosomeName::X),
                phys_loc: Some(15726123),
                gen_loc: Some(22.95),
                recomb_suppressor: None,
            },
        ),
        (
            Allele {
                name: "ox1059".to_string(),
                contents: None,
                systematic_gene_name: Some("C10C6.1".to_string()),
                variation_name: None,
            },
            Gene {
                systematic_name: "C10C6.1".to_string(),
                descriptive_name: Some("kin-4".to_string()),
                chromosome: Some(ChromosomeName::Iv),
                phys_loc: Some(11425742),
                gen_loc: Some(4.98),
                recomb_suppressor: None,
            },
        ),
        (
            Allele {
                name: "oxEx219999".to_string(),
                contents: Some("[Primb-1::HisCl1::SL2::GFP]".to_string()),
                systematic_gene_name: None,
                variation_name: Some("oxEx219999".to_string()),
            },
            Gene {
                systematic_name: "".to_string(),
                descriptive_name: None,
                chromosome: None,
                phys_loc: None,
                gen_loc: None,
                recomb_suppressor: None,
            },
        ),
        (
            Allele {
                name: "oxEx2254".to_string(),
                contents: Some(
                    "[Psnt-1::Flp, Punc-122::GAP-43::mScarlet, cbr-unc-119(+), NeoR]".to_string(),
                ),
                systematic_gene_name: None,
                variation_name: Some("oxEx2254".to_string()),
            },
            Gene {
                systematic_name: "".to_string(),
                descriptive_name: None,
                chromosome: None,
                phys_loc: None,
                gen_loc: None,
                recomb_suppressor: None,
            },
        ),
        (
            Allele {
                name: "oxIs12".to_string(),
                contents: Some("[Punc-47::GFP; lin-15(+)]".to_string()),
                systematic_gene_name: None,
                variation_name: Some("oxIs12".to_string()),
            },
            Gene {
                systematic_name: "".to_string(),
                descriptive_name: None,
                chromosome: None,
                phys_loc: None,
                gen_loc: None,
                recomb_suppressor: None,
            },
        ),
        (
            Allele {
                name: "oxIs363".to_string(),
                contents: Some("[unc-122p::GFP + unc-119(+)]".to_string()),
                systematic_gene_name: None,
                variation_name: Some("oxIs363".to_string()),
            },
            Gene {
                systematic_name: "".to_string(),
                descriptive_name: None,
                chromosome: None,
                phys_loc: None,
                gen_loc: None,
                recomb_suppressor: None,
            },
        ),
        (
            Allele {
                name: "oxIs644".to_string(),
                contents: Some("[Peft-3::FRT-UTR-FRT::mYFP::unc-54UTR; lin-15(+)]".to_string()),
                systematic_gene_name: None,
                variation_name: Some("oxIs644".to_string()),
            },
            Gene {
                systematic_name: "".to_string(),
                descriptive_name: None,
                chromosome: None,
                phys_loc: None,
                gen_loc: None,
                recomb_suppressor: None,
            },
        ),
        (
            Allele {
                name: "oxSi1168".to_string(),
                contents: Some("[Psnt-1:Flp, *ttTi5605]".to_string()),
                systematic_gene_name: None,
                variation_name: Some("oxSi1168".to_string()),
            },
            Gene {
                systematic_name: "".to_string(),
                descriptive_name: None,
                chromosome: None,
                phys_loc: None,
                gen_loc: None,
                recomb_suppressor: None,
            },
        ),
        (
            Allele {
                name: "oxTi302".to_string(),
                contents: Some("[Peft-3::mCherry; cbr-unc-119(+)]".to_string()),
                systematic_gene_name: None,
                variation_name: Some("oxTi302".to_string()),
            },
            Gene {
                systematic_name: "".to_string(),
                descriptive_name: None,
                chromosome: None,
                phys_loc: None,
                gen_loc: None,
                recomb_suppressor: None,
            },
        ),
        (
            Allele {
                name: "oxTi75".to_string(),
                contents: Some("[Peft-3::GFP-NLS; unc-18(+)]".to_string()),
                systematic_gene_name: None,
                variation_name: Some("oxTi75".to_string()),
            },
            Gene {
                systematic_name: "".to_string(),
                descriptive_name: None,
                chromosome: None,
                phys_loc: None,
                gen_loc: None,
                recomb_suppressor: None,
            },
        ),
        (
            Allele {
                name: "tmC5".to_string(),
                contents: None,
                systematic_gene_name: None,
                variation_name: Some("tmC5".to_string()),
            },
            Gene {
                systematic_name: "".to_string(),
                descriptive_name: None,
                chromosome: None,
                phys_loc: None,
                gen_loc: None,
                recomb_suppressor: None,
            },
        ),
        (
            Allele {
                name: "tmC5[F36H1.3(tmIs1220)]".to_string(),
                contents: Some("[Pmyo-2::YFP]".to_string()),
                systematic_gene_name: None,
                variation_name: Some("tmC5[F36H1.3(tmIs1220)]".to_string()),
            },
            Gene {
                systematic_name: "".to_string(),
                descriptive_name: None,
                chromosome: None,
                phys_loc: None,
                gen_loc: None,
                recomb_suppressor: None,
            },
        ),
    ]
}

pub fn get_filtered_alleles_with_content() -> Vec<Allele> {
    vec![
        Allele {
            name: "eT1(III)".to_string(),
            contents: Some("[unc-36(e873)]".to_string()),
            systematic_gene_name: None,
            variation_name: Some("eT1(III)".to_string()),
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
            name: "oxIs363".to_string(),
            contents: Some("[unc-122p::GFP + unc-119(+)]".to_string()),
            systematic_gene_name: None,
            variation_name: Some("oxIs363".to_string()),
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
            name: "tmC5[F36H1.3(tmIs1220)]".to_string(),
            contents: Some("[Pmyo-2::YFP]".to_string()),
            systematic_gene_name: None,
            variation_name: Some("tmC5[F36H1.3(tmIs1220)]".to_string()),
        },
    ]
}
pub fn get_filtered_alleles_with_null_content() -> Vec<Allele> {
    vec![
        Allele {
            name: "cn64".to_string(),
            contents: None,
            systematic_gene_name: Some("T14B4.7".to_string()),
            variation_name: None,
        },
        Allele {
            name: "e128".to_string(),
            contents: None,
            systematic_gene_name: Some("T14B4.7".to_string()),
            variation_name: None,
        },
        Allele {
            name: "e1282".to_string(),
            contents: None,
            systematic_gene_name: Some("T22B3.1".to_string()),
            variation_name: None,
        },
        Allele {
            name: "e138".to_string(),
            contents: None,
            systematic_gene_name: Some("F57H12.2".to_string()),
            variation_name: None,
        },
        Allele {
            name: "ed3".to_string(),
            contents: None,
            systematic_gene_name: Some("M142.1".to_string()),
            variation_name: None,
        },
        Allele {
            name: "eT1(V)".to_string(),
            contents: None,
            systematic_gene_name: None,
            variation_name: Some("eT1(V)".to_string()),
        },
        Allele {
            name: "hd43".to_string(),
            contents: None,
            systematic_gene_name: Some("F56H11.1".to_string()),
            variation_name: None,
        },
        Allele {
            name: "md299".to_string(),
            contents: None,
            systematic_gene_name: Some("F27D9.1".to_string()),
            variation_name: None,
        },
        Allele {
            name: "n744".to_string(),
            contents: None,
            systematic_gene_name: Some("ZK662.4".to_string()),
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
            name: "tmC5".to_string(),
            contents: None,
            systematic_gene_name: None,
            variation_name: Some("tmC5".to_string()),
        },
    ]
}
pub fn search_alleles_by_name() -> Vec<Allele> {
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
    ]
}
