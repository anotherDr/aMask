'use strict';

/**
 * @param {string} value
 * @returns {string}
 */
function AMask(value){
	let bufferArr = [],
		/** @type {number} */
		bufferLen = bufferArr.length,
		/** @type {string} */
		pattern =  '99.99.9999',
		/** @type {string} */
		placeholder = '_',
		patternArr = pattern.split(''),
		patternLen = patternArr.length,
		valueArr = value.replace(/[^0-9.]+/g, ''),
		char = '',
		/** @type {(number|string)} */
		pat;
		
	for (let i = 0; i < patternLen; i++) {
		char = valueArr[i];
		bufferLen = bufferArr.length;
		pat = patternArr[bufferLen];
		
		if (/\d/.test(pat)) {
				if (/\d/.test(char)) {
					bufferArr.push(char);
				}
				else if ( !char ) {
					bufferArr.push(placeholder);
				}
				else {
					/* do nothing */
				}
			}
			else if (/[\s.\/()-]/.test(pat) ) {
				bufferArr.push(pat);
				i--;
			}
			
		}

	return bufferArr.slice(0,10).join('');
}

let elemInput = document.querySelector('.amask');
elemInput.setAttribute('placeholder', '__.__.____')
elemInput.focus();

elemInput.addEventListener('keyup', (e) => {
	e.preventDefault();

	
	if (e.key === 'Backspace' ||
		e.key === 'ArrowLeft' ||
		e.key === 'ArrowUp' ||
		e.key === 'ArrowRight' ||
		e.key === 'ArrowDown' ) {
		return;
	}
	
	let elem = e.currentTarget,
		/** @type {string} */
		value = elem.value,
		pos = elem.selectionEnd,
		output = AMask(value);
		// usefulLen = output.indexOf('_');
		
		console.log(pos);
	
		if (pos === 3) {
			pos = 4
		}
		else if (pos === 6) {
			pos = 7
		} else {}
	/** @type {string} */
	elem.value = output;
	elem.focus();
	elem.setSelectionRange(pos, pos);
});



/* TEST -------------------------------------- */
const testVal = [
	{val: '0', res: '0_.__.____'},
	{val: '00', res: '00.__.____'},
	{val: '1.02.', res: '10.2_.____'},
	{val: '1.02.1965', res: '10.21.965_'},
	{val: '01.02.196589', res: '01.02.1965'},
	{val: 'a', res: '__.__.____'},
	{val: 'asdasdasd', res: '__.__.____'},
	{val: '', res: '__.__.____'},
];

function test(){
	testVal.forEach((it, idx)=>{
		let res = AMask(it.val);
		console.log( idx, it.res === res, it.val , it.res, res );
	});
}

if (window.location.hash === '#test') {
	test();
}

