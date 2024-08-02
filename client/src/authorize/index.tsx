import React, { useEffect, useContext, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import ServerContext from '../server-context'
import { getCookie } from '../cookie'

export function Authorize() {
  useEffect(() => {
    window.location.href = `http://localhost:5000/google?redirect_uri=${window.location.origin}/authorized`
  }, [])
  return <React.Fragment />
}

export function Authorized() {
  const [searchParams] = useSearchParams()
  const [code] = useState(searchParams.get('code'))
  const navigate = useNavigate()

  const { server, setAccessToken } = useContext(ServerContext)

  function init() {
    const accessToken = getCookie('access_token')
    if (accessToken) {
      setAccessToken(accessToken)
      navigate('/recipes')
    }
  }

  useEffect(init, [code, navigate, server])
  return <React.Fragment />
}
