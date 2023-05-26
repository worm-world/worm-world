BEGIN TRANSACTION;
INSERT INTO variations (
        allele_name,
        chromosome,
        phys_loc,
        gen_loc,
        recomb_suppressor_start,
        recomb_suppressor_end
    )
VALUES ("oxIs644", NULL, NULL, NULL, NULL, NULL),
    ("oxIs12", "X", NULL, NULL, NULL, NULL),
    ("oxTi302", "I", 10166146, 4.72, NULL, NULL),
    ("oxTi75", "II", NULL, -1.46, NULL, NULL),
    ("tmC5", "IV", NULL, NULL, 6600000, 12500000),
    (
        "tmC5[F36H1.3(tmIs1220)]",
        "IV",
        NULL,
        NULL,
        6600000,
        12500000
    ),
    ("oxEx2254", NULL, NULL, NULL, NULL, NULL),
    ("oxSi1168", "II", 8420158, 0.77, NULL, NULL),
    ("oxEx219999", NULL, NULL, NULL, NULL, NULL),
    ("eT1(V)", "V", NULL, NULL, 1, 8934697),
    ("eT1(III)", "III", NULL, NULL, 8192365, 13783733);
COMMIT TRANSACTION;