BEGIN TRANSACTION;

INSERT INTO genes (systematic_name, descriptive_name, chromosome, phys_loc, gen_loc, recomb_suppressor_start, recomb_suppressor_end)
VALUES
    ("M142.1", "unc-119", "III", 10902641, 5.59, NULL, NULL),
    ("ZK662.4", "lin-15B", "X", 15726123, 22.95, NULL, NULL),
    ("F27D9.1", "unc-18", "X", 7682896, -1.35, NULL, NULL),
    ("T14B4.7", "dpy-10", "II", 6710149, 0, NULL, NULL),
    ("C10C6.1", "kin-4", "IV", 11425742, 4.98, NULL, NULL);

INSERT INTO variation_info (allele_name, chromosome, phys_loc, gen_loc, recomb_suppressor_start, recomb_suppressor_end)
VALUES
    ("oxIs644", NULL, NULL, NULL, NULL, NULL),
    ("oxIs12", "X", NULL, NULL, NULL, NULL),
    ("oxTi302", "I", 10166146, 4.72, NULL, NULL),
    ("oxTi75", "II", NULL, -1.46, NULL, NULL),
    ("tmC5", "IV", NULL, NULL, 6600000, 12500000),
    ("tmC5[F36H1.3(tmIs1220)]", "IV", NULL, NULL, 6600000, 12500000),
    ("oxEx2254", NULL, NULL, NULL, NULL, NULL),
    ("oxSi1168", "II", 8420158, 0.77, NULL, NULL),
    ("oxEx219999", NULL, NULL, NULL, NULL, NULL),
    ("eT1(V)", "V", NULL, NULL, 1, 8934697),
    ("eT1(III)", "III", NULL, NULL, 8192365, 13783733);
    

INSERT INTO phenotypes (name, wild, male_mating, female_sterile, arrested, lethal, maturation_days, short_name)
VALUES
    ("eT1Vhomozygote_aneuploid", 0, 0, 0, 0, 1, NULL, "aneuploid"),
    ("eT1IIIhomozygote_aneuploid", 0, 0, 0, 0, 1, NULL, "aneuploid"),
    ("eT1Vhet_aneuploid", 0, 0, 0, 0, 1, NULL, "aneuploid"),
    ("eT1IIIhet_aneuploid", 0, 0, 0, 0, 1, NULL, "aneuploid"),
    ("unc-119", 0, 0, 0, 0, 0, 4, "unc"),
    ("unc-119", 1, NULL, NULL, NULL, NULL, NULL, "unc"),
    ("unc-31", 0, NULL, NULL, NULL, NULL, NULL, "unc"),
    ("lin-15B", 0, NULL, NULL, NULL, NULL, NULL, "muv"),
    ("lin-15A", 0, 3, 0, 0, 0, 3, "muv"),
    ("lin-15B", 1, NULL, NULL, NULL, NULL, NULL, "muv"),
    ("lin-15A", 1, 3, 0, 0, 0, 3, "muv"),
    ("unc-18", 0, 1, 0, 0, 0, 4, "unc"),
    ("unc-18", 1, NULL, NULL, NULL, NULL, NULL, "unc"),
    ("dpy-10", 0, 0, 0, 0, 0, 4, "dpy"),
    ("unc-5", 0, 0, 0, 0, 0, 4, "unc"),
    ("mec-3", 0, NULL, NULL, NULL, NULL, NULL, "mec"),
    ("rol", 0, 0, 0, 0, 0, 3, "rol"),
    ("GFP", 0, 3, 0, 0, 0, 3, "GFP"),
    ("GFP-NLS", 0, 3, 0, 0, 0, 3, "GFP-NLS"),
    ("mCherry", 0, 3, 0, 0, 0, 3, "mCherry"),
    ("GFP(GABA)", 0, 3, 0, 0, 0, 3, "GFP(GABA)"),
    ("YFP-NLS", 0, 3, 0, 0, 0, 3, "YFP-NLS"),
    ("YFP(pharynx)", 0, 3, 0, 0, 0, 3, "YFP(pharynx)"),
    ("mScarlet(coel)", 0, 3, 0, 0, 0, 3, "mScarlet(coel)"),
    ("Flp", 1, 3, 0, 0, 0, 3, "Flp(+)"),
    ("HygR", 0, 3, 0, 0, 0, 3, "HygR"),
    ("NeoR", 0, 3, 0, 0, 0, 3, "NeoR"),
    ("paralyzed", 0, 0, 0, 0, 0, NULL, "paralyzed"),
    ("lethal", 0, 0, 0, 0, 1, NULL, "lethal");

INSERT INTO conditions (name, male_mating, female_sterile, arrested, lethal, maturation_days)
VALUES
    ("15C", 3, 0, 0, 0, 4),
    ("25C", 3, 0, 0, 0, 3),
    ("Tetracycline", 3, 0, 0, 0, 3),
    ("Histamine", 3, 0, 0, 0, 3);

INSERT INTO alleles (name, systematic_gene_name, variation_name, contents)
VALUES
    ("ed3", "M142.1", NULL, NULL),
    ("n765", "ZK662.4", NULL, NULL),
    ("md299", "F27D9.1", NULL, NULL),
    ("cn64", "T14B4.7", NULL, NULL),
    ("ox1059", "C10C6.1", NULL, NULL),
    ("oxIs644", NULL, "oxIs644", "[Peft-3::FRT-UTR-FRT::mYFP::unc-54UTR; lin-15(+)]"),
    ("oxIs12", NULL, "oxIs12", "[Punc-47::GFP; lin-15(+)]"),
    ("oxTi302", NULL, "oxTi302", "[Peft-3::mCherry; cbr-unc-119(+)]"),
    ("oxTi75", NULL, "oxTi75", "[Peft-3::GFP-NLS; unc-18(+)]"),
    ("tmC5", NULL, "tmC5", NULL),
    ("tmC5[F36H1.3(tmIs1220)]", NULL, "tmC5[F36H1.3(tmIs1220)]", "[Pmyo-2::YFP]"),
    ("oxEx2254", NULL, "oxEx2254", "[Psnt-1::Flp, Punc-122::GAP-43::mScarlet, cbr-unc-119(+), NeoR]"),
    ("oxSi1168", NULL, "oxSi1168", "[Psnt-1:Flp, *ttTi5605]"),
    ("eT1(V)", NULL, "eT1(V)", NULL),
    ("eT1(III)", NULL, "eT1(III)", "[unc-36(e873)]"),
    ("oxEx219999", NULL, "oxEx219999", "[Primb-1::HisCl1::SL2::GFP]");

INSERT INTO allele_exprs (allele_name, expressing_phenotype_name, expressing_phenotype_wild, dominance)
VALUES
    ("ed3", "unc-119",0, 0),
    ("n765", "lin-15B",0, 0),
    ("md299", "unc-18",0, 0),
    ("cn64", "dpy-10",0, 0),
    ("eT1(III)", "eT1IIIhomozygote_aneuploid", 0, 0),
    ("eT1(V)", "eT1Vhomozygote_aneuploid", 0, 0),
    ("eT1(III)", "eT1IIIhet_aneuploid", 0, 1),
    ("eT1(V)", "eT1Vhet_aneuploid", 0, 1),
    ("cn64", "rol",0, 1),
    ("ox1059", "YFP(pharynx)",0, 2),
    ("ox1059", "lin-15B",1, 2),
    ("ox1059", "lin-15A",1, 2),
    ("oxIs644", "mCherry",0, 2),
    ("oxIs644", "unc-119",0, 2),
    ("oxIs644", "YFP(pharynx)",0, 2),
    ("oxIs12", "GFP-NLS",0, 2),
    ("oxIs12", "unc-18",1, 2),
    ("oxTi302", "mCherry",0, 2),
    ("oxTi302", "unc-119",1, 2),
    ("oxTi75", "GFP-NLS", 0, 2),
    ("oxTi75", "unc-18", 1, 2),
    ("tmC5", "mec-3", 0, 0),
    ("tmC5", "unc-31", 0, 0),
    ("tmC5[F36H1.3(tmIs1220)]", "mec-3", 0, 0),
    ("tmC5[F36H1.3(tmIs1220)]", "unc-31", 0, 0),
    ("tmC5[F36H1.3(tmIs1220)]", "YFP(pharynx)", 0, 2),
    ("oxEx2254", "Flp", 1, 2 ),
    ("oxEx2254", "mScarlet(coel)", 0, 2 ),
    ("oxEx2254", "unc-119", 1, 2 ),
    ("oxEx2254", "NeoR", 0, 2 ),
    ("oxSi1168", "Flp", 1, 2 ),
    ("oxSi1168", "mScarlet(coel)", 0, 2 ),
    ("oxSi1168", "unc-119", 1, 2 ),
    ("oxSi1168", "NeoR", 0, 2 ),
    ("oxEx219999", "paralyzed", 0, 2);

-- is_suppressing == 0 means phenotype req
INSERT INTO expr_relations (allele_name,expressing_phenotype_name, expressing_phenotype_wild, altering_phenotype_name, altering_phenotype_wild, altering_condition, is_suppressing)
VALUES
    ("eT1(III)", "eT1IIIhomozygote_aneuploid", 0, "eT1Vhomozygote_aneuploid", 0, NULL, 1),
    ("eT1(V)", "eT1Vhomozygote_aneuploid", 0, "eT1IIIhomozygote_aneuploid", 0, NULL, 1),
    ("eT1(III)", "eT1IIIhet_aneuploid", 0, "eT1Vhet_aneuploid", 0, NULL, 1),
    ("eT1(V)", "eT1Vhet_aneuploid", 0, "eT1IIIhet_aneuploid", 0, NULL, 1),
    ("n765", "lin-15B", 0, NULL, NULL,"25C", 0),
    ("oxIs644", "YFP(pharynx)", 0, "Flp", 1, NULL, 0),
    ("oxEx219999", "paralyzed", 0, NULL, NULL, "Histamine", 0);
    
INSERT INTO trees (id, name, last_edited, data, editable)
VALUES
    (1, "test1", "2012-01-01", "{}", 1),
    (2, "test2", "2012-01-02", "{}", 0),
    (3, "test3", "2012-01-03", "{}", 1);

INSERT INTO tasks (id, due_date, action, strain1, strain2, result, notes, tree_id, completed)
VALUES
    (1, "2012-01-01", 0, "{}", "{}", "{}", "example note", 1, 1),
    (2, "2012-01-02", 1, "{}", "{}", "{}", NULL, 1, 0),
    (3, "2012-01-03", 0, "{}", "{}", "{}", "example note", 2, 0),
    (4, "2012-01-03", 2, "{}", "{}", "{}", NULL, 2, 1),
    (5, "2012-01-04", 3, "{}", "{}", "{}", "example note", 3, 1);

INSERT INTO task_conds (task_id, cond_name)
VALUES
    (1, "Histamine"),
    (2, "Tetracycline"),
    (3, "Histamine");
    
INSERT INTO task_deps (parent_id, child_id)
VALUES
    (1, 2),
    (2, 3);


COMMIT TRANSACTION;