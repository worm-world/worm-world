use crate::models::task::{Action, Task};
pub fn get_tasks() -> Vec<Task> {
    vec![
        Task {
            id: "1".to_string(),
            due_date: Some("2012-01-01".to_string()),
            action: Action::Cross,
            strain1: "{}".to_string(),
            strain2: Some("{}".to_string()),
            result: Some("{}".to_string()),
            notes: Some("example note".to_string()),
            tree_id: "1".to_string(),
            completed: true,
        },
        Task {
            id: "2".to_string(),
            due_date: Some("2012-01-02".to_string()),
            action: Action::SelfCross,
            strain1: "{}".to_string(),
            strain2: Some("{}".to_string()),
            result: Some("{}".to_string()),
            notes: None,
            tree_id: "1".to_string(),
            completed: false,
        },
        Task {
            id: "3".to_string(),
            due_date: Some("2012-01-03".to_string()),
            action: Action::Cross,
            strain1: "{}".to_string(),
            strain2: Some("{}".to_string()),
            result: Some("{}".to_string()),
            notes: Some("example note".to_string()),
            tree_id: "2".to_string(),
            completed: false,
        },
        Task {
            id: "4".to_string(),
            due_date: Some("2012-01-03".to_string()),
            action: Action::Freeze,
            strain1: "{}".to_string(),
            strain2: Some("{}".to_string()),
            result: Some("{}".to_string()),
            notes: None,
            tree_id: "2".to_string(),
            completed: true,
        },
        Task {
            id: "5".to_string(),
            due_date: Some("2012-01-04".to_string()),
            action: Action::Pcr,
            strain1: "{}".to_string(),
            strain2: Some("{}".to_string()),
            result: Some("{}".to_string()),
            notes: Some("example note".to_string()),
            tree_id: "3".to_string(),
            completed: true,
        },
    ]
}
pub fn get_filtered_tasks() -> Vec<Task> {
    vec![Task {
        id: "1".to_string(),
        due_date: Some("2012-01-01".to_string()),
        action: Action::Cross,
        strain1: "{}".to_string(),
        strain2: Some("{}".to_string()),
        result: Some("{}".to_string()),
        notes: Some("example note".to_string()),
        tree_id: "1".to_string(),
        completed: true,
    }]
}
