use crate::models::task_cond::TaskCondition;

pub fn get_task_conditions() -> Vec<TaskCondition> {
    vec![
        TaskCondition {
            task_id: "1".to_string(),
            cond_name: "Histamine".to_string(),
        },
        TaskCondition {
            task_id: "2".to_string(),
            cond_name: "Tetracycline".to_string(),
        },
        TaskCondition {
            task_id: "3".to_string(),
            cond_name: "Histamine".to_string(),
        },
    ]
}

pub fn get_filtered_task_conditions() -> Vec<TaskCondition> {
    vec![TaskCondition {
        task_id: "1".to_string(),
        cond_name: "Histamine".to_string(),
    }]
}
