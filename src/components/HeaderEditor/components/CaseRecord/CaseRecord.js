import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import styles from './CaseRecord.module.scss';
import classNames from 'classnames/bind';
import { IoMdArrowDropdown } from 'react-icons/io';
import { getLocaleDateWithYMS } from '../../../../utils/momentHelper';

const cx = classNames.bind(styles);

@withRouter
@inject('Case')
@observer
class CaseRecord extends Component {
    state = { focusParent: false }
    componentDidMount() {
        document.addEventListener('mousedown', this._handleClickOutside);
    }
    componentWillUnmount() {
        this.setState({ focusParent: false });
        document.removeEventListener('mousedown', this._handleClickOutside);
    }
    _handleClickOutside = (event) => {
        if (this.recordDate && !this.recordDate.contains(event.target) && this.state.focusParent) {
            this.setState({ focusParent: false})
        }
    }
    _toggleOnFocus = () => {
        this.setState({ focusParent: !this.state.focusParent})
    }
    render() {
        const { isEditing, currentCaseRecord } = this.props.Case;
        const { dateIndex, caseId } = this.props.match.params;

        return (
            <div 
                ref={(ref) => { this.recordDate = ref; }}
                className={cx('record-date', {focus: this.state.focusParent})}
            >
                <div 
                    className={cx('selected-date')} 
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
                                        this.props.modal.setFunction('cancel', () => {
                                            this.props.history.push(`/case/editor/detail/${caseId}/${i}`);
                                        })
                                        
                                        this.props.handleModal('confirm', '저장되지 않은 내용이 있습니다. 저장하고 다른 진료일자로 바꾸시겠습니까?');
                                        return this.props.modal.setFunction('confirm', () => {
                                            this.props.Case.updateCase(dateIndex)
                                                .then(res => {
                                                    if (res) {
                                                        this.props.toastUpdate();
                                                        this.props.history.push(`/case/editor/detail/${caseId}/${i}`);
                                                    }
                                                })
                                                .catch(err => {
                                                    console.log(err)
                                                });
                                        })
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
        );
    }
}

export default CaseRecord;