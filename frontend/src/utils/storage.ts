const PREFIX = 'online-exam-pro:'

export function setStorage<T>(key: string, value: T) {
  localStorage.setItem(PREFIX + key, JSON.stringify(value))
}

export function getStorage<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(PREFIX + key)
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function removeStorage(key: string) {
  localStorage.removeItem(PREFIX + key)
}

export function examDraftKey(examId: number | string, userId: number | string) {
  return `draft:${examId}:${userId}`
}
