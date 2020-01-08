import React,{useState,useEffect} from 'react'
import {
    Card,
    List,
    Icon
} from 'antd'
import './product-detail.css';
import SlotButton from '../../../components/common/slot-button/SlotButton';
import {IDetailProps,IDetailData} from "../product-interface";
import {reqGetCategory} from "../../../network";

const {Item} = List;

const ProductDetail:React.FC<IDetailProps> = ({history})=>{
    let {
        pCategoryId,
        categoryId,
        name,
        desc,
        detail,
        imgs,
        price
    }=history.location.state;

    console.log("============>",pCategoryId,"===========>",categoryId);

    /*请求分类*/ 
    const [firstCategory, setFirstCategory] = useState<string>("");
    const [secondCategory, setSecondCategory] = useState<string>("");
    const getCategoryInfo = async ()=>{
        let result:any;
        if(pCategoryId === "0"){ //说明是一级分类的商品
            result = await reqGetCategory(categoryId);
            const {data} = result.data;
            setFirstCategory(data.name);
        }else{
            result = await Promise.all([reqGetCategory(pCategoryId),reqGetCategory(categoryId)]);
            setFirstCategory(result[0].data.data.name);
            setSecondCategory(result[1].data.data.name);
        }
    }

    useEffect(() => {
        getCategoryInfo()
    }, [])

    const title = (
        <SlotButton onClick={()=>{history.goBack()}}>
            <Icon type="arrow-left"/>
            <span>返回上一级</span>
        </SlotButton>
    )

    const dataArr:IDetailData[] = [
        {key:"商品名称:",value:name},
        {key:"商品描述:",value:desc},
        {key:"商品价格:",value:price},
        {
            key:"所属分类:",
            value:(secondCategory ?  `${firstCategory}--->${secondCategory}` : firstCategory)
        },
        {key:"商品图片:",value:imgs},
        {key:"商品详情:",value:detail},
    ]
    return (
        <Card title={title} className="product-detail">
            <List>
                {dataArr.map((item:IDetailData,index:number)=>{
                    if(item.value instanceof Array){
                        return (
                            <Item className="left" key={index}>
                                <span>商品图片:</span>
                                <span>
                                    {imgs.map((item:string,index:number)=>
                                        <img 
                                            key={index} 
                                            src={"http://localhost:5000/upload/"+item} 
                                            alt="img" 
                                            className="product-img"
                                        />
                                    )}
                                </span>
                            </Item>
                        )
                    }else if(item.key==="商品详情:"){
                        return(
                            <Item className="left" key={index}>
                                <span>商品详情:</span>
                                <span 
                                    style={{color:"#1890ff",marginTop:"15px"}} 
                                    dangerouslySetInnerHTML={{__html:item.value}} 
                                />
                            </Item>
                        )
                    }else{
                        return (
                            <Item className="left" key={index}>
                                <span>{item.key}</span>
                                <span>{item.value}</span>
                            </Item>  
                        )           
                    }
                })}
            </List>
        </Card>
    )
}
export default ProductDetail;