use crate::models::condition::Condition;
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
pub fn search_conditions_by_name() -> Vec<Condition> {
    vec![Condition {
        name: "Histamine".to_string(),
        description: None,
        male_mating: Some(3),
        lethal: Some(false),
        female_sterile: Some(false),
        arrested: Some(false),
        maturation_days: Some(3.0),
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
