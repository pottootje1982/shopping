import React, { useState, useEffect, useContext } from 'react'
import './App.css'
import RecipeCollection from './Components/collection'
import { Grid, Typography } from '@material-ui/core'
import { ReactComponent as Hat } from './hat.svg'
import blue from '@material-ui/core/colors/blue'
import { useCookies } from 'react-cookie'
import { GoogleLogin, GoogleLogout } from 'react-google-login'
import { refreshTokenSetup } from './util/refreshToken'
import UserSettingsDialog from './Components/user-settings'
import { Fab } from './Components/styled'
import { Settings } from '@material-ui/icons'
import RecipeContext from './Components/collection/RecipeProvider'

const clientId =
  '525923155725-8k5ukoaer4isj73bl6jpi887v2r70ic8.apps.googleusercontent.com'

export default function App() {
  const [recipeTitle, setRecipeTitle] = useState()
  const [settingsDisabled, setSettingsDisabled] = useState(
    !localStorage.getItem('authToken')
  )
  const [, , removeCookie] = useCookies(['HAS_SHOPPING_EXTENSION'])

  const [dialogOpen, setDialogOpen] = useState(false)
  const { supermarket, setSupermarket } = useContext(RecipeContext)

  useEffect(() => removeCookie('HAS_SHOPPING_EXTENSION'), [removeCookie])

  const onSuccess = (res) => {
    console.log('Login Success: currentUser:', res.profileObj, res)
    setSettingsDisabled(false)
    localStorage.setItem('authToken', res.accessToken)
    refreshTokenSetup(res)
    // Refresh recipes:
    setSupermarket({ ...supermarket })
  }

  const onFailure = (res) => {
    console.log('Login failed: res:', res)
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    setSettingsDisabled(true)
  }

  return (
    <div className="App">
      <div className="App-header">
        <div style={{ display: 'table', clear: 'both' }}></div>
        <Grid container alignItems="center" spacing={1}>
          <Grid item container xs={3}>
            <Grid item>
              <Typography variant="h4" style={{ padding: 15, color: blue[50] }}>
                Lazy chef
              </Typography>
            </Grid>
            <Grid item>
              <Hat style={{ width: 60, height: 60 }}></Hat>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" style={{ color: blue[50] }}>
              {recipeTitle}
            </Typography>
          </Grid>
          <GoogleLogin
            clientId={clientId}
            buttonText="Login"
            onSuccess={onSuccess}
            onFailure={onFailure}
            cookiePolicy={'single_host_origin'}
            style={{ marginTop: '100px' }}
            isSignedIn={true}
          />
          <GoogleLogout onLogoutSuccess={logout} />
          <Fab onClick={() => setDialogOpen(true)} disabled={settingsDisabled}>
            <Settings />
          </Fab>
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={3}></Grid>
        </Grid>
      </div>

      <RecipeCollection setRecipeTitle={setRecipeTitle}></RecipeCollection>
      <UserSettingsDialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
      ></UserSettingsDialog>
    </div>
  )
}
