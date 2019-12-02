import React from 'react';
import classNames from 'classnames/bind';
import styles from './Page404.module.scss';

const cx = classNames.bind(styles);

const Page404 = () => {
    return (
        <section className={cx('Page404')}>
            <div className={cx('container')}>
                <p className={cx('content')}>
                    <span className={cx('error-state')}>404</span>
                    <span>Not</span>
                    <span>Found</span>
                </p>
                <div className={cx('links')}>
                    <a href='/'>메인화면으로 돌아가기 -></a>
                </div>
            </div>
        </section>
    );
};

export default Page404;