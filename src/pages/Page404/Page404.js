import React from 'react';
import './Page404.scss';

const Page404 = ({message = '404 에러, 존재하지 않는 요청주소 입니다.'}) => {
    return (
        <div className="Page404">
            <main>
                <div className="container">
                    <p className="hero">
                    <span className="bigger">404</span>
                    <span>Not</span>
                    <span>Found</span>
                    </p>
                    <p className="links">
                        <a href='/'>메인화면으로 돌아가기 -></a>
                    </p>
                </div>
            </main>
            {message} <br/>
        </div>
    );
};

export default Page404;