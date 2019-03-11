
import '../sass/main.scss'
import AMask from './amask'

console.log(AMask.version());

const params1 = {
	selector: '#dateStart',
	spaceholder: '-',
	pattern: '99.99.9999'
};

let amask1 = new AMask(params1);
amask1.init();

/* ====================================== */

const params2 = {
	selector: '.js__amask',
	spaceholder: '-',
	pattern: '+9 (999) 999-99-99'
};
let amask2 = new AMask(params2);
amask2.init();


// 18187772223344

// let test_elem = document.getElementById('phone');
//
// test_elem.addEventListener('input', (e)=>{
// 	console.log('input - ' , ' - ' , e.target.value);
// });
// test_elem.addEventListener('paste', (e)=>{
// 	let pastedText = '';
// 	if (window.clipboardData && window.clipboardData.getData) {     // IE
// 		pastedText = window.clipboardData.getData('Text');
// 	} else if (e.clipboardData && e.clipboardData.getData) {
// 		pastedText = e.clipboardData.getData('text/plain');
// 	}
// 	console.log('paste - ' , pastedText );
// });
// test_elem.addEventListener('keyup', (e)=>{
// 	console.log('keyup - ' , ' - ' , e.target.value);
// });
// test_elem.addEventListener('keydown', (e)=>{
// 	console.log('keydown - ' , ' - ' , e.target.value);
// });
