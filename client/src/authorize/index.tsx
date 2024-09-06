import React, { useEffect, useContext, useState, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import ServerContext from '../server-context'
import { getCookie } from '../cookie'
import axios from 'axios'

export function Authorize() {
  useEffect(() => {
    window.location.href = `${axios.defaults.baseURL}/google?redirect_uri=${window.location.origin}/authorized`
  }, [])
  return <React.Fragment />
}

export function Authorized() {
  const [searchParams] = useSearchParams()
  const [code] = useState(searchParams.get('code'))
  const navigate = useNavigate()

  const { server, setAccessToken } = useContext(ServerContext)

  const init = useCallback(() => {
    const accessToken = getCookie('access_token')
    if (accessToken) {
      setAccessToken(accessToken)
      navigate('/recipes')
    }
  }, [navigate, setAccessToken])

  useEffect(init, [code, navigate, server, init])
  return <React.Fragment />
}
