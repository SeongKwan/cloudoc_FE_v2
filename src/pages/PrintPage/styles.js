const styles = {
    page: {
        position: 'relative',
        paddingTop: 36,
        paddingBottom: 65,
        paddingHorizontal: 35,
        fontFamily: 'NanumSquare'
    },
    header: {
        position: 'relative',
        marginBottom: 18,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerTitle: {
        backgroundColor: '#d3d3d3',
        display: 'inline',
        fontSize: 12,
        color: 'white',
        padding: '4 8',
        borderRadius: 4,

    },
    flexbox: {
        display: 'flex',
        flexDirection: "row"
    },
    flexItem: {
        flex: 1
    },
    flex1: {
        flex: 1,
        backgroundColor: 'blue'
    },
    flex2: {
        flex: 2,
    },
    flex3: {
        flex: 3,
    },
    horizon: {
        marginTop: 8,
        borderBottom: "1pt solid #c8c8c8"
    },
    titleWrapper: {
        marginTop: 8
    },
    title: {
        fontSize: 24,
        fontFamily: 'NanumSquare',
        fontWeight: 800,
        letterSpacing: 1.5,
        marginBottom: 28,
    },
    caseInfo: {
        marginBottom: 16
    },
    info: {
        fontSize: 10,
        margin: 0,
        color: 'gray',
        letterSpacing: 1
    },
    date: {
        textAlign: "right",
        marginBottom: 4
    },
    author: {
        textAlign: 'right'
    },
    section: {
        marginTop: 12
    },
    subTitle: {
        paddingLeft: 10,
        paddingTop: 6,
        paddingBottom: 6,
        backgroundColor: '#d3d3d3',
        borderRadius: 2,
        fontWeight: 800,
        letterSpacing: 1.6,
        fontSize: 14,
        marginTop: 24,
        marginBottom: 8
    },
    symptomTitle: {
        backgroundColor: '#f1dfcb',
    },
    labTitle: {
        backgroundColor: '#f1cbce',
    },
    diagnosisTitle: {
        backgroundColor: '#f1cbce',
    },
    teachingTitle: {
        backgroundColor: '#f1cbce',
    },
    contentBox: {
        marginTop: 8,
        padding: 8,
        paddingLeft: 12,
    },
    teachingContents: {
        marginTop: 0
    },
    name: {
        fontSize: 12,
        marginBottom: 8,
        letterSpacing: 2
    },
    categoryTitle: {
        fontWeight: 600
    },
    labname: {
        fontSize: 11,
        fontWeight: 200
    },
    unit: {
        fontSize: 9,
        color: 'gray'
    },
    content: {
        fontWeight: 200,
        padding: 8,
        paddingLeft: 12,
        border: "1pt solid #e9e9e9",
        borderRadius: 2,
        fontSize: 11,
        lineHeight: 1.4,
    },

    labItem: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 8,
        paddingLeft: 8,
        marginTop: 15,

    },
    alert: {
        position: 'absolute',
        left: -14,
        top: -4,
        width: 12,
        height: 12,
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 8,
        fontWeight: 800,
        backgroundColor: 'black',
        color: 'white'
    },
    minRef: {
        fontSize: 9,
        color: '#807e7e',
        position: 'absolute',
        top: -12.5,
        left: 0

    },
    maxRef: {
        fontSize: 9,
        color: '#807e7e',
        position: 'absolute',
        top: -12.5,
        right: 0

    },
    labBar: {
        position: 'relative',
        backgroundColor: '#d4e6d1',
        height: 15,
        borderRadius: 3
    },
    currentPosition: {
        position: 'absolute',
        width: 30,
        fontSize: 9,
        height: 12,
        color: 'white',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        top: 0.75,
        left: '100%',
        borderRadius: 2,
        transform: 'translateX(-15)',
        backgroundColor: '#707070'
    },
    pageNumber: {
        position: 'absolute',
        fontSize: 10,
        bottom: 36,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: 'grey',
    },
    copyright: {
        position: 'absolute',
        bottom: 15,
        left: 0,
        right: 0,
        fontSize: 9,
        fontWeight: 200,
        textAlign: 'center'
    }
}

export default styles;