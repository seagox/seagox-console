const BigNumber = require('bignumber.js')

let FUNCTION_REGEX = [
    'IF\\(',
    'IFS\\(',
    'AND\\(',
    'OR\\(',
    'XOR\\(',
    'NOT\\(',
    'ISEMPTY\\(',
    'CONCAT\\(',
    'AVERAGE\\(',
    'COUNT\\(',
    'SUM\\(',
    'CURDATE\\(',
    'NOW\\(',
    'UUID\\(',
    'YEAR\\(',
    'MONTH\\(',
    'DAY\\(',
    'HOUR\\(',
    'MINUTE\\(',
    'SECOND\\(',
    'DAYS\\(',
    'MONTHDIFF\\(',
    'SUBTRACT\\(',
    'PRODUCT\\(',
    'DIVIDE\\('
]
function handleFormula(input, variables) {
    // 参数替换
    let pattern = /\$\{(.*?)\}/g
    var matches = input.match(pattern)
    if (matches) {
        for (let i = 0; i < matches.length; i++) {
            let matche = matches[i]
            if (
                variables[matche.substring(2, matche.length - 1)] ||
                variables[matche.substring(2, matche.length - 1)] == 0
            ) {
                input = input.replace(matche, variables[matche.substring(2, matche.length - 1)])
            } else {
                // 表达式中缺少参数
                throw new Error('表达式中缺少参数')
            }
        }
    }
    // 函数替换
    var startRegexList = getStartRegex(input)
    var endRegexList = getEndRegex(input)

    var lastKey = ''
    var lastValue = 0
    var functionNum = 0
    let functionPattern = '/' + FUNCTION_REGEX.join('|') + '/g'
    var regex = eval(functionPattern)
    while ((match = regex.exec(input))) {
        lastKey = match[0]
        lastValue = regex.lastIndex - match[0].length
        functionNum = functionNum + 1
    }
    if (startRegexList.length != endRegexList.length) {
        // 表达式中()有误
        throw new Error('表达式中()有误')
    }
    if (lastKey) {
        var start = lastValue
        // var end = endRegexList[startRegexList.indexOf(lastValue + lastKey.length - 1)] + 1
        var end = getEndBracketIndex(input, startRegexList.indexOf(lastValue + lastKey.length - 1))
        var type = lastKey.substring(0, lastKey.length - 1)
        var content = input.substring(start + lastKey.length, end)
        var result = handleFunction(type, content)
        var newInput = input.replace(input.substring(start, end + 1), result)

        // 循环检查替换
        if (functionNum > 1) {
            return handleFormula(newInput, variables)
        } else {
            return newInput.replace(/"/g, "")
        }
    }
    return input.replace(/"/g, "")
}

// 通过左括号下标获取右括号下标
function getEndBracketIndex(input, leftBracketIndex){
    var bracket = []
    var algorithms = input || ''
    var leftBracketNum = 0
    var leftBracketTargetIndex = -1
    for(var i=0; i<algorithms.length; i++){
        if(algorithms.charAt(i) == "("){
            bracket.push('(')
            if (leftBracketNum === leftBracketIndex) {
                leftBracketTargetIndex = bracket.length - 1
            }
            leftBracketNum ++
        }
        if(algorithms.charAt(i)==")"){
            if(bracket.length){
                if (leftBracketTargetIndex === bracket.length - 1) {
                    return i
                }
                bracket.pop()
            }else{
                throw new Error('公式括号不配对，缺少左括号！')
                return -1
            }
        }
    }
    throw new Error('公式括号不配对，缺少右括号！')
    return -1
}

function getStartRegex(input) {
    var startRegexList = []
    let regex = /\(/g
    while ((match = regex.exec(input))) {
        startRegexList.push(regex.lastIndex - match[0].length)
    }
    return startRegexList
}

function getEndRegex(input) {
    var endRegexList = []
    let regex = /\)/g
    while ((match = regex.exec(input))) {
        endRegexList.push(regex.lastIndex - match[0].length)
    }
    endRegexList.reverse()
    return endRegexList
}

function handleFunction(type, content) {
    if (type === 'IF') {
        var contentArray = content.split(',')
        if (contentArray.length == 3) {
            if (eval(contentArray[0])) {
                return '"' + contentArray[1].trim() + '"'
            } else {
                return '"' + contentArray[2].trim() + '"'
            }
        } else {
            throw new Error('表达式中IF函数设置有误')
        }
    } else if (type === 'IFS') {
        var contentArray = content.split(',')
        if (contentArray.length % 2 == 0) {
            for (var i = 0; i < contentArray.length; i++) {
                if (i % 2 == 0) {
                    if (eval(contentArray[i])) {
                        return '"' + contentArray[i + 1].trim() + '"'
                    }
                }
            }
        } else {
            throw new Error('表达式中IFS函数设置有误')
        }
    } else if (type === 'AND') {
        var contentArray = content.split(',')
        if (contentArray.length == 0) {
            for (var i = 0; i < contentArray.length; i++) {
                if (!eval(contentArray[i])) {
                    return 'false'
                }
            }
            return 'true'
        } else {
            throw new Error('表达式中AND函数设置有误')
        }
    } else if (type === 'OR') {
        var contentArray = content.split(',')
        if (contentArray.length == 0) {
            for (var i = 0; i < contentArray.length; i++) {
                if (eval(contentArray[i])) {
                    return 'true'
                }
            }
            return 'false'
        } else {
            throw new Error('表达式中OR函数设置有误')
        }
    } else if (type === 'XOR') {
        var contentArray = content.split(',')
        if (contentArray.length == 0) {
            var trueResult = 0
            var falseResult = 0
            for (var i = 0; i < contentArray.length; i++) {
                if (eval(contentArray[i])) {
                    trueResult = trueResult + 1
                } else {
                    falseResult = falseResult + 1
                }
            }
            if (trueResult == 0 || falseResult == 0) {
                return 'false'
            }
            return 'true'
        } else {
            throw new Error('表达式中OR函数设置有误')
        }
    } else if (type === 'NOT') {
        if (eval(content)) {
            return 'false'
        }
        return 'true'
    } else if (type === 'ISEMPTY') {
        if (content) {
            return 'false'
        }
        return 'true'
    } else if (type === 'CONCAT') {
        var contentArray = content.split(',')
        var result = ''
        if (contentArray.length == 0) {
            for (var i = 0; i < contentArray.length; i++) {
                result = result + contentArray[i]
            }
            return '"' + result + '"'
        } else {
            throw new Error('表达式中CONCAT函数设置有误')
        }
    } else if (type === 'AVERAGE') {
        var contentArray = content.split(',')
        var totalAmount = 0
        if (contentArray.length != 0) {
            for (var i = 0; i < contentArray.length; i++) {
                totalAmount = totalAmount + Number(contentArray[i].trim())
            }
            return totalAmount / contentArray.length
        } else {
            throw new Error('表达式中AVERAGE函数设置有误')
        }
    } else if (type === 'COUNT') {
        var contentArray = content.split(',')
        return contentArray.length
    } else if (type === 'SUM') {
        var contentArray = content.split(',')
        var total = BigNumber(0)
        if (contentArray.length != 0) {
            for (var i = 0; i < contentArray.length; i++) {
                total = total.plus(Number(contentArray[i].trim()))
            }
            return total.toString()
        } else {
            throw new Error('表达式中SUM函数设置有误')
        }
    } else if (type === 'CURDATE') {
        var date = new Date()
        var year = date.getFullYear() + '-'
        var month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
        var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
        return '"' + year + month + day + '"'
    } else if (type === 'NOW') {
        var date = new Date()
        var year = date.getFullYear() + '-'
        var month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
        var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate() + ' '
        var hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours() + ':'
        var minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes() + ':'
        var second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
        return '"' + year + month + day + hour + minute + second + '"'
    } else if (type === 'UUID') {
        return '"' + uuid() + '"'
    } else if (type === 'YEAR') {
        var date = new Date()
        return date.getFullYear()
    } else if (type === 'MONTH') {
        var date = new Date()
        return date.getMonth() + 1
    } else if (type === 'DAY') {
        var date = new Date()
        return date.getDate()
    } else if (type === 'HOUR') {
        var date = new Date()
        return date.getHours()
    } else if (type === 'MINUTE') {
        var date = new Date()
        return date.getMinutes()
    } else if (type === 'SECOND') {
        var date = new Date()
        returndate.getSeconds()
    } else if (type === 'DAYS') {
        var contentArray = content.split(',')
        if (contentArray.length == 2) {
            let startTime = new Date(Date.parse(contentArray[1].replace(/-/g, '/'))).getTime()
            let endTime = new Date(Date.parse(contentArray[0].replace(/-/g, '/'))).getTime()
            return parseInt((startTime - endTime) / (1000 * 60 * 60 * 24))
        } else {
            throw new Error('表达式中DAYS函数设置有误')
        }
    } else if (type === 'MONTHDIFF') {
        var contentArray = content.split(',')
        if (contentArray.length == 2) {
            //初始化开始结束时间
            let startTime = new Date(Date.parse(contentArray[1].replace(/-/g, '/')))
            let endTime = new Date(Date.parse(contentArray[0].replace(/-/g, '/')))
            //初始化年月日数值
            let startYear = startTime.getYear()
            let endYear = endTime.getYear()
            let startMonth = startTime.getMonth() + 1
            let endMonth = endTime.getMonth() + 1
            return (endYear - startYear) * 12 + (endMonth - startMonth)
        } else if (contentArray.length == 3) {
            //初始化开始结束时间
            let startTime = new Date(Date.parse(contentArray[1].replace(/-/g, '/')))
            let endTime = new Date(Date.parse(contentArray[0].replace(/-/g, '/')))
            //初始化年月日数值
            let startYear = startTime.getYear()
            let endYear = endTime.getYear()
            let startMonth = startTime.getMonth() + 1
            let endMonth = endTime.getMonth() + 1

            let num = (endYear - startYear) * 12 + (endMonth - startMonth)

            let day = endTime.getDate() - startTime.getDate();
            // contentArray[2] == 1:向上取整，contentArray[2] == 2:向下取整
            if (day > 0) {
                if (contentArray[2] == 1) {
                    num += 1
                }
            } else if (day < 0) {
                if (contentArray[2] == 2) {
                    num -= 1
                }
            }
            return num
        } else {
            throw new Error('表达式中MONTHDIFF函数设置有误')
        }
    } else if (type === 'SUBTRACT') {
        var contentArray = content.split(',')
        if (contentArray.length != 0) {
            var total = BigNumber(Number(contentArray[0].trim()))
            for (var i = 1; i < contentArray.length; i++) {
                total = total.minus(Number(contentArray[i].trim()))
            }
            return total.toString()
        } else {
            throw new Error('表达式中SUBTRACT函数设置有误')
        }
    } else if (type === 'PRODUCT') {
        var contentArray = content.split(',')
        if (contentArray.length != 0) {
            var total = BigNumber(Number(contentArray[0].trim()))
            for (var i = 1; i < contentArray.length; i++) {
                total = total.times(Number(contentArray[i].trim()))
            }
            return total.toString()
        } else {
            throw new Error('表达式中PRODUCT函数设置有误')
        }
    } else if (type === 'DIVIDE') {
        var contentArray = content.split(',')
        if (contentArray.length == 2) {
            var total = BigNumber(Number(contentArray[0].trim()))
            for (var i = 1; i < contentArray.length; i++) {
                total = total.div(Number(contentArray[i].trim()))
            }
            return total.toString()
        } else {
            throw new Error('表达式中DIVIDE函数设置有误')
        }
    }
    return null
}

function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
    })
}

module.exports = {
    handleFormula
}
