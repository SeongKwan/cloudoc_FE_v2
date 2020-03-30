import React, { Component } from 'react';
import styles from './Teaching.module.scss';
import classNames from 'classnames/bind';
import { observer, inject } from 'mobx-react';
import { FiPlus } from '../../../../lib/react-icons/fi';
import { FaTrash } from '../../../../lib/react-icons/fa';
import TextareaAutosize from 'react-textarea-autosize';
import $ from 'jquery';

const cx = classNames.bind(styles);

@inject('Case', 'search', 'teaching')
@observer
class Teaching extends Component {
    componentWillUnmount() {
        this.props.teaching.clear();
    }

    _handleOnChange = (e) => {
        const { dataset, name, value } = e.target;
        this.props.teaching.handleChange(dataset.index, name, value);
    }
    
    _handleClickOnAddTeaching = () => {
        const { editableData } = this.props.teaching;
        const { length } = editableData;
        this.props.teaching.addTeaching(null, null, '');
        if (length <= 0) {
            return setTimeout(() => {$(`#teaching-description-${0}`).focus();}, 100)
        }
        return setTimeout(() => {$(`#teaching-description-${length}`).focus();}, 100)
    }
    
    _deleteTeaching = (i) => {
        const selectedIndex = i;
        
        if (i !== undefined) {
            this.props.teaching.deleteTeaching(selectedIndex);
        }
    }
    
    render() {
        const { isEditing } = this.props.Case;
        const { type } = this.props;
        const { editableData, staticData } = this.props.teaching;
        const { length } = editableData;

        return (
            <div className={cx('Teaching', {view: !isEditing})}>
                <h5>환자지도</h5>
                <div className={cx('wrapper', 'teaching-wrapper')}>
                    <ul>
                        {
                            length > 0 ? (type === "create" || isEditing) ?
                            editableData.map((teaching, i) => {
                                const { description } = teaching;
                                return <li key={i} className={cx('')}>
                                    <div className={cx('form-wrapper', 'teaching-description', 'input')}>
                                        
                                        <TextareaAutosize 
                                            data-index={i}
                                            className={cx('textarea', 'description')}
                                            name="description" 
                                            id={`teaching-description-${i}`} 
                                            type="text" 
                                            minRows={2}
                                            placeholder="환자지도" 
                                            onChange={this._handleOnChange}
                                            value={description || ''}
                                        />
                                        <label htmlFor={`teaching-description-${i}`}>지도내용</label>
                                    </div>
                                    <div className={cx('trash')}>
                                        <FaTrash onClick={() => {this._deleteTeaching(i);}}/>
                                    </div>
                                </li>
                            })
                            : staticData.map((teaching, i) => {
                                const { description } = teaching;
                                return <li key={i} className={cx('')}>
                                    <div className={cx('form-wrapper', 'teaching-description', 'input')}>
                                        
                                        <TextareaAutosize 
                                            data-index={i}
                                            className={cx('textarea', 'description', 'static', 'view')}
                                            name="description" 
                                            id={`teaching-description-${i}`} 
                                            type="text" 
                                            minRows={2}
                                            placeholder="환자지도" 
                                            readOnly
                                            value={description || ''}
                                        />
                                        <label htmlFor={`teaching-description-${i}`}>지도내용</label>
                                    </div>
                                </li>
                            })
                            : <li></li>
                        }
                    </ul>
                    {
                        (type === "create" || isEditing) &&
                        <button className={cx('btn-add-teaching')} onClick={this._handleClickOnAddTeaching}>지도법추가<FiPlus /></button>
                    }
                </div>
            </div>
        );
    }
}

export default Teaching;