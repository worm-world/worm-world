BEGIN TRANSACTION;
INSERT INTO conditions (
        name,
        male_mating,
        female_sterile,
        arrested,
        lethal,
        maturation_days
    )
VALUES ("15C", 3, 0, 0, 0, 4),
    ("25C", 3, 0, 0, 0, 3),
    ("Tetracycline", 3, 0, 0, 0, 3),
    ("Histamine", 3, 0, 0, 0, 3);
COMMIT TRANSACTION;