import axios, { AxiosInstance } from 'axios'
import { getCookie } from './cookie'
import React, { createContext, useCallback, useState } from 'react'

axios.defaults.baseURL =
  process.env.NODE_ENV !== 'production'
    ? 'http://localhost:5000'
    : 'https://lazychef.onrender.com'
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8'

interface ServerContextType {
  server: () => AxiosInstance
  setAccessToken: (value: string) => void
  signedIn: boolean
  serverUrl?: string
}

const ServerContext = createContext({} as ServerContextType)

export default ServerContext

interface ServerProviderProps {
  children: React.ReactNode
}

export function ServerProvider(props: ServerProviderProps) {
  const [accessToken, setAccessToken] = useState(getCookie('access_token'))
  const server = useCallback(() => {
    const res = axios.create({
      baseURL: axios.defaults.baseURL,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    return res
  }, [accessToken])

  const values = {
    server,
    setAccessToken,
    signedIn: !!accessToken,
    serverUrl: axios.defaults.baseURL
  }

  return (
    <ServerContext.Provider value={values}>
      {props.children}
    </ServerContext.Provider>
  )
}
