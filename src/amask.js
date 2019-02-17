// @ts-check
'use strict';
const version = '0.6.1';
const defaultOptions = {
	pattern: '99.99.9999',
	placeholder: '_',
	selector: '.amask'
};

export default class AMask {    // A Mask
	
	constructor(opt = defaultOptions) {
		/** @type {string} */
		this.selector = opt.selector || defaultOptions.selector;
		/** @type {NodeList} */
		this.elems = opt.elem || document.querySelectorAll(this.selector);
		/** @type {string} */
		this.pattern = opt.pattern || defaultOptions.pattern;
		/** @type {string} */
		this.placeholder = opt.placeholder || defaultOptions.placeholder;
		/** @type {string[]} */
		this.patternArr = this.pattern.split('');
		/** @type {number} */
		this.patternLen = this.patternArr.length;
		
		this.firstTime = true;
		this.bufferArr = [];
		this.bufferArrLen = 0;
		this.cursorPosition = 0;
		this.isKeyDown = true;
	}
	
	/* -----------------------------------------------------
	 *  METHODS
	 *  ----------------------------------------------------- */
	
	/**
	 * method returns version
	 * @returns {string}
	 */
	static version() {
		return `version ${version}`;
	}
	prepareBuffer(){
		if (this.firstTime) {
			this.bufferArr = Array.from(this.pattern.replace(/\d/g, this.placeholder).split(''));
			this.bufferArrLen = this.bufferArr.length;
			this.firstTime = false;
			return this.bufferArr;
		}
	}
	onKeyDownHandler(e){
		
		let th = this,
			startPosition = e.target.selectionStart,
			position = e.target.selectionEnd,
			isRange = e.target.selectionStart !== e.target.selectionEnd,
			key =  e.key;
		
		this.isKeyDown = false;
		
		if (e.key === 'Backspace') {
			for (let i = startPosition; i <= position; i++) {
				if (/\d/.test( th.patternArr[i] ) ) {
					th.bufferArr[i] = this.placeholder;
				}
			}
			th.cursorPosition = startPosition;
		}
		else if (e.key === 'ArrowLeft') {
			th.cursorPosition = position;
			return false;
		}
		else if (e.key === 'ArrowRight') {
			th.cursorPosition = position;
			return false;
		}
		else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
			th.cursorPosition = position;
			return false;
		}
		else {
			e.preventDefault();
			this.isKeyDown = true;
			function insertion(key, position){
				if (/\d/.test( th.patternArr[position] ) ) {
					if (/[0-9]/.test(key)) {
						th.bufferArr[position] = key;
						th.cursorPosition = position + 1;
					}
				}
				else if ( /[\s.\/()+\-]/.test( th.patternArr[position] ) ) {
					th.cursorPosition = position + 1;
					insertion(key, th.cursorPosition);
				}
				else {
					th.cursorPosition = position;
				}
			}
			insertion(key, position);
		}
		
		let output = this.bufferArr.join('');
		console.log(output);
		this.onKeyUpHandler(e.target);
	}
	
	onKeyUpHandler(elem){
		if (!this.isKeyDown) return;
		
		let output = this.bufferArr.join('');
		let cursor = this.cursorPosition;
		
		console.log('output: ', output);
		
		elem.value = output;
		elem.focus();
		elem.setSelectionRange(cursor, cursor);
		
		return {output, cursor};
	}
	
	/**
	 * method calculates OUTPUT VALUE which will show in the input field
	 * @param {string} value
	 * @returns {string}
	 */
	calcOutputValue(value, key, position) {
		let
			/** @type {string} */
			placeholder = '_',
			/** @type {string} */
			valueArr = value.replace(/[^0-9]+/g, ''),  // remove which aren't like those
			/** @type {string} */
			char = '',                                  // slice from value
			/** @type {(number|string)} */
			pat,                                        // slice from pattern
			/** @type {string} */
			inference;                                  // result
		
		this.prepareBuffer();
		/*if (this.firstTime) {
			this.bufferArr = Array.from(this.pattern.replace(/\d/g, this.placeholder).split(''));
			this.bufferArrLen = this.bufferArr.length;
			this.firstTime = false;
		}*/
		
		
		for (let i = 0; i < this.patternLen; i++) {
			char = valueArr[i];                 // one char from value
			this.bufferArrLen = this.bufferArr.length;       // length of buffer
			pat = this.patternArr[this.bufferArrLen];   // pattern piece according to last buffer char
			
			if (/\d/.test(pat)) {
				if (/\d/.test(char)) {
					this.bufferArr.push(char);
				} else if (!char) {
					this.bufferArr.push(placeholder);
				} else {
					/* do nothing */
				}
			} else if (/[\s.\/()+\-]/.test(pat)) {
				this.bufferArr.push(pat);
				i--;
			}
		}
		inference = this.bufferArr.slice(0, this.patternLen).join('');
		
		return inference;
	}
	
	/**
	 * method calculates CURSOR POSITION
	 * @param {number} position
	 * @param {string} value
	 * @returns {number}
	 */
	calcCursorPosition(position, value) {
		/** @type {string} */
		let char = (value.length > 1) ? value.split('')[position - 1] : value;
		
		if (/[\s.\/()+\-]/.test(this.patternArr[position - 1])) {
			position++;
			return this.calcCursorPosition(position, char);
		} else if (!/[0-9]/.test(char)) {
			position--;
		}
		return position;
	}
	
	delete(start, end) {
		let i = start-1;
		for (i; i < end; i++){
			this.bufferArr[i] = this.placeholder;
		}
	}
	
	/**
	 * method for keyup event : receives and emits {} : value and position
	 * @param {Object} e
	 * @returns {Object}
	 * */
	maskCore(e) {
		/** @type {AMask} */
		let th = this,
			/** @type {Object} */
			elem = e.currentTarget,
			/** @type {string} */
			key = /[0-9]/.test(e.key) ? e.key : '#',
			/** @type {string} */
			value = elem.value,
			/** @type {number} */
			positionStart = elem.selectionStart,
			/** @type {number} */
			positionEnd = elem.selectionEnd,
			/** @type {string} */
			output = value,
			/** @type {number} */
			cursorPosition;
			
		// console.log( 'start: ', positionEnd );
		
		if (e.key === 'Backspace') {
			e.preventDefault();
			this.delete(positionStart, positionEnd);
			output = this.bufferArr.join('');
			cursorPosition = positionStart;
			
		}
		else if (e.key === 'ArrowLeft') {
			cursorPosition = positionEnd;
		}
		else if (e.key === 'ArrowRight') {
			cursorPosition = positionEnd;
		}
		else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
			cursorPosition = positionEnd;
		}
		else {
			positionEnd = elem.selectionEnd + 1; // + 1
			output = th.calcOutputValue(value, key, elem.selectionEnd);
			cursorPosition = th.calcCursorPosition(positionEnd, value);
		}
		
		// console.log( '1: ', cursorPosition );
		
		return {output, cursorPosition};
		
	}
	
	/**
	 * method sets Attribute placeholder
	 */
	setPlaceholder() {
		// this.elem.setAttribute('placeholder', this.calcOutputValue(this.placeholder));
		// return this.calcOutputValue(this.placeholder);
		this.prepareBuffer();
		return this.bufferArr.join('');
	}
	
	/* -----------------------------------------------------
	 *  METHODS for vanilla js
	 *  ----------------------------------------------------- */
	
	/**
	 * output handler used by init
	 * @param {Object} e
	 */
	inputHandler(e) {
		/** @type {AMask} */
		let th = this,
			/** @type {Object} */
			elem,
			/** @type {Object} */
			inputParams;
		
		inputParams = th.maskCore(e);
		elem = e.target;
		elem.value = inputParams.output;
		elem.focus();
		elem.setSelectionRange(inputParams.cursorPosition, inputParams.cursorPosition);
	}
	
	/**
	 * method adds event 'keyup' for vanilla js uses inputHandler
	 */
	init() {
		/** @type {NodeList} */
		let inputElements = this.elems;
		// this.prepareBuffer();
		
		inputElements.forEach((elem) => {
			// elem.setAttribute('placeholder', this.calcOutputValue(this.placeholder));
			elem.setAttribute('placeholder', this.setPlaceholder());
			// elem.addEventListener('keydown', (e) => this.inputHandler(e, 1));
			elem.addEventListener('keydown', (e) => this.onKeyDownHandler(e));
			// elem.addEventListener('keyup', () => this.onKeyUpHandler(elem));
		});
	}
}

