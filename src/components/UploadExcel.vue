<template>
  <div>
    <el-upload drag
               :limit=limitNum
               :auto-upload="false"
               accept=".xlsx"
               :action="UploadUrl()"
               :before-upload="beforeUploadFile"
               :on-change="fileChange"
               :on-exceed="exceedFile"
               :on-success="handleSuccess"
               :on-error="handleError"
               :file-list="fileList"
               class="upload-body">
      <div class="upload-mid">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传xlsx文件，且不超过10M</div>
      </div>
    </el-upload>
<!--    <br/>-->
    <div class="button">
      <el-button size="default" type="primary" @click="uploadFile">立即上传</el-button>
<!--      <el-button size="default">取消</el-button>-->
    </div>
    <el-dialog v-model="dialogVisible" title="Tips" width="30%" draggable>
      <span>It's a draggable Dialog</span>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogVisible = false">
          Confirm
        </el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "UploadExcel",
  data() {
    return {
      limitNum: 1,  // 上传excell时，同时允许上传的最大数
      fileList: [],   // excel文件列表
      f_path: ''
    }
  },
  methods:{
    // 文件超出个数限制时的钩子
    exceedFile(files, fileList) {
      this.$message.warning(`只能选择 ${this.limitNum} 个文件，当前共选择了 ${files.length + fileList.length} 个`);
    },
    // 文件状态改变时的钩子
    fileChange(file, fileList) {
      console.log(file.raw);
      this.fileList.push(file.raw) ;
      console.log(this.fileList);
    },
    // 上传文件之前的钩子, 参数为上传的文件,若返回 false 或者返回 Promise 且被 reject，则停止上传
    beforeUploadFile(file) {
      console.log('before upload');
      console.log(file);
      let extension = file.name.substring(file.name.lastIndexOf('.')+1);
      let size = file.size / 1024 / 1024;
      if(extension !== 'xlsx') {
        this.$message.warning('只能上传后缀是.xlsx的文件');
      }
      if(size > 10) {
        this.$message.warning('文件大小不得超过10M');
      }
    },
    // 文件上传成功时的钩子
    handleSuccess(res, file, fileList) {
      this.$message.success('文件上传成功');
    },
    // 文件上传失败时的钩子
    handleError(err, file, fileList) {
      this.$message.error('文件上传失败');
    },
    UploadUrl:function(){
      // 因为action参数是必填项，我们使用二次确认进行文件上传时，直接填上传文件的url会因为没有参数导致api报404，所以这里将action设置为一个返回为空的方法就行，避免抛错
      return ""
    },
    uploadFile() {
      if (this.fileList.length === 0){
        this.$message.warning('请上传文件');
      } else {
        let form = new FormData();
        this.fileList.map(e => {
          form.append('fileTest', e)
        })
        axios.post("http://127.0.0.1:5001/upload", form).then(
            res=>{
              console.log("文件上传成功", res)
              this.f_path = res.data
              console.log(this.f_path)
            },err =>{
              console.log("文件上传失败", err)
            });
      }
    }

  }
}
</script>

<style scoped lang="less">
  .upload-body :deep(.el-upload-dragger) {
    height: 170px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

 .button {
   margin: 15px 0 0 20px;
 }
</style>
