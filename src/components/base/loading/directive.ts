import Loading from './loading.vue'
import { createApp, } from 'vue'
import type {DirectiveBinding, ObjectDirective } from 'vue'
const loadingDirective:ObjectDirective = {
  mounted(el, binding:DirectiveBinding) {
    const app = createApp(Loading)
    const instance = app.mount(document.createElement('div'))
    el.instance = instance
    if (binding.value) {
      append(el)
    }
  },
  updated(el, binding) {
    if (binding.value !== binding.oldValue) {
      if (binding.value) {
        append(el)
      }else{
        remove(el)
      }
    }
  }
}

function append(el) {
  const style=getComputedStyle(el)
  if(!['absolute','fixed','relative'].includes(style.position)){
    el.classList.add('g-relative')
  }
  el.appendChild(el.instance.$el)
}
function remove(el){
  el.removeChild(el.instance.$el)
  el.classList.remove('g-relative')
}
export default loadingDirective
