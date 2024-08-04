import React, { useState, useEffect, useContext } from 'react'
import './App.css'
import RecipeCollection from './Components/collection'
import { Grid, Typography } from '@material-ui/core'
import Hat from './hat'
import blue from '@material-ui/core/colors/blue'
import { useCookies } from 'react-cookie'
import {
  GoogleLogin,
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
  GoogleLogout
} from 'react-google-login'
import { refreshTokenSetup } from './util/refreshToken'
import UserSettingsDialog from './Components/user-settings'
import { Fab } from './Components/styled'
import { Settings } from '@material-ui/icons'
import RecipeContext, {
  Supermarket
} from './Components/collection/RecipeProvider'
import ServerContext from './server-context'

const clientId =
  '525923155725-8k5ukoaer4isj73bl6jpi887v2r70ic8.apps.googleusercontent.com'

export default function App() {
  const { setAccessToken, server, signedIn } = useContext(ServerContext)
  const [recipeTitle, setRecipeTitle] = useState<string>()
  const [settingsDisabled, setSettingsDisabled] = useState(!server)
  const [, , removeCookie] = useCookies(['HAS_SHOPPING_EXTENSION'])

  const [dialogOpen, setDialogOpen] = useState(false)
  const { supermarket, setSupermarket } = useContext(RecipeContext)

  useEffect(() => removeCookie('HAS_SHOPPING_EXTENSION'), [removeCookie])

  const onSuccess = (res: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    if (res && 'profileObj' in res && 'tokenId' in res) {
      console.log('Login Success: currentUser:', res.profileObj, res)
      setSettingsDisabled(false)
      setAccessToken(res.tokenId)
      refreshTokenSetup(res)
      // Refresh recipes:
      setSupermarket({ ...supermarket } as Supermarket)
    }
  }

  const onFailure = (res: unknown) => {
    console.log('Login failed: res:', res)
  }

  const logout = () => {
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
              <Hat></Hat>
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
          <GoogleLogout onLogoutSuccess={logout} clientId={clientId} />
          <Fab onClick={() => setDialogOpen(true)} disabled={settingsDisabled}>
            <Settings />
          </Fab>
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={3}></Grid>
        </Grid>
      </div>

      {signedIn && (
        <RecipeCollection setRecipeTitle={setRecipeTitle}></RecipeCollection>
      )}
      <UserSettingsDialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
      ></UserSettingsDialog>
    </div>
  )
}
