use crate::models::phenotype::Phenotype;
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
            name: "eT1IIIhet_aneuploid".to_string(),
            wild: false,
            short_name: "aneuploid".to_string(),
            description: None,
            male_mating: Some(0),
            lethal: Some(true),
            female_sterile: Some(false),
            arrested: Some(false),
            maturation_days: None,
        },
        Phenotype {
            name: "eT1IIIhomozygote_aneuploid".to_string(),
            wild: false,
            short_name: "aneuploid".to_string(),
            description: None,
            male_mating: Some(0),
            lethal: Some(true),
            female_sterile: Some(false),
            arrested: Some(false),
            maturation_days: None,
        },
        Phenotype {
            name: "eT1Vhet_aneuploid".to_string(),
            wild: false,
            short_name: "aneuploid".to_string(),
            description: None,
            male_mating: Some(0),
            lethal: Some(true),
            female_sterile: Some(false),
            arrested: Some(false),
            maturation_days: None,
        },
        Phenotype {
            name: "eT1Vhomozygote_aneuploid".to_string(),
            wild: false,
            short_name: "aneuploid".to_string(),
            description: None,
            male_mating: Some(0),
            lethal: Some(true),
            female_sterile: Some(false),
            arrested: Some(false),
            maturation_days: None,
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
            name: "eT1IIIhet_aneuploid".to_string(),
            wild: false,
            short_name: "aneuploid".to_string(),
            description: None,
            male_mating: Some(0),
            lethal: Some(true),
            female_sterile: Some(false),
            arrested: Some(false),
            maturation_days: None,
        },
        Phenotype {
            name: "eT1IIIhomozygote_aneuploid".to_string(),
            wild: false,
            short_name: "aneuploid".to_string(),
            description: None,
            male_mating: Some(0),
            lethal: Some(true),
            female_sterile: Some(false),
            arrested: Some(false),
            maturation_days: None,
        },
        Phenotype {
            name: "eT1Vhet_aneuploid".to_string(),
            wild: false,
            short_name: "aneuploid".to_string(),
            description: None,
            male_mating: Some(0),
            lethal: Some(true),
            female_sterile: Some(false),
            arrested: Some(false),
            maturation_days: None,
        },
        Phenotype {
            name: "eT1Vhomozygote_aneuploid".to_string(),
            wild: false,
            short_name: "aneuploid".to_string(),
            description: None,
            male_mating: Some(0),
            lethal: Some(true),
            female_sterile: Some(false),
            arrested: Some(false),
            maturation_days: None,
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
pub fn search_phenotypes_by_short_name() -> Vec<Phenotype> {
    vec![
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
