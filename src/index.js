
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
	selector: '.amask',
	spaceholder: '-',
	pattern: '+9 (999) 999-99-99'
};
let amask2 = new AMask(params2);
amask2.init();