import request from '@/http'
export async function getTest() {
  // return {
  //   name: '李思',
  //   age: 24
  // }
  const res = await request.get({
    url: '/user-info'
  })
  return res
}
