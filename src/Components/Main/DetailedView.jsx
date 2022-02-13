import React from 'react';
import { useUserCredentials } from '../../Modules/Context/UserContext';
import {Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend} from 'chart.js';
import { Line } from 'react-chartjs-2';
import moment from 'moment';

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Tooltip,
	Title,
	Legend
  );

const sellCoinHandler = ({coinID}) => {
	console.log("sell coin handler pressed")
}

const currencyFormat = Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "INR"
})

function DetailedView({coin}){
	return <div className="detailed-view">
		{coin ? 
		<View coin={coin} />
		: ""}
	</div>
}

function View({coin}){
	let options, data;
	const [userCredentials, _] = useUserCredentials();
	let qty, avgBP;

	userCredentials.coinsOwned.forEach(c => {
		if(c.id === coin.id){
			qty = c.qty;
			avgBP = c.avgBP;
		}
	});
	
	const currentPrice = coin.market_data.current_price.inr;
	const investedValue = qty * avgBP;
	const currentValue = qty * currentPrice;
	const gain = Math.round(currentValue-(investedValue), 2);
	const gainPercent = Math.round((gain/(avgBP*qty))*100, 2);
	let pl;
	if(gain < 0){pl = 'loss'}
	else { pl = 'profit'; }
	console.log(qty, avgBP, currentPrice, gain, gainPercent);

	if(coin){
		options = {
			responsive: true,
			plugins: {
				legend: {
					position: 'top',
				},
				title: {
					display: true,
					text: coin.name,
				},
				label: {
					display: false,
				},
				tooltips:{
					axis: "xy"
				},
			},
		};
		const USDtoINR = userCredentials.USDtoINR;
		let d = new Date();
		let labels = [];
		for(let i=0 ; i<(24*7)-4 ; i++){
			d.setHours(d.getHours() - 2);
			labels.push(moment().subtract(i, 'h').format("Do MMM h a"));
		}
		labels = labels.reverse()
		console.log(labels)
		// let labels = coin.market_data.sparkline_7d.price;
		// labels = labels.map(label=>label*USDtoINR);
		// labels = labels.map(label=>Math.round(label, 2));

		let yData = coin.market_data.sparkline_7d.price;
		yData = yData.map(data=>data*USDtoINR)
		yData = yData.map(data=>Math.round(data, 2));

		data = {
			labels,
			datasets: [{
				label: coin.name,
				data: yData,
				borderColor: 'rgb(255, 99, 132)',
				backgroundColor: 'rgba(255, 99, 132, 0.5)',
			}],
		};
	}

	return(<>
			<button 
				className="sell-btn" 
				onClick={()=>{sellCoinHandler(coin.id)}}
			>
				SELL
			</button>
		<div className='chart'>
			<Line options={options} data={data} />
		</div> 
		<div className='info'>

			<div className='stats'>
				<div className='title'>
					<div className='name-exchg'>
						<span>
							<img 
								className='icon' 
								src={coin.image.large} 
								alt={`${coin.name} icon`} 
							/>
						</span>
						<div>
							<span className='name'>{coin.name}</span>
							<span className='exchange'>/INR</span>
						</div>
					</div>
					<div className='price'>
						{currencyFormat.format(currentPrice)}
					</div>
				</div>

				<div className='user-gain'>
					<div className='gain-data'>
						<div className='gain'>
							<span className='text'>Total Gain</span>
							<span className={pl}>{currencyFormat.format(gain)}</span>
						</div>
						<div className='gain-percent'>
							<span className='text'>Gain Percentage</span>
							<span className={pl}>{gainPercent}%</span>
						</div>
					</div>
					<div className='gain-data'>
						<div className='gain'>
							<span className='text'>Invested Amount</span>
							<span className={pl}>{currencyFormat.format(investedValue)}</span>
						</div>
						<div className='gain-percent'>
							<span className='text'>Current Value</span>
							<span className={pl}>{currencyFormat.format(currentValue)}</span>
						</div>
					</div>
				</div>

				<div className='extra-info'>

				</div>
			</div>
		</div>
	</>
	) 
}

export default DetailedView