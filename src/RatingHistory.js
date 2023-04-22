import { Review } from "./Review.js";
import { $, $$, getHtml, log } from "./basics.js";

export class RatingHistory {
	constructor() {
		this.dom = {
			chartContainer: null,
			canvas: null
		}

		this.init();
	}




	async init() {
		if ($('.tabs-tab[href*="br-reviews"]')) {
			await this.addDom();
			const url = location.pathname.replace(/(^\/threads\/[^/]+)(\/.*)?$/, '$1/br-reviews');
			const reviews = await this.loadReviews(url);
			log('reviews:', reviews);
			await this.addChart(reviews);
		}
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
						lineTension: 0,
						fill: 'start',
						pointRadius: 0
					}
				]
			},
			options: {
				scales: {
					x: {
						offset: false,
						type: 'time',
						time: {
							unit: 'month'
						}
					},
					y: {
						min: 0,
						max: 5
					}
				}
			}
		});
	}
}