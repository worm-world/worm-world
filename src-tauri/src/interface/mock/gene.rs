use crate::models::{chromosome::Chromosome, gene::Gene};

pub fn get_genes() -> Vec<Gene> {
    vec![
        Gene {
            systematic_name: "T14B4.7".to_string(),
            descriptive_name: Some("dpy-10".to_string()),
            chromosome: Some(Chromosome::Ii),
            phys_loc: Some(6710149),
            gen_loc: Some(0.0),
            recomb_suppressor: None,
        },
        Gene {
            systematic_name: "T22B3.1".to_string(),
            descriptive_name: Some("dpy-20".to_string()),
            chromosome: Some(Chromosome::Iv),
            phys_loc: Some(11696430),
            gen_loc: Some(5.22),
            recomb_suppressor: None,
        },
        Gene {
            systematic_name: "F56H11.1".to_string(),
            descriptive_name: Some("fbl-1".to_string()),
            chromosome: Some(Chromosome::Iv),
            phys_loc: Some(9540806),
            gen_loc: Some(4.3),
            recomb_suppressor: None,
        },
        Gene {
            systematic_name: "C10C6.1".to_string(),
            descriptive_name: Some("kin-4".to_string()),
            chromosome: Some(Chromosome::Iv),
            phys_loc: Some(11425742),
            gen_loc: Some(4.98),
            recomb_suppressor: None,
        },
        Gene {
            systematic_name: "ZK662.4".to_string(),
            descriptive_name: Some("lin-15B".to_string()),
            chromosome: Some(Chromosome::X),
            phys_loc: Some(15726123),
            gen_loc: Some(22.95),
            recomb_suppressor: None,
        },
        Gene {
            systematic_name: "M142.1".to_string(),
            descriptive_name: Some("unc-119".to_string()),
            chromosome: Some(Chromosome::Iii),
            phys_loc: Some(10902641),
            gen_loc: Some(5.59),
            recomb_suppressor: None,
        },
        Gene {
            systematic_name: "F27D9.1".to_string(),
            descriptive_name: Some("unc-18".to_string()),
            chromosome: Some(Chromosome::X),
            phys_loc: Some(7682896),
            gen_loc: Some(-1.35),
            recomb_suppressor: None,
        },
        Gene {
            systematic_name: "F57H12.2".to_string(),
            descriptive_name: Some("unc-24".to_string()),
            chromosome: Some(Chromosome::Iv),
            phys_loc: Some(7979870),
            gen_loc: Some(3.51),
            recomb_suppressor: None,
        },
    ]
}
pub fn get_filtered_genes() -> Vec<Gene> {
    vec![
        Gene {
            systematic_name: "T22B3.1".to_string(),
            descriptive_name: Some("dpy-20".to_string()),
            chromosome: Some(Chromosome::Iv),
            phys_loc: Some(11696430),
            gen_loc: Some(5.22),
            recomb_suppressor: None,
        },
        Gene {
            systematic_name: "F56H11.1".to_string(),
            descriptive_name: Some("fbl-1".to_string()),
            chromosome: Some(Chromosome::Iv),
            phys_loc: Some(9540806),
            gen_loc: Some(4.3),
            recomb_suppressor: None,
        },
        Gene {
            systematic_name: "C10C6.1".to_string(),
            descriptive_name: Some("kin-4".to_string()),
            chromosome: Some(Chromosome::Iv),
            phys_loc: Some(11425742),
            gen_loc: Some(4.98),
            recomb_suppressor: None,
        },
        Gene {
            systematic_name: "ZK662.4".to_string(),
            descriptive_name: Some("lin-15B".to_string()),
            chromosome: Some(Chromosome::X),
            phys_loc: Some(15726123),
            gen_loc: Some(22.95),
            recomb_suppressor: None,
        },
        Gene {
            systematic_name: "F27D9.1".to_string(),
            descriptive_name: Some("unc-18".to_string()),
            chromosome: Some(Chromosome::X),
            phys_loc: Some(7682896),
            gen_loc: Some(-1.35),
            recomb_suppressor: None,
        },
        Gene {
            systematic_name: "F57H12.2".to_string(),
            descriptive_name: Some("unc-24".to_string()),
            chromosome: Some(Chromosome::Iv),
            phys_loc: Some(7979870),
            gen_loc: Some(3.51),
            recomb_suppressor: None,
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
            recomb_suppressor: None,
        },
        Gene {
            systematic_name: "F27D9.1".to_string(),
            descriptive_name: Some("unc-18".to_string()),
            chromosome: Some(Chromosome::X),
            phys_loc: Some(7682896),
            gen_loc: Some(-1.35),
            recomb_suppressor: None,
        },
        Gene {
            systematic_name: "F56H11.1".to_string(),
            descriptive_name: Some("fbl-1".to_string()),
            chromosome: Some(Chromosome::Iv),
            phys_loc: Some(9540806),
            gen_loc: Some(4.3),
            recomb_suppressor: None,
        },
        Gene {
            systematic_name: "F57H12.2".to_string(),
            descriptive_name: Some("unc-24".to_string()),
            chromosome: Some(Chromosome::Iv),
            phys_loc: Some(7979870),
            gen_loc: Some(3.51),
            recomb_suppressor: None,
        },
        Gene {
            systematic_name: "T22B3.1".to_string(),
            descriptive_name: Some("dpy-20".to_string()),
            chromosome: Some(Chromosome::Iv),
            phys_loc: Some(11696430),
            gen_loc: Some(5.22),
            recomb_suppressor: None,
        },
        Gene {
            systematic_name: "ZK662.4".to_string(),
            descriptive_name: Some("lin-15B".to_string()),
            chromosome: Some(Chromosome::X),
            phys_loc: Some(15726123),
            gen_loc: Some(22.95),
            recomb_suppressor: None,
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
        recomb_suppressor: None,
    }]
}
pub fn get_filtered_genes_and_or_clause() -> Vec<Gene> {
    vec![
        Gene {
            systematic_name: "T22B3.1".to_string(),
            descriptive_name: Some("dpy-20".to_string()),
            chromosome: Some(Chromosome::Iv),
            phys_loc: Some(11696430),
            gen_loc: Some(5.22),
            recomb_suppressor: None,
        },
        Gene {
            systematic_name: "ZK662.4".to_string(),
            descriptive_name: Some("lin-15B".to_string()),
            chromosome: Some(Chromosome::X),
            phys_loc: Some(15726123),
            gen_loc: Some(22.95),
            recomb_suppressor: None,
        },
        Gene {
            systematic_name: "M142.1".to_string(),
            descriptive_name: Some("unc-119".to_string()),
            chromosome: Some(Chromosome::Iii),
            phys_loc: Some(10902641),
            gen_loc: Some(5.59),
            recomb_suppressor: None,
        },
        Gene {
            systematic_name: "F27D9.1".to_string(),
            descriptive_name: Some("unc-18".to_string()),
            chromosome: Some(Chromosome::X),
            phys_loc: Some(7682896),
            gen_loc: Some(-1.35),
            recomb_suppressor: None,
        },
    ]
}
pub fn search_genes_by_desc_name() -> Vec<Gene> {
    vec![
        Gene {
            systematic_name: "C10C6.1".to_string(),
            descriptive_name: Some("kin-4".to_string()),
            chromosome: Some(Chromosome::Iv),
            phys_loc: Some(11425742),
            gen_loc: Some(4.98),
            recomb_suppressor: None,
        },
        Gene {
            systematic_name: "ZK662.4".to_string(),
            descriptive_name: Some("lin-15B".to_string()),
            chromosome: Some(Chromosome::X),
            phys_loc: Some(15726123),
            gen_loc: Some(22.95),
            recomb_suppressor: None,
        },
    ]
}
pub fn search_genes_by_sys_or_desc_name() -> Vec<Gene> {
    vec![
        Gene {
            systematic_name: "T14B4.7".to_string(),
            descriptive_name: Some("dpy-10".to_string()),
            chromosome: Some(Chromosome::Ii),
            phys_loc: Some(6710149),
            gen_loc: Some(0.0),
            recomb_suppressor: None,
        },
        Gene {
            systematic_name: "ZK662.4".to_string(),
            descriptive_name: Some("lin-15B".to_string()),
            chromosome: Some(Chromosome::X),
            phys_loc: Some(15726123),
            gen_loc: Some(22.95),
            recomb_suppressor: None,
        },
    ]
}
