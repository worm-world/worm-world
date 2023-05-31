BEGIN TRANSACTION;
INSERT INTO phenotypes (
    name,
    wild,
    male_mating,
    female_sterile,
    arrested,
    lethal,
    maturation_days,
    short_name
  )
VALUES (
    "eT1Vhomozygote_aneuploid",
    0,
    0,
    0,
    0,
    1,
    NULL,
    "aneuploid"
  ),
  (
    "eT1IIIhomozygote_aneuploid",
    0,
    0,
    0,
    0,
    1,
    NULL,
    "aneuploid"
  ),
  (
    "eT1Vhet_aneuploid",
    0,
    0,
    0,
    0,
    1,
    NULL,
    "aneuploid"
  ),
  (
    "eT1IIIhet_aneuploid",
    0,
    0,
    0,
    0,
    1,
    NULL,
    "aneuploid"
  ),
  ("unc-119", 0, 0, 0, 0, 0, 4, "unc"),
  (
    "unc-119",
    1,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    "unc"
  ),
  ("unc-31", 0, NULL, NULL, NULL, NULL, NULL, "unc"),
  (
    "lin-15B",
    0,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    "muv"
  ),
  ("lin-15A", 0, 3, 0, 0, 0, 3, "muv"),
  (
    "lin-15B",
    1,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    "muv"
  ),
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
  (
    "mScarlet(coel)",
    0,
    3,
    0,
    0,
    0,
    3,
    "mScarlet(coel)"
  ),
  ("Flp", 1, 3, 0, 0, 0, 3, "Flp(+)"),
  ("HygR", 0, 3, 0, 0, 0, 3, "HygR"),
  ("NeoR", 0, 3, 0, 0, 0, 3, "NeoR"),
  ("paralyzed", 0, 0, 0, 0, 0, NULL, "paralyzed"),
  ("lethal", 0, 0, 0, 0, 1, NULL, "lethal");
COMMIT TRANSACTION;