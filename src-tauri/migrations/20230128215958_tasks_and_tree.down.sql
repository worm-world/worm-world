-- Add down migration script here
PRAGMA foreign_keys = OFF;

DROP TABLE tasks;
DROP TABLE task_conds;
DROP TABLE task_deps;
DROP TABLE trees;

PRAGMA foreign_keys = ON;

CREATE TABLE trees
(
  id          INTEGER NOT NULL,
  name        TEXT    NULL    ,
  last_edited TEXT    NULL    ,
  PRIMARY KEY (id)
);

-- Reproductions are crosses or self-fertilizations
CREATE TABLE crosses
(
  id INTEGER NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE sched_trees
(
  id      INTEGER NOT NULL,
  tree_id INTEGER NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (tree_id) REFERENCES trees (id)
);

CREATE TABLE sched_crosses
(
  scheduled_tree_id INTEGER NOT NULL,
  cross_id          INTEGER NOT NULL,
  date              TEXT    NULL    ,
  completed         INTEGER NULL    ,
  PRIMARY KEY (scheduled_tree_id, cross_id),
  FOREIGN KEY (scheduled_tree_id) REFERENCES sched_trees (id),
  FOREIGN KEY (cross_id) REFERENCES crosses (id)
);


CREATE TABLE tree_strains
(
  id              INTEGER NOT NULL,
  tree_id         INTEGER NOT NULL,
  strain          TEXT    NOT NULL,
  sex             INTEGER NOT NULL,
  -- The reproduction that produced this
  parent_cross_id INTEGER NULL    ,
  PRIMARY KEY (id),
  FOREIGN KEY (tree_id) REFERENCES trees (id),
  FOREIGN KEY (strain) REFERENCES strains (name),
  FOREIGN KEY (parent_cross_id) REFERENCES crosses (id)
);

-- This is the list of parents involved in each repro (1 or 2)
CREATE TABLE cross_parents
(
  cross_id  INTEGER NOT NULL,
  strain_id INTEGER NOT NULL,
  PRIMARY KEY (cross_id, strain_id),
  FOREIGN KEY (cross_id) REFERENCES crosses (id),
  FOREIGN KEY (strain_id) REFERENCES tree_strains (id)
);

