import { showToast } from 'vant'
import type { User, ApiResp } from '@/types'
import { getUsers, saveUsers, nextId, currentUserId, type MockUser } from '@/mock/db'

function toUser(u: MockUser): User {
  return { id: u.id, username: u.username, nickname: u.nickname, avatar: u.avatar, phone: u.phone, created_at: u.created_at }
}

export function register(data: { username: string; password: string; nickname?: string }) {
  const users = getUsers()
  if (users.some((u) => u.username === data.username)) {
    showToast('用户名已存在')
    return Promise.reject(new Error('用户名已存在'))
  }
  const user: MockUser = {
    id: nextId(users),
    username: data.username,
    password: data.password,
    nickname: data.nickname || data.username,
    avatar: '',
    phone: '',
    created_at: new Date().toLocaleString()
  }
  users.push(user)
  saveUsers(users)
  return Promise.resolve<ApiResp<{ token: string; user: User }>>({
    code: 200, message: 'success',
    data: { token: `mock_token_${user.id}`, user: toUser(user) }
  })
}

export function login(data: { username: string; password: string }) {
  const users = getUsers()
  const u = users.find((x) => x.username === data.username && x.password === data.password)
  if (!u) {
    showToast('用户名或密码错误')
    return Promise.reject(new Error('用户名或密码错误'))
  }
  return Promise.resolve<ApiResp<{ token: string; user: User }>>({
    code: 200, message: 'success',
    data: { token: `mock_token_${u.id}`, user: toUser(u) }
  })
}

export function getMe() {
  const u = getUsers().find((x) => x.id === currentUserId())
  if (!u) {
    return Promise.reject(new Error('用户不存在'))
  }
  return Promise.resolve<ApiResp<User>>({ code: 200, message: 'success', data: toUser(u) })
}
