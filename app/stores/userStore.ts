import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
    const loading = ref(false)
    const error = ref<string | null>(null)
    const user = ref(null)

    async function login({ email, password }: { email: string; password: string }) {
        
    }

    return { loading, error, user, login }
})
