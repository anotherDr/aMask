'use strict';

const defaultOptions = {
	pattern: '99.99.9999',
	placeholder: '_',
};

export default class AMask {
	
	constructor( opt = defaultOptions ) {
		this.selector = opt.selector = '.amask';
		this.elem = opt.elem || document.querySelector(this.selector);
		this.pattern = opt.pattern || defaultOptions.pattern;
		this.placeholder = opt.placeholder || defaultOptions.placeholder;
	}
	
	/* METHODS ----------------------------------------------------- */
	
	static version() {
		return 'version 0.2.2';
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
		
		output = this.aMaskCore(value);
		cursorPosition = this.calcCursorPosition(position);
		
		
		/** @type {string} */
		elem.value = output;
		elem.focus();
		elem.setSelectionRange(cursorPosition, cursorPosition);
		
		return {output, cursorPosition};
	}
	
	init(){
		let elemInput = this.elem;
		elemInput.setAttribute('placeholder', this.aMaskCore(this.placeholder));
		// elemInput.focus();
		elemInput.addEventListener('keyup', (e) => this.maskInput(e) );
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
