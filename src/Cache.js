export class CacheItem {
	/**@type {number} */ updatedAt;
	/**@type {ReviewValue[]} */ reviews;
}

const MAX_CACHE_AGE = 48 * 60 * 60 * 1000;

export class Cache {
	/**
	 * 
	 * @returns {Promise<Record<string, CacheItem>>}
	 */
	static async #load() {
		return JSON.parse(localStorage.getItem('frh-cache') ?? '{}');
	}
	static async #save(data) {
		localStorage.setItem('frh-cache', JSON.stringify(data));
	}


	/**
	 * 
	 * @param {string} key 
	 * @returns {Promise<ReviewValue[] | undefined>}
	 */
	static async get(key) {
		const cache = await this.#load();
		const item = cache[key];
		if (!item) return undefined;
		if (Date.now() - item?.updatedAt > MAX_CACHE_AGE) {
			return undefined;
		}
		return item.reviews;
	}

	/**
	 * 
	 * @param {string} key 
	 * @param {ReviewValue[]} reviews 
	 */
	static async set(key, reviews) {
		const cache = await this.#load();
		cache[key] = {
			reviews,
			updatedAt: Date.now(),
		};
		await this.#save(cache);
	}
}