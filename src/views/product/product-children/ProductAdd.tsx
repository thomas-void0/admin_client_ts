import React,{useState,useEffect} from 'react'
import {
    Card,
    Input,
    Button,
    Form,
    Icon,
    Cascader,
    message
} from 'antd'
import SlotButton from '../../../components/common/slot-button/SlotButton';
import {reqCategorys} from "../../../network";
import {IAdd,IAddData} from "../product-interface";
import PictureWall from './PictureWall';
// import RichTextEditor from '../rich-text-editor/rich-text-editor';

const {Item} = Form;
const { TextArea } = Input;


const ProductAdd = (props:any)=>{
    /*输入框在容器中所占用的位置*/
    const formItemLayout = {
        labelCol: { span: 2 },
        wrapperCol: { span: 8 },
    }
    
    /*表单价格自定义验证函数*/
    const validatorPrice = (rule:never,value:{price:number},callback:(value?:string)=>void)=>{
        let valueNum = Number(value);
        if(valueNum > 0){
            callback()
        }else if(valueNum === 0){
            callback("价格不能为0")
        }else{
            callback("价格不能为负数")
        }
    }

    /*初始化一级菜单*/
    const [_options, set_options] = useState<any>([]);
    const initOptions = (dataArr:IAddData[])=>{
        const newOptions = dataArr.filter((item:IAddData)=>{
            return{
                value: item._id,
                label: item.name,
                isLeaf: false,
            }
        });
        console.log("this value is ===========>",newOptions);
        set_options(newOptions);
    }

    /*请求数据*/ 
    const getCategorys = async (parentId:string)=>{
        const result:IAdd = await reqCategorys(parentId);
        const {data} = result;
        if(data.status === 0){ 
            if(parentId === "0"){ //说明请求的是一级分类
                initOptions(data.data);
            }else{
                console.log("二级列表");
            }
        }else{
            message.error(`数据请求失败${data.msg}`);
        }

    }
    
    useEffect(()=>{
        getCategorys("0")
    },[])

    const loadData = async (selectedOptions:any) => {
        const targetOption = selectedOptions[0]; //得到当前选择的项
        targetOption.loading = true;

        // 在这里发起数据请求
        // const result = await reqCategorys();

        targetOption.loading = false;
        // setOption([...options]);

    };

    /*用于和表单进行双向绑定*/
    let { 
        form,
        history
    } = props;
    const {getFieldDecorator} = form;
    /*返回上一级*/ 
    const goBackToHome = ()=>{
        history.goBack()
    }
    /*得到子组件传递过来的图片数组*/ 
    const getImgs = (value:string[])=>{
        console.log("value==>",value);
    }
    /*card的返回按钮*/ 
    const title = (
        <span>
            <SlotButton onClick={()=>{goBackToHome()}}>
                <Icon type="arrow-left" style={{fontSize:20}}/>
                <span>返回上一级</span>
            </SlotButton>
        </span>
    )
    return (
        <Card title={title}>
            <Form {...formItemLayout}>
                <Item  label="商品名称">
                    {getFieldDecorator("name",{
                        initialValue:"name",
                        rules:[
                            {required:true,message:"商品名称必须输入"}
                        ]
                    })(<Input placeholder="请输入商品名称"/>)}
                </Item>
                <Item  label="商品描述">
                    {getFieldDecorator("desc",{
                        initialValue:"desc",
                        rules:[
                            {required:true,message:"商品描述必须输入"}
                        ]
                    })(<TextArea 
                        placeholder="请输入商品描述"
                        autoSize={{ minRows: 2 }}
                    />)}
                </Item>
                <Item  label="商品价格">
                    {getFieldDecorator("price",{
                        initialValue:"price",
                        rules:[
                            {required:true,message:"商品的价格必须输入"},
                            {validator:validatorPrice}
                        ]
                    })(<Input type="number" placeholder="请输入商品价格" addonAfter="元"/>)}
                </Item>
                <Item  label="商品分类">
                {getFieldDecorator("categoryIds",{
                        initialValue:[],
                        rules:[
                            {required:true,message:"分类不能为空"},
                        ]
                    })(
                    <Cascader
                        options={_options}
                        loadData={loadData}
                        placeholder="请选择分类"
                />
                )}
                </Item>
                <Item  label="商品图片">
                   <PictureWall getImgs={getImgs}/>
                </Item>
                <Item  label="商品详情" labelCol={{span: 2}} wrapperCol={{span: 18}}>
                   {/* <RichTextEditor ref={editor} detail={detail}/> */}
                </Item>
                <Item labelCol={{span: 2}}>
                    <Button type="primary" /*onClick={()=>{submitAddProduct()}}*/>提交</Button>
                </Item>
            </Form>
        </Card>
    )
}

export default  Form.create({})(ProductAdd);