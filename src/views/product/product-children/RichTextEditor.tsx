import React,{
  useState,
  forwardRef,
  useImperativeHandle,
  Ref,
  useEffect
} from 'react';
import { EditorState, convertToRaw, ContentState} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

export interface IGetDesc{
  getDetail:()=>string
}

interface IProps{
  detail:string
}

const RichTextEditor:React.FC<IProps>=({detail},ref:Ref<IGetDesc>)=>{
    /*设置编辑器状态*/ 
    const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty());
    useEffect(()=>{
      if(detail){
        const contentBlock = htmlToDraft(detail)
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const editorState = EditorState.createWithContent(contentState)
        setEditorState(editorState);
      }
    },[detail])
    /*将这个方法暴露给外部父组件*/ 
    useImperativeHandle(ref,()=>({
      getDetail:()=>{
        return draftToHtml(convertToRaw(editorState.getCurrentContent()));
      }
    }))
    /*编辑器监听状态*/
    const onEditorStateChange = (editorState:EditorState)=>{
        setEditorState(editorState)
    }
    /*上传描述图片*/ 
    const uploadImageCallBack = (file:string | Blob):Promise<{data:{link:string}}>=>{
        return new Promise(
            (resolve, reject) => {
              const xhr = new XMLHttpRequest();
              xhr.open('POST', '/manage/img/upload');
              const data = new FormData();
              data.append('image', file);
              xhr.send(data);
              xhr.addEventListener('load', () => {
                const response = JSON.parse(xhr.responseText);
                const url = response.data.url
                resolve({data:{link:url}});
              });
              xhr.addEventListener('error', () => {
                const error = JSON.parse(xhr.responseText);
                reject(error);
              });
            }
          );
    }
    return (
      <div>
          <Editor
            editorState={editorState}
            editorStyle={{border:"1px solid black",minHeight:"200px",paddingLeft:"10px"}}
            onEditorStateChange={onEditorStateChange}
            toolbar={{
              image: { uploadCallback: uploadImageCallBack, alt: { present: true, mandatory: true } },
            }}
          />         
      </div>
       
      )
}

export default forwardRef(RichTextEditor);