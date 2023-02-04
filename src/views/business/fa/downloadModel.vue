<template>
  <div>
    <div class="toolView">

      <div style="margin-top: 0px">
        <el-button style="font-size: 15px" type="text" icon="el-icon-download" @click="downloadModel" size="small">下载模版</el-button>
      </div>
    </div>


  </div>
</template>
<script>
export default {
  data() {
    return {
      action: this.$axios.defaults.baseURL + 'cloud/authority/ysImport',
      headers: {
        Authorization: localStorage.getItem('Authorization')
      },

    }
  },
  created() {

    this.downloadModel()
  },
  methods: {


    downloadModel() {
      let url = 'http://192.168.0.188:9000/sea-oss/9faa0b1a33fde6520c9d9fda4a6832c0.xlsx'
      let fileName = '期初导入模板'
      this.getBlob(url, (blob) => {
        this.saveAs(blob, fileName)
      })
    },
    getBlob(url, cb) {
      let xhr = new XMLHttpRequest()
      xhr.open('GET', url, true)
      xhr.responseType = 'blob'
      xhr.onload = function () {
        if (xhr.status === 200) {
          cb(xhr.response)
        }
      }
      xhr.send()
    },

    saveAs(blob, filename) {
      if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, filename)
      } else {
        let link = document.createElement('a')
        let body = document.querySelector('body')

        link.href = window.URL.createObjectURL(blob)
        link.download = filename

        link.style.display = 'none'
        body.appendChild(link)

        link.click()
        body.removeChild(link)
        window.URL.revokeObjectURL(link.href)
      }
    }
  }
}
</script>
<style scoped>
.container {
  padding: 15px;
}
</style>