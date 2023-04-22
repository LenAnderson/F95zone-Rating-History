import { $, $$ } from "./basics.js";

export class Review {
	/**@type {HTMLElement}*/ root;
	/**@type {Number}*/ rating;
	/**@type {Date}*/ date;




	constructor(root) {
		this.root = root;

		this.rating = $$(root, '.contentRow-extra > .ratingStars > .ratingStars-star--full').length;
		this.date = new Date($(root, '.message-footer > .message-actionBar > .actionBar-set > .contentRow-muted > .u-dt').getAttribute('data-time') * 1000);
	}
}