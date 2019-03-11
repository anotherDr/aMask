// @ts-check
'use strict';
const version = '0.6.7';
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
	
	/**
	 * method sets Attribute placeholder
	 */
	setPlaceholder() {
		this.prepareBuffer();
		return this.bufferArr.join('');
	}
	
	/**
	 * method add new char to the string in proper position
	 */
	addItem (key, position) {
		let th = this;
		
		if (this.position > this.len) return;
		
		if (/\d/.test( th.patternArr[position] ) ) {
			if (/[0-9]/.test(key)) {
				th.bufferArr[position] = key;
				th.cursorPosition = position + 1;
			}
		}
		else if ( /[\s.\/()+\-]/.test( th.patternArr[position] ) ) {
			th.cursorPosition = position + 1;
			th.addItem (key, th.cursorPosition);
		}
		else {
			th.cursorPosition = position;
		}
	}
	/**
	 * method react to keydown and return new string and new cursor position
	 */
	onKeyDownHandler(e){
		if( (e.ctrlKey || e.metaKey) && (e.key === 'v' || e.key === 'V')) {
			return;
		}
		e.preventDefault();
		
		let th = this,
			elem = e.target,
			startPosition = e.target.selectionStart,
			position = e.target.selectionEnd,
			output,
			cursor,
			key =  e.key;
		
		this.prepareBuffer();
		
		if (e.key === 'Backspace') {
			// e.preventDefault();
			if (startPosition === position) {
				startPosition -= 1;
			}
			for (let i = startPosition; i < position; i++) {
				if (/\d/.test( th.patternArr[i] ) ) {
					th.bufferArr[i] = this.placeholder;
				}
			}
			th.cursorPosition = startPosition;
		}
		else if (e.key === 'Delete') {
			// e.preventDefault();
			if (startPosition === position) {
				position += 1;
			}
			for (let i = startPosition; i < position; i++) {
				if (/\d/.test( th.patternArr[i] ) ) {
					th.bufferArr[i] = this.placeholder;
				}
			}
			th.cursorPosition = position;
		}
		else if (e.key === 'ArrowLeft') {
			th.cursorPosition = position -= 1;
		}
		else if (e.key === 'ArrowRight') {
			th.cursorPosition = position += 1;
		}
		else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
			th.cursorPosition = position;
		}
		else {
			// e.preventDefault();
			this.isKeyDown = true;
			this.addItem(key, position);
		}
		
		output = this.bufferArr.join('');
		cursor = (this.cursorPosition < 0) ? 0 : this.cursorPosition;
		
		// console.log('output: ', output);
		
		elem.value = output;
		elem.focus();
		elem.setSelectionRange(cursor, cursor);
		
		return {output, cursor};
	}
	
	onPasteHandler(e){
		let th = this,
			pastedText = '',
			clearText,
			textArr;
		
		if (window.clipboardData && window.clipboardData.getData) {     // IE
			pastedText = window.clipboardData.getData('Text');
		} else if (e.clipboardData && e.clipboardData.getData) {
			pastedText = e.clipboardData.getData('text/plain');
		}
		
		clearText = pastedText.replace(/[^\d]/,' ');
		textArr = clearText.split('');
		
		console.log('pasted: ' , textArr );
		
		function stringHandler(textArr, position = -1) {
			let char;
			if (textArr.length > 0) {
				char = textArr.shift();
				th.addItem (char, position + 1);
			}
		}
		stringHandler(textArr);
	}
	
	
	/* -----------------------------------------------------
	 *  METHODS for vanilla js
	 *  ----------------------------------------------------- */
	
	/**
	 * method adds event 'keyup' for vanilla js uses inputHandler
	 */
	init() {
		/** @type {NodeList} */
		let inputElements = this.elems;
		
		inputElements.forEach((elem) => {
			elem.setAttribute('placeholder', this.setPlaceholder());
			elem.addEventListener('keydown', (e) => this.onKeyDownHandler(e));
			elem.addEventListener('paste', (e) => this.onPasteHandler(e));
		});
	}
}

