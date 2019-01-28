<template>
	<div>
		
		<div class="row">
			<div class="col-md-12">
				<h2>VUE</h2>
				<h3>Methods</h3>
			</div>
		</div>
		
		<div class="row">
			<div class="col-md-4">
				<div class="form-group">
					<input type="text"
					       class="form-control"
					       :placeholder="setPhonePlaceholder()"
					       @keyup="phoneMaskinput($event)"
					/>
				</div>
			</div>
			<div class="col-md-4">
				{{phone}}
			</div>
		</div>
		
		<div class="row">
			<div class="col-md-12">
				<h3>With Datepicker</h3>
			</div>
		</div>
		
		<div class="row">
			<div class="col-md-4">
				<div class="input-group mb-3">
					<input type="text"
					       class="form-control"
					       v-model="dateStart"
					       placeholder="__.__.____"
					       @keyup="dateMaskinput($event)"
					/>
					<div class="input-group-append">
						<button class="btn btn-outline-secondary btn-datepicker">
							<i class="far fa-calendar"></i>
							<datepicker
									@selected="dateSelected"
									:language="ru"
									:monday-first="true  "
									format="MM.dd.yyyy"
									:value="compDate"
							/>
						</button>
					</div>
				</div>
			</div>
			<div class="col-md-4">
				{{compDate}}
			</div>
			<div class="col-md-4">
				{{dateStart}}
			</div>
		</div>
		
		<hr class="separator"/>
		
		<div class="row">
			<div class="col-md-12">
				<h3>Masked Datepicker</h3>
			</div>
		</div>
		
		<div class="row">
			<div class="col-md-4">
				<!--/* MASKED DATEPICKER COMPONENT*/-->
				<masked-datepicker
						:lang="lang"
						v-on:chosen-date="printResult"
				
				/>
			<div class="col-md-4">
				Masked Datepicker Result: {{maskedDatepickerResult}}
			</div>
		</div>
		</div>
		
	</div>
</template>

<script>
	import AMask from './amask'                 // mask core module
	// import amaskdir from '../shared/a-mask-dir'    // mask directive
	import MaskedDatepicker from './masked-datepicker.vue'    // mask directive
	
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
				
				/* MASKED DATEPICKER COMPONENT*/
				maskedDatepickerResult: '',
				lang: 'ru',
			}
		},
		computed: {
			compDate(){
				let th = this;
				return moment(th.dateStart, 'DD.MM.YYYY').format('MM.DD.YYYY');
			}
		},
		components: {
			Datepicker,
			'masked-datepicker': MaskedDatepicker,
		},
		// directives: {
		// 	amaskdir,
		// },
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
			
			/* MASKED DATEPICKER COMPONENT*/
			printResult(result){
				this.maskedDatepickerResult = result;
			},
		}
	}
</script>

<style scoped>
	
	.btn-datepicker {
		position: relative;
		background: #ddd;
		white-space: normal;
		color: #555555;
		/*display: inline-block;*/
		/*width: 29px;*/
		/*height: 29px;*/
		/*line-height: 29px;*/
		/*padding: 0;*/
		/*vertical-align: middle;*/
		/*margin-left: -8px;*/
		/*border: 1px solid #ccc;*/
		/*border-radius: 4px;*/
		/*font-size: 16px;*/
	}
	
	.btn-datepicker:focus {
		outline: none;
	}


</style>

<style lang="scss">
	.vdp-datepicker {
		position: absolute !important;
		width: 100%;
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
		@extend .vdp-datepicker;
		background: transparent;
		color: transparent;
	}
	
	.vdp-datepicker__calendar {
		position: absolute;
		z-index: 100;
		background: #fff;
		width: 220px;
		border: 1px solid #ccc;
		right: -1px;
		top: -1px;
		font-size: 14px;
		padding: 0px 5px 15px;
		min-height: 172px;
	}

	.vdp-datepicker:focus {
		outline: none;
	}
	.vdp-datepicker__calendar .cell {
		padding: 0 5px;
		height: 20px;
		line-height: 20px;
		
		&.weekend {
			color: red;
		}
		&.selected {
			background: #6be6ff;
		}
	}
</style>