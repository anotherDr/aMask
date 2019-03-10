
import Vue from 'vue'
import formComponent from './mdpapp.vue'

var vm = new Vue({
	el: '#app',
	render: h => h(formComponent)
});
