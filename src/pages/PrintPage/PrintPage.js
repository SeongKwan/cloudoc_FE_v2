import React, { Component } from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { getLocaleDateWithYMS } from '../../utils/momentHelper';
import _ from 'lodash';
import style from './styles';
import font from './font';

const styles = StyleSheet.create(style);
Font.register(font);

class PrintPage extends Component {
  render() {
    const { user, currentCase, contentSetting } = this.props;
    if (currentCase === undefined || currentCase === null) {
      return (
        <Document>
          <Page>
            <Text>잘못된 요청입니다</Text>
          </Page>
        </Document>
      )
    } else {
        const { patient, created_date, title, record } = currentCase;
        const { symptom, lab, diagnosis, treatment, teaching } = record[0];
    
        let dividedLabByCategory = [];
        let arr = _.uniqBy(lab, 'category');
        let categories = [];
    
        arr.forEach((item, i) => {
          categories[i] = item.category;
        });
        categories = _.sortBy(categories);
        categories.forEach((category, i) => {
          dividedLabByCategory[i] = lab.filter(item => {
              return item.category === category;
          })
        });

        return (
          <Document title={title} author={'User Name'} creator="2020 Cloudoc" >
            <Page style={styles.page} wrap>
              <View style={styles.header} fixed>
                <View style={{flex: 1, backgroundColor: '#d3d3d3', width: '100%', height: '3pt', borderRadius: 4, position: 'absolute', top: '45%', left: 0}}></View>
                <View><Text style={styles.headerTitle}>2020 Cloudoc</Text></View>
              </View>
              <View>
                <View style={styles.titleWrapper}>
                  <Text style={styles.title}>{title}</Text>
                </View>
                <View style={[styles.caseInfo]}>
                  <View style={styles.flexItem}>
                    <Text style={[styles.info, styles.date]}>작성일 : {getLocaleDateWithYMS(created_date)}</Text>
                  </View>
                  <View style={styles.flexItem}>
                    <Text style={[styles.info, styles.author]}>담당 한의사 : {user.username}</Text>
                  </View>
                </View>
              </View>
              {
                contentSetting.basic &&
                <View style={styles.section}>
                  <Text style={styles.subTitle} wrap={false}>
                    기본정보 ( {patient.gender === 'male' ? '남성' : '여성'} / 만 {patient.age}세 )
                  </Text>
      
                  <View style={styles.contentBox}>
                    <Text style={styles.name}>&#9635; 과거력</Text>
                    <Text style={styles.content}>
                      {patient.pastHistory || '해당사항 없음'}
                    </Text>
                  </View>
                  <View style={styles.contentBox}>
                    <Text style={styles.name}>&#9635; 가족력</Text>
                    <Text style={styles.content}>
                      {patient.familyHistory || '해당사항 없음'}
                    </Text>
                  </View>
                  <View style={styles.contentBox}>
                    <Text style={styles.name}>&#9635; 사회력</Text>
                    <Text style={styles.content}>
                      {patient.socialHistory || '해당사항 없음'}
                    </Text>
                  </View>
                  <View style={styles.contentBox}>
                    <Text style={styles.name}>&#9635; 기타진찰소견</Text>
                    <Text style={styles.content}>
                      {patient.memo || '해당사항 없음'}
                    </Text>
                  </View>
                </View>
              }

              {
                contentSetting.symptom &&
                <View style={styles.section}>
                  <Text wrap={false} style={[styles.subTitle, styles.symptomTitle]}>
                    증상
                  </Text>
                  {
                    symptom.map((symptom, i) => {
                      const { name, description } = symptom;
                      return <View key={i} style={styles.contentBox} wrap={false}>
                        <Text style={styles.name}>{i + 1}. {name}</Text>
                        <Text style={styles.content}>
                          {description || '증상 보충설명 또는 의사 소견란'}
                        </Text>
                      </View>
                    })
                  }
                </View>
              }
              {
                contentSetting.lab &&
                <View style={styles.section}>
                  <Text wrap={false} style={[styles.subTitle, styles.labTitle]}>
                    혈액검사
                  </Text>
                  {
                    dividedLabByCategory.map((labs, index) => {
                      let sortedArr = [];
                      sortedArr = _.sortBy(labs, 'name');
                      return <View key={index} style={styles.contentBox}>
                        <Text style={[styles.name, styles.categoryTitle]}>[ {categories[index]} ]</Text>
                        {
                          sortedArr.map((lab, i) => {
                            const {
                                  name, unit, value,
                                  refMin, refMax, alertMin,
                                  alertMax, alertMessage, state,
                              } = lab;
      
                              let showAlert = (state === '매우 낮음' && !!alertMin) || (state === '매우 높음' && !!alertMax);
                              let widthBar;
                              let borderColor;
                              widthBar = (( value - refMin ) / ( refMax - refMin )) * 100;

                              if (widthBar > 101) { widthBar = 100; } 
                              else if (widthBar < 0) { widthBar = 0; }
                              if ((state === '매우 낮음' && !!alertMin)) { borderColor = '2pt solid #3b69e6'; }
                              else if ((state === '매우 높음' && !!alertMax)) { borderColor = '2pt solid #d64646'; }
                              else { borderColor = '1pt solid gray'; }
      
                              return <View wrap={false} key={i} style={[styles.labItem, {display: 'flex', flexDirection: 'column'}]}>
                                <View style={[styles.flexbox]}>
                                  <View style={[styles.flex2, {position: 'relative'}]}>
                                    {
                                      showAlert &&
                                      <View style={[styles.alert]}>
                                        <Text>!</Text>
                                      </View>
                                    }
                                    <Text style={[styles.labname]}>{name} [ {unit} ]</Text>
                                  </View>
                                  <View style={[styles.flex3, {position: 'relative', backgroundColor: '#e9e9e9', border: `${borderColor}`, borderRadius: 4}]}>
                                    <View style={[styles.minRef]}>
                                      <Text>{refMin}</Text>
                                    </View>
                                    <View style={[styles.maxRef]}>
                                      <Text>{refMax}</Text>
                                    </View>
                                    <View style={[styles.labBar, {width: `${widthBar}%`}]}>
                                      <View style={[styles.currentPosition]}>
                                        <Text style={{opacity: 1}}>{value}</Text>
                                      </View>
                                    </View>
                                  </View>
                                </View>
                                {
                                  showAlert &&
                                  <View style={[{fontSize: 8, lineHeight: 1.4, padding: 8, marginTop: 12, marginBottom: 12, backgroundColor: '#f0f0f0',  borderRadius: 4}]}>
                                    <Text style={{fontWeight: 200}}>
                                      {alertMessage}
                                    </Text>
                                  </View>
                                }
                              </View>
                          })
                        }
                      </View>
                    })
                  }
                </View>
              }
              {
                contentSetting.diagnosis &&
                <View style={styles.section}>
                  <Text wrap={false} style={[styles.subTitle, styles.diagnosisTitle]}>
                    추정진단 ({diagnosis.length})
                  </Text>
                  {
                    diagnosis.map((diagnosis, i) => {
                      const { name, description } = diagnosis;
                      
                      return <View key={i} style={styles.contentBox} wrap={false}>
                        <Text style={styles.name}>{i + 1}. {name}</Text>
                        <Text style={styles.content}>
                          {description || '진단 보충설명 또는 의사 소견란'}
                        </Text>
                      </View>
                    })
                  }
                </View>
              }
              {
                contentSetting.drug &&
                <View style={styles.section}>
                  <Text style={styles.subTitle} wrap={false}>
                    처방
                  </Text>
      
                    <View style={styles.contentBox} wrap={false}>
                    <Text style={styles.name}>{treatment.drugName}</Text>
                    {
                      contentSetting.fomula &&
                      <Text style={styles.content}>
                        {
                          treatment.fomula.length > 0 ?
                          treatment.fomula.map((fomula, i) => {
                            const { herbName, dose } = fomula;
                            if (i < (treatment.fomula.length - 1)) {
                              return `${herbName}(${dose}g/일), `
                            } else if (i === treatment.fomula.length - 1) {
                              return `${herbName}(${dose}g/일)`
                            } else {
                              return false;
                            }
                          })
                          : "처방을 구성하는 한약재 목록"
                        }
                      </Text>
                    }
                    </View>
                  <View style={styles.contentBox} wrap={false}>
                    <Text style={styles.name}>&#9635; 복약법</Text>
                    <Text style={styles.content}>
                      {treatment.guide || '해당사항 없음'}
                    </Text>
                  </View>
                  <View style={styles.contentBox} wrap={false}>
                    <Text style={styles.name}>&#9635; 주의사항</Text>
                    <Text style={styles.content}>
                      {treatment.caution || '해당사항 없음'}
                    </Text>
                  </View>
                </View>
              }
              {
                contentSetting.teaching &&
                <View style={styles.section}>
                  <Text wrap={false} style={[styles.subTitle, styles.teachingTitle]}>
                    환자지도
                  </Text>
                  {
                    teaching.length > 0 ?
                    teaching.map((teaching, i) => {
                      const { description } = teaching;
                      return <View key={i} style={[styles.contentBox, styles.teachingContents]} wrap={false}>
                        <Text style={[styles.content]}>
                          {description || '환자 생활 지도에 관한 내용'}
                        </Text>
                      </View>
                    })
                    : <Text style={[styles.content]}>
                      해당사항 없음
                    </Text>
                  }
                </View>
              }          
              <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (`${pageNumber} / ${totalPages}`)} fixed />
              <View style={styles.copyright} fixed>
                <Text>Copyright &copy; 2020 Cloudoc. All rights reserved.</Text>
              </View>
            </Page>
            </Document>
        );
    }
  }
}

export default PrintPage;