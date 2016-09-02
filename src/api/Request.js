import { Axios } from 'axios'

export default class Request extends Axios {
  constructor(...args) {
    super(...args)
    this.defaults.baseURL = '/api'
  }

  addMobilization(mobilization, headers) {
    return this.post(`/mobilizations`, { mobilization }, { headers })
  }

  editMobilization(mobilization, headers) {
    return this.put(`/mobilizations/${mobilization.id}`, { mobilization }, { headers })
  }
}