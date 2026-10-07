import React, { Component } from 'react'
import {  Bar, Line, Pie } from 'react-chartjs-2';
import styled from "styled-components"
import StoreIcon from '@mui/icons-material/Store'
import ShoppingBasketIcon  from '@mui/icons-material/ShoppingBasket'
import PaidIcon from '@mui/icons-material/Paid';
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
  SubTitle
} from 'chart.js';


  

export default class Chart extends Component {
    constructor(props) {
        super(props)
        this.state = {
          data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                label: 'Orders',
                data: [12, 19, 3, 5, 2, 3],
                fill: false,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
    }
  
    ChartJS.register(
      ArcElement,
      LineElement,
      BarElement,
      PointElement,
      BarController,
      BubbleController,
      DoughnutController,
      LineController,
      PieController,
      PolarAreaController,
      RadarController,
      ScatterController,
      CategoryScale,
      LinearScale,
      LogarithmicScale,
      RadialLinearScale,
      TimeScale,
      TimeSeriesScale,
      Decimation,
      Filler,
      Legend,
      Title,
      Tooltip,
      SubTitle
    );
    
  }
    render() {
        return (
          <Wrapper>
            <Wrapp>
              <div className='sells'>
                <PaidIcon className="sellsIcon" />
                <h3>Total Sells</h3>
              </div>
              <div className="Orders">
                <StoreIcon className="storeIcon" />
                <h3> Orders</h3>
              </div>
              <div className="Shopping">
                <ShoppingBasketIcon className="ShoppingIcon" />
                <h3>Total Products</h3>
              </div>
            </Wrapp>
            <ChartWrapper>
              <div className='Bar' >
                <Bar data={this.state.data} />
              </div>
              <div className='Pie'>
                <Pie data={this.state.data} />
              </div>
            </ChartWrapper>
            
          </Wrapper>
        )
    }
}
const Wrapper = styled.div`

  `
const ChartWrapper = styled.div`
   display:flex;
   border-radius:8px;
   align-items:center;
   .Pie{
     margin-left:30px;
     background:#ffff;
     border-radius:8px;
     width:20vw;
   }
   .Bar{
      background:#ffff;
      width:55vw;
      padding:0px 10px;
      border-radius:8px;
   }
`
const Wrapp =  styled.div`
    display:flex;
    justify-content:space-between;
    margin-bottom:10px;

    
   
   
   
    
    
    div{
       background-color:rgb(250, 250, 250);
       padding:0px 10px;
       border-radius:8px;
       display:flex;
       align-items:center;
       box-shadow:8px 4px 15px  rgb(0,0,0,0.5);
    }
    .Orders, .Shopping, .sells{
        width:20vw;
        font-size:0.8rem;
    }
    .sells{
      margin-right:0;
    }
    .Orders{
      margin-right:0px;
    }
    
    .storeIcon, .ShoppingIcon, .sellsIcon{
       color:#ffff;
       margin:2px  2px  4px;
       font-size:1.6rem;
       border-radius:50%;
       padding:5px;
       background-color:rgb(20, 150, 10, 0.5)
    }

`