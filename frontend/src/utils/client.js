const API_URL = import.meta.env.VITE_API_URL;

let accessToken = null
let refreshing = null

export function setAccessToken(token) {
  accessToken = token
}

async function requestRefresh() {
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include"
    })

    if (!res.ok) {
      accessToken = null
      return null
    }

    const data = await res.json()
    accessToken = data.accessToken
    return data
  } finally {
    refreshing = null
  }
}

export function refreshSession() {
  if (!refreshing) {
    refreshing = requestRefresh()
  }
  return refreshing
}

export async function apiFetch(path, options = {}) {
  const send = () =>
    fetch(`${API_URL}${path}`, {
      ...options,
      credentials: "include",
      headers: {
        ...(options.body ? {"Content-Type": "application/json"} : {}),
        ...options.headers,
        ...(accessToken ? {Authorization: `Bearer ${accessToken}`} : {}),
      },
    })

  let res = await send()

  if (res.status === 401 && !path.startsWith("/auth/")) {
    const session = await refreshSession()
    if (session) {
      res = await send()
    }
  }

  return res
}
