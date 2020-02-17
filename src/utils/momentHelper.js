import moment from 'moment';
import 'moment-timezone';


/**
 * 계산은 utc로 변형해서 한다.
 */

function toUnix(_datetime) {
    return moment(_datetime).unix()*1000;
}

function getLocaleSemiDateWithTime(_datetime) {
    let d = new Date(_datetime);
    return moment(d).tz(moment.tz.guess()).format("YY/MM/DD HH:mm");
}

function getLocaleFullDateWithTime(_datetime) {
    let d = new Date(_datetime);
    return moment(d).tz(moment.tz.guess()).format("YYYY/MM/DD HH:mm:ss");
}

function getLocaleDateWithYYYY(_datetime) {
    let d = new Date(_datetime);
    return moment(d).tz(moment.tz.guess()).format("YYYYMMDD");
}




export { toUnix, getLocaleFullDateWithTime, getLocaleDateWithYYYY, getLocaleSemiDateWithTime }


// getLocaleDatetime = (_datetime) => {
//     return this.moment(_datetime).tz(this.timezone).format("MM.DD HH:mm")
// }

// getLocaleHourMinute = (_datetime) => {
//     return this.moment(_datetime).tz(this.timezone).format("HH:mm")
// }

// getLocaleDateWithMM = (_datetime) => {
//     return this.moment(_datetime).tz(this.timezone).format("MM/DD")
// }

// getLocaleDateWithYY = (_datetime) => {
//     return this.moment(_datetime).tz(this.timezone).format("YY/MM/DD")
// }

// getLocaleDateWithYYYY = (_datetime) => {
//     return this.moment(_datetime).tz(this.timezone).format("YYYY-MM-DD")
// }

// getLocaleFullDateWithTime = (_datetime) => {
//     return this.moment(_datetime).tz(this.timezone).format("YYYY.MM.DD HH:mm:ss")
// }