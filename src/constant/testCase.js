export const testCase = {
    "_id" : "5e54ce8ac5189242e6a00737",
    "patient" : {
        "chart_id" : "90",
        "gender" : "female",
        "age" : "24",
        "pastHistory" : "유년시절 외과수술을 받은 적이 있다",
        "familyHistory" : "고조할아버지가 암으로 사망하였다",
        "socialHistory" : "외부에 나가는 일이 잦은 직업을 가지고 있다",
        "memo" : "긍정적인 태도가 강해서 정신적인 스트레스가 덜한 편이다"
    },
    "user_id" : "5cd363b37514870004aba2e4",
    "created_date" : "2020/02/25 16:36:42",
    "title" : "증례 Report PDF UI를 위한 시험자료",
    "record" : [ 
        {
            "_id" : "5e54ce8ac5189242e6a00738",
            "createdDate" : "2020/02/25 16:36:42",
            "symptom" : [ 
                {
                    "_id" : "5e54ce8ac5189242e6a0073d",
                    "rank" : 1,
                    "category" : "",
                    "name" : "감각마비",
                    "onset" : "",
                    "value" : "",
                    "unit" : "NRS",
                    "min" : 0,
                    "max" : 10,
                    "description" : ""
                }, 
                {
                    "_id" : "5e54ce8ac5189242e6a0073c",
                    "rank" : 2,
                    "category" : "",
                    "name" : "감각저하",
                    "onset" : "",
                    "value" : "",
                    "unit" : "NRS",
                    "min" : 0,
                    "max" : 10,
                    "description" : ""
                }, 
                {
                    "_id" : "5e54ce8ac5189242e6a0073b",
                    "rank" : 3,
                    "category" : "",
                    "name" : "감각이상",
                    "onset" : "",
                    "value" : "",
                    "unit" : "NRS",
                    "min" : 0,
                    "max" : 10,
                    "description" : ""
                }, 
                {
                    "_id" : "5e54ce8ac5189242e6a0073a",
                    "rank" : 4,
                    "category" : "",
                    "name" : "체중감소",
                    "onset" : "",
                    "value" : "",
                    "unit" : "NRS",
                    "min" : 0,
                    "max" : 10,
                    "description" : ""
                }, 
                {
                    "_id" : "5e54ce8ac5189242e6a00739",
                    "rank" : 5,
                    "category" : "",
                    "name" : "수면장애",
                    "onset" : "",
                    "value" : "",
                    "unit" : "NRS",
                    "min" : 0,
                    "max" : 10,
                    "description" : ""
                }
            ],
            "exam" : [],
            "selectedLabCategory" : [ 
                {
                    "value" : "간기능",
                    "label" : "간기능",
                    "_id" : "5e54ce8ac5189242e6a0074f"
                }, 
                {
                    "value" : "",
                    "label" : "갑상선",
                    "_id" : "5e54ce8ac5189242e6a0074e"
                }, 
                {
                    "value" : "",
                    "label" : "근육",
                    "_id" : "5e54ce8ac5189242e6a0074d"
                }, 
                {
                    "value" : "",
                    "label" : "단백질",
                    "_id" : "5e54ce8ac5189242e6a0074c"
                }, 
                {
                    "value" : "",
                    "label" : "대사",
                    "_id" : "5e54ce8ac5189242e6a0074b"
                }, 
                {
                    "value" : "",
                    "label" : "무기질",
                    "_id" : "5e54ce8ac5189242e6a0074a"
                }, 
                {
                    "value" : "백혈구",
                    "label" : "백혈구",
                    "_id" : "5e54ce8ac5189242e6a00749"
                }, 
                {
                    "value" : "",
                    "label" : "비타민",
                    "_id" : "5e54ce8ac5189242e6a00748"
                }, 
                {
                    "value" : "",
                    "label" : "뼈",
                    "_id" : "5e54ce8ac5189242e6a00747"
                }, 
                {
                    "value" : "신장",
                    "label" : "신장",
                    "_id" : "5e54ce8ac5189242e6a00746"
                }, 
                {
                    "value" : "",
                    "label" : "염증",
                    "_id" : "5e54ce8ac5189242e6a00745"
                }, 
                {
                    "value" : "",
                    "label" : "전립선",
                    "_id" : "5e54ce8ac5189242e6a00744"
                }, 
                {
                    "value" : "",
                    "label" : "전해질",
                    "_id" : "5e54ce8ac5189242e6a00743"
                }, 
                {
                    "value" : "지질",
                    "label" : "지질",
                    "_id" : "5e54ce8ac5189242e6a00742"
                }, 
                {
                    "value" : "",
                    "label" : "철분",
                    "_id" : "5e54ce8ac5189242e6a00741"
                }, 
                {
                    "value" : "혈구",
                    "label" : "혈구",
                    "_id" : "5e54ce8ac5189242e6a00740"
                }, 
                {
                    "value" : "혈당",
                    "label" : "혈당",
                    "_id" : "5e54ce8ac5189242e6a0073f"
                }, 
                {
                    "value" : "",
                    "label" : "호르몬",
                    "_id" : "5e54ce8ac5189242e6a0073e"
                }
            ],
            "lab" : [ 
                {
                    "_id" : "5e54ce8ac5189242e6a0076f",
                    "category" : "백혈구",
                    "name" : "Total WBCs",
                    "name_kor" : "총백혈구수",
                    "description" : null,
                    "value" : "6.3",
                    "unit" : "10^3/µL",
                    "state" : "최적",
                    "refMin" : 3.8,
                    "refMax" : 10.8,
                    "optMin" : 5.5,
                    "optMax" : 7.5,
                    "alertMax" : 11,
                    "alertMessage" : "발열, 오한 증상이 동반될 수 있습니다. 상급의료기관 진료가 필요합니다.",
                    "originalIndex" : 0
                }, 
                {
                    "_id" : "5e54ce8ac5189242e6a0076e",
                    "category" : "백혈구",
                    "name" : "Lymphocytes",
                    "name_kor" : "림프구(%)",
                    "description" : null,
                    "value" : "35.5",
                    "unit" : "%",
                    "state" : "최적",
                    "refMin" : 14,
                    "refMax" : 46,
                    "optMin" : 24,
                    "optMax" : 44,
                    "originalIndex" : 1
                }, 
                {
                    "_id" : "5e54ce8ac5189242e6a0076d",
                    "category" : "백혈구",
                    "name" : "Monocytes",
                    "name_kor" : "단핵구(%)",
                    "description" : null,
                    "value" : "20.2",
                    "unit" : "%",
                    "state" : "매우 높음",
                    "refMin" : 4,
                    "refMax" : 13,
                    "optMin" : 0,
                    "optMax" : 7,
                    "originalIndex" : 2
                }, 
                {
                    "_id" : "5e54ce8ac5189242e6a0076c",
                    "category" : "백혈구",
                    "name" : "Granulocytes",
                    "name_kor" : "과립구(%)",
                    "description" : null,
                    "value" : "44.3",
                    "unit" : "%",
                    "state" : "매우 낮음",
                    "refMin" : 55,
                    "refMax" : 60,
                    "optMin" : 55,
                    "optMax" : 60,
                    "originalIndex" : 3
                }, 
                {
                    "_id" : "5e54ce8ac5189242e6a0076b",
                    "category" : "백혈구",
                    "name" : "Lymphocytes#",
                    "name_kor" : "림프구수",
                    "description" : null,
                    "value" : "2.2",
                    "unit" : "10^3/µL",
                    "state" : "최적",
                    "refMin" : 1.2,
                    "refMax" : 3.6,
                    "optMin" : 1.2,
                    "optMax" : 3.6,
                    "alertMin" : 1,
                    "alertMax" : 4,
                    "alertMessage" : "수치가 1 미만이면서 무력감, 피로 등의 증상이 나타나는 경우에는 상급의료기관 진료를 권고합니다.",
                    "originalIndex" : 4
                }, 
                {
                    "_id" : "5e54ce8ac5189242e6a0076a",
                    "category" : "백혈구",
                    "name" : "Monocytes#",
                    "name_kor" : "단핵구수",
                    "description" : null,
                    "value" : "1.3",
                    "unit" : "10^3/µL",
                    "state" : "매우 높음",
                    "refMin" : 0.1,
                    "refMax" : 0.9,
                    "optMin" : 0.1,
                    "optMax" : 0.9,
                    "originalIndex" : 5
                }, 
                {
                    "_id" : "5e54ce8ac5189242e6a00769",
                    "category" : "백혈구",
                    "name" : "Granulocytes#",
                    "name_kor" : "과립구수",
                    "description" : null,
                    "value" : "2.8",
                    "unit" : "10^3/µL",
                    "state" : "최적",
                    "refMin" : 2,
                    "refMax" : 5.4,
                    "optMin" : 2,
                    "optMax" : 5.4,
                    "originalIndex" : 6
                }, 
                {
                    "_id" : "5e54ce8ac5189242e6a00768",
                    "category" : "혈구",
                    "name" : "RBC",
                    "name_kor" : "적혈구수",
                    "description" : null,
                    "value" : "4.19",
                    "unit" : "10^6/µL",
                    "state" : "최적",
                    "refMin" : 3.8,
                    "refMax" : 5.1,
                    "optMin" : 3.9,
                    "optMax" : 4.5,
                    "sex" : "F",
                    "originalIndex" : 7
                }, 
                {
                    "_id" : "5e54ce8ac5189242e6a00767",
                    "category" : "혈구",
                    "name" : "Hemoglobin",
                    "name_kor" : "혈색소",
                    "description" : null,
                    "value" : "11.2",
                    "unit" : "g/dL",
                    "state" : "매우 낮음",
                    "refMin" : 11.7,
                    "refMax" : 15.5,
                    "optMin" : 13.5,
                    "optMax" : 14.5,
                    "sex" : "F",
                    "alertMin" : 9,
                    "alertMax" : 16.5,
                    "alertMessage" : "9 g/dL 이하이면서 무력감과 안면창백 등의 증상이 나타나는 경우, 또는 9 g/dL 이상인 경우에는 상급의료기관 진료를 권고합니다. 7 g/dL 이하일 경우 응급 진료가 필요합니다.",
                    "originalIndex" : 8
                }, 
                {
                    "_id" : "5e54ce8ac5189242e6a00766",
                    "category" : "혈구",
                    "name" : "Hematocrit",
                    "name_kor" : "적혈구용적률",
                    "description" : null,
                    "value" : "35.1",
                    "unit" : "%",
                    "state" : "낮음",
                    "refMin" : 35,
                    "refMax" : 45,
                    "optMin" : 37,
                    "optMax" : 44,
                    "sex" : "F",
                    "originalIndex" : 9
                }, 
                {
                    "_id" : "5e54ce8ac5189242e6a00765",
                    "category" : "혈구",
                    "name" : "MCV",
                    "name_kor" : "평균적혈구용적",
                    "description" : null,
                    "value" : "84.0",
                    "unit" : "fL",
                    "state" : "최적",
                    "refMin" : 80,
                    "refMax" : 100,
                    "optMin" : 82,
                    "optMax" : 89.9,
                    "originalIndex" : 10
                }, 
                {
                    "_id" : "5e54ce8ac5189242e6a00764",
                    "category" : "혈구",
                    "name" : "MCH",
                    "name_kor" : "평균적혈구혈색소",
                    "description" : null,
                    "value" : "26.7",
                    "unit" : "pg",
                    "state" : "매우 낮음",
                    "refMin" : 27,
                    "refMax" : 33,
                    "optMin" : 28,
                    "optMax" : 31.9,
                    "originalIndex" : 11
                }, 
                {
                    "_id" : "5e54ce8ac5189242e6a00763",
                    "category" : "혈구",
                    "name" : "MCHC",
                    "name_kor" : "평균적혈구혈색소농도",
                    "description" : null,
                    "value" : "31.9",
                    "unit" : "g/dL",
                    "state" : "매우 낮음",
                    "refMin" : 32,
                    "refMax" : 36,
                    "optMin" : 32,
                    "optMax" : 35,
                    "originalIndex" : 12
                }, 
                {
                    "_id" : "5e54ce8ac5189242e6a00762",
                    "category" : "혈구",
                    "name" : "RDW-SD",
                    "name_kor" : "적혈구분포(표준편차)",
                    "description" : null,
                    "value" : "40.6",
                    "unit" : "fL",
                    "state" : "최적",
                    "refMin" : 25,
                    "refMax" : 80,
                    "optMin" : 25,
                    "optMax" : 80,
                    "originalIndex" : 13
                }, 
                {
                    "_id" : "5e54ce8ac5189242e6a00761",
                    "category" : "혈구",
                    "name" : "RDW",
                    "name_kor" : "적혈구분포폭",
                    "description" : null,
                    "value" : "13.3",
                    "unit" : "%",
                    "state" : "높음",
                    "refMin" : 11,
                    "refMax" : 15,
                    "optMin" : 11.7,
                    "optMax" : 13,
                    "originalIndex" : 14
                }, 
                {
                    "_id" : "5e54ce8ac5189242e6a00760",
                    "category" : "혈구",
                    "name" : "Platelets",
                    "name_kor" : "혈소판수",
                    "description" : null,
                    "value" : "200.0",
                    "unit" : "10^3/µL",
                    "state" : "최적",
                    "refMin" : 140,
                    "refMax" : 400,
                    "optMin" : 155,
                    "optMax" : 385,
                    "alertMin" : 100,
                    "alertMessage" : "수치가 100 미만이면서 잦은 멍, 무력감 등의 증상이 나타나는 경우에는 상급의료기관 진료를 권고합니다. 30 미만인 경우 응급 진료가 필요합니다.",
                    "originalIndex" : 15
                }, 
                {
                    "_id" : "5e54ce8ac5189242e6a0075f",
                    "category" : "혈구",
                    "name" : "MPV",
                    "name_kor" : "혈소판용적",
                    "description" : null,
                    "value" : "10.2",
                    "unit" : "fL",
                    "state" : "최적",
                    "refMin" : 7.4,
                    "refMax" : 10.4,
                    "optMin" : 7.4,
                    "optMax" : 10.4,
                    "originalIndex" : 16
                }, 
                {
                    "_id" : "5e54ce8ac5189242e6a0075e",
                    "category" : "혈구",
                    "name" : "PDW",
                    "name_kor" : "혈소판분포폭",
                    "description" : null,
                    "value" : "11.0",
                    "unit" : "%",
                    "state" : "매우 낮음",
                    "refMin" : 15.5,
                    "refMax" : 17.5,
                    "optMin" : 15.5,
                    "optMax" : 17.5,
                    "originalIndex" : 17
                }, 
                {
                    "_id" : "5e54ce8ac5189242e6a0075d",
                    "category" : "혈구",
                    "name" : "Plateletcrit",
                    "name_kor" : "혈소판용적치",
                    "description" : null,
                    "value" : "0.2",
                    "unit" : "%",
                    "state" : "최적",
                    "refMin" : 0.15,
                    "refMax" : 0.32,
                    "optMin" : 0.15,
                    "optMax" : 0.32,
                    "originalIndex" : 18
                }, 
                {
                    "_id" : "5e54ce8ac5189242e6a0075c",
                    "category" : "혈구",
                    "name" : "Platelet - Large Cell Ratio",
                    "name_kor" : "거대혈소판(%)",
                    "description" : null,
                    "value" : "21.8",
                    "unit" : "%",
                    "state" : "최적",
                    "refMin" : 0.1,
                    "refMax" : 99.9,
                    "optMin" : 0.1,
                    "optMax" : 99.9,
                    "originalIndex" : 19
                }, 
                {
                    "_id" : "5e54ce8ac5189242e6a0075b",
                    "category" : "지질",
                    "name" : "Cholesterol - Total",
                    "name_kor" : "총콜레스테롤",
                    "description" : null,
                    "value" : "183.0",
                    "unit" : "mg/dL",
                    "state" : "높음",
                    "refMin" : 125,
                    "refMax" : 200,
                    "optMin" : 160,
                    "optMax" : 180,
                    "originalIndex" : 20
                }, 
                {
                    "_id" : "5e54ce8ac5189242e6a0075a",
                    "category" : "지질",
                    "name" : "Triglycerides",
                    "name_kor" : "중성지방",
                    "description" : null,
                    "value" : "74.0",
                    "unit" : "mg/dL",
                    "state" : "최적",
                    "refMin" : 0,
                    "refMax" : 150,
                    "optMin" : 70,
                    "optMax" : 80,
                    "alertMax" : 500,
                    "alertMessage" : "500 mg/dL 이상인 경우 상급의료기관 진료를 권고합니다. 특별한 증상이 나타나지 않을 수도 있습니다. ",
                    "originalIndex" : 21
                }, 
                {
                    "_id" : "5e54ce8ac5189242e6a00759",
                    "category" : "지질",
                    "name" : "HDL Cholesterol",
                    "name_kor" : "고밀도지단백 콜레스테롤",
                    "description" : null,
                    "value" : "74.0",
                    "unit" : "mg/dL",
                    "state" : "높음",
                    "refMin" : 46,
                    "refMax" : 100,
                    "optMin" : 55,
                    "optMax" : 70,
                    "originalIndex" : 22
                }, 
                {
                    "_id" : "5e54ce8ac5189242e6a00758",
                    "category" : "지질",
                    "name" : "LDL Cholesterol",
                    "name_kor" : "저밀도지단백 콜레스테롤",
                    "description" : null,
                    "value" : "94.0",
                    "unit" : "mg/dL",
                    "state" : "최적",
                    "refMin" : 0,
                    "refMax" : 130,
                    "optMin" : 0,
                    "optMax" : 120,
                    "alertMax" : 190,
                    "alertMessage" : "190 mg/dL 이상인 경우 상급의료기관 진료를 권고합니다. 특별한 증상이 나타나지 않을 수도 있습니다. ",
                    "originalIndex" : 23
                }, 
                {
                    "_id" : "5e54ce8ac5189242e6a00757",
                    "category" : "지질",
                    "name" : "Cholesterol/HDL Ratio",
                    "name_kor" : "총콜레스테롤/HDL 비율",
                    "description" : null,
                    "value" : "2.5",
                    "unit" : "Ratio",
                    "state" : "최적",
                    "refMin" : 0,
                    "refMax" : 5,
                    "optMin" : 0,
                    "optMax" : 3,
                    "originalIndex" : 24
                }, 
                {
                    "_id" : "5e54ce8ac5189242e6a00756",
                    "category" : "지질",
                    "name" : "non-HDL",
                    "name_kor" : "비HDL",
                    "description" : null,
                    "value" : "109.0",
                    "unit" : "mg/dL",
                    "state" : "최적",
                    "refMin" : 50,
                    "refMax" : 160,
                    "optMin" : 50,
                    "optMax" : 160,
                    "originalIndex" : 25
                }, 
                {
                    "_id" : "5e54ce8ac5189242e6a00755",
                    "category" : "간기능",
                    "name" : "AST (SGOT)",
                    "name_kor" : "아스파테이트아미노전이효소",
                    "description" : null,
                    "value" : "28.0",
                    "unit" : "IU/L",
                    "state" : "높음",
                    "refMin" : 10,
                    "refMax" : 35,
                    "optMin" : 10,
                    "optMax" : 26,
                    "alertMax" : 200,
                    "alertMessage" : "200 IU/L 이상이면서 피로와 소화불량 등의 증상이 나타나는 경우, 상급의료기관 진료를 권고합니다. 300 IU/L 이상인 경우, 응급 진료가 필요합니다.",
                    "originalIndex" : 26
                }, 
                {
                    "_id" : "5e54ce8ac5189242e6a00754",
                    "category" : "간기능",
                    "name" : "ALT (SGPT)",
                    "name_kor" : "알라닌아미노전이효소",
                    "description" : null,
                    "value" : "26.0",
                    "unit" : "IU/L",
                    "state" : "최적",
                    "refMin" : 6,
                    "refMax" : 29,
                    "optMin" : 10,
                    "optMax" : 26,
                    "alertMax" : 200,
                    "alertMessage" : "200 IU/L 이상이면서 피로와 소화불량 등의 증상이 나타나는 경우, 상급의료기관 진료를 권고합니다. 300 IU/L 이상인 경우, 응급 진료가 필요합니다.",
                    "originalIndex" : 27
                }, 
                {
                    "_id" : "5e54ce8ac5189242e6a00753",
                    "category" : "간기능",
                    "name" : "GGT",
                    "name_kor" : "감마글루타밀전이효소",
                    "description" : "Alk Phos와 동반상승하면서 무력감, 피로, 소화불량 등의 증상이 나타나는 경우, 상급의료기관 진료를 권고합니다.",
                    "value" : "11.0",
                    "unit" : "IU/L",
                    "state" : "최적",
                    "refMin" : 3,
                    "refMax" : 70,
                    "optMin" : 10,
                    "optMax" : 30,
                    "originalIndex" : 28
                }, 
                {
                    "_id" : "5e54ce8ac5189242e6a00752",
                    "category" : "신장",
                    "name" : "Creatinine",
                    "name_kor" : "크레아티닌",
                    "description" : null,
                    "value" : "0.47",
                    "unit" : "mg/dL",
                    "state" : "낮음",
                    "refMin" : 0.4,
                    "refMax" : 1.5,
                    "optMin" : 0.8,
                    "optMax" : 1.1,
                    "alertMax" : 1.7,
                    "alertMessage" : "1.7 mg/dL 이상이면서 피로감을 동반한 경우, 상급의료기관 진료를 권고합니다.",
                    "originalIndex" : 29
                }, 
                {
                    "_id" : "5e54ce8ac5189242e6a00751",
                    "category" : "신장",
                    "name" : "BUN",
                    "name_kor" : "혈액요소질소",
                    "description" : null,
                    "value" : "11.1",
                    "unit" : "mg/dL",
                    "state" : "최적",
                    "refMin" : 7,
                    "refMax" : 25,
                    "optMin" : 10,
                    "optMax" : 16,
                    "alertMax" : 30,
                    "alertMessage" : "30 mg/dL 이상이면서 피로감을 동반한 경우, 상급의료기관 진료를 권고합니다.",
                    "originalIndex" : 30
                }, 
                {
                    "_id" : "5e54ce8ac5189242e6a00750",
                    "category" : "혈당",
                    "name" : "Hemoglobin A1C",
                    "name_kor" : "당화혈색소",
                    "description" : null,
                    "value" : "4.51",
                    "unit" : "%",
                    "state" : "최적",
                    "refMin" : 0,
                    "refMax" : 5.7,
                    "optMin" : 4.5,
                    "optMax" : 5.5,
                    "alertMax" : 6.5,
                    "alertMessage" : "수치가 6.5 이상이면서 식후 피로감과 혈당조절이상 의심 증상이 나타나는 경우, 상급의료기관 진료를 권고합니다.",
                    "originalIndex" : 31
                }
            ],
            "analyzeCondition" : [],
            "analyzeSymptom" : [],
            "analyzeLab" : [],
            "diagnosis" : [ 
                {
                    "_id" : "5e54ce8ac5189242e6a00773",
                    "category" : "",
                    "name" : "갑상선염",
                    "description" : "",
                    "strategy" : ""
                }, 
                {
                    "_id" : "5e54ce8ac5189242e6a00772",
                    "category" : "",
                    "name" : "갑상선기능저하",
                    "description" : "",
                    "strategy" : ""
                }, 
                {
                    "_id" : "5e54ce8ac5189242e6a00771",
                    "category" : "",
                    "name" : "부신기능저하증",
                    "description" : "",
                    "strategy" : ""
                }, 
                {
                    "_id" : "5e54ce8ac5189242e6a00770",
                    "category" : "",
                    "name" : "갑상선기능항진",
                    "description" : "",
                    "strategy" : ""
                }
            ],
            "analyzeTreatment" : [],
            "treatment" : {
                "drugName" : "십전대보탕",
                "guide" : "복얍법 설명하는 공간",
                "caution" : "처방된 약을 복용할 때 주의해야 할 것들을 섦명",
                "lifestyle" : "",
                "fomula" : [ 
                    {
                        "_id" : "5e54ce8ac5189242e6a00778",
                        "herbName" : "감초",
                        "dose" : 8
                    }, 
                    {
                        "_id" : "5e54ce8ac5189242e6a00777",
                        "herbName" : "녹용",
                        "dose" : 20
                    }, 
                    {
                        "_id" : "5e54ce8ac5189242e6a00776",
                        "herbName" : "허브",
                        "dose" : 10
                    }, 
                    {
                        "_id" : "5e54ce8ac5189242e6a00775",
                        "herbName" : "버섯",
                        "dose" : 5
                    }, 
                    {
                        "_id" : "5e54ce8ac5189242e6a00774",
                        "herbName" : "인삼",
                        "dose" : 17
                    }
                ]
            },
            "teaching" : [ 
                {
                    "description" : "",
                    "ref_id" : "",
                    "_id" : "5e54ce8ac5189242e6a00783"
                }, 
                {
                    "description" : "갑상선 호르몬의 전환 과정에 문제가 있다고 판단될 경우엔 셀레늄, 아연 등이 포함된 식품 혹은 영양제를 섭취하도록 합니다. ",
                    "ref_id" : "IML",
                    "_id" : "5e54ce8ac5189242e6a00782"
                }, 
                {
                    "description" : "갑상선기능저하일 때는 강도 높은 운동을 하다가 다칠 우려가 있으니 저강도의 운동을 지속적으로 하는 것을 추천합니다. ",
                    "ref_id" : "606",
                    "_id" : "5e54ce8ac5189242e6a00781"
                }, 
                {
                    "description" : "갑상선기능저하증이 악화되는 것을 방지하기 위해 항산화 효능이 있는 셀레늄을 보충하는 것을 추천합니다. ",
                    "ref_id" : "606",
                    "_id" : "5e54ce8ac5189242e6a00780"
                }, 
                {
                    "description" : "갑상선기능저하증이 있을 때 무작정 굶으면서 체중감량을 할 경우엔 영양불균형으로 인해 갑상선기능저하가 더욱 심해지면서, 체중감량도 잘 되질 않습니다. ",
                    "ref_id" : "IML",
                    "_id" : "5e54ce8ac5189242e6a0077f"
                }, 
                {
                    "description" : "갑상선기능저하증일 경우엔 요오드가 함유된 해조류 섭취량을 늘릴 것을 권장합니다. ",
                    "ref_id" : "IML",
                    "_id" : "5e54ce8ac5189242e6a0077e"
                }, 
                {
                    "description" : "자가면역성 갑상선기능저하라면 면역 균형 회복을 위한 한약을 복용할 것을 추천합니다. ",
                    "ref_id" : "IML",
                    "_id" : "5e54ce8ac5189242e6a0077d"
                }, 
                {
                    "description" : "체중이 증가하진 않는지, 부종이 전신으로 심해지진 않는지를 살펴보아야 합니다. ",
                    "ref_id" : "IML",
                    "_id" : "5e54ce8ac5189242e6a0077c"
                }, 
                {
                    "description" : "DHEA등 보충제를 섭취하도록 합니다. ",
                    "ref_id" : "629",
                    "_id" : "5e54ce8ac5189242e6a0077b"
                }, 
                {
                    "description" : "과로, 스트레스를 줄여야 부신기능을 보호할 수 있습니다. ",
                    "ref_id" : "628",
                    "_id" : "5e54ce8ac5189242e6a0077a"
                }, 
                {
                    "description" : "미네랄 모니터링을 하여 부종, 심장기능을 관리합니다. ",
                    "ref_id" : "628",
                    "_id" : "5e54ce8ac5189242e6a00779"
                }
            ]
        }
    ],
    "__v" : 0
}