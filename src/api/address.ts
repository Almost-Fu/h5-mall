import type { Address, ApiResp } from '@/types'
import { currentUserId, getAddressesOf, saveAddressesOf, nextId } from '@/mock/db'

function uid() {
  return currentUserId()
}

export function getAddresses() {
  return Promise.resolve<ApiResp<Address[]>>({ code: 200, message: 'success', data: getAddressesOf(uid()) })
}

export function addAddress(data: Omit<Address, 'id'>) {
  const addrs = getAddressesOf(uid())
  if (data.is_default === 1) addrs.forEach((a) => (a.is_default = 0))
  const addr: Address = { id: nextId(addrs), ...data }
  addrs.push(addr)
  saveAddressesOf(uid(), addrs)
  return Promise.resolve<ApiResp<Address>>({ code: 200, message: 'success', data: addr })
}

export function updateAddress(id: number, data: Omit<Address, 'id'>) {
  const addrs = getAddressesOf(uid())
  const addr = addrs.find((a) => a.id === id)
  if (addr) {
    if (data.is_default === 1) addrs.forEach((a) => (a.is_default = 0))
    Object.assign(addr, data)
  }
  saveAddressesOf(uid(), addrs)
  return Promise.resolve<ApiResp<Address>>({ code: 200, message: 'success', data: addr! })
}

export function deleteAddress(id: number) {
  saveAddressesOf(uid(), getAddressesOf(uid()).filter((a) => a.id !== id))
  return Promise.resolve<ApiResp>({ code: 200, message: 'success', data: null })
}
