import React,{useState,useEffect,useRef} from 'react'
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
import {IAdd,IAddData,IAddValues} from "../product-interface";
import PictureWall from './PictureWall';
import RichTextEditor from '../product-children/RichTextEditor';
import {reqAddOrUpdateProduct} from "../../../network"
import {IProduct} from "../../../types"


const {Item} = Form;
const { TextArea } = Input;

interface IProps{
    form:any,
    history:any,
}

const ProductAdd:React.FC<IProps> = ({form,history})=>{
    const {state} = history.location;
    const [productInfo] = useState<IProduct>(state || "") //得到修改按钮点击时传递过来的值
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
    const [placeFlag, setplaceFlag] = useState<boolean>(false);
    const initOptions = (dataArr:IAddData[])=>{
        const newOptions = dataArr.filter((item:IAddData,index:number)=>{
            return{
                value: item._id,
                label: item.name,
                isLeaf: false,
                key:index
            }
        });
        set_options(newOptions);
        setplaceFlag(placeFlag)
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
    const [displayImgs,setDisplayImgs] = useState<any[]>([]);
    const [detail,setDeatail] = useState<string>("");
    useEffect(()=>{
        getCategorys("0")
        if(productInfo){
            const imgs = productInfo.imgs.reduce((pre:any,item:any,index:number)=>{
                pre[index] = {
                    uid: `-${index}`,/*每个file都是自己唯一的id*/
                    name: 'image.png',/*图片文件名*/
                    status: 'done',/*图片状态 done-已上传*/
                    url: `http://localhost:5000/upload/${item}`,
                }
                return pre;
            },[])
            setDeatail(productInfo.detail);
            setDisplayImgs(imgs);
        }
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
    const {getFieldDecorator} = form;
    /*返回上一级*/ 
    const goBackToHome = ()=>{
        history.goBack()
    }
    /*得到子组件传递过来的图片数组*/ 
    const [imgs, setImgs] = useState<string[]>([]);

    const getImgs = (value:string[])=>{
        setImgs(value);
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

    /*提交事件*/ 
    const refRichTextEditor = useRef<any>(null); 

    const submitAddProduct = async ()=>{
        let product:IProduct;
        form.validateFields(async (err:any, values:IAddValues) =>{
            const {
                categoryIds,
                desc,
                name,
                price
            }=values;
            const pCategoryId = "5dac66b8b485702028557b55";
            const categoryId = "5dac6edbb485702028557b60";
            const detail = refRichTextEditor.current.getDetail();//得到富文本编辑器编辑后的文本
            product = {desc,name,price,pCategoryId,categoryId,imgs,detail}
            if(productInfo){ //说明是点击修改跳转过来的
                product._id = productInfo._id;
            }
            // 在这里收集到所有的数据 然后发起请求
            const result:any = await reqAddOrUpdateProduct(product);
            const info = !productInfo ? "添加" : "更新";
            if(result.data.status === 0){
                message.success(`商品${info}成功`)
            }else{
                message.error(result.data.msg);
            }
            
        })
    }



    return (
        <Card title={title}>
            <Form {...formItemLayout}>
                <Item  label="商品名称">
                    {getFieldDecorator("name",{
                        initialValue:productInfo && productInfo.name,
                        rules:[
                            {required:true,message:"商品名称必须输入"}
                        ]
                    })(<Input placeholder="请输入商品名称"/>)}
                </Item>
                <Item  label="商品描述">
                    {getFieldDecorator("desc",{
                        initialValue:productInfo && productInfo.desc,
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
                        initialValue:productInfo && productInfo.price,
                        rules:[
                            {required:true,message:"商品的价格必须输入"},
                            {validator:validatorPrice}
                        ]
                    })(<Input type="number" placeholder="请输入商品价格" addonAfter="元"/>)}
                </Item>
                <Item  label="商品分类">
                {getFieldDecorator("categoryIds",{
                        initialValue:[],
                        // rules:[
                        //     {required:true,message:"分类不能为空"},
                        // ]
                    })(
                    <Cascader
                        options={_options}
                        loadData={loadData}
                        placeholder={placeFlag ? "请选择分类" : "呵呵"}
                />
                )}
                </Item>
                <Item  label="商品图片">
                   <PictureWall getImgs={getImgs} imgs={displayImgs} />
                </Item>
                <Item  label="商品详情" labelCol={{span: 2}} wrapperCol={{span: 18}}>
                   <RichTextEditor detail={detail} ref={refRichTextEditor} />
                </Item>
                <Item labelCol={{span: 2}}>
                    <Button type="primary" onClick={()=>{submitAddProduct()}}>提交</Button>
                </Item>
            </Form>
        </Card>
    )
}

export default  Form.create({})(ProductAdd);