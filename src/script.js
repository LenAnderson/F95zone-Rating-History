// ==UserScript==
// @name         F95zone - Rating History
// @namespace    https://github.com/LenAnderson/
// @downloadURL  https://github.com/LenAnderson/F95zone-Rating-History/raw/master/F95zone-Rating-History.user.js
// @version      1.2.1
// @author       LenAnderson
// @match        https://f95zone.to/threads/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/chart.js@4.2.1/dist/chart.umd.js
// @require      https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns@3.0.0
// ==/UserScript==

import { RatingHistory } from "./RatingHistory.js";

(()=>{
	'use strict';

	// ${imports}




	const app = new RatingHistory();
})();