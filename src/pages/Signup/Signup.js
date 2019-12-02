import React, { Component } from 'react';
import styles from './Signup.module.scss';
import classNames from 'classnames/bind';
import { withRouter } from 'react-router-dom';
import { Container, Button, Form, Row, Col } from 'react-bootstrap';
import { inject, observer } from 'mobx-react';
import constInviteCode from '../../constant/inviteCode';
import { Helmet } from "react-helmet";
import Layout from '../../components/Layout';

const cx = classNames.bind(styles);

@withRouter
@inject('userStore', 'signupStore')
@observer
class Signup extends Component {
  componentWillUnmount() {
    this.props.signupStore.clear();
    this.props.signupStore.clearErrorValues();
  }

  _handleClick = (e) => {
    e.preventDefault();
    const {
      name,
      email,
      password,
      confirmPassword,
      inviteCode
    } = this.props.signupStore.userInfo;
    
    let buttonOn = name.length > 0 && email.length > 0 && password.length > 0 && confirmPassword.length > 0 && inviteCode.length > 0;

    let isEmailForm = email.search(/[0-9a-zA-Z][_0-9a-zA-Z-]*@[_0-9a-zA-Z-]+(\.[_0-9a-zA-Z-]+){1,2}$/) !== -1;

        if (name === '') {
          this.props.signupStore.manageError('name');
        } 
        if (email === '') {
          this.props.signupStore.manageError('email');
        }
        if (password === '') {
          this.props.signupStore.manageError('password');
        }
        if (!isEmailForm) {
          this.props.signupStore.manageError('inValidEmail');
        }
        if (password.length < 8) {
          this.props.signupStore.manageError('inValidPassword');
        }
        if (password !== confirmPassword) {
          this.props.signupStore.manageError('inValidConfirm');
        }
        if (inviteCode === '') {
          this.props.signupStore.manageError('inviteCode');
        }

        if (inviteCode !== constInviteCode) {
          this.props.signupStore.manageError('inValidInviteCode');
      }
      
      if (buttonOn) {
        return this.props.signupStore.signup()
        .then(res => {
          if(res.data.success) {
            this.props.signupStore.signupCaseMaster();
          }
        })
        .then(res => {
          alert('가입해주셔서 감사합니다. 이제 Case Editor를 이용하실 수 있습니다.');
          return this.props.history.replace('/login');
        })
        .catch(err => {
          console.log(err);
        });
      }
  }

  _handleChange = (e) => {
    this.props.signupStore.changeInput(e.target.name, e.target.value);
  }

  render() {
    const { email, password, name, confirmPassword, inviteCode } = this.props.signupStore.userInfo;
    const { noIdValue, noPasswordValue, noUsernameValue, noConfirmPasswordValue, noInviteCode, inValidEmail, inValidPassword, inValidConfirm, inValidInviteCode } = this.props.signupStore.errorValues;

    let buttonOn = name.length > 0 && email.length > 0 && password.length > 0 && confirmPassword.length > 0 && inviteCode.length > 0;

    return (
      <>
      <Helmet>
        <title>Cloudoc - 회원가입</title>
      </Helmet>
      <Layout>
        <section className={cx('Signup')}>
          <Container fluid className={cx('signup-container')}>
            <div className={cx('wrapper')}>
                <h2>회원가입</h2>
                <Row className={cx('row')}>
                  <Col xs={12} sm={8} md={6} lg={5} xl={4}>
                    <Form 
                      className={cx('signup-form')}
                    >
                        <Form.Group controlId="formBasicName">
                            <Form.Label>사용자명</Form.Label>
                            <Form.Control 
                              className={cx('input-form', {error: noUsernameValue})}
                              autoFocus
                              name='name' 
                              type="text" 
                              placeholder={noUsernameValue ? '* 사용자명을 입력해 주세요' : '사용자명' } 
                              as='input' 
                              value={name} 
                              onChange={this._handleChange} 
                              required
                            />
                        </Form.Group>

                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>이메일</Form.Label>
                            <Form.Control 
                              className={cx('input-form', {error: noIdValue}, {inValid: inValidEmail})}
                              name='email' 
                              type="email" 
                              placeholder={noIdValue ? '* 이메일을 입력해 주세요' : '이메일' } 
                              as='input' 
                              value={email} 
                              onChange={this._handleChange} 
                              required
                              pattern="^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,6}$"
                            />
                            
                        </Form.Group>
                        {
                          inValidEmail && 
                          <div className={cx('container-error')}>
                            {
                              inValidEmail && <p>이메일 형식이 아닙니다</p>
                            }
                          </div>
                        }
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>비밀번호</Form.Label>
                            <Form.Control 
                              className={cx('input-form', {error: noPasswordValue}, {inValid: inValidPassword})}
                              name='password' 
                              type="password" 
                              placeholder={noPasswordValue ? '* 비밀번호을 입력해 주세요' : '비밀번호' } 
                              as='input' 
                              value={password} 
                              onChange={this._handleChange}
                              minLength="8"
                              required
                            />
                            <Form.Text className={cx('text-muted')}>
                              * 최소 8자리 이상
                            </Form.Text>
                        </Form.Group>
                        {
                          inValidPassword && 
                          <div className={cx('container-error')}>
                            {
                              inValidPassword && <p>비밀번호 자릿수가 부족합니다</p>
                            }
                          </div>
                        }

                        <Form.Group controlId="formBasicConfirmPassword">
                            <Form.Label>비밀번호 확인</Form.Label>
                            <Form.Control 
                              className={cx('input-form', {error: noConfirmPasswordValue}, {inValid: inValidConfirm})}
                              name='confirmPassword' 
                              type="password" 
                              placeholder={noConfirmPasswordValue ? '* 확인용 비밀번호를 입력해 주세요' : '비밀번호 확인' } 
                              as='input' 
                              value={confirmPassword} 
                              onChange={this._handleChange}
                              minLength="8"
                              required
                            />
                        </Form.Group>
                        {
                          inValidConfirm && 
                          <div className={cx('container-error')}>
                            {
                              inValidConfirm && <p>비밀번호가 다릅니다</p>
                            }
                          </div>
                        }

                        <Form.Group controlId="inviteCode">
                            <Form.Label>초대코드</Form.Label>
                            <Form.Control 
                              className={cx('input-form', {error: noInviteCode}, {inValid: inValidInviteCode})}
                              name='inviteCode' 
                              type="text" 
                              placeholder={noInviteCode ? '* 초대코드를 입력해 주세요' : '초대코드' } 
                              as='input' 
                              value={inviteCode} 
                              onChange={this._handleChange}
                              required
                            />
                        </Form.Group>
                        {
                          inValidInviteCode && 
                          <div className={cx('container-error')}>
                            {
                              inValidInviteCode && <p>초대코드가 다릅니다. 관리자에게 문의바랍니다.</p>
                            }
                          </div>
                        }
                        <Button 
                          disabled={!buttonOn}
                          variant="primary" 
                          type="submit" 
                          onClick={this._handleClick}>
                            가입하기
                        </Button>
                    </Form>
                  </Col>
                </Row>
            </div>
          </Container>
        </section>
      </Layout>
      </>
    );
  }
}

export default Signup;