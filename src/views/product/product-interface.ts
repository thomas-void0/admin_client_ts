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
        status:number
    },
}
/*事件对象接口*/ 
export interface IEvent{
    target:{
        value:string
    }
}