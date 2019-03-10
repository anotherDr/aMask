<template>
	<div>
		<div class="row">
			<div class="col-md-12">
				<h1>Vue Component With Masked Datepicker</h1>
			</div>
		</div>
		
		<!--
		MASKED DATEPICKER COMPONENTS
		-->
		<div class="row">
			<div class="col-md-8" :class="{'error': dateFromError}">
				
				<masked-datepicker
						:lang="'ru'"
						:monday-first="true"
						:state="stateFrom"
						:inputClass="'white-input'"
						v-model="dateFrom"
						@chosen-date="printFromResult"
						@statuses="statusFromHandler"
				/>
				<div class="msg" v-show="dateFromError" v-html="dateFromErrorMsg"/>
			
			</div>
				<div class="col-md-4">
					<div>v-model dateFrom: {{dateFrom}}</div>
					<div>fn dateFromResult: {{dateFromResult}}</div>
				</div>
		</div>
		
		<div class="row">
			<div class="col-md-8" :class="{'error': dateToError}">
				<masked-datepicker
						:lang="'ru'"
						:monday-first="true"
						:state="stateTo"
						:inputClass="'white-input'"
						v-model="dateTo"
						@chosen-date="printToResult"
						@statuses="statusToHandler"
				/>
				<div class="msg" v-show="dateToError" v-html="dateToErrorMsg"/>
			</div>
			
			<div class="col-md-4">
				<div>v-model dateTo: {{dateTo}}</div>
				<div>fn dateToResult: {{dateToResult}}</div>
			</div>
		</div>
		
	</div>
</template>

<script>
	import AMask from './a-mask'                 // mask core module
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
				dateFrom: '22.04.2012',
				dateTo: '',
				dateFromResult: '22.04.2012',
				dateToResult: '',
				
				dateFromError: false,
				dateFromErrorMsg: '',
				dateToError: false,
				dateToErrorMsg: '',
				
				/* MASKED DATEPICKER COMPONENT*/
				maskedDatepickerResult: '',
				lang: 'ru',
				stateFrom: {
					disabledDates: {
						from: new Date(2019, 2, 15), // Disable all dates up to specific date
					}
				},
				stateTo: {
					disabledDates: {
						to: new Date(), // Disable all dates after specific date
					}
				},
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
			printFromResult(result){
				this.dateFromResult = result;
			},
			printToResult(result){
				this.dateToResult = result;
			},
			statusFromHandler(status){
				this.dateFromError = !!status;
				this.dateFromErrorMsg = status ? MESSAGES.ru[status] : '';
			},
			statusToHandler(status){
				this.dateToError = !!status;
				this.dateToErrorMsg = status ? MESSAGES.ru[status] : '';
			}
		}
	}
</script>

<style scoped>
	.row {
		margin-bottom: 20px;
	}
	.msg {
		padding: 20px 0;
	}
	
</style>

<style lang="scss">
	.form-control {
		min-width: 280px;
		font-size: 14px;
		padding: 4px 8px;
	}
	
	.container {
		width: 100%;
		padding-right: 15px;
		padding-left: 15px;
		margin-right: auto;
		margin-left: auto;
	}
	.row {
		display: flex;
		flex-wrap: wrap;
		margin-right: -15px;
		margin-left: -15px;
	}
	.col-md-4,
	.col-md-12 {
		position: relative;
		width: 100%;
		min-height: 1px;
		padding-right: 15px;
		padding-left: 15px;
	}
	.col-md-4 {
		flex: 0 0 33.33333%;
		max-width: 33.33333%;
	}
	.col-md-12 {
		flex: 0 0 100%;
		max-width: 100%;
	}
</style>

