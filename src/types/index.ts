/*放置公用的接口*/ 

/*菜单列表配置文件的接口定义*/ 
export interface IInfo{
    title:string,
    key:string,
    icon:string,
    isPublic?:boolean,
    children?:any
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
