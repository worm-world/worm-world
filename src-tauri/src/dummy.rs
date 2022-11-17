
#[cfg(test)]
pub mod testdata {
    use crate::models::gene::Gene;

    pub fn get_genes() -> Vec<Gene> {
        vec![
            Gene {
                name: "dpy-10".to_string(),
                chromosome: Some("II".to_string()),
                phys_loc: Some(6710149),
                gen_loc: Some(0.0),
            },
            Gene {
                name: "lin-15B".to_string(),
                chromosome: Some("X".to_string()),
                phys_loc: Some(15726123),
                gen_loc: Some(22.95),
            },
            Gene {
                name: "ox1059".to_string(),
                chromosome: Some("IV".to_string()),
                phys_loc: Some(11425742),
                gen_loc: Some(4.98),
            },
            Gene {
                name: "unc-119".to_string(),
                chromosome: Some("III".to_string()),
                phys_loc: Some(10902641),
                gen_loc: Some(5.59),
            },
            Gene {
                name: "unc-18".to_string(),
                chromosome: Some("X".to_string()),
                phys_loc: Some(7682896),
                gen_loc: Some(-1.35),
            },
        ]
    }
    
}
