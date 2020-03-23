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
import {
  FiArrowUp
} from '../../lib/react-icons/fi';
import {
  IoMdArrowDropdown
} from 'react-icons/io';
// import {
//   MdKeyboardArrowLeft,
//   MdKeyboardArrowRight
// } from 'react-icons/md';
import { getLocaleDateWithYMS } from '../../utils/momentHelper';

const cx = classNames.bind(styles);

@withRouter
@inject(
  'auth',
  'Case',
  'login',
  'user', 
  'lab',
  'caseEditorBasic',
  'symptomListItem',
  'drugListItem',
  'diagnosisListItem'
)
@observer
class CaseEditor extends Component {
  state = { 
    focusParent: false
}
  componentDidMount() {
    const { type, caseId, dateIndex } = this.props.match.params;

    
    $('#case-editor-center-container-scroll-box').scrollTop(0);

    $('#case-editor-center-container-scroll-box').on("scroll", function() {
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

    document.addEventListener('mousedown', this._handleClickOutside);
    
  }

  componentDidUpdate(prevProps) {
    const { type, dateIndex } = this.props.match.params;
    if (prevProps.match.params.dateIndex !== this.props.match.params.dateIndex) {
      this.props.Case.setCurrentCaseDetail(dateIndex);
      this.props.Case.setCurrentCase(this.props.Case.currentCase, dateIndex);
    }
    
    $('#case-editor-center-container-scroll-box').on("scroll", function() {
      if ( $( this ).scrollTop() > 400 ) {
        $( '#scroll-to-top' ).fadeIn();
      } else {
        $( '#scroll-to-top' ).fadeOut();
      }
    });

    
    if (prevProps.location.pathname.split('/')[3] !== type) {
      $('#case-editor-center-container-scroll-box').scrollTop(0);
    }
  }

  componentWillUnmount() {
    this.props.Case.clearIsEditing();
    this.props.Case.clearCurrentCase();
    document.removeEventListener('mousedown', this._handleClickOutside);
  }

  _handleClickOutside = (event) => {
    if (this.recordDate && !this.recordDate.contains(event.target)) {
        this.setState({ focusParent: false});
        
    }
}

  handleClickOnTopScroll = () => {
    $('#case-editor-center-container-scroll-box').animate( { scrollTop : 0 }, 400 );
  }

  _toggleOnFocus = () => {
    this.setState({ focusParent: true})
  }

  render() {
    const { type, dateIndex, caseId } = this.props.match.params;
    const { isEditing, isLoading, currentCaseRecord } = this.props.Case;
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
                    {
                      type === 'detail' &&
                      <div 
                          ref={(ref) => {
                              this.recordDate = ref;
                          }}
                          className={cx('record-date', {focus: this.state.focusParent})}>
                        <div className={cx('selected-date')} 
                          onClick={() => { this._toggleOnFocus(); }}
                        >
                          <div>({`${+dateIndex + 1}/${currentCaseRecord.length}`})</div>
                          {
                            currentCaseRecord.length > 0 &&
                            <div>{getLocaleDateWithYMS(currentCaseRecord[dateIndex])}</div>
                          }
                          <div className={cx('arrow-down-icon')}><IoMdArrowDropdown /></div>
                        </div>
                        {
                          this.state.focusParent &&
                          <div className={cx('records')}>
                            <ul>
                              {
                                currentCaseRecord.map((date, i) => {
                                  return <li key={i}>
                                    <div 
                                      onClick={() => {
                                        this.setState({focusParent: false});
                                        if (isEditing) {
                                            if (this.props.Case.checkDifferenceContent()) {
                                                if (window.confirm('저장되지 않은 내용이 있습니다. 저장하고 다른 진료일자로 바꾸시겠습니까?')) {
                                                  return this.props.Case.updateCase(dateIndex)
                                                    .then(res => {
                                                        if (res) {
                                                            alert('정상적으로 수정되었습니다')
                                                        }
                                                    })
                                                    .then(() => {
                                                      this.props.history.push(`/case/editor/detail/${caseId}/${i}`);
                                                    })
                                                    .catch(err => {
                                                        console.log(err)
                                                    });
                                                  }
                                                return this.props.history.push(`/case/editor/detail/${caseId}/${i}`);
                                            }
                                        }
                                        return this.props.history.push(`/case/editor/detail/${caseId}/${i}`);
                                      }} 
                                      className={cx('date', {selected: i === +dateIndex})}
                                    >
                                      {getLocaleDateWithYMS(date)}
                                    </div>
                                  </li>
                                })
                              }
                            </ul>
                          </div>
                        }
                      </div>
                    }
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