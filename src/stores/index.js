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
    symptomListForInput
}

export default stores;