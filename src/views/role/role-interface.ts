//约束角色列表
export interface IRoles{
    auth_name:string,
    auth_time:number,
    create_time:number,
    menus:string[],
    name:string,
    _id:string
}

// 当前选中的角色
export interface IRole{
    menus:string[],
    _id:string,
    name:string,
    create_time:number
}