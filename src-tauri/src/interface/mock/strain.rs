use crate::models::strain::Strain;

pub fn get_strains() -> Vec<Strain> {
    vec![
        Strain {
            name: "BT14".to_string(),
            genotype: "fbl-1(hd43)/dpy-20(e1282) unc-24(e138) IV.".to_string(),
            description: Some("Heterozygotes are WT and segregate WT, Steriles (hd43 homozygotes) and Dpy Uncs.".to_string()),
        },
        Strain {
            name: "CB128".to_string(),
            genotype: "dpy-10(e128) II.".to_string(),
            description: Some("Small Dpy.".to_string()),
        },
        Strain {
            name: "EG5071".to_string(),
            genotype: "unc-119(ed3) III; oxIs363 IV.".to_string(),
            description: Some("oxIs363 [unc-122p::GFP + unc-119(+)]. Wild type. Very dim GFP expression in the coelomycytes. Only visible on compound microscope. Plasmid pBN04 inserted by MosSCI into cxTi10882 site.".to_string()),
        },
        Strain {
            name: "EG6207".to_string(),
            genotype: "unc-199(ed3) III.".to_string(),
            description: Some("Reference: WBPaper00059962".to_string()),
        },
        Strain {
            name: "MT2495".to_string(),
            genotype: "lin-15B(n744) X.".to_string(),
            description: None,
        },
        Strain {
            name: "N2".to_string(),
            genotype: "C. elegans wild isolate.".to_string(),
            description: Some( "C. elegans var Bristol. Generation time is about 3 days. Brood size is about 350. Also CGC reference 257. Isolated from mushroom compost near Bristol, England by L.N. Staniland.".to_string()),
        },
        Strain {
            name: "TN64".to_string(),
            genotype: "dpy-10(cn64) II.".to_string(),
            description: Some("Temperature sensitive. Dpy when grown at 15C. DpyRoller when grown at 25C. Heterozygotes are Rollers at any temperature.".to_string()),
        }
    ]
}

pub fn get_filtered_strains() -> Vec<Strain> {
    vec![
        Strain {
            name: "CB128".to_string(),
            genotype: "dpy-10(e128) II.".to_string(),
            description: Some("Small Dpy.".to_string()),
        },
        Strain {
            name: "N2".to_string(),
            genotype: "C. elegans wild isolate.".to_string(),
            description: Some( "C. elegans var Bristol. Generation time is about 3 days. Brood size is about 350. Also CGC reference 257. Isolated from mushroom compost near Bristol, England by L.N. Staniland.".to_string()),
        },
    ]
}

pub fn get_filtered_strains_alternate_ordering() -> Vec<Strain> {
    vec![
        Strain {
            name: "N2".to_string(),
            genotype: "C. elegans wild isolate.".to_string(),
            description: Some( "C. elegans var Bristol. Generation time is about 3 days. Brood size is about 350. Also CGC reference 257. Isolated from mushroom compost near Bristol, England by L.N. Staniland.".to_string()),
        },
        Strain {
            name: "CB128".to_string(),
            genotype: "dpy-10(e128) II.".to_string(),
            description: Some("Small Dpy.".to_string()),
        },
    ]
}

pub fn get_filtered_strains_and_clause() -> Vec<Strain> {
    vec![Strain {
        name: "N2".to_string(),
        genotype: "C. elegans wild isolate.".to_string(),
        description: Some( "C. elegans var Bristol. Generation time is about 3 days. Brood size is about 350. Also CGC reference 257. Isolated from mushroom compost near Bristol, England by L.N. Staniland.".to_string()),
    }]
}

pub fn get_filtered_strains_and_or_clause() -> Vec<Strain> {
    vec![Strain {
        name: "BT14".to_string(),
        genotype: "fbl-1(hd43)/dpy-20(e1282) unc-24(e138) IV.".to_string(),
        description: Some(
            "Heterozygotes are WT and segregate WT, Steriles (hd43 homozygotes) and Dpy Uncs."
                .to_string(),
        ),
    }]
}

pub fn search_strains_by_desc_name() -> Vec<Strain> {
    vec![
    Strain {
        name: "EG6207".to_string(),
        genotype: "unc-199(ed3) III.".to_string(),
        description: Some("Reference: WBPaper00059962".to_string()),
    },
    Strain {
        name: "EG5071".to_string(),
        genotype: "unc-119(ed3) III; oxIs363 IV.".to_string(),
        description: Some("oxIs363 [unc-122p::GFP + unc-119(+)]. Wild type. Very dim GFP expression in the coelomycytes. Only visible on compound microscope. Plasmid pBN04 inserted by MosSCI into cxTi10882 site.".to_string()),
    },
    ]
}
