// @ts-check
'use strict';
const version = '0.6.0';
const defaultOptions = {
	pattern: '99.99.9999',
	placeholder: '_',
	selector: '.amask'
};

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
		this.items = this.pattern.split('');
		/** @type {number} */
		this.len = this.items.length;
		/** @type {number} */
		this.position = 0;
		/** @type {string} */
		this.key = ''
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
	makePlaceholder(){
	 	return this.pattern.replace(/\d/g, this.placeholder);
	}
	
	addItem() {
	 	if (this.position > this.len) return;
	 	
		if (/\d/.test(this.items[this.position])) {
			this.items[this.position] = this.key;
			this.position++;
		}
		else if (this.position < this.len-1) {
			this.position++;
			this.addItem();
		}
		else {
			return;
		}
		
	}
	
	outputValue(){
		return this.items.join('');
	}
	
	/**
	 * method for keyup event : receives and emits {} : value and position
	 * @param {Object} e
	 * @returns {Object}
	 * */
	maskCore(e) {
			/** @type {AMask} */
		let th = this;
			
		if ( /[^0-9]/.test(e.key) ) {
			return;
		}
		th.key = e.key;
		th.position = e.currentTarget.selectionEnd;
		
		console.log(th.key, th.position);
		
		this.addItem();
		
		console.log(this.outputValue(), this.position);
		console.log('====================');
		
		return {
			output: this.outputValue(),
			position: this.position
		}
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
		elem.value = inputParams.output;
		elem.focus();
		elem.setSelectionRange(inputParams.position, inputParams.position);
	}
	
	/**
	 * method adds event 'keyup' for vanilla js uses inputHandler
	 */
	init(){
		/** @type {NodeList} */
		let inputElements = this.elems;
		
		inputElements.forEach((elem)=> {
			elem.setAttribute( 'placeholder', this.makePlaceholder() );
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