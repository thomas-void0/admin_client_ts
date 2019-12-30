/*定义表单传入的props值*/
export interface IProps{
    form:any
}

/*定义表单收集到值*/
export interface IForm{
    categoryName:string,
    gender?:string
}

/*定义更新返回的数据*/ 
export interface IUpdate{
    data:{
        status: number,
        msg?: string   
    }
}

/*定义添加分类返回的数据*/ 
export interface IAdd{
    data:{
        status:number,
        data:{
            parentId:string,
            _id:string,
            name:string,
            __v:number,
            msg?:string 
        }        
    }
}

/*分类消息*/ 
export interface ICategory{
    key:number,
    parentId:string,
    _id:string,
    name:string,
    __v:number,
}


/*下拉框接口*/ 
export interface ISelect {
    // handleSelectChange:(value:string)=>void,
    categorys:ICategory[],
}