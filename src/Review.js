import { $, $$ } from "./basics.js";

export class Review {
	/**@type {HTMLElement}*/ root;
	/**@type {Number}*/ rating;
	/**@type {Date}*/ date;


	/**
	 * 
	 * @param {ReviewValue} value 
	 * @returns {Review}
	 */
	static fromValue(value) {
		const review = new Review();
		review.date = new Date(value.date);
		review.rating = value.rating;
		return review;
	}




	constructor(root) {
		if (root) {
			this.root = root;
	
			this.rating = $$(root, '.contentRow-extra > .ratingStars > .ratingStars-star--full').length;
			this.date = new Date($(root, '.message-footer > .message-actionBar > .actionBar-set > .contentRow-muted > .u-dt').getAttribute('data-time') * 1000);
		}
	}

	/**
	 * 
	 * @returns {ReviewValue}
	 */
	toValue() {
		return {
			date: this.date.getTime(),
			rating: this.rating
		};
	}
}

export class ReviewValue {
	/**@type {Number}*/ rating;
	/**@type {Date}*/ date;
}