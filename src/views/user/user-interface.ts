// 约束用户列表
export interface IUserInfo {
    create_time:number,
    email:string,
    password:string,
    phone:string,
    role_id:string,
    username:string,
    _id:string
}

//约束角色列表
export interface IRoles{
    auth_name:string,
    auth_time:number,
    create_time:number,
    menus:string[],
    name:string,
    _id:string
}

//对请求到的数据格式进行约束
export interface IData{
    status:number,
    data:{
        users:IUserInfo[],
        roles:IRoles[]
    },
    msg?:string
}