import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
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
import {
  FiArrowUp
} from '../../lib/react-icons/fi';
import {
  IoMdArrowDropdown
} from 'react-icons/io';
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight
} from 'react-icons/md';
import { getLocaleDateWithYMS } from '../../utils/momentHelper';

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
    console.log(JSON.parse(JSON.stringify(this.props.Case.currentCaseRecord)))
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
          isLoading ? <div className={cx('loader-container')}><Loader /> </div>
          : <>
          {
            currentCaseRecord.length > 1 && type === 'detail' && !isEditing &&
            <>
              {
                +dateIndex !== 0 &&
                <Link className={cx('prevRecord', 'btn-move-record')} to={`/case/editor/detail/${caseId}/${+dateIndex - 1}`}>
                  <MdKeyboardArrowLeft />
                  <div className={cx('date')}>{getLocaleDateWithYMS(currentCaseRecord[+dateIndex - 1])}</div>
                </Link>
              }
              {
                +dateIndex !== currentCaseRecord.length - 1 &&
                <Link className={cx('nextRecord', 'btn-move-record')} to={`/case/editor/detail/${caseId}/${+dateIndex + 1}`}>
                  <MdKeyboardArrowRight />
                  <div className={cx('date')}>{getLocaleDateWithYMS(currentCaseRecord[+dateIndex + 1])}</div>
                </Link>
              }
            </>
          }
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
                    {
                      type === 'detail' &&
                      <div 
                          ref={(ref) => {
                              this.recordDate = ref;
                          }}
                          className={cx('record-date', {focus: this.state.focusParent}, {isEditing: isEditing})}>
                        <div className={cx('selected-date')} 
                          onClick={() => {
                            if (!isEditing) {
                              this._toggleOnFocus();
                            }
                          }}
                        >
                          <div>({`${+dateIndex + 1}/${currentCaseRecord.length}`})</div>
                          {
                            currentCaseRecord.length > 0 &&
                            <div>{getLocaleDateWithYMS(currentCaseRecord[dateIndex])}</div>
                          }
                          {
                            !isEditing &&
                            <div className={cx('arrow-down-icon')}><IoMdArrowDropdown /></div>
                          }
                        </div>
                        {
                          this.state.focusParent &&
                          <div className={cx('records')}>
                            <ul>
                              {
                                currentCaseRecord.map((date, i) => {
                                  return <li key={i}><Link onClick={() => {this.setState({focusParent: false})}} className={cx('date', {selected: i === +dateIndex})} to={`/case/editor/detail/${caseId}/${i}`}>{getLocaleDateWithYMS(date)}</Link></li>
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
                {
                  (type === "create" || isEditing) &&
                  <RightSideList type={type} isEditing={isEditing} />
                }
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