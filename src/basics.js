export const log = (...msgs)=>console.log.call(console.log, '[FRH]', ...msgs);


export const $ = (query,root)=>(root?query:document).querySelector(root?root:query);
export const $$ = (query,root)=>Array.from((root?query:document).querySelectorAll(root?root:query));


export const get = (url) => {
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
export const getHtml = (url) => {
	return get(url).then(txt=>{
		const html = document.createElement('div');
		html.innerHTML = txt;
		return html;
	});
};
export const getJson = (url) => {
	return get(url).then(JSON.parse);
}


export const wait = async(millis)=>new Promise(resolve=>setTimeout(resolve, millis));