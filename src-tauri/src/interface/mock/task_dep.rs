use crate::models::task_dep::TaskDependency;
pub fn get_task_dependencies() -> Vec<TaskDependency> {
    vec![
        TaskDependency {
            parent_id: "1".to_string(),
            child_id: "2".to_string(),
        },
        TaskDependency {
            parent_id: "2".to_string(),
            child_id: "3".to_string(),
        },
    ]
}

pub fn get_filtered_task_dependency() -> Vec<TaskDependency> {
    vec![TaskDependency {
        parent_id: "1".to_string(),
        child_id: "2".to_string(),
    }]
}
