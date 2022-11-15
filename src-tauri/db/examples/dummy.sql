BEGIN TRANSACTION;

INSERT INTO genes (name, chromosome, phys_loc, gen_loc)
VALUES 
    ("unc-119", "III", 10902641, 5.59)
    ("lin-15B", "X", 15726123, 22.95),
    ("unc-18", "X", 7682896, -1.35), 
    ("dpy-10", "II", 6710149, 0), 
    ("ox1059", "IV", 11425742, 4.98);

-- TODO: Does it make sense for the phenotype to be (-)?
-- TODO: Every time a phenotype like that shows up, the (+) version must suppress it
INSERT INTO phenotypes (short_name, male_mating, female_sterile, arrested, lethal, growth_rate, short_name, is_condition)
VALUES
    ("unc-199(-)", 0, 0, 0, 0, 4, "unc", 0),
    ("lin-15B(-)", NULL, NULL, NULL, NULL, NULL, "muv", 0),
    ("lin-15(-)", 3, 0, 0, 0, 3, "muv", 0),
    ("unc-18(-)", 1, 0, 0, 0, 4, "unc", 0),
    ("dpy-10(-)", 0, 0, 0, 0, 4, "dpy", 0),
    ("unc-5(-)", 0, 0, 0, 0, 4, "unc", 0),
    ("mec-3(-)", NULL, NULL, NULL, NULL, NULL, "mec", 0),
    ("rol", 0, 0, 0, 0, 3, "rol", 0),
    ("GFP", 3, 0, 0, 0, 3, "GFP", 0),
    ("GFP-NLS", 3, 0, 0, 0, 3, "GFP-NLS", 0),
    ("mCherry", 3, 0, 0, 0, 3, "mCherry", 0),
    ("GFP(GABA)", 3, 0, 0, 0, 3, "GFP(GABA)", 0),
    ("YFP-NLS", 3, 0, 0, 0, 3, "YFP-NLS", 0),
    ("YFP(pharynx)", 3, 0, 0, 0, 3, "YFP(pharynx)", 0),
    ("mScarlett(coel)", 3, 0, 0, 0, 3, "mScarlett(coel)", 0),
    ("Flp(+)", 3, 0, 0, 0, 3, "Flp(+)", 0),
    ("HygR", 3, 0, 0, 0, 3, "HygR", 0),
    ("NeoR", 3, 0, 0, 0, 3, "NeoR", 0),
-- TODO: Does this "lethal" on its own make sense to be a phenotype?
    ("lethal", 0, 0, 0, 1, NULL, "lethal", 0),
    ("15C", 3, 0, 0, 0, 4, "15C", 1),
    ("25C", 3, 0, 0, 0, 3, "25C", 1),
    ("Tetracycline", 3, 0, 0, 0, 3, "Tetracycline", 1),
    ("Histamine", 3, 0, 0, 0, 3, "Histamine", 1);

INSERT INTO alleles (name, gene_name)
VALUES
    ("ed3", "unc-119"),
    ("n765", "lin-15B"),
    ("md299", "unc-18"),
    ("cn64", "dpy-10"),
    ("kin-4", "ox1059");



COMMIT TRANSACTION;