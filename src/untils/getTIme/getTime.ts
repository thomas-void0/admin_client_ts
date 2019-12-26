export default (time:number):string=>{
    let date:Date = new Date(time);
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" +date.getDate() + "  " +
    date.getHours() + ":" + date.getMinutes() + ":" +date.getSeconds()
}