/*对传入的数据添加key值*/ 
export const addKey = (data:any[]):any[]=>{
    return data.filter((item:any,index:number)=>{
        item.key = index;
        return item;
    })
}