import React, { useEffect, useState } from 'react'
import axios from "axios";
import { Line } from 'react-chartjs-2';
import {defaults} from "chart.js/auto";

defaults.responsive = true;
defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.color = "black";

const IncomeByDate = () => {
    const [datas,setData] = useState([]);
    useEffect(()=>{
        getChartData();
    },[]);
    const getChartData = async () =>{
        try {
            const response = await axios.get('http://localhost:3000/api/v1/orders/income-by-month');
            setData(response.data.data.income);
            console.log(datas);
        }catch (e) {
            console.log(e)
        }
    }

    const orderLabels = Object.keys(datas);
    const orderData = Object.values(datas);

    const data={
        labels:orderLabels,
        datasets:[
            {
                label:'Monthly Income Data',
                data:orderData,
                fill:false
            }
        ]
    }

    const options={
        scales:{
            y:{
                beginAtZero:true
            }
        }
    }

    return (
        <>
            <Line
                options={options}
                data={data}
            />
        </>
    )
}
export default IncomeByDate;