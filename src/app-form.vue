<template>
	<div>
		<h3>Methods</h3>
		<div>
			<input type="text"
			       :placeholder="setPlaceholder()"
			       @keyup="amask($event)"
			/>&nbsp; {{phone}}
		</div>
		<h3>With Datepicker</h3>
		<div>{{compDate}}</div>
		<div>{{dateStart}}</div>
		<div>{{closedMsg}}</div>
		<input type="text" v-model="dateStart">
		
		<button class="btn btn-datepicker">
			<i class="far fa-calendar"></i>
			<datepicker
					@input="onInputFn"
					@selected="selectedDPFn"
					@opened="openedDPFn"
					@closed="closedDPFn"
					:language="ru"
					:monday-first="true  "
					:typeable="true"
					format="MM.dd.yyyy"
					:value="compDate"
			/>
		</button>
	</div>
</template>

<script>
	import AMask from './amask'                 // mask core module
	import amaskdir from '../shared/a-mask-dir'    // mask directive
	
	/* https://github.com/charliekassel/vuejs-datepicker */
	import Datepicker from 'vuejs-datepicker';
	import {en, ru} from 'vuejs-datepicker/dist/locale'
	
	import moment from 'moment'
	
	const props = {
		selector: '#phone',
		spaceholder: '-',
		pattern: '+9 (999) 999-99-99'
	};
	const aMask = new AMask(props);
	
	const dateProps = {
		selector: '#dateStart',
		spaceholder: ' ',
		pattern: '99.99.9999'
	};
	const dateMask = new AMask(dateProps);
	
	
	export default {
		name: 'app-form',
		data: function(){
			return {
				phone: '',
				dateStart: '',
				dateFinish: '',
				// datepicker
				en: en,
				ru: ru,
				
				fakeDate: '',
				onInput: 'input',
				closedMsg: 'closedMsg'
			}
		},
		computed: {
			compDate(){
				let th = this;
				return moment(th.dateStart, 'DD.MM.YYYY').format('MM.DD.YYYY');
			}
		},
		components: {
			Datepicker
		},
		directives: {
			amaskdir,
		},
		methods: {
			setPlaceholder(){
				return aMask.setPlaceholder();
			},
			amask(e){
				let th = this;
				
				aMask.maskInput(e).then((result)=> {
					
					let elem = e.target;
					
					th.phone = result.output;
					elem.value = result.output;
					elem.focus();
					elem.setSelectionRange(result.cursorPosition, result.cursorPosition);
				}).catch( reason => {
					console.log(reason.message);
				})
			},
			dateIputmask(e){
				console.log('e')
			},
			dateMaskinput(e){
				let th = this;
				
				dateMask.maskInput(e).then((result)=> {
					
					let elem = e.target;
					
					th.phone = result.output;
					elem.value = result.output;
					elem.focus();
					elem.setSelectionRange(result.cursorPosition, result.cursorPosition);
				}).catch( reason => {
					console.log(reason.message);
				})
			},
			onInputFn(e){
				console.log(e);
				this.onInput = e;
			},
			selectedDPFn(e){
				this.dateStart = moment(e).format('DD.MM.YYYY');
			},
			openedDPFn(e){
				this.closedMsg = 'opened';
				console.log(e)
			},
			closedDPFn(e){
				this.closedMsg = 'closedMsg validation';
				console.log(e)
			},
		},
		mounted(){
			let th = this;
			dateMask.init();
		}
	}
</script>

<style scoped>
	
	*:focus {
		/*outline-color: lawngreen;*/
		/*outline-color: #00ddff;*/
		/*outline-color: cyan;*/
	}

</style>

<style lang="scss">
	$blue_dark: navy;
	* {
		box-sizing: border-box;
	}
	*:focus {
		outline-color: #00ddff;
	}
	
	input {
		padding: 5px 8px;
		font-size: 14px;
		vertical-align: middle;
		border-radius: 4px;
		border: 1px solid $blue_dark;
	}
	
	.icon,
	.btn {
		display: inline-block;
		width: 32px;
		height: 32px;
		background: #ddd;   
		color: $blue_dark;
		border: 1px solid $blue_dark;
		-webkit-border-radius: 4px;
		-moz-border-radius: 4px;
		border-radius: 4px;
		
		img {
			width: 16px;
			height: 16px;
		}
	}
	
	.btn-datepicker {
		position: relative;
		display: inline-block;
		width: 29px;
		height: 29px;
		line-height: 29px;
		padding: 0;
		vertical-align: middle;
		margin-left: -8px;
		background: #eaeafd;
		color: $blue_dark;
		border: 1px solid navy;
		border-radius: 4px;
		font-size: 16px;
	}
	
	.vdp-datepicker,
	.vdp-datepicker input {
		position: absolute;
		width: 100%;
		 /*opacity: 0;*/
		height: 100%;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: 0;
		padding: 0;
		border-width: 0;
		cursor: pointer;
	}
	.vdp-datepicker input {
		background: transparent;
		color: transparent;
	}
	
	.vdp-datepicker__calendar {
		position: absolute;
		z-index: 100;
		background: #fff;
		width: 300px;
		border: 1px solid #ccc;
		left: -150px;
		top: -150px;
		/*color: #000;*/
	}
</style>