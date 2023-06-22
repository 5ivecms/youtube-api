const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'

export const TokenService = {
  getAccessToken: (): string | null => localStorage.getItem(ACCESS_TOKEN_KEY),

  getRefreshToken: (): string | null => localStorage.getItem(REFRESH_TOKEN_KEY),

  removeAccessToken: (): void => {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
  },

  removeRefreshToken: (): void => {
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  },

  removeTokens: (): void => {
    TokenService.removeAccessToken()
    TokenService.removeRefreshToken()
  },

  setAccessToken: (token: string): void => {
    localStorage.setItem(ACCESS_TOKEN_KEY, token)
  },

  setRefreshToken: (token: string): void => {
    localStorage.setItem(REFRESH_TOKEN_KEY, token)
  },

  setTokens: (tokens: { accessToken: string; refreshToken: string }): void => {
    const { accessToken, refreshToken } = tokens
    TokenService.setAccessToken(accessToken)
    TokenService.setRefreshToken(refreshToken)
  },
}
