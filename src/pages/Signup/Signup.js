import React, { Component } from 'react';
import styles from './Signup.module.scss';
import classNames from 'classnames/bind';
import { withRouter } from 'react-router-dom';
import { Container, Button, Form, Row, Col } from 'react-bootstrap';
import { inject, observer } from 'mobx-react';
import { Helmet } from "react-helmet";
import Layout from '../../components/Layout';
import FormInput from './components/FormInput';

const cx = classNames.bind(styles);

@withRouter
@inject('user', 'signup')
@observer
class Signup extends Component {
  componentWillUnmount() {
    this.props.signup.clear();
    this.props.signup.clearErrorValues();
  }

  _handleClick = (e) => {
    e.preventDefault();
    this.props.signup.validation();
  }

  _handleChange = (e) => {
    this.props.signup.changeInput(e.target.name, e.target.value);
  }

  render() {
    const { email, password, name, confirmPassword, inviteCode } = this.props.signup.userInfo;
    const { 
      noIdValue, noPasswordValue, noUsernameValue, 
      noConfirmPasswordValue, noInviteCode, inValidEmail, 
      inValidPassword, inValidConfirm, inValidInviteCode 
    } = this.props.signup.errorValues;

    let buttonOn = 
    name.length > 0 && email.length > 0 && 
    password.length > 0 && confirmPassword.length > 0 && 
    inviteCode.length > 0;

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
                    <Form className={cx('signup-form')}>
                      <FormInput id="formBasicName" labelTitle="사용자명" errorValue={noUsernameValue} name="name" type="text" errMsg="* 사용자명을 입력해 주세요" value={name} onChange={this._handleChange} required/>
                      <FormInput id="formBasicEmail" labelTitle="이메일" inValid={inValidEmail} errorValue={noIdValue} name="email" type="email" errMsg="* 이메일을 입력해 주세요" value={email} onChange={this._handleChange} required/>
                      {inValidEmail && <div className={cx('container-error')}>
                          {inValidEmail && <p>이메일 형식이 아닙니다</p>}
                        </div>}
                      <FormInput id="formBasicPassword" labelTitle="비밀번호" inValid={inValidPassword} errorValue={noPasswordValue} name="password" type="password" errMsg="* 비밀번호를 입력해 주세요" value={password} onChange={this._handleChange} required/>
                      {inValidPassword && <div className={cx('container-error')}>
                          {inValidPassword && <p>비밀번호 자릿수가 부족합니다</p>}
                        </div>}
                      <FormInput id="formBasicConfirmPassword" labelTitle="비밀번호 확인" inValid={inValidConfirm} errorValue={noConfirmPasswordValue} name="confirmPassword" type="password" errMsg="* 확인용 비밀번호를 입력해 주세요" value={confirmPassword} onChange={this._handleChange} required/>
                      {inValidConfirm && <div className={cx('container-error')}>
                          {inValidConfirm && <p>비밀번호가 다릅니다</p>}
                        </div>}
                      <FormInput id="inviteCode" labelTitle="초대코드" inValid={inValidInviteCode} errorValue={noInviteCode} name="inviteCode" type="text" errMsg="* 초대코드를 입력해 주세요" value={inviteCode} onChange={this._handleChange} required/>
                      {inValidInviteCode && <div className={cx('container-error')}>
                          {inValidInviteCode && <p>초대코드가 다릅니다. 관리자에게 문의바랍니다.</p>}
                        </div>}
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