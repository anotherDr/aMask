// import Vue from 'vue'

export default {
	
	inserted: function(el, binding, vnode){
		let val = el.value,
			vm = vnode.context.$root,
			context = vnode.context;
		// let path = binding.expression.split('.');
		
		/*vm.$set( context.vset, [binding.value], {
			$model: val,
			$error: false,
			$require: false
		});*/
		
		console.log( context );
		console.log( binding.expression );
		console.log( binding.value );
		console.log( binding.name );
		console.log( vnode );
		console.log( vnode.context.$root );  // vue
		
	},
	update: function(el, binding, vnode){
		let context = vnode.context;
		let val = el.value,
			argument = binding.arg,
			mode = binding.modifiers;
			// msg = '',
			// vr = context.vset[binding.value];
		
		/*vr.$model = val;
		
		if (mode.required) {
			if (val === ''){
				// msg = msg.lang.required;
				vr.$error = true;
				vr.$require = true;
			}
		}*/
		
		
		console.log( 'val: ', val );
		console.log(argument, mode );
		console.log(binding.oldValue, binding.value, );
		
	},
}