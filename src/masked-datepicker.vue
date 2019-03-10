<template>
	<div class="masket-datepicker">
		<div class="input-group">
			<input type="text"
			       class="form-control masked-input"
			       :class="inputClass"
			       v-model="typedDate"
			       placeholder="__.__.____"
			       @keydown="dateKeydown($event)"
			       @input="dateMaskinput($event)"
			/>
			<div class="input-group-append">
				<div type="button" class="btn  btn-datepicker"><!-- btn-outline-secondary -->
					<i class="far fa-calendar"></i>
					<datepicker
							@selected="dateSelected"
							:language="curLang"
							:monday-first="curMondayFirst"
							format="MM.dd.yyyy"
							:value="computedDate"
							:disabledDates="state.disabledDates"
							:highlighted="state.highlighted"
					/>
				</div>
			</div>
		</div>
		 <!--for test
		<div class="clearfix">
			<div>
				{{computedDate}}
			</div>
			<div>
				{{typedDate}}
			</div>
		</div>-->
	</div>
</template>

<script>
	import AMask from './a-mask'                 // mask core module
	
	/* VUEJS-DATEPICKER */
	/* https://github.com/charliekassel/vuejs-datepicker */
	import Datepicker from 'vuejs-datepicker';
	import {en, ru} from 'vuejs-datepicker/dist/locale'
	import moment from 'moment'
	
	const dateProps = {
		spaceholder: '_',
		pattern: '99.99.9999'
	};
	const dateMask = new AMask(dateProps);
	
	function trueModelDate(d){
		if ( !/\d\d\.\d\d\.\d\d\d\d/.test(d)) {
			if ( moment(d).isValid() ) {
				return moment(d).format('DD.MM.YYYY');
			}
			else {
				// console.error('non valid date!');
				return '';
			}
		}
		else {
			return d;
		}
	}
	
	export default {
		name: 'masked-input',
		model: {
			prop: 'result',
			event: 'choise'
		},
		props: {
			result: String | Date,
			lang: String,
			state: Object,
			// defaultData: String,
			mondayFirst: Boolean,
			inputClass: String,
		},
		data() {
			return {
				kde: null,
				typedDate: trueModelDate(this.result),
				// typedDate: this.state.defaultData || '',
				curLang: this.lang === 'ru' ? ru : en,
				curMondayFirst: this.mondayFirst || true,

				/* STATUS */
				test: false, // TODO: remove
			}
		},
		watch: {
			typedDate(){
				let status = '';
				
				/* VALIDATOR */
				if (this.typedDate === '' || this.typedDate === '__.__.____') {
					status = 'isEmpty';
				}
				else if (!/\d\d\.\d\d\.\d\d\d\d/.test(this.typedDate)) {
					status = 'isntFormat';
				}
				else if (!moment(this.typedDate, 'DD.MM.YYYY').isValid()) {
					status = 'isntDate';
				}
				else if (this.state.disabledDates.from && this.state.disabledDates.to) {
					if (!moment(this.typedDate, 'DD.MM.YYYY').isBetween(this.state.disabledDates.to, this.state.disabledDates.from, null, [])) {
						status = 'isOutOfRange';
					}
				}
				else if (this.state.disabledDates.to) {
					if ( moment(this.typedDate, 'DD.MM.YYYY').isBefore(this.state.disabledDates.to) ) {
						status = 'isBeforeRange';
					}
				}
				else if (this.state.disabledDates.from) {
					if ( moment(this.typedDate, 'DD.MM.YYYY').isAfter(this.state.disabledDates.from) ) {
						status = 'isAfterRange';
					}
				}
				
				this.$emit('choise',  this.typedDate);
				this.$emit('chosen-date', this.typedDate);
				this.$emit('statuses', status);
			}
		},
		computed: {
			computedDate() {
				let th = this;
				// return moment(th.typedDate, 'DD.MM.YYYY').format('MM.DD.YYYY'); // work only in chrome
				if (th.typedDate && moment(this.typedDate, 'DD.MM.YYYY').isValid() ) {
					return moment(th.typedDate, 'DD.MM.YYYY').toDate();
				}
				else {
					return new Date();
				}
			}
		},
		components: {
			Datepicker
		},
		methods: {
			/* Date */
			dateKeydown(e) {
				// console.log(e)
				this.kde = e;
			},
			dateMaskinput(e) {
				let th = this;
				
				let elem = e.target,
					result = dateMask.maskCore(e, th.kde);
				
				th.typedDate = result.output;
				elem.value = result.output;
				elem.focus();
				elem.setSelectionRange(result.cursorPosition, result.cursorPosition);
			},
			dateSelected(e) {
				this.typedDate = moment(e).format('DD.MM.YYYY');
			},
		}
	}
</script>

<style scoped>
	.masket-datepicker .btn-datepicker {
		position: relative;
		background: #ddd;
		white-space: normal;
		padding: 4px 8px;
	}
	.masket-datepicker .btn-datepicker:focus {
		outline: none;
	}

</style>

<style>

	/* MASKED DATEPICKER */
	.masket-datepicker .vdp-datepicker input::-moz-selection {
	    background: transparent;
	    color: transparent;
	}
	.masket-datepicker .vdp-datepicker input::selection {
	    background: transparent;
	    color: transparent;
	}
	.masket-datepicker .input-group {
		position: relative;
		display: flex;
		/*flex-wrap: wrap;*/
		align-items: stretch;
		width: 100%;
	}

	.masket-datepicker .input-group > input[type='text']:not(:last-child) {
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}

	.masket-datepicker .input-group-prepend,
	.masket-datepicker .input-group-append {
		display: flex;
	}

	.masket-datepicker .input-group-append {
		margin-left: -1px;
	}

	.masket-datepicker .input-group > .input-group-append > .btn {
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
		border: 1px solid #cccccc;
		background: #ededed;
	}

	.masket-datepicker .input-group > .input-group-append > input[type="text"] {
		border: 0 none;
	}

	.masket-datepicker .far.fa-calendar {
		display: inline-block;
		width: 24px;
		height: 24px;
		vertical-align: top;
		background: url('/images/forma/dateicon.png') 50% 50% no-repeat;
	}


	.masket-datepicker .vdp-datepicker {
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
		text-align: left;
	}
	.masket-datepicker .vdp-datepicker:focus {
		outline: none;
	}
	.masket-datepicker .vdp-datepicker input {
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
		background: transparent;
		color: transparent;
	}

	.masket-datepicker .vdp-datepicker__calendar {
		position: absolute;
		z-index: 100;
		width: 315px;
		border: 1px solid #ccc;
		right: -1px;
		top: -1px;
		font-size: 14px;
		padding: 10px 10px 10px;
		min-height: 172px;
		background: #eee;
		color: #000;
	}
	.masket-datepicker header + div {
		background: #fff;
	}


	.masket-datepicker .vdp-datepicker__calendar header {
		display: block;
		line-height: 40px;
	}

	.masket-datepicker .vdp-datepicker__calendar .cell.day-header {
		font-size: 100%;
		white-space: nowrap;
		cursor: inherit;
	}

	.masket-datepicker .vdp-datepicker__calendar .cell.day-header:nth-child(6),
	.masket-datepicker .vdp-datepicker__calendar .cell.day-header:nth-child(7) {
		color: rgb(226, 26, 26);
	}
	.masket-datepicker .vdp-datepicker__calendar .cell.weekend {
		color: rgb(226, 26, 26);
	}

	.masket-datepicker .vdp-datepicker__calendar .cell {
		padding: 0 5px;
		height: 28px;
		line-height: 28px;
	}
	.masket-datepicker .vdp-datepicker__calendar .cell.day,
	.masket-datepicker .vdp-datepicker__calendar .cell.day-header {
		border: 1px solid #eee;
	}
	.masket-datepicker .vdp-datepicker__calendar .cell.disabled {
		color: grey;
		opacity: 0.5;
		filter: progid:DXImageTransform.Microsoft.Alpha(opacity = 50);
	}

	.masket-datepicker .vdp-datepicker__calendar .cell.month,
	.masket-datepicker .vdp-datepicker__calendar .cell.year {
		background: #fff;
	}

	.masket-datepicker .vdp-datepicker__calendar header span {
		background: #eee;
	}

	.masket-datepicker .vdp-datepicker__calendar header .prev:not(.disabled):hover,
	.masket-datepicker .vdp-datepicker__calendar header .next:not(.disabled):hover,
	.masket-datepicker .vdp-datepicker__calendar header .up:not(.disabled):hover {
		background: #fff;
	}

</style>