import { b } from 'vite/dist/node/moduleRunnerTransport.d-DJ_mE5sf'

export interface GoogleCredentialResponse {
  clientId: string
  client_id: string
  credential: string
  select_by: string
}

export interface GoogleUser {
  id: string
  email: string
  name: string
  picture: string
  provider: string
  created_at: string
  last_login: string | null
}

export interface AuthGoogleState {
  user: GoogleUser | null
  token: string | null
  isAuthing: boolean
  isFallbackRenderButtonUsed: boolean
}

export interface AuthGoogleGetters {
  getIsAuthenticated: () => boolean
  getUser: () => AuthGoogleState['user']
}

export interface AuthGoogleLogoutResponse {
  successful: boolean
}
