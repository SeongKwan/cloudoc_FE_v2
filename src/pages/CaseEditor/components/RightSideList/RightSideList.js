import React, { Component } from 'react';
// import { inject, observer } from 'mobx-react';
import styles from './RightSideList.module.scss';
import classNames from 'classnames/bind';
import CollapsibleBox from '../../../../components/CollapsibleBox/CollapsibleBox';

const cx = classNames.bind(styles);

class RightSideList extends Component {
    render() {
        return (
            <div className={cx('RightSideList')}>
                <CollapsibleBox 
                    short
                    title="증상점검" 
                    initOpen={false}
                    sidebar
                    detail="symptom"
                >
                    <ul className={cx('check-symptoms')}>
                        <li>복통</li>
                        <li>치통</li>
                        <li>생리통</li>
                        <li>증상</li>
                        <li>증상</li>
                        <li>증상</li>
                        <li>증상</li>
                        <li>증상</li>
                        <li>증상</li>
                        <li>증상</li>
                        <li>증상</li>
                        <li>증상</li>
                        <li>증상</li>
                        <li>증상</li>
                        <li>증상</li>
                        <li>증상</li>
                        <li>증상</li>
                        <li>증상</li>
                        <li>증상</li>
                        <li>증상</li>
                        <li>증상</li>
                    </ul>
                </CollapsibleBox>
                <CollapsibleBox 
                    short
                    title="검사점검" 
                    initOpen={false}
                    sidebar
                    detail="lab"
                >
                    <ul className={cx('check-labs')}>
                        <li>혈소</li>
                        <li>단백질</li>
                        <li>지방</li>
                        <li>지방</li>
                        <li>지방</li>
                        <li>지방</li>
                        <li>지방</li>
                        <li>지방</li>
                        <li>지방</li>
                        <li>지방</li>
                        <li>지방</li>
                        <li>지방</li>
                        <li>지방</li>
                        <li>지방</li>
                        <li>지방</li>
                        <li>지방</li>
                        <li>지방</li>
                        <li>지방</li>
                        <li>지방</li>
                        <li>지방</li>
                        <li>지방</li>
                        <li>지방</li>
                        <li>지방</li>
                    </ul>
                </CollapsibleBox>
                <CollapsibleBox 
                    short
                    title="주의사항" 
                    initOpen={false}
                    sidebar
                    detail="caution"
                >
                    <ul className={cx('cautions')}>
                        <li>주의사항1asdfadsfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdf</li>
                        <li>주의사항2</li>
                        <li>주의사항2</li>
                        <li>주의사항2</li>
                        <li>주의사항2</li>
                        <li>주의사항2</li>
                        <li>주의사항2</li>
                        <li>주의사항2</li>
                        <li>주의사항2</li>
                        <li>주의사항2</li>
                        <li>주의사항2</li>
                        <li>주의사항2</li>
                        <li>주의사항2</li>
                        <li>주의사항2</li>
                        <li>주의사항2</li>
                        <li>주의사항2</li>
                        <li>주의사항2</li>
                        <li>주의사항2</li>
                        <li>주의사항3</li>
                        <li>주의사항4</li>
                    </ul>
                </CollapsibleBox>
            </div>
        );
    }
}

export default RightSideList;