/*放置公用的接口*/ 

/*菜单列表配置文件的接口定义*/ 
export interface IInfo{
    title:string,
    key:string,
    icon:string,
    isPublic?:boolean,
    children?:any
}
/*商品添加*/
export interface IProduct{
    _id?:string,
    categoryId:string,
    pCategoryId:string,
    name:string,
    desc:string,
    price:string,
    detail:string,
    imgs:string[]
}

/*分类的每一项参数*/ 
export interface CategoryData{
    key:number,
    name:string,
    parentId:string,
    __v:number,
    _id:string
}

/*传入路由的接口*/ 
export interface IHistory{
    history:any,
}

/*传入的表单控件*/ 
export interface IFormProps{
    getFieldDecorator:(value1:string,value2:IFormPropsValue2)=>any,
    categoryName?:string
}

export interface IFormPropsValue2{
    initialValue?:string,
    rules:{ required: boolean; message: string; }[]
}