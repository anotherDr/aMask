<template>
	<div>
		<h3>Methods</h3>
		<div>
			<input type="text"
			       :placeholder="setPlaceholder()"
			       @keyup="amask($event)"
			/>&nbsp; {{phone}}
			<!--@change="phone = $event.target.value"-->
		</div>
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
	import Vue from 'vue'                 // mask core module
	import AMask from './amask'                 // mask core module
	import amaskdir from '../shared/a-mask-dir'    // mask directive
	
	const props = {
		selector: '#dateStart',
		spaceholder: '-',
		pattern: '+9 (999) 999-99-99'
	};
	
	const aMask = new AMask(props);
	
	export default {
		name: 'app-form',
		data: function(){
			return {
				phone: '',
				dateStart: '',
				dateFinish: ''
			}
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
					
				let elem = e.target,
				result = aMask.maskInput(e);
				
				th.phone = result.output;
				elem.value = result.output;
				elem.focus();
				elem.setSelectionRange(result.cursorPosition, result.cursorPosition);
			}
		}
	}
</script>

<style scoped>

</style>