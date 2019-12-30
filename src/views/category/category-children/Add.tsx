import React from 'react'
import { Form,Input,Select} from 'antd';
import {IFormProps} from "../../../types";
import {ICategory,ISelect} from "../categoryInter";

const Item = Form.Item;
const { Option } = Select;

/*继承表单接口*/
interface IProps extends IFormProps{
    nowPage:number
}

const Add:React.FC<ISelect & IProps> = ({nowPage,categorys,getFieldDecorator})=> {
    return (
        <Form>    
            {nowPage === 1 ? (
            <Item label="添加分类：">
                {getFieldDecorator('gender', {
                    initialValue:'一级分类',
                    rules: [{ required: true, message: '请选择你需要添加的分类' }],
                })(
                <Select>
                    {
                        categorys.reduce((pre:JSX.Element[],item:ICategory,index:number)=>{
                            pre.push(
                                <Option key={index} value={item._id}>{item.name}</Option>
                            )
                            return pre;
                        },[])
                    }
                </Select>,
                )}
            </Item >
            ):null}  
            <Item  label="分类名称：">
                {getFieldDecorator('categoryName', {
                    initialValue:'',
                    rules: [{ required: true, message: '必须输入名称' }],
                })(
                    <Input
                    placeholder="输入分类的名称"
                    />,
                )}
            </Item>
        </Form>
    )
}

export default Add;