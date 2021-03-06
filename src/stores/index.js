import auth from './authStore';
import Case from './caseStore';
import error from './errorStore';
import login from './loginStore';
import signup from './signupStore';
import user from './userStore';
import search from './searchStore';
import caseEditorBasic from './caseEditorBasicStore';
import collapsible from './collapsibleStore';
import symptom from './symptomStore';
import symptomListItem from './symptomListItemStore';
import symptomListForInput from './symptomListForInputStore';
import diagnosis from './diagnosisStore';
import diagnosisListItem from './diagnosisListItemStore';
import diagnosisListForInput from './diagnosisListForInputStore';
import treatment from './treatmentStore';
import drugListItem from './drugListItemStore';
import drugListForInput from './drugListForInputStore';
import lab from './labStore';
import labListItem from './labListItemStore';
import labListForInput from './labListForInputStore';
import modal from './modalStore';
import analyzeSymptom from './analyzeSymptomStore';
import analyzeDrug from './analyzeRecommendationTreatmentStore';
import analyzeTeaching from './analyzeTeachingStore';
import teaching from './teachingStore';
import caseEditor from './caseEditorStore';
import print from './PrintStore';

const stores = {
    auth,
    Case,
    error,
    login,
    signup,
    user,
    search,
    caseEditorBasic,
    collapsible,
    symptom,
    symptomListItem,
    symptomListForInput,
    diagnosis,
    diagnosisListForInput,
    diagnosisListItem,
    treatment,
    drugListItem,
    drugListForInput,
    lab,
    labListForInput,
    labListItem,
    modal,
    analyzeSymptom,
    analyzeDrug,
    analyzeTeaching,
    teaching,
    caseEditor,
    print
}

export default stores;