// ==UserScript==
// @name         F95zone - Rating History
// @namespace    https://github.com/LenAnderson/
// @downloadURL  https://github.com/LenAnderson/F95zone-Rating-History/raw/master/F95zone-Rating-History.user.js
// @version      ce9c1c2c-2614-4ec4-a466-6717dfa4e34f
// @author       LenAnderson
// @match        https://f95zone.to/threads/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/chart.js@2.9.4/dist/Chart.bundle.min.js
// ==/UserScript==



(()=>{
	'use strict';

// ---------------- IMPORTS  ----------------



// src\Review.js
class Review {
	/**@type {HTMLElement}*/ root;
	/**@type {Number}*/ rating;
	/**@type {Date}*/ date;




	constructor(root) {
		this.root = root;

		this.rating = $$(root, '.contentRow-extra > .ratingStars > .ratingStars-star--full').length;
		this.date = new Date($(root, '.message-footer > .message-actionBar > .actionBar-set > .contentRow-muted > .u-dt').getAttribute('data-time') * 1000);
	}
}


// src\RatingHistory.js



class RatingHistory {
	constructor() {
		this.dom = {
			chartContainer: null,
			canvas: null
		}

		this.init();
	}




	async init() {
		await this.addDom();
		const url = location.pathname.replace(/(^\/threads\/[^/]+)(\/.*)?$/, '$1/br-reviews');
		const reviews = await this.loadReviews(url);
		log('reviews:', reviews);
		await this.addChart(reviews);
	}


	async addDom() {
		log('RatingHistory.addDom');
		const pageContent = $('.p-body-pageContent');
		const chartContainer = document.createElement('div'); {
			this.dom.chartContainer = chartContainer;
			chartContainer.classList.add('frh-chartContainer');
			const canvas = document.createElement('canvas'); {
				this.dom.canvas = canvas;
				canvas.height = 200;
				canvas.width = pageContent.getBoundingClientRect().width;
				chartContainer.appendChild(canvas);
			}
		}
		pageContent.parentElement.insertBefore(chartContainer, pageContent);
	}


	async loadReviews(url) {
		log('RatingHistory.loadReviews', url);
		const html = await getHtml(url);
		const reviews = $$(html, '.p-body-pageContent > .block > .block-container > .block-body > .block-row > .message--review > .contentRow').map(it=>new Review(it));
		log(reviews);

		const next = $(html, '.pageNav-jump--next');
		if (next) {
			reviews.push(...(await this.loadReviews(next.href)));
		}
		reviews.sort((a,b)=>a.date-b.date);
		return reviews;
	}


	async addChart(reviews) {
		log('RatingHistory.addChart', reviews, reviews.map(review=>({
			x: review.date,
			y: review.rating
		})));
		//'rgb(186 69 69)'
		const con = this.dom.canvas.getContext('2d');
		let sum = 0;
		const chart = new Chart(con, {
			type: 'bar',
			data: {
				datasets: [
					{
						label: 'Rating',
						data: reviews.map(review=>({
							x: review.date,
							y: review.rating
						})),
						borderColor: 'rgb(186, 69, 69)',
						backgroundColor: 'rgb(186, 69, 69)',
						barThickness: 1
					},
					{
						label: 'Average Rating',
						data: reviews.map((review,idx)=>({
							x: review.date,
							y: (sum+=review.rating, sum/(idx+1))
						})),
						borderColor: 'transparent',
						backgroundColor: 'rgb(36, 38, 41)',
						type: 'line',
						lineTension: 0
					}
				]
			},
			options: {
				scales: {
					xAxes: [{
						type: 'time',
						time: {
							unit: 'month'
						}
					}]
				}
			}
		});
	}
}


// src\basics.js
const log = (...msgs)=>console.log.call(console.log, '[FRH]', ...msgs);


const $ = (query,root)=>(root?query:document).querySelector(root?root:query);
const $$ = (query,root)=>Array.from((root?query:document).querySelectorAll(root?root:query));


const get = (url) => {
	return new Promise((resolve,reject)=>{
		const xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.addEventListener('load', ()=>{
			resolve(xhr.responseText);
		});
		xhr.addEventListener('error', ()=>{
			reject(xhr);
		});
		xhr.send();
	});
};
const getHtml = (url) => {
	return get(url).then(txt=>{
		const html = document.createElement('div');
		html.innerHTML = txt;
		return html;
	});
};
const getJson = (url) => {
	return get(url).then(JSON.parse);
}


const wait = async(millis)=>new Promise(resolve=>setTimeout(resolve, millis));
// ---------------- /IMPORTS ----------------





	const app = new RatingHistory();
})();