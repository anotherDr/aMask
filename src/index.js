
import AMask from '/Users/Amadeus/Frontend/MyGitHub/aMask/src/amask'

const params = {
	selector: '.amask',
	spaceholder: '-',
	pattern: '99.99.9999'
};
let amask = new AMask(params);
amask.init();

/* TEST */
let test_block = document.body.appendChild( document.createElement('div') );
test_block.innerHTML = AMask.version();