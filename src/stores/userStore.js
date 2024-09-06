import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref(JSON.parse(localStorage.getItem('user')))

  const saveUser = (newUser) => {
    if (newUser) {
      user.value = newUser
      localStorage.setItem('user', JSON.stringify(newUser))
    }
  }

  const removeUser = () => {
    localStorage.removeItem('user')
    user.value = null
  }

  return { user, saveUser, removeUser }
})
