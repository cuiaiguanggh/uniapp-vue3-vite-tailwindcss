import { defineStore } from 'pinia'
import { getTest } from '@/services/home'

export const useAppStore = defineStore('app', {
  state: () => {
    return {
      userInfo: {
        name: undefined,
        age: 0
      }
    }
  },
  getters: {},
  actions: {
    // 发送验证码
    async getUserInfo(phone: number): Promise<any> {
      // 每次发送记录本次发送的事件，限制一分钟一次
      const res = await getTest()
      console.log('res111: ', res)
      this.userInfo = res
      // uni.setStorageSync('codeLasttime', Date.now().toString())
    }
  }
})
