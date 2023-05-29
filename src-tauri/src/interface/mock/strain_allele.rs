use crate::models::strain_allele::StrainAllele;

pub fn get_strain_alleles() -> Vec<StrainAllele> {
    vec![
        StrainAllele {
            strain_name: "BT14".to_string(),
            allele_name: "e1282".to_string(),
            homozygous: false,
        },
        StrainAllele {
            strain_name: "BT14".to_string(),
            allele_name: "e138".to_string(),
            homozygous: true,
        },
        StrainAllele {
            strain_name: "BT14".to_string(),
            allele_name: "hd43".to_string(),
            homozygous: false,
        },
        StrainAllele {
            strain_name: "CB128".to_string(),
            allele_name: "e128".to_string(),
            homozygous: true,
        },
        StrainAllele {
            strain_name: "EG5071".to_string(),
            allele_name: "ed3".to_string(),
            homozygous: true,
        },
        StrainAllele {
            strain_name: "EG5071".to_string(),
            allele_name: "oxIs363".to_string(),
            homozygous: true,
        },
        StrainAllele {
            strain_name: "EG6207".to_string(),
            allele_name: "ed3".to_string(),
            homozygous: true,
        },
        StrainAllele {
            strain_name: "MT2495".to_string(),
            allele_name: "n744".to_string(),
            homozygous: true,
        },
        StrainAllele {
            strain_name: "TN64".to_string(),
            allele_name: "cn64".to_string(),
            homozygous: true,
        },
    ]
}

pub fn get_filtered_strain_alleles() -> Vec<StrainAllele> {
    vec![
        StrainAllele {
            strain_name: "EG5071".to_string(),
            allele_name: "ed3".to_string(),
            homozygous: true,
        },
        StrainAllele {
            strain_name: "EG6207".to_string(),
            allele_name: "ed3".to_string(),
            homozygous: true,
        },
    ]
}

pub fn get_filtered_strain_alleles_and_or_clause() -> Vec<StrainAllele> {
    vec![StrainAllele {
        strain_name: "EG5071".to_string(),
        allele_name: "ed3".to_string(),
        homozygous: true,
    }]
}
