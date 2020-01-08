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
import {IAdd,IAddData,IAddValues,IOption,ICategorys} from "../product-interface";
import PictureWall from './PictureWall';
import RichTextEditor from '../product-children/RichTextEditor';
import {reqAddOrUpdateProduct} from "../../../network"
import {IProduct} from "../../../types";


const {Item} = Form;
const { TextArea } = Input;

interface IProps{
    form:any,
    history:any,
}

const ProductAdd:React.FC<IProps> = ({form,history})=>{
    const {state} = history.location;
    const [productInfo] = useState<IProduct>(state || "") //得到修改按钮点击时传递过来的值
    const [categoryIds] = useState<Array<string>>(state ? [state.pCategoryId,state.categoryId] : []);
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

    // 处理级联选择器的数据
    const hanleOptions = (array:IAddData[],flag:boolean = true):Array<IOption>=>{
        return array.reduce((pre:IOption[],item:IAddData,index:number)=>{
            pre.push({
                value: item._id,
                label: item.name,
                isLeaf: flag,
                key:index  
            });  
            return pre;
        },[])
    }
    // 查找需要被更新的分类对象
    const checkNewOptions = (value:string,children?:IOption[]):Array<IOption>=>{
        return [..._options].reduce((pre:IOption[],item:IOption)=>{
            if(item.value === value && children){
                item.children = children; //有子分类的情况
            }else if(item.value === value){
                item.isLeaf = true; //说明没有子分类
            }
            pre.push(item);
            return pre;
        },[])
    }
    /*初始化一级菜单*/
    const [_options,set_options] = useState<any>([]);
    /*请求数据*/ 
    const [displayImgs,setDisplayImgs] = useState<any[]>([]);
    const [detail,setDeatail] = useState<string>("");

    useEffect(()=>{
        if(productInfo){ 
            (async ()=>{ //说明是跳转过来进行修改的内容
                const {pCategoryId} = productInfo;
                const response = await Promise.all([reqCategorys("0"),reqCategorys(pCategoryId)]);
                const parentResult = response[0].data;
                const childrenResult = response[1].data;
                if(parentResult.status === 0 && childrenResult.status === 0){
                    const handleParentData = hanleOptions(parentResult.data,false);
                    if(childrenResult.data.length > 0){
                        const handleChildrenData = hanleOptions(childrenResult.data,true);//处理子数组数据
                        const targetOption = handleParentData.find((cItem:IOption)=>cItem.value === pCategoryId);
                        targetOption!.children = handleChildrenData;
                    }
                    set_options(handleParentData);
                }else{
                    message.error("数据请求出错")
                }
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
            })()
        }else{
            (async ()=>{
                const result:IAdd = await reqCategorys("0");
                const {data} = result;
                if(data.status === 0){ 
                    set_options(hanleOptions(data.data,false)); //设置初始化的级联选择器数据
                }else{
                    message.error(`数据请求失败${data.msg}`);
                }
            })()
        }
    },[])



    const loadData = async (selectedOptions:any) => {
        const targetOption = selectedOptions[0]; //得到当前选择的项
        targetOption.loading = true;
        // 在这里发起数据请求
        const result:ICategorys = await reqCategorys(targetOption.value);
        targetOption.loading = false;
        const {data,status} = result.data;
        if(status === 0 && data.length > 0){//说明有二级分类
            const children = hanleOptions(data,true);
            set_options(checkNewOptions(targetOption.value,children));
        }else if(status === 0){ //没有二级分类
            set_options(checkNewOptions(targetOption.value));
        }else{
            message.error(result.data.msg)
        }
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
            const pCategoryId = categoryIds[0];
            const categoryId = categoryIds[1];
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
                        initialValue:categoryIds,
                        rules:[
                            {required:true,message:"分类不能为空"},
                        ]
                    })(
                    <Cascader
                        options={_options}
                        loadData={loadData}
                        placeholder={"请选择分类"}
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