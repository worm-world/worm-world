-- Add up migration script here\
PRAGMA foreign_keys = OFF;
DROP TABLE tasks;
PRAGMA foreign_keys = ON;
CREATE TABLE tasks (
  id TEXT NOT NULL,
  due_date TEXT NULL,
  action INTEGER NOT NULL,
  strain1 TEXT NOT NULL,
  strain2 TEXT NULL,
  result TEXT NULL,
  notes TEXT NULL,
  completed INTEGER NOT NULL,
  tree_id TEXT NOT NULL,
  FOREIGN KEY (tree_id) REFERENCES trees (id),
  PRIMARY KEY (id)
);