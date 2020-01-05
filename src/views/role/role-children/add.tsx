import React,{forwardRef,useImperativeHandle,Ref} from 'react'
import { Form,Input} from 'antd';
import {FormComponentProps} from "antd/es/form"

const Item = Form.Item;

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
}

interface IProps{
    form:any,
    ref:Ref<Form>
}

const Add = forwardRef<FormComponentProps,IProps>(({form},ref)=>{
    const {getFieldDecorator} = form;
    useImperativeHandle(ref,()=>({
       form//直接将form暴露出去
    }))
    return (
        <Form {...formItemLayout}>
            <Item label="创建角色：">
                {getFieldDecorator('roleName', {
                    initialValue:'',
                    rules: [{ required: true, message: '必须输入名称' }],
                })(
                    <Input
                        placeholder="输入角色名称"
                    />,
                )}
            </Item>
        </Form>
    )
})
export default Form.create({})(Add);