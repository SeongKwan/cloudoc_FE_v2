const convertRef = [{
        "source": "GLU",
        "target": "Glucose",
        "category": "Blood Glucose",
        "unit": "mg/dL"
    },
    {
        "source": "RBC",
        "target": "RBC",
        "category": "CBC/Hemoatology",
        "unit": "10^6/µL"
    },
    {
        "source": "HGB",
        "target": "Hemoglobin",
        "category": "CBC/Hemoatology",
        "unit": "g/dL"
    },
    {
        "source": "HB",
        "target": "Hemoglobin",
        "category": "CBC/Hemoatology",
        "unit": "g/dL"
    },
    {
        "source": "HCT",
        "target": "Hematocrit",
        "category": "CBC/Hemoatology",
        "unit": "%"
    },
    {
        "source": "MCV",
        "target": "MCV",
        "category": "CBC/Hemoatology",
        "unit": "fL"
    },
    {
        "source": "MCH",
        "target": "MCH",
        "category": "CBC/Hemoatology",
        "unit": "pg"
    },
    {
        "source": "MCHC",
        "target": "MCHC",
        "category": "CBC/Hemoatology",
        "unit": "g/dL"
    },
    {
        "source": "PLT",
        "target": "Platelets",
        "category": "CBC/Hemoatology",
        "unit": "10^3/µL"
    },
    {
        "source": "RDW-CV",
        "target": "RDW",
        "category": "CBC/Hemoatology",
        "unit": "%"
    },
    {
        "source": "Testosterone",
        "target": "Testosterone Total",
        "category": "Hormones",
        "unit": "ng/dL"
    },
    {
        "source": "CRP",
        "target": "C-Reactive Protein",
        "category": "Inflammation/Oxidation",
        "unit": "mg/L"
    },
    {
        "source": "TCHO",
        "target": "Cholesterol - Total",
        "category": "Lipids",
        "unit": "mg/dL"
    },
    {
        "source": "TG",
        "target": "Triglycerides",
        "category": "Lipids",
        "unit": "mg/dL"
    },
    {
        "source": "LDL",
        "target": "LDL Cholesterol",
        "category": "Lipids",
        "unit": "mg/dL"
    },
    {
        "source": "HDL",
        "target": "HDL Cholesterol",
        "category": "Lipids",
        "unit": "mg/dL"
    },
    {
        "source": "GOT",
        "target": "AST (SGOT)",
        "category": "Liver and Gallbladder",
        "unit": "IU/L"
    },
    {
        "source": "GPT",
        "target": "ALT (SGPT)",
        "category": "Liver and Gallbladder",
        "unit": "IU/L"
    },
    {
        "source": "GGT",
        "target": "GGT",
        "category": "Liver and Gallbladder",
        "unit": "IU/L"
    },
    {
        "source": "UA",
        "target": "Uric Acid",
        "category": "Metabolic",
        "unit": "mg/dL"
    },
    {
        "source": "PSA",
        "target": "PSA - Total",
        "category": "Prostate",
        "unit": "ng/mL"
    },
    {
        "source": "ALB",
        "target": "Albumin",
        "category": "Proteins",
        "unit": "g/dL"
    },
    {
        "source": "BUN",
        "target": "BUN",
        "category": "Renal",
        "unit": "mg/dL"
    },
    {
        "source": "CRE",
        "target": "Creatinine",
        "category": "Renal",
        "unit": "mg/dL"
    },
    {
        "source": "eGFR",
        "target": "eGFR Non-Afr. American",
        "category": "Renal",
        "unit": "mL/min/1.73m2"
    },
    {
        "source": "TSH",
        "target": "TSH",
        "category": "Thyroid",
        "unit": "µU/mL"
    },
    {
        "source": "T4",
        "target": "Total T4",
        "category": "Thyroid",
        "unit": "µg/dL"
    },
    {
        "source": "WBC",
        "target": "Total WBCs",
        "category": "White Blood Cells",
        "unit": "10^3/µL"
    },
    {
        "source": "LYM%",
        "target": "Lymphocytes",
        "category": "White Blood Cells",
        "unit": "%"
    },
    {
        "source": "MID%",
        "target": "Monocytes",
        "category": "White Blood Cells",
        "unit": "%"
    },
    {
        "source": "GRAN%",
        "target": "Granulocytes",
        "category": "White Blood Cells",
        "unit": "%"
    },
    {
        "source": "LYM#",
        "target": "Lymphocytes#",
        "category": "White Blood Cells",
        "unit": "10^3/µL"
    },
    {
        "source": "MID#",
        "target": "Monocytes#",
        "category": "White Blood Cells",
        "unit": "10^3/µL"
    },
    {
        "source": "GRAN#",
        "target": "Granulocytes#",
        "category": "White Blood Cells",
        "unit": "10^3/µL"
    },
    {
        "source": "RDW-SD",
        "target": "RDW-SD",
        "category": "CBC/Hemoatology",
        "unit": "fL"
    },
    {
        "source": "MPV",
        "target": "MPV",
        "category": "CBC/Hemoatology",
        "unit": "fL"
    },
    {
        "source": "PDW",
        "target": "PDW",
        "category": "CBC/Hemoatology",
        "unit": "%"
    },
    {
        "source": "PCT",
        "target": "Plateletcrit",
        "category": "CBC/Hemoatology",
        "unit": "%"
    },
    {
        "source": "P-LCR",
        "target": "Platelet - Large Cell Ratio",
        "category": "CBC/Hemoatology",
        "unit": "%"
    },
    {
        "source": "TCHO/HDL",
        "target": "Cholesterol/HDL Ratio",
        "category": "Lipids",
        "unit": "ratio"
    },
    {
        "source": "non-HDL",
        "target": "non-HDL",
        "category": "Lipids",
        "unit": "mg/dL"
    },
    {
        "source": "hsCRP",
        "target": "Hs CRP",
        "category": "Inflammation/Oxidation",
        "unit": "mg/L"
    },
    {
        "source": "HbA1c",
        "target": "Hemoglobin A1C",
        "category": "Blood Glucose",
        "unit": "%"
    },
    {
        "source": "LH",
        "target": "LH",
        "category": "Hormones",
        "unit": "mIU/mL"
    },
    {
        "source": "FSH",
        "target": "FSH",
        "category": "Hormones",
        "unit": "mIU/mL"
    }
];

export default convertRef;