-- Add up migration script here
-- Add down migration script here
PRAGMA foreign_keys = OFF;

DROP TABLE tasks;
DROP TABLE task_conds;
DROP TABLE task_deps;
DROP TABLE trees;

PRAGMA foreign_keys = ON;

CREATE TABLE tasks
(
  id        TEXT NOT NULL,
  due_date  TEXT    NULL    ,
  action    INTEGER NOT NULL,
  strain1   TEXT    NOT NULL,
  strain2   TEXT    NULL    ,
  notes     TEXT    NULL,
  completed INTEGER NOT NULL,
  tree_id   TEXT NOT NULL,
  FOREIGN KEY (tree_id) REFERENCES trees (id),
  PRIMARY KEY (id)
);

CREATE TABLE task_conds
(
  task_id   TEXT NOT NULL,
  cond_name TEXT    NOT NULL,
  PRIMARY KEY (task_id, cond_name),
  FOREIGN KEY (task_id) REFERENCES tasks (id),
  FOREIGN KEY (cond_name) REFERENCES conditions (name)
);

CREATE TABLE task_deps
(
  parent_id TEXT NOT NULL,
  child_id  TEXT NOT NULL,
  PRIMARY KEY (parent_id, child_id),
  FOREIGN KEY (parent_id) REFERENCES tasks (id),
  FOREIGN KEY (child_id) REFERENCES tasks (id)
);

CREATE TABLE trees
(
  id          TEXT NOT NULL,
  name        TEXT    NOT NULL,
  last_edited TEXT    NOT NULL,
  data        TEXT    NOT NULL,
  editable    INTEGER NOT NULL,
  PRIMARY KEY (id)
);