import { createApp } from 'vue'
import './style.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faBars, faEyeSlash, faEye, faPlus, faMinus, faHeart, faSpinner, faUserPlus, faPhone, faLocationDot, faEnvelope, faComment, faCheck } from '@fortawesome/free-solid-svg-icons'
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { faFacebook, faInstagram, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons'

const pinia = createPinia();
library.add(faBars, faEyeSlash, faEye, faPlus, faMinus, faHeartRegular, faHeart, faSpinner, faUserPlus, faLinkedin, faPhone, faFacebook, faLocationDot, faInstagram, faTwitter, faEnvelope, faComment, faCheck );
const app = createApp(App);
app.component('font-awesome-icon', FontAwesomeIcon);
app.use(pinia)
app.use(router).mount('#app')
