<template>
	<div>
		<h3>Function</h3>
		<div>
			<input type="text" v-model="dateStart" @keyup="amask($event)">&nbsp; {{dateStart}}
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
			amask(e){
				let th = this;
				let promise = new Promise((resolve, reject)=>{
					resolve( th.maskInput(e) );
				});
				promise.then((result)=> {
					let elem = e.target,
						options = result;
					console.log(aMask.maskInput(e));
					th.dateStart = options.output;
					elem.focus();
					elem.setSelectionRange(options.cursorPosition, options.cursorPosition);
				})
			}
		}
	}
</script>

<style scoped>

</style>