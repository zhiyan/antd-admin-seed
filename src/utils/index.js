export function isPromise(value) {
  if (value !== null && typeof value === 'object') {
    return value.promise && typeof value.promise.then === 'function';
  }
}

export function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length === 2) return parts.pop().split(";").shift();
}

export function removeCookie(name){
	var oDate=new Date()
	oDate.setDate(oDate.getDate()-10000)
	document.cookie=name+'=;path=/;expires='+oDate
}
export function exportData(url, obj){
	let params = ''
	if(typeof obj === 'object'){
		for(let i in obj){
			params += `&${i}=${obj[i] === undefined ? '' : obj[i]}`
		}
	}else{
		params += `&${obj}`
	}
	params = `/api/${url}?${params.substring(1)}`
	window.open(params)
}
