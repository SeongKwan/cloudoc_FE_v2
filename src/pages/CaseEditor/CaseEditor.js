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
    this.props.symptomListItem.loadSymptoms()
    .then((res) => {
      this.props.drugListItem.loadDrugs();
      this.props.diagnosisListItem.loadConditions();
    })
    .catch((err) => {
      console.log(err);
    });
  }
  

  render() {
    const type = this.props.location.pathname.split('/')[3]
    
    return (
      <div className={cx('CaseEditor')}>
        <Helmet>
            <title>{type === 'create' ? 'Case Create' : 'Case Editor'}</title>
        </Helmet>
        <HeaderEditor type={type} />
        <div className={cx('container', 'left')}>
          <div className={cx('scroll-box')}>
            <LeftSideToolbar />
          </div>
        </div>
        <div id="case-editor-center-container" className={cx('container', 'center')}>
          <div id="case-editor-center-container-scroll-box" className={cx('scroll-box')}>
            <div className={cx('container-case')}>
              <Basic />
              <CollapsibleBox 
                title="추가정보(선택입력)" 
                initOpen={false}
              >
                <BasicOptional />
              </CollapsibleBox>
              <Symptoms />
              <Lab />
              <Diagnosis />
              <Drug />
            </div>
          </div>
        </div>
        <div className={cx('container', 'right')}>
          <div className={cx('scroll-box')}>
            <RightSideList />
          </div>
        </div>
      </div>
    );
  }
}

export default CaseEditor;