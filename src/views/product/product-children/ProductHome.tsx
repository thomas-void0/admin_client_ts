import React,{useState,useEffect, useMemo} from 'react'
import { 
    Card,
    Table,
    Input,
    Select,
    Button,
    Form,
    message
} from 'antd';
import SlotButton from "../../../components/common/slot-button/SlotButton";
import {reqProducts,reqSearchProducts,reqUpdateStatus} from "../../../network"
import {PAGE_SIZE} from "../../../constant";
import {IData,IResult,IEvent} from "../product-interface";
import {addKey} from "../../../untils/addKey/add-key";

const { Option } = Select;

/*定义路由接口*/ 
interface IFrom{
    history:{
        push:(vlaue:string)=>void
    }
}

const ProductHome:React.FC<IFrom> = ({history})=>{
    /*初始化添加按钮*/ 
    const initAddProduct = ():JSX.Element=>{
        return (
            <Button type="primary" icon="plus" onClick={()=>{
                history.push("/products/product/add")
            }}>
                添加
            </Button>
        )
    }
    const [initBtnDom] = useState<JSX.Element>(initAddProduct())

    /*搜索框*/ 
    /*下拉框选择*/ 
    const handleSelect = (value:string)=>{
        setSearchType(value);
    }
    const [searchType, setSearchType] = useState<string>("productName");
    const [keyWords, setKeyWords] = useState<string>("");

    const title = (
        <Form layout="inline">
        <Form.Item>
            <Select
                value={searchType}
                style={{ width: '35%', marginRight: '3%' }}
                onChange={(value:string) =>{handleSelect(value)}}
            >
                <Option value='productName'>按名称搜索</Option>
                <Option value='productDesc'>按描述搜索</Option>
            </Select>
            <Input
                type="text"
                placeholder="关键字"
                value={keyWords}
                onChange={(event:IEvent)=>setKeyWords(event.target.value)}
                style={{ width: '60%', marginRight: '3%' }}
            />
            <Button 
            type="primary" 
            htmlType="submit"
            onClick={()=>{getProductInfo(1)}}
            >搜索</Button>
        </Form.Item>
      </Form>
    )
    /*对商品进行上架下架*/ 
    const [pageNum,setPageNum] = useState<number>(1);

    console.log("pageNUmnow----------->",pageNum);
    
    const updateStatus =  (product:any)=>{
        console.log("prdocut===>",product);
        console.log(" pageNUM==>",pageNum);

        // let {_id,status} = product;
        // status === 1 ? status = 0 : status = 1;
        // const result = await reqUpdateStatus(_id,status);
        // if(result.data.status === 0){
        //     getProducts(pageNum);//请求当前页面的数据
        //     message.success(`商品${status === 1 ? '上' : "下"}架成功`);
        // }
    }
    // ======================================拿不到最新的状态值=======================================>
    /*初始化表格列的数组*/
    // 点击修改
    const changeInfo = (product:any)=>{
        console.log("----------------",pageNum);
    }
    const initColumns = ()=>{
        return [
            {
                title: '商品名称',
                dataIndex: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
            },
            {
                title: '价格',
                width:120,
                dataIndex: 'price',
                render:(price:number)=> "￥" + price
            },
            {
                title: '状态',
                width:100,
                render:(product:any)=> {
                    const {status} = product;
                    return(
                        <span>
                            <Button 
                                type="primary" 
                                onClick={()=>{updateStatus(product)}}>
                                {status ===  1? "下架" : "上架"}
                            </Button>
                            <span>{status===1 ? "在售" : "已下架"}</span>
                        </span>
                    )
                }
            },
            {
                title: '操作',
                width:100,
                render:(product:any)=> {
                    return(
                        <span>
                            <SlotButton /*onClick={()=>history.push("/products/product/detail",product)}*/ >详情</SlotButton>
                            <SlotButton onClick={()=>{changeInfo(product)}}>修改</SlotButton>
                        </span>
                    )
                }
            },
        ];
    }
    const [columns] = useState<any[]>(initColumns());
    //==========================================拿不到最新的状态值=====================================>


    /*数据处理函数*/ 
    const handleData = (data:IData[]):void=>{
        const result = addKey(data);
        setData(result);
    }
    /*请求商品数据以及收集页码*/
    const [loading,setLoading] = useState<boolean>(false);//商品信息的加载动画
    const [data,setData] = useState<IData[]>([]);
    const [total,setTotal] = useState<number>(0);
    /*请求商品数据*/ 
    const getProducts = async (pageNum:number)=>{
        console.log("pageNum1111111==>",pageNum);
        let result:IResult;
        if(keyWords !== ""){ //有关键词 说明是搜索
            result = await reqSearchProducts(pageNum,PAGE_SIZE,keyWords,searchType);
        }else{  //没有关键词 说明是直接请求
            result = await reqProducts(pageNum,PAGE_SIZE);
        }
        setLoading(true);
        const {data,status} = result.data;
        if(status === 0){
            handleData(data.list);
            setTotal(data.total)
        }else{
            message.error("数据请求出错");
        }
        setLoading(false);
    }
    /*当页码发生改变的时候*/ 
    const getProductInfo = (nowPage:number):void=>{
        console.log("nowpage-<",nowPage);
        getProducts(nowPage);
        setPageNum(nowPage); //将页码设置为当前的页码
        console.log("执行了嘛");

    }
    useEffect(() => {
        getProducts(1);
    }, [])
    return (
        <Card title={title} extra={initBtnDom}>
            <Table
                rowKey="_id"
                columns={columns} //表格选项
                dataSource={data} //表格数据
                bordered
                loading={loading} //加载效果
                pagination={{
                    current:pageNum, //默认显示页码
                    defaultPageSize:PAGE_SIZE, //每页显示条数
                    total:total, //数据总量
                    showQuickJumper:true, 
                    onChange:getProductInfo //监听事件
                }}
            />
        </Card>
    )
}
export default Form.create()(ProductHome)