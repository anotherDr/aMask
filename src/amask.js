'use strict';
const version = '0.2.8';
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
	}
	
	/* METHODS ----------------------------------------------------- */
	
	static version() {
		return `version ${version}`;
	}
	
	/** calculates what to show in input
	 * @param {string} value
	 * @returns {string}
	 */
	aMaskCore(value, position)  {
		let bufferArr = [],
			/** @type {number} */
			bufferLen = bufferArr.length,
			/** @type {string} */
			pattern =  this.pattern,
			/** @type {string} */
			placeholder = '_',
			patternArr = pattern.split(''),
			patternLen = patternArr.length,
			valueArr = value.replace(/[^0-9.]+/g, ''), // is not like those
			char = '',
			/** @type {(number|string)} */
			pat,        // part of patternArr
			inference;  // result
		
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
			else if (/[\s.\/()+\-]/.test(pat) ) {
				bufferArr.push(pat);
				i--;
			}
		}
		inference = bufferArr.slice(0, patternLen).join('');
		
		return inference;
	}
	
	
	/** calculate cursor position
	 * @param {number} position
	 * @returns {number}
	 */
	calcCursorPosition(position, value = ''){
		let patternArr = this.pattern.split(''),
			char = value.split('')[position-1];
		
		if ( /[\s.\/()+\-]/.test(patternArr[position-1]) ) {
			position++;
			return this.calcCursorPosition(position);
		}
		else if ( !/[0-9\s.\/()+\-]/.test(char) ) {
			position--;
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
			return new Promise((resolve, reject) => {
				reject(new Error('Arrow Keys'));
			});
		}
		
		let elem = e.currentTarget,
			/** @type {string} */
			value = elem.value,
			/** @type {number} */
			position = elem.selectionEnd,
			output,
			cursorPosition;
			
		let th = this;
		
		let promise1 = new Promise((resolve, reject)=>{
			resolve( th.aMaskCore(value) );
			reject( new Error('something wrong') );
		});
		
		let promise2 = new Promise((resolve, reject)=>{
			resolve( th.calcCursorPosition(position, value) );
			reject( new Error('something wrong') );
		});
			
		return Promise.all([promise1,promise2])
			.then((result) => {
				output = result[0];
				cursorPosition = result[1];
				return {output, cursorPosition};
			});
		
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
		
		th.maskInput(e).then( (result) => {
			inputParams = result;
			elem = e.target;
			elem.value = inputParams.output;
			elem.focus();
			elem.setSelectionRange(inputParams.cursorPosition, inputParams.cursorPosition);
		}).catch( (error) => {
			console.error(error.message)
		});
	}
	
	setPlaceholder(){
		this.elem.setAttribute('placeholder', this.aMaskCore(this.placeholder));
	}
	
	/**
	 * handler for vue function
	 * @param e
	 */
	vueFn(e) {
		th.maskInput(e).then( (result) => {
			let output = result[0],
				cursorPosition = result[1];
			return {output, cursorPosition};
		})
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
