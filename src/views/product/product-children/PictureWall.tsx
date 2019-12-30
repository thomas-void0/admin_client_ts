import React,{useState} from 'react'
import { Upload, Icon, Modal,message} from 'antd';
import {reqDeleteImg} from "../../../network";

/*将图片转换为base编码方便显示*/
const getBase64=(file:any):Promise<any>=>{
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
}

/*接口*/ 
interface IProps{
    getImgs:(value:any[])=>void;
}

const PictureWall2:React.FC<IProps> = ({getImgs})=>{
    const [previewVisible, setPreviewVisible] = useState<boolean>(false) 
    const [previewImage, setPreviewImage] = useState<string>("") 
    const [fileList, setFileList] = useState<any[]>([]);
    const handleCancel = () => setPreviewVisible(false);

    /*显示大图*/
    const handlePreview = async (file:any):Promise<void> => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      setPreviewVisible(true)
      setPreviewImage(file.url || file.preview)
    };
    /*监听图片处理*/ 
    const handleChange = async ({ file,fileList}:any):Promise<void> =>{
        const status = file.status;
        if(status === "done"){ /*图片上传完成*/
            const result = file.response;
            if(result.status === 0){ /*图片上传成功*/
                message.success("图片上传成功")
                const {name,url} = result.data;
                let newFile = fileList[fileList.length - 1];
                newFile.name = name;
                newFile.url  = url;
            }else{
                message.error("图片上传失败")
            }
        }else if(status === "removed"){ /*删除图片*/
            const result = await reqDeleteImg(file.name);
            if(result.data.status === 0){
                message.success("图片删除成功")
            }else{
                message.error("图片删除失败")
            }
        }
        setFileList(fileList);
        const imgsValue = fileList.map((item:any):string=>{
            return item.name;
        })
        getImgs(imgsValue);//父组件拿到子组件中的图片数组
    };
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );
    return (
        <div className="clearfix">
            <Upload
                action="/manage/img/upload"/*上传图片的接口地址*/
                accept="image/*"/*只接收图片格式*/
                name="image"/*请求参数名*/
                listType="picture-card" /*卡片样式*/
                fileList={fileList}/*所有已上传图片文件对象的数组*/
                onPreview={handlePreview}/*显示对应图片的大图*/
                onChange={handleChange}/*上传文件改变时的状态*/
            >
            {fileList.length >= 8 ? null : uploadButton}
            </Upload>
            <Modal 
                visible={previewVisible} 
                footer={null} 
                onCancel={()=>{handleCancel()}}
            >
            <img 
                alt="example" 
                style={{ width: '100%' }} 
                src={previewImage} 
            />
            </Modal>
      </div>
    )
}
export default PictureWall2