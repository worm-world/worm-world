BEGIN TRANSACTION;
INSERT INTO genes (
        systematic_name,
        descriptive_name,
        chromosome,
        phys_loc,
        gen_loc,
        recomb_suppressor_start,
        recomb_suppressor_end
    )
VALUES (
        "M142.1",
        "unc-119",
        "III",
        10902641,
        5.59,
        NULL,
        NULL
    ),
    (
        "ZK662.4",
        "lin-15B",
        "X",
        15726123,
        22.95,
        NULL,
        NULL
    ),
    (
        "F27D9.1",
        "unc-18",
        "X",
        7682896,
        -1.35,
        NULL,
        NULL
    ),
    (
        "T14B4.7",
        "dpy-10",
        "II",
        6710149,
        0,
        NULL,
        NULL
    ),
    (
        "C10C6.1",
        "kin-4",
        "IV",
        11425742,
        4.98,
        NULL,
        NULL
    );
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
INSERT INTO alleles (
        name,
        systematic_gene_name,
        variation_name,
        contents
    )
VALUES ("ed3", "M142.1", NULL, NULL),
    ("n765", "ZK662.4", NULL, NULL),
    ("md299", "F27D9.1", NULL, NULL),
    ("cn64", "T14B4.7", NULL, NULL),
    ("ox1059", "C10C6.1", NULL, NULL),
    (
        "oxIs644",
        NULL,
        "oxIs644",
        "[Peft-3::FRT-UTR-FRT::mYFP::unc-54UTR; lin-15(+)]"
    ),
    (
        "oxIs12",
        NULL,
        "oxIs12",
        "[Punc-47::GFP; lin-15(+)]"
    ),
    (
        "oxTi302",
        NULL,
        "oxTi302",
        "[Peft-3::mCherry; cbr-unc-119(+)]"
    ),
    (
        "oxTi75",
        NULL,
        "oxTi75",
        "[Peft-3::GFP-NLS; unc-18(+)]"
    ),
    ("tmC5", NULL, "tmC5", NULL),
    (
        "tmC5[F36H1.3(tmIs1220)]",
        NULL,
        "tmC5[F36H1.3(tmIs1220)]",
        "[Pmyo-2::YFP]"
    ),
    (
        "oxEx2254",
        NULL,
        "oxEx2254",
        "[Psnt-1::Flp, Punc-122::GAP-43::mScarlet, cbr-unc-119(+), NeoR]"
    ),
    (
        "oxSi1168",
        NULL,
        "oxSi1168",
        "[Psnt-1:Flp, *ttTi5605]"
    ),
    ("eT1(V)", NULL, "eT1(V)", NULL),
    ("eT1(III)", NULL, "eT1(III)", "[unc-36(e873)]"),
    (
        "oxEx219999",
        NULL,
        "oxEx219999",
        "[Primb-1::HisCl1::SL2::GFP]"
    );
COMMIT TRANSACTION;