import React from 'react';
import { Form,Input} from 'antd';
import {IFormProps} from "../../../types";



const Update:React.FC<IFormProps> = ({getFieldDecorator,categoryName})=>{
    return (
        <Form>
            <Form.Item>
            {getFieldDecorator('categoryName', {
                initialValue:categoryName,
                rules: [{ required: true, message: '必须输入名称' }],
            })(
                <Input
                placeholder="输入分类的名称"
                />,
            )}
            </Form.Item>
        </Form>
    )
}
export default Update