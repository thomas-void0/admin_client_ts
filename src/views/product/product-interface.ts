/*商品信息list接口*/ 
export interface IData{
    status:number,
    categoryId:string,
    desc:string,
    detail:string,
    imgs:string[],
    name:string,
    pCategoryId:string,
    price:number,
    _id:string
}
/*商品信息接口*/ 
export interface IResult {
    data:{
        data:{
            list:IData[],
            pageNum:number,
            pageSize:number,
            pages:number,
            total:number
        },
        status:number,
        msg?:string
    },
}
/*事件对象接口*/ 
export interface IEvent{
    target:{
        value:string,
    }
}

/*商品详情props接口*/ 
export interface IDetailProps{
    history:{
        goBack:()=>void,
        location:{
            state:IData
        }
    }
}
/*商品初始化列表数据*/
export interface IDetailData{
    key:string,
    value:any
}

/*定义添加分类返回的数据*/ 
export interface IAdd{
    data:{
        status:number,
        data:IAddData[],
        msg?:string 
    }
}

export interface IAddData{
    parentId:string,
    _id:string,
    name:string,
    __v:number,
}

/*添加商品表单收集到的值*/ 
export interface IAddValues{
    categoryIds:string[],
    desc:string,
    name:string,
    price:string
}
// 级联选择器
export interface IOption{
    value: string,
    label: string,
    isLeaf: boolean,
    key:number,
    children?:IOption[]
}

/*定义添加分类返回的数据*/ 
export interface ICategorys{
    data:{
        status:number,
        data:IAddData[],
        msg?:string        
    }
}
