-- Add up migration script here
CREATE TABLE Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name TEXT NOT NULL
);

INSERT INTO Users (id, user_name)
VALUES 
    (1, "Andrew"),
    (2, "Daniel"),
    (3, "Seth"),
    (4, "Will");