import { defineStore } from 'pinia'

// User store
export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
  }),
  actions: {
    addUser(user) {
      this.users.push(user)
    },
  },
})

// Payment store
export const usePaymentStore = defineStore('payment', {
  state: () => ({
    payments: [],
  }),
  actions: {
    addPayment(payment) {
      this.payments.push(payment)
    },
  },
})
