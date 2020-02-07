import React, { Component } from 'react';
import styles from './Teaching.module.scss';
import classNames from 'classnames/bind';
import { observer, inject } from 'mobx-react';
import { FiPlus } from 'react-icons/fi';
import { FaTrash } from 'react-icons/fa';

const cx = classNames.bind(styles);

@inject('Case', 'search', 'teaching')
@observer
class Teaching extends Component {
    componentDidMount() {
        this.props.teaching.initEditableData();
    }

    _handleOnChange = (e) => {
        const { dataset, name, value } = e.target;
        this.props.teaching.handleChange(dataset.index, name, value);
    }
    
    _handleClickOnAddTeaching = () => {
        this.props.teaching.addTeaching(null, null, '');
    }
    _deleteTeaching = (i) => {
        const selectedIndex = i;
        
        if (i !== undefined) {
            this.props.teaching.deleteTeaching(selectedIndex);
        }
    }
    
    render() {
        const { editableData } = this.props.teaching;
        const { length } = editableData;

        console.log(JSON.parse(JSON.stringify(editableData)))

        return (
            <div className={cx('Teaching')}>
                <h5>환자지도</h5>
                <div className={cx('wrapper', 'teaching-wrapper')}>
                    <ul>
                        {
                            length > 0 ? editableData.map((teaching, i) => {
                                const { ref_id, description } = teaching;
                                return <li key={i} className={cx('')}>
                                    <div className={cx('form-wrapper', 'teaching-description', 'input')}>
                                        <input 
                                            data-index={i}
                                            className={cx('description')}
                                            name="description" 
                                            id={`teaching-description-${i}`} 
                                            type="text" 
                                            placeholder="환자지도" 
                                            onChange={this._handleOnChange}
                                            value={description || ''}
                                        />
                                        <label htmlFor={`teaching-description-${i}`}>지도내용</label>
                                    </div>
                                    <div className={cx('input', 'ref_id', 'form-wrapper')}>
                                        <input 
                                            data-index={i}
                                            className={cx('ref_id')}
                                            name="ref_id" 
                                            id={`teaching-ref_id-${i}`} 
                                            type="text" 
                                            autoComplete='off' 
                                            placeholder="###" 
                                            onChange={this._handleOnChange}
                                            value={ref_id}
                                        />
                                        <label htmlFor={`teaching-ref_id-${i}`}>No.</label>
                                    </div>
                                    <div className={cx('trash')}>
                                        <FaTrash onClick={() => {this._deleteTeaching(i);}}/>
                                    </div>
                                </li>
                            })
                            : <li></li>
                        }
                    </ul>
                    <button className={cx('btn-add-teaching')} onClick={this._handleClickOnAddTeaching}>지도법추가<FiPlus /></button>
                </div>
            </div>
        );
    }
}

export default Teaching;