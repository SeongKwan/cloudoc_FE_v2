import React from 'react';
import styles from './FormInput.module.scss';
import classNames from 'classnames/bind';
import { Form } from 'react-bootstrap';

const cx = classNames.bind(styles);

const FormInput = ({id, labelTitle, inValid, autoFocus = false, name, type, errorValue, errMsg, value, onChange, required = true}) => {
    return (
        <Form.Group controlId={id}>
            <Form.Label className={cx('form-input-label')}>{labelTitle}</Form.Label>
            <Form.Control 
                className={cx('input-form', {error: errorValue}, {inValid: inValid})}
                autoFocus={autoFocus}
                name={name} 
                type={type} 
                placeholder={errorValue ? errMsg : labelTitle} 
                as='input' 
                value={value} 
                onChange={onChange} 
                required={required}
                minLength={type === "password" ? 8 : 0}
            />
            {name === "password" && <Form.Text className={cx('text-muted')}>
                * 최소 8자리 이상
            </Form.Text>}
        </Form.Group>
    );
};

export default FormInput;