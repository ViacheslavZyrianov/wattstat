export interface User {
  id: string
  email: string
  displayName: string
  firstName: string
  lastName: string
  avatar: string
  emailVerified: boolean
}

export interface AuthState {
  user: User | null
  isLoading: boolean
}
