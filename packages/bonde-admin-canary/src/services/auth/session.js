import { CrossStorageClient } from 'cross-storage'

class AuthAPI {
  
  constructor () {
    this.storage = new CrossStorageClient(
      process.env.REACT_APP_CROSS_STORAGE_URL || 'http://cross-storage.bonde.devel'
    )
    this.token = undefined
  }

  login (user) {
    return this.storage.onConnect()
      .then(() => {
        this.authenticated = true
        this.token = user.jwtToken
        return this.storage.set('auth', JSON.stringify(user))
      })
  }

  logout () {
    return this.storage.onConnect()
      .then(() => {
        return this.storage.del('auth')
          .then(() => {
            this.token = undefined
          })
      })
  }

  getToken () {
    return this.token
  }

  getAsyncToken () {
    return this.storage.onConnect()
      .then(() => {
        return this.storage.get('auth')
      })
      .then(authJson => {
        if (authJson) {
          this.token = JSON.parse(authJson).jwtToken
          return Promise.resolve(this.token)
        }
      })
  }

  isAuthenticated () {
    return this.token !== undefined
  }
}

export default new AuthAPI()
