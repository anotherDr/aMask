'use strict';
const version = '0.2.4';
const defaultOptions = {
	pattern: '99.99.9999',
	placeholder: '_',
	selector: '.amask'
};

export default class AMask {
	
	constructor( opt = defaultOptions ) {
		this.selector = opt.selector || defaultOptions.selector;
		this.elems = opt.elem || document.querySelectorAll(this.selector);
		this.pattern = opt.pattern || defaultOptions.pattern;
		this.placeholder = opt.placeholder || defaultOptions.placeholder;
	}
	
	/* METHODS ----------------------------------------------------- */
	
	static version() {
		return `version ${version}`;
	}
	
	/** calculates what to show in input
	 * @param {string} value
	 * @returns {string}
	 */
	aMaskCore(value)  {
		let bufferArr = [],
			/** @type {number} */
			bufferLen = bufferArr.length,
			/** @type {string} */
			pattern =  this.pattern,
			/** @type {string} */
			placeholder = '_',
			patternArr = pattern.split(''),
			patternLen = patternArr.length,
			valueArr = value.replace(/[^0-9.]+/g, ''),
			char = '',
			/** @type {(number|string)} */
			pat,    // part of patternArr
			inference;
		
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
		inference = bufferArr.slice(0,10).join('');
		
		return inference;
	}
	
	/** calculate cursor position
	 * @param {number} position
	 * @returns {number}
	 */
	calcCursorPosition(position){
		let specPositions = Array.from(this.pattern, (item, idx)=>{
			if (/[\s.\/()-]/.test(item) ) {
				return idx;
			}
		}).filter((el)=> !!el);
		
		if ( specPositions.includes(position) ) {
			position++;
		}
		return position;
	}
	
	/** handler of keyup event : receives and emits value
	 * @param {Object} e
	 * @returns {Object}
	 * */
	maskInput(e){
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
			/** @type {number} */
			position = elem.selectionEnd,
			output,
			cursorPosition;
			
		let promise1 = new Promise((resolve, reject)=>{
			resolve( this.aMaskCore(value) );
		});
		let promise2 = new Promise((resolve, reject)=>{
			resolve( this.calcCursorPosition(position) );
		});
		
		Promise.all([promise1,promise2]).then((result) => {
			output = result[0];
			cursorPosition = result[1];
			/** @type {string} */
			elem.value = output;
			elem.focus();
			elem.setSelectionRange(cursorPosition, cursorPosition);
			console.log(output, cursorPosition);
			return {output, cursorPosition};
		});
		
		
	}
	
	init(){
		let inputElems = this.elems;
		inputElems.forEach((elem)=> {
			elem.setAttribute('placeholder', this.aMaskCore(this.placeholder));
			elem.addEventListener('keyup', (e) => this.maskInput(e) );
		});
	}
}



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
	let testMasc = new AMask();
	
	testVal.forEach((it, idx)=>{
		let res = testMasc.aMaskCore(it.val);
		console.log( idx, it.res === res, it.val , it.res, res );
	});
}

if (window.location.hash === '#test') {
	test();
}
