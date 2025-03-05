import React, { useEffect, useState } from 'react'
import axios from "axios";
import { Line } from 'react-chartjs-2';
import {defaults} from "chart.js/auto";
import AxiosInstance from '../confige/AxiosInstance';

defaults.responsive = true;
defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.color = "black";
// Chart.overrides.line.spanGaps = true;

const IncomeByDate = () => {
    const [datas,setData] = useState([]);
    useEffect(()=>{
        getChartData();
    },[]);
    const getChartData = async () =>{
        try {
            const response = await AxiosInstance.get('/orders/income-by-month');
            setData(response.data.data.income);
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
                label: 'Daily Income', // Add a label for the dataset
                data: orderData,
                fill: false,
                borderColor: 'rgb(0, 60, 255)',
                tension: 0.3, //  A bit of tension for smoother lines
                cubicInterpolationMode: 'monotone',
                borderWidth: 2
            }
        ],
        
    }

    const options = {
        responsive: true, // Make chart responsive
        plugins: {
            title: {
                display: true,
                text: 'Income By Date',
                fullSize:true,
                align: 'start', // Align title to the start
                color: 'black',
                font: { // Change title font properties here
                    size: 15, // Change title size here
                    family: 'Arial', // Example font family
                    weight: 'bold' // Example font weight
                }
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: { // Add a title to the y-axis
                    display: true,
                    text: 'Income'
                }
            },
            x: { // Add a title to the x-axis
                title: {
                    display: true,
                    text: 'Date'
                },
                grid: { // Add grid configuration here
                    color: 'rgba(0, 0, 0, 0.1)', // Example grid line color (light gray)
                    borderColor: 'rgba(0, 0, 0, 0.1)', // Example grid border color
                    borderDash: [2, 2] // Dashed line style
                }
            },
        }
    };


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