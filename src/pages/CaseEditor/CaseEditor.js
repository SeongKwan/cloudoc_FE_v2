import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import styles from './CaseEditor.module.scss';
import classNames from 'classnames/bind';
import { Helmet } from "react-helmet";
// import Loader from '../../components/Loader/Loader';
import HeaderEditor from '../../components/HeaderEditor/HeaderEditor';
import Basic from './components/Basic/Basic';
import Symptoms from './components/Symptoms/Symptoms';
import BasicOptional from './components/BasicOptional';
import CollapsibleBox from '../../components/CollapsibleBox/CollapsibleBox';
import Diagnosis from './components/Diagnosis/Diagnosis';
import Drug from './components/Drug/Drug';
import Lab from './components/Lab';
import LeftSideToolbar from './components/LeftSideToolbar/LeftSideToolbar';
import RightSideList from './components/RightSideList/RightSideList';
import Teaching from './components/Teaching/Teaching';
import $ from 'jquery';
import Loader from '../../components/Loader';

const cx = classNames.bind(styles);

@withRouter
@inject(
  'auth',
  'Case',
  'login',
  'user', 
  'caseEditorBasic',
  'symptomListItem',
  'drugListItem',
  'diagnosisListItem'
)
@observer
class CaseEditor extends Component {
  componentDidMount() {
    const type = this.props.location.pathname.split('/')[3];
    const caseId = this.props.location.pathname.split('/')[4];
    if (type === 'detail') {
      this.props.Case.loadCase(caseId);
    }
    this.props.symptomListItem.loadSymptoms()
    .then((res) => {
      this.props.drugListItem.loadDrugs();
      this.props.diagnosisListItem.loadConditions();
    })
    .catch((err) => {
      console.log(err);
    });
  }

  componentDidUpdate(prevProps) {
    const type = this.props.location.pathname.split('/')[3];
    if (prevProps.location.pathname.split('/')[3] !== type) {
      $('#case-editor-center-container-scroll-box').scrollTop(0);
    }
  }

  componentWillUnmount() {
    this.props.Case.clearIsEditing();
    this.props.Case.clearCurrentCase();
  }
  

  render() {
    const type = this.props.location.pathname.split('/')[3]
    const { isEditing, isLoading } = this.props.Case;
    const {
      pastHistory,
      familyHistory,
      socialHistory,
      memo
    } = this.props.caseEditorBasic.editableData;
    let checkContentEmpty;
    if (pastHistory === '' && familyHistory === '' && socialHistory === '' && memo === '') {
      checkContentEmpty = false;
    } else {
      checkContentEmpty = true;
    }

    return (
      <div className={cx('CaseEditor', {isLoading: isLoading})}>
        <Helmet>
            <title>{type === 'create' ? 'Case Create' : 'Case Editor'}</title>
        </Helmet>
        <HeaderEditor type={type} />
        {
          isLoading ? <Loader /> 
          : <>
            <div className={cx('container', 'left')}>
              <div className={cx('scroll-box')}>
                {
                  (type === "create" || isEditing) &&
                  <LeftSideToolbar type={type} />
                }
              </div>
            </div>
            <div id="case-editor-center-container" className={cx('container', 'center')}>
              <div id="case-editor-center-container-scroll-box" className={cx('scroll-box')}>
                
                  <>
                    <Basic type={type} />
                    <CollapsibleBox 
                      title={isEditing || type === "create" ? "추가정보(선택입력)" : "추가정보"} 
                      initOpen={(type === "detail" && checkContentEmpty) ? true : false}
                    >
                      <BasicOptional type={type} />
                    </CollapsibleBox>
                    <Symptoms type={type} />
                    <Lab type={type} />
                    <Diagnosis type={type} />
                    <Drug type={type} />
                    <Teaching type={type} />
                  </>
                
              </div>
            </div>
            <div className={cx('container', 'right')}>
              <div className={cx('scroll-box')}>
                {
                  (type === "create" || isEditing) &&
                  <RightSideList type={type} isEditing={isEditing} />
                }
              </div>
            </div>
          </>
        }
      </div>
    );
  }
}

export default CaseEditor;