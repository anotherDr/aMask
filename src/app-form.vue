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
		<datepicker
				id="dateStart"
				:value="dateStart"
				placeholder="__.__.____"
				format="dd.MM.yyyy"
				name="someday"
				:typeable="true"
				:language="ru"
				@opened="dateIputmask"
		/>
		
		<!--<h3>Directives</h3>-->
		<!--<div>-->
			<!--<input type="text"-->
			       <!--v-model="dateFinish"-->
			       <!--:data-regexp="true"-->
			       <!---->
			<!--/>&lt;!&ndash; v-amask:phone.undescore="'+9 (999) 999-99-99'" &ndash;&gt;-->
			<!--&nbsp; {{dateFinish}}-->
		<!--</div>-->
	</div>
</template>

<script>
	import AMask from './amask'                 // mask core module
	import amaskdir from '../shared/a-mask-dir'    // mask directive
	
	/* https://github.com/charliekassel/vuejs-datepicker */
	import Datepicker from 'vuejs-datepicker';
	import {en, ru} from 'vuejs-datepicker/dist/locale'
	
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
				dateStart: '22.12.2018',
				dateFinish: '',
				// datepicker
				en: en,
				ru: ru,
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
			dateIputmask(){
			
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
			}
		},
		mounted(){
			let th = this;
			dateMask.init();
		}
	}
</script>

<style scoped>
	
	*:focus {
		outline-color: lawngreen;
	}

</style>

<style>
	* {
		box-sizing: border-box;
	}
	
	input {
		padding: 4px 8px;
	}
</style>