import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import styles from './Login.module.scss';
import classNames from 'classnames/bind';
import { Container, Button, Form, Row, Col } from 'react-bootstrap';
import { Helmet } from "react-helmet";
import Layout from '../../components/Layout';

const cx = classNames.bind(styles);

@withRouter
@inject('userStore', 'loginStore')
@observer
class Login extends Component {
  componentWillUnmount() {
    this.props.loginStore.clearInputValuesForLogin();
    this.props.loginStore.clearErrorValues();
  }
  _handleChange = (e) => {
    this.props.loginStore.changeInput(e.target.name, e.target.value);
  }

  _handleClick = (e) => {
    e.preventDefault();
    this.props.loginStore.login()
    .then((res) => {
      return this.props.history.replace('/editor');
    })
    .catch(err => {
    });
  }

  render() {
    const { email, password } = this.props.loginStore.inputValuesForLogin;
    const { noIdValue, noPasswordValue, inputError } = this.props.loginStore.errorValues;
    const { isLoading } = this.props.loginStore;
    let error = noIdValue || noPasswordValue || inputError;

    return (
      <Layout>
        <section className={cx('Login')}>
          <Helmet>
            <title>Cloudoc - 로그인</title>
          </Helmet>
          <Container fluid className={cx('container')}>
            <Row className={cx('row')}>
              <Col className={cx('col')} xs={12} sm={8} md={6} lg={5} xl={4}>
                <h2>로그인</h2>
                  <Form className={cx('form-container')}>
                    <Form.Group controlId="form-basic-email">
                      <Form.Control 
                        as='input'
                        className={cx('input-form', {isLoading})} 
                        readOnly={isLoading} 
                        autoFocus 
                        name='email' 
                        type="email" 
                        placeholder="이메일" 
                        value={email} 
                        onChange={this._handleChange}/>
                    </Form.Group>
                    <Form.Group controlId="form-basic-password">
                      <Form.Control 
                        as='input'
                        className={cx('input-form', {isLoading})} 
                        readOnly={isLoading} 
                        type="password" 
                        name ='password' 
                        placeholder="비밀번호" 
                        value={password} 
                        onChange={this._handleChange}/>
                    </Form.Group>
                    {
                      error && 
                      <div className={cx('container-error')}>
                        {
                          (noIdValue && noPasswordValue) && <p>이메일과 비밀번호를 입력해 주세요</p>
                        }
                        {
                          noIdValue && !noPasswordValue && <p>이메일을 입력해 주세요</p>
                        }
                        {
                          noPasswordValue && !noIdValue && <p>비밀번호를 입력해 주세요</p>
                        }
                        {
                          inputError && <p>이메일 또는 비밀번호를 확인하여 주세요</p>
                        }
                      </div>
                    }
                    {
                      !isLoading &&
                      <Button className={cx('login-button')} variant="primary" type="submit" onClick={this._handleClick}>
                        로그인
                      </Button>
                    }
                  </Form>
                  {
                    isLoading ?
                    <div className={cx('loading-container')}>
                      <div className={cx("spinner-grow")} role="status">
                        <span className={cx("sr-only")}>loading...</span>
                      </div>
                    </div>
                    : <div className={cx('link-forgetPW')}>
                      <a href="/">비밀번호를 잊어버리셨나요?</a>
                    </div>
                  }
              </Col>
            </Row>
          </Container>
        </section>
      </Layout>
    );
  }
}

export default Login;