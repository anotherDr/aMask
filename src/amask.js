'use strict';
const version = '0.2.10';
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
		/** @type number[] */
		this.specPositions;
		this.patternArr = this.pattern.split('');
		this.patternLen = this.patternArr.length;
	}
	
	/** -----------------------------------------------------
	 *  METHODS
	 *  ----------------------------------------------------- */
	
	/**
	 * returns version
	 * @returns {string}
	 */
	 static version() {
		return `version ${version}`;
	}
	
	/**
	 * calculates OUTPUT VALUE which will show in the input field
	 * @param {string} value
	 * @returns {string}
	 */
	aMaskCore(value, position)  {
		let bufferArr = [],
			/** @type {number} */
			bufferLen = bufferArr.length,               // length of new (output) array
			/** @type {string} */
			placeholder = '_',
			valueArr = value.replace(/[^0-9.]+/g, ''),  // remove which aren't like those
			char = '',                                  // slice from value
			/** @type {(number|string)} */
			pat,                                        // slice from pattern
			inference;                                  // result
		
		for (let i = 0; i < this.patternLen; i++) {
			char = valueArr[i];
			bufferLen = bufferArr.length;
			pat = this.patternArr[bufferLen];
			
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
			else if (/[\s.\/()+\-]/.test(pat) ) {
				bufferArr.push(pat);
				i--;
			}
		}
		inference = bufferArr.slice(0, this.patternLen).join('');
		
		return inference;
	}
	
	/**
	 * calculates CURSOR POSITION
	 * @param {number} position
	 * @returns {number}
	 */
	calcCursorPosition(position, value){
		let char = (value.length > 1) ? value.split('')[position-1] : value;
		
		if ( /[\s.\/()+\-]/.test(this.patternArr[position-1]) ) {
			position++;
			return this.calcCursorPosition(position, char);
		}
		else if ( !/[0-9]/.test(char) ) {
			position--;
		}
		return position;
	}
	
	/**
	 * handler of keyup event : receives and emits value
	 * @param {Object} e
	 * @returns {Object}
	 * */
	maskInput(e){
		
		let th = this,
			elem = e.currentTarget,
			/** @type {string} */
			value = elem.value,
			/** @type {number} */
			position = elem.selectionEnd,
			output,
			cursorPosition;
			
		if (e.key === 'Backspace'  ||
			e.key === 'ArrowLeft'  ||
			e.key === 'ArrowUp'    ||
			e.key === 'ArrowRight' ||
			e.key === 'ArrowDown' ) {
			return {output: value, cursorPosition: position};
		}
		
		output = th.aMaskCore(value);;
		cursorPosition = th.calcCursorPosition(position, value);
		return {output, cursorPosition};
	}
	
	/**
	 * handler for vanilla js onKeyUp
	 * @param e
	 */
	inputHandler(e) {
		let th = this,
			/** @type {Object} */
			elem,
			inputParams;
			
		inputParams = th.maskInput(e);
		elem = e.target;
		elem.value = inputParams.output;
		elem.focus();
		elem.setSelectionRange(inputParams.cursorPosition, inputParams.cursorPosition);
		
	}
	
	setPlaceholder(){
		// this.elem.setAttribute('placeholder', this.aMaskCore(this.placeholder));
		return this.aMaskCore(this.placeholder);
	}
	
	/**
	 * add event for vanilla js 'keyup'
	 */
	init(){
		let inputElems = this.elems;
		inputElems.forEach((elem)=> {
			elem.setAttribute('placeholder', this.aMaskCore(this.placeholder));
			elem.addEventListener('keyup', (e) => this.inputHandler(e) );
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
