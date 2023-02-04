// 设置图片地址
function setImageUrl(data) {
    data.forEach(item => {
        if(item.type === 1) {
            if(item.toUserIds) {
                item.src = require('@/assets/fileType/share.svg')
            } else {
                item.src = require('@/assets/fileType/folder.svg')
            }
        } else if(item.type === 2) {
            item.src = require('@/assets/fileType/image.svg')
        } else if(item.type === 3) {
            item.src = require('@/assets/fileType/word.svg')
        } else if(item.type === 4) {
            item.src = require('@/assets/fileType/excel.svg')
        } else if(item.type === 5) {
            item.src = require('@/assets/fileType/ppt.svg')
        } else if(item.type === 6) {
            item.src = require('@/assets/fileType/pdf.svg')
        } else if(item.type === 7) {
            item.src = require('@/assets/fileType/zip.svg')
        } else if(item.type === 8) {
            item.src = require('@/assets/fileType/txt.svg')
        } else if(item.type === 9) {
            item.src = require('@/assets/fileType/document.svg')
        } else if(item.type === 10) {
            item.src = require('@/assets/fileType/video.svg')
        } else if(item.type === 11) {
            item.src = require('@/assets/fileType/music.svg')
        }else if(item.type === 12) {
            item.src = require('@/assets/fileType/other.svg')
        } else if(item.type === 13) {
            item.src = require('@/assets/fileType/md.svg')
        }
    })
}

export {
    setImageUrl
}
