import store from 'store';

/*定义浏览器中存储的key*/
const USER_KEY = "user_key";

/*定义返回的数据接口*/
export interface ILocalInfo{
    _id:string,
    username:string,
    password:string,
    create_time:number,
    __v:number,
    role:object
}

export default {
    /*保存数据到localStorage中*/ 
    saveLocalInfo:(data:any):void=>{
        store.set(USER_KEY,data);
    },
    /*得到浏览器中存储的数据*/ 
    getLocalData:():ILocalInfo=>{
        return store.get(USER_KEY);
    },
    /*删除浏览器中存储的数据*/ 
    removeLocalData:():void=>{
        store.remove(USER_KEY)
    }
}