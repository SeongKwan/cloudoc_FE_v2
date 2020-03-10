import moment from 'moment';
import 'moment-timezone';


/**
 * 계산은 utc로 변형해서 한다.
 */

function toUnix(_datetime) {
    let d = new Date(_datetime);
    return moment(d, "X") * 1000;
}

function getLocaleSemiDateWithTime(_datetime) {
    // console.log(_datetime)
    let d = new Date(_datetime);
    // return moment("12-25-1995", "MM-DD-YYYY");
    // return moment(_datetime, "X");
    return moment(d).tz(moment.tz.guess()).format("YYYY년 MM월 DD일");
}

function getLocaleFullDateWithTime(_datetime) {
    let d = new Date(_datetime);
    return moment(d).tz(moment.tz.guess()).format("YYYY/MM/DD HH:mm:ss");
}

function getLocaleDateWithYYYY(_datetime) {
    let d = new Date(_datetime);
    return moment(d).tz(moment.tz.guess()).format("YYYYMMDD");
}
function getLocaleDateWithYMS(_datetime) {
    let d = new Date(_datetime);
    return moment(d).tz(moment.tz.guess()).format("YYYY/MM/DD");
}




export { toUnix, getLocaleFullDateWithTime, getLocaleDateWithYYYY, getLocaleSemiDateWithTime, getLocaleDateWithYMS }


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