import React from 'react';
import { Form,Input} from 'antd';

interface IProps{
    getFieldDecorator:(value1:string,value2:Value2)=>any,
    categoryName:string
}

interface Value2{
    initialValue?:string,
    rules:{ required: boolean; message: string; }[]
}

const Update:React.FC<IProps> = ({getFieldDecorator,categoryName})=>{
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