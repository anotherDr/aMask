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
					       @keydown="phoneKeydown($event)"
					       @input="phoneMaskinput($event)"
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
					       @input="dateMaskinput($event)"
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
			<div class="col-md-4" :class="{'error': dateError}">
				<!--
				MASKED DATEPICKER COMPONENT
				-->
				<masked-datepicker
						:lang="lang"
						@chosen-date="printResult"
						@statuses="statusHandler"
						:state="state"
				/>
				<div class="msg" v-show="dateError" v-html="dateErrorMsg"/>
			</div>
			<div class="col-md-4">
				Masked Datepicker Result: {{maskedDatepickerResult}}
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
	import MESSAGES from './messages'
	
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
				/* ---------------------------------------------
				 * MASKED METHODS
				 * --------------------------------------------- */
				kde: null,
				phone: '',
				dateStart: '',
				dateFinish: '',
				en: en,
				ru: ru,
				
				dateError: false,
				dateErrorMsg: '',
				
				/* MASKED DATEPICKER COMPONENT*/
				maskedDatepickerResult: '',
				lang: 'ru',
				state: {
					disabledDates: {
						to: new Date(2018, 0, 25), // Disable all dates up to specific date
						from: new Date(2019, 2, 22), // Disable all dates after specific date
					}
				}
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
			/* ---------------------------------------------
			 * MASKED METHODS
			 * --------------------------------------------- */
			setPhonePlaceholder(){
				return phoneMask.setPlaceholder();
			},
			phoneKeydown(e){
				this.kde = e;
			},
			phoneMaskinput(e){
				let th = this;
				
				let elem = e.target,
					result = phoneMask.maskCore(e, th.kde);
				
				th.phone = result.output;
				elem.value = result.output;
				elem.focus();
				elem.setSelectionRange(result.cursorPosition, result.cursorPosition);
				
			},
			/* Date */
			dateMaskinput(e){
				let th = this;
				
				let elem = e.target,
					result = dateMask.maskCore(e);
				
				th.dateStart = result.output;
				elem.value = result.output;
				elem.focus();
				elem.setSelectionRange(result.cursorPosition, result.cursorPosition);
			},
			
			dateSelected(e){
				this.dateStart = moment(e).format('DD.MM.YYYY');
			},
			
			/* ---------------------------------------------
			 * MASKED DATEPICKER COMPONENT
			 * --------------------------------------------- */
			printResult(result){
				this.maskedDatepickerResult = result;
			},
			statusHandler(status){
				this.dateError = !!status;
				this.dateErrorMsg = status ? MESSAGES.ru[status] : '';
			}
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
	
	.form-control:focus {
		color: #495057;
		background-color: #fff;
		border-color: #ccc;
		outline: 0;
		box-shadow: 0 0 0 0 transparent;
	}
	
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
	
	.error {
		input.form-control {
			border: 1px solid #c00;
		}
		.msg {
			color: #c00;
		}
	}
</style>