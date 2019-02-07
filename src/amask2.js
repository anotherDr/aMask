// @ts-check
'use strict';
const version = '0.6.0';
const defaultOptions = {
	pattern: '99.99.9999',
	placeholder: '_',
	selector: '.amask'
};
console.log( { ...['a', 'b', 'c'] } );
console.log( Object.assign({}, ['a', 'b', 'c'] ) );

export default class AMask {    // A Mask
	
	constructor( opt = defaultOptions ) {
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
		
		/** @type {string[]} */
		// this.items = Object.assign({}, this.patternArr);
		this.items = { ...this.patternArr};
		this.position = 0;
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
	
	/*/!**
	 * method calculates OUTPUT VALUE which will show in the input field
	 * @param {string} value
	 * @returns {string}
	 *!/
	calcOutputValue(value)  {
		let bufferArr = [],
			/!** @type {number} *!/
			bufferLen = bufferArr.length,               // length of new (output) array
			/!** @type {string} *!/
			placeholder = '_',
			/!** @type {string} *!/
			valueArr = value.replace(/[^0-9.]+/g, ''),  // remove which aren't like those
			/!** @type {string} *!/
			char = '',                                  // slice from value
			/!** @type {(number|string)} *!/
			pat,                                        // slice from pattern
			/!** @type {string} *!/
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
					/!* do nothing *!/
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
	*/
	/*
	/!**
	 * method calculates CURSOR POSITION
	 * @param {number} position
	 * @param {string} value
	 * @returns {number}
	 *!/
	calcCursorPosition(position, value){
		/!** @type {string} *!/
		let char = (value.length > 1) ? value.split('')[position-1] : value;
		
		if ( /[\s.\/()+\-]/.test(this.patternArr[position-1]) ) {
			position++;
			return this.calcCursorPosition(position, char);
		}
		else if ( !/[0-9]/.test(char) ) {
			position--;
		}
		console.log('result: ', position);
		return position;
	}*/
	
	addItem(key, position) {
		if (/\d/.test(this.items[this.position])) {
			this.items[this.position] = key;
		} else {
			this.position++;
			this.addItem(key, this.position);
		}
		this.position++;
	}
	
	outputValue(){
		let len = Object.keys(this.items).length,
			output = '';
		for (let i = 0; i < len; i++ ) {
			output +=  this.items[i];
		}
		return output;
	}
	
	/**
	 * method for keyup event : receives and emits {} : value and position
	 * @param {Object} e
	 * @returns {Object}
	 * */
	maskCore(e) {
			/** @type {AMask} */
		let th = this,
			/** @type {string} */
			key = e.key,
			/** @type {number} */
			positionStart = e.currentTarget.selectionStart,
			position = e.currentTarget.selectionEnd,
			/** @type {string} */
			output,
			/** @type {number} */
			cursorPosition;
			
			console.log(key);
			console.log(positionStart, position);
			
		if (e.key === 'Backspace'  ||
			e.key === 'ArrowLeft'  ||
			e.key === 'ArrowUp'    ||
			e.key === 'ArrowRight' ||
			e.key === 'ArrowDown' ) {
			return {output: e.currentTarget.value, cursorPosition: position};
		}
		
		this.addItem(key, position);
		console.log(outputValue());
		console.log(position);
		
		
	}
	
	/**
	 * method sets Attribute placeholder
	 */
	setPlaceholder(elem){
		elem.setAttribute( 'placeholder', this.outputValue() );
		return this.outputValue(this.placeholder);
	}
	
	/* -----------------------------------------------------
	 *  METHODS for vanilla js
	 *  ----------------------------------------------------- */
	
	/**
	 * handler used by init
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
		// elem.value = inputParams.output;
		// elem.focus();
		// elem.setSelectionRange(inputParams.cursorPosition, inputParams.cursorPosition);
	}
	
	/**
	 * method adds event 'keyup' for vanilla js uses inputHandler
	 */
	init(){
		/** @type {NodeList} */
		let inputElements = this.elems;
		
		inputElements.forEach((elem)=> {
			elem.setAttribute('placeholder', this.placeholder);
			elem.addEventListener('keydown', (e) => this.inputHandler(e) );
		});
	}
}

// altKey: false
// bubbles: true
// cancelBubble: false
// cancelable: true
// charCode: 0
// code: "Digit1"       "Digit2"        "KeyQ"
// composed: true
// ctrlKey: false
// currentTarget: input#phone.form-control.js__amask
// defaultPrevented: false
// detail: 0
// eventPhase: 2
// isComposing: false
// isTrusted: true
// key: "1"         "2"     "q"
// keyCode: 49      50      81
// location: 0
// metaKey: false
// path: (9) [input#phone.form-control.js__amask, div.form-group, div.col-md-4, div.row, div.container, body, html, document, Window]
// repeat: false
// returnValue: true
// shiftKey: false
// sourceCapabilities: InputDeviceCapabilities {firesTouchEvents: false}
// srcElement: input#phone.form-control.js__amask
// target: input#phone.form-control.js__amask
// timeStamp: 3809.6999999997934
// type: "keydown"
// view: Window {postMessage: ƒ, blur: ƒ, focus: ƒ, close: ƒ, parent: Window, …}
// which: 49    50       81

// selectionEnd: 5
// selectionStart: 5

// value: "+4 (__4_) ___-__-__"