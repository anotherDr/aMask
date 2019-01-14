<template>
	<div>
		<h3>Function</h3>
		<div>
			<input type="text" v-model="dateStart" @keyup="amask($event)">&nbsp; {{dateStart}}
		</div>
		<h3>Directives</h3>
		<div>
			<input type="text"
			       v-model="dateStart"
			       :data-regexp="true"
			       v-amask:phone.undescore="'+9 (999) 999-99-99'"
			/>
			&nbsp; {{dateStart}}
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
				dateStart: ''
			}
		},
		directives: {
			amask,
		},
		methods: {
			amask(e){
				console.log(aMask.maskInput(e));
			}
		}
	}
</script>

<style scoped>

</style>