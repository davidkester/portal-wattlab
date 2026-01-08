import { createApp } from 'vue'
import './style.css'

import { VueDatePicker } from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'


import App from './App.vue'

const app = createApp(App);
app.component('Navbar', Navbar);
app.component('Footer', Footer);
app.component('VueDatePicker', VueDatePicker);
app.mount('#app')
