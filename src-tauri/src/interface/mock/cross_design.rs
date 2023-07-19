use crate::models::cross_design::CrossDesign;

pub fn get_cross_designs() -> Vec<CrossDesign> {
    vec![
        CrossDesign {
            id: "1".to_string(),
            name: "test1".to_string(),
            last_edited: "2012-01-01".to_string(),
            data: "{}".to_string(),
            editable: true,
        },
        CrossDesign {
            id: "2".to_string(),
            name: "test2".to_string(),
            last_edited: "2012-01-02".to_string(),
            data: "{}".to_string(),
            editable: false,
        },
        CrossDesign {
            id: "3".to_string(),
            name: "test3".to_string(),
            last_edited: "2012-01-03".to_string(),
            data: "{}".to_string(),
            editable: true,
        },
    ]
}
pub fn get_filtered_cross_designs() -> Vec<CrossDesign> {
    vec![CrossDesign {
        id: "1".to_string(),
        name: "test1".to_string(),
        last_edited: "2012-01-01".to_string(),
        data: "{}".to_string(),
        editable: true,
    }]
}
