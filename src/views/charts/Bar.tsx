import React, { useState } from 'react'
import ReactEcharts from "echarts-for-react";
import {Card,Button} from 'antd'

const Bar:React.FC = ()=>{
    const [sales, setsales] = useState<number[]>([5,20,11,22,54,23]);
    const [stores, setstores] = useState<number[]>([6,10,25,20,64,13])

    const update = ():void => {
        const newSales = [...sales].filter((item:number)=>item + 1);
        const newStores = [...stores].reduce((pre:number[],item:number)=>{pre.push(item+1);return pre},[])
        setsales(newSales);
        setstores(newStores);

    }
        const title:JSX.Element = (<Button type="primary" onClick={update}>更新</Button>)
        const option = {
            title:{
                text:"销售情况"
            },
            legend: {
                data:['销量', '库存']
            },
            tooltip: {},
            xAxis: {
                data: ["电动车","五菱宏光","川崎","长安","科鲁兹","科迈罗"]
            },
            yAxis: {},
            series: [
                {
                    name:"销量",
                    type: 'bar',
                    data:sales
                },
                {
                    name:"库存",
                    type: 'bar',
                    data:stores
                },
            ]
        };
        return (
            <Card title={title}>
                <ReactEcharts
                    option={option}
                    notMerge={true}
                />
            </Card>
        )
    }
export default Bar;