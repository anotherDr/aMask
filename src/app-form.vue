<template>
	<div>
		<h3>Function</h3>
		<div>
			<input type="text"
			       :placeholder="setPlaceholder()"
			       v-model="dateStart"
			       @keyup="amask($event)"
			/>&nbsp; {{dateStart}}
		</div>
		<h3>Directives</h3>
		<div>
			<input type="text"
			       v-model="dateFinish"
			       :data-regexp="true"
			       v-amask:phone.undescore="'+9 (999) 999-99-99'"
			/>
			&nbsp; {{dateFinish}}
		</div>
	</div>
</template>

<script>
	import AMask from './amask'
	import amask from '../shared/a-mask-dir'
	
	const props = {
		selector: '#dateStart',
		spaceholder: '-',
		pattern: '+9 (999) 999-99-99'
	};
	const aMask = new AMask(props);
	
	export default {
		name: "app-form",
		data: function(){
			return {
				dateStart: '',
				dateFinish: ''
			}
		},
		directives: {
			amask,
		},
		methods: {
			setPlaceholder(){
				return aMask.setPlaceholder();
			},
			amask(e){
				let th = this;
				
				aMask.maskInput(e).then((result)=> {
					console.log(result);
					
					let elem = e.target;
					
					// th.dateStart = result.output;
					elem.value = result.output;
					elem.focus();
					elem.setSelectionRange(result.cursorPosition, result.cursorPosition);
				}).catch( reason => {
					console.log(reason.message);
				})
			}
		}
	}
</script>

<style scoped>

</style>