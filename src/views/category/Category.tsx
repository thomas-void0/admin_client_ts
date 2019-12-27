import React,{useEffect, useState} from 'react';
import { Card,Table,Modal,Button,Icon,Form } from 'antd';
import SlotButton from "../../components/common/slot-button/SlotButton";
import {reqCategorys,reqCategoryUpdate} from '../../network';
import {addKey} from "../../untils/addKey/add-key";
import {message} from "antd";
import {CategoryData} from "../../types";
import Update from "./category-children/Update";

/*定义表单传入的props值*/
interface IProps{
    form:any
}

/*定义表单收集到值*/
interface IForm{
    categoryName:string
}

const Category:React.FC<IProps>=({form})=>{
    /*返回第一页*/ 
    const backToFirstPage = ()=>{
        setChildCategorys([]);//清空二级分类列表
        setNowPage(1);//设置当前页码为1
    }
    /*设置头部标题文字*/ 
    const [nowPage, setNowPage] = useState<number>(1);
    const [title,setTitle] = useState<JSX.Element>()
    useEffect(() => {
        const initTile = (():JSX.Element=>{
            return(
                <>
                    {nowPage === 1 ? (<span>一级菜单</span>) : (
                        <div>
                            <button style={{
                                cursor:"pointer",
                                border:"0",
                                backgroundColor:"transparent",
                                color:"#1890ff",
                                outline:"none"
                                }}
                                onClick={backToFirstPage}
                            >
                                一级菜单
                            </button>
                            <Icon type="double-right" />
                            <span style={{marginLeft:"10px"}}>二级菜单</span>
                        </div>
                    )}
                </>
            )
        })();
        setTitle(initTile);
    }, [nowPage])

    /*设置初始化表格标题变量*/ 
    const [columns,setColumns] = useState<any[]>();
    /*查看子分类*/ 
    const checkChildCategory =(category:CategoryData)=>{
        const {_id} = category;
        getCategorys(_id);
    }
    /*修改分类*/ 
    const [addVisible, setAddVisible] = useState<boolean>(false);
    const [categoryInfo, setCategoryInfo] = useState<CategoryData>();
    const updateCategory = (category:CategoryData):void=>{
        setAddVisible(true) //打开对话框
        setCategoryInfo(category);//设置输入框默认值
    }
    const updateModelOk = ():void=>{
        setAddVisible(false);
        form.validateFields(async (err:any,values:IForm)=>{
            if(!err){
                const {categoryName} = values;
                const categoryId = categoryInfo ? categoryInfo._id : "";
                const result:any = await reqCategoryUpdate(categoryId,categoryName);
                if(result.data.status === 0){
                    message.success("更新成功");
                    // 成功后，重新请求数据。渲染页面
                    const parendId = categoryInfo ? categoryInfo.parentId : "0";
                    getCategorys(parendId);
                }else{  
                    message.error("更新失败");
                }
            }
        })
        form.resetFields();//清空输入框
    }
    const ModelCancel = ():void=>{
        setAddVisible(false)
    }
    const initColumns = ()=>{
        return [
            {title: '分类名称',dataIndex: 'name',width:"70%"},
            {
                title: '操作',
                render: (category:CategoryData)=>{
                    return(
                        <div>
                            <SlotButton  onClick={()=>{updateCategory(category)}} >修改分类</SlotButton>
                            {nowPage === 1 ? 
                                (<SlotButton onClick={()=>{checkChildCategory(category)}} >查看子分类</SlotButton>)
                            : null}
                        </div>
                    )
                }
            },
        ]
    }
    useEffect(() => {
        setColumns(initColumns())
    }, [nowPage])
    /*设置添加按钮的变量*/ 
    const [initBtnDom,setInitBtnDom] = useState<JSX.Element>();
    /*初始化添加按钮*/
    const setButton = ():JSX.Element=>{
        return(
            <Button type="primary">
                <Icon type="plus" />
                添加
            </Button>
        )
    }

    /*请求分类数据*/ 
    const [categorys, setCategorys] = useState<any[]>([]);
    const [childCategorys, setChildCategorys] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(false);
    /*请求数据处理,给值绑定key,赋值,错误提示等*/ 
    const handleData=(parentId:string,data:any):void=>{
        if(data.status === 0){
            /*对请求到的数据添加key值，解决antd的警告提示*/ 
            const result = addKey(data.data);
            /*判断请求到数据是不是存在的，添加提示信息*/ 
            const info = "分类中没有数据，如有需要，请手动添加..."
            const strFlag:string = JSON.stringify(result);
            if(strFlag === "[]"){
                parentId === "0" ? message.warn(`一级${info}`) : message.warn(`二级${info}`);
            }else{
                /*如果传入的id是一级分类，那么就给一级分类赋值，否则给二级分类赋值*/ 
                parentId === "0" ? setCategorys(result) : setChildCategorys(result);
                parentId !== "0" && setNowPage(2); //如果二级菜单有数据，那么就更改显示的页码
            }
        }else{
            message.error("数据请求失败");
        }


    }
    /*返回请求到的数据*/ 
    const getCategorys = async (parentId:string)=>{
        setLoading(true);//数据开始请求前，开启loading效果
        const {data} = await reqCategorys(parentId);
        handleData(parentId,data);
        setLoading(false);//数据请求完毕后，关闭loading效果
    }

    /*判断子分类数组中是否有值*/ 
    const isChildCategorys = ()=>{
        return JSON.stringify(childCategorys) !== "[]";
    }

    useEffect(() => {
        setInitBtnDom(setButton());
        getCategorys("0");
    }, [])

    const {getFieldDecorator} = form
    return (
        <Card 
        title={title} 
        extra={initBtnDom} 
        >
            <Table
                columns={columns}
                dataSource={isChildCategorys() ? childCategorys : categorys}
                bordered
                pagination={{
                    defaultPageSize:5,
                    showQuickJumper:true,
                    hideOnSinglePage:true,
                }}
                loading={loading}
            />
            <Modal
                title="修改分类"
                visible={addVisible}
                onOk={updateModelOk}
                onCancel={ModelCancel}
                okText="确定"
                cancelText="取消"
                >
                    <Update 
                        getFieldDecorator={getFieldDecorator}
                        categoryName={categoryInfo ?  categoryInfo.name : ""}
                    />
            </Modal>
            <Modal
                title="添加分类"
                // visible={props.visible}
                // onOk={props.categoryUpdate}
                onCancel={ModelCancel}
                okText="确定"
                cancelText="取消"
                >

            </Modal>
        </Card>
    )
}
export default Form.create()(Category) 

