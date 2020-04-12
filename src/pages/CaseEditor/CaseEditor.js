import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import styles from './CaseEditor.module.scss';
import classNames from 'classnames/bind';
import { Helmet } from "react-helmet";
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
import { FiArrowUp } from '../../lib/react-icons/fi';

const cx = classNames.bind(styles);

@withRouter
@inject(
  'auth', 'Case', 'login', 'user', 
  'lab', 'caseEditorBasic', 'symptomListItem',
  'drugListItem', 'diagnosisListItem', 'collapsible'
)
@observer
class CaseEditor extends Component {
  componentDidMount() {
    const { type, caseId, dateIndex } = this.props.match.params;
    const scrollBox = $('#case-editor-center-container-scroll-box');
    scrollBox.scrollTop(0);
    scrollBox.on("scroll", function() {
      if ( $( this ).scrollTop() > 400 ) {
        $( '#scroll-to-top' ).fadeIn();
      } else {
        $( '#scroll-to-top' ).fadeOut();
      }
    });

    if (type === 'detail') {
      this.props.Case.loadCase(caseId, dateIndex);
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
    const { type, dateIndex } = this.props.match.params;
    const scrollBox = $('#case-editor-center-container-scroll-box');
    let where = this.props.history.location.pathname.split('/')[3];
    if (where === 'detail') {
      if (prevProps.match.params.dateIndex !== this.props.match.params.dateIndex) {
        this.props.Case.setCurrentCaseDetail(dateIndex);
        this.props.Case.setCurrentCase(this.props.Case.currentCase, dateIndex);
      }
    }
    
    scrollBox.on("scroll", function() {
      if ( $( this ).scrollTop() > 400 ) {
        $( '#scroll-to-top' ).fadeIn();
      } else {
        $( '#scroll-to-top' ).fadeOut();
      }
    });
    
    if (prevProps.location.pathname.split('/')[3] !== type) {
      scrollBox.scrollTop(0);
    }
  }

  componentWillUnmount() {
    this.props.Case.clearIsEditing();
    this.props.Case.clearCurrentCase();
    this.props.Case.clearAllEditableData();
    this.props.collapsible.clear();
  }

  handleClickOnTopScroll = () => {
    $('#case-editor-center-container-scroll-box').animate({scrollTop : 0}, 400);
  }

  render() {
    const { type } = this.props.match.params;
    const { isEditing, isLoading } = this.props.Case;
    const {
      pastHistory, familyHistory,
      socialHistory, memo
    } = this.props.caseEditorBasic.editableData;
    let checkContentEmpty;
    if (pastHistory === '' && familyHistory === '' && socialHistory === '' && memo === '') {
      checkContentEmpty = false;
    } else {
      checkContentEmpty = true;
    }

    return (
      <div className={cx('CaseEditor')}>
        <Helmet>
            <title>{type === 'create' ? 'Case Create' : 'Case Editor'}</title>
        </Helmet>
        <HeaderEditor type={type} />
        {
          (isLoading && !this.props.Case.onReady) ? <div className={cx('loader-container')}><Loader /></div>
          : <>
            <div className={cx('container', 'left')}>
              <div className={cx('scroll-box')}>
                <LeftSideToolbar type={type} />
              </div>
            </div>
            <div id="case-editor-center-container" className={cx('container', 'center')}>
              <div id="case-editor-center-container-scroll-box" className={cx('scroll-box')}>
                  <>
                    <Basic type={type} />
                    <CollapsibleBox 
                      type="basic"
                      title={isEditing || type === "create" ? "추가정보(선택입력)" : "추가정보"} 
                      initOpen={(type === "detail" && checkContentEmpty) ? true : false}
                      sidebar={false}
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
                <RightSideList type={type} isEditing={isEditing} />
              </div>
              <div id="scroll-to-top" className={cx('scroll-to-top')} onClick={this.handleClickOnTopScroll}><FiArrowUp /></div>
            </div>
          </>
        }
      </div>
    );
  }
}

export default CaseEditor;