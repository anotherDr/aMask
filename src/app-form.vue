<template>
	<div>
		<h3>Methods</h3>
		<div>
			<input type="text"
			       :placeholder="setPhonePlaceholder()"
			       @keyup="phoneMaskinput($event)"
			/>&nbsp; {{phone}}
		</div>
		<h3>With Datepicker</h3>
		<div>{{compDate}}</div>
		<div>{{dateStart}}</div>
		<input type="text"
		       v-model="dateStart"
		       placeholder="__.__.____"
		       @keyup="dateMaskinput($event)"
		/>
		<button class="btn btn-datepicker">
			<i class="far fa-calendar"></i>
			<datepicker
					@selected="dateSelected"
					:language="ru"
					:monday-first="true  "
					format="MM.dd.yyyy"
					:value="compDate"
			/>
		</button> {{dateStart}}
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
	const phoneMask = new AMask(props);
	
	const dateProps = {
		selector: '#dateStart',
		spaceholder: '_',
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
				en: en,
				ru: ru,
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
			setPhonePlaceholder(){
				return phoneMask.setPlaceholder();
			},
			phoneMaskinput(e){
				let th = this;
				
				phoneMask.maskInput(e).then((result)=> {
					
					let elem = e.target;
					
					th.phone = result.output;
					elem.value = result.output;
					elem.focus();
					elem.setSelectionRange(result.cursorPosition, result.cursorPosition);
				}).catch( reason => {
					console.log(reason.message);
				})
			},
			/* Date */
			dateMaskinput(e){
				let th = this;
				
				dateMask.maskInput(e).then((result)=> {
					
					let elem = e.target;
					
					th.dateStart = result.output;
					elem.value = result.output;
					elem.focus();
					elem.setSelectionRange(result.cursorPosition, result.cursorPosition);
				}).catch( reason => {
					console.log(reason.message);
				})
			},
			dateSelected(e){
				this.dateStart = moment(e).format('DD.MM.YYYY');
			},
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