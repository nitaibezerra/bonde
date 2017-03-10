// polyfill webpack require.ensure
if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require)
import { injectAsyncReducer } from '~common/store'

export default store => ({
  path: 'mobilizations/:mobilization_id/widgets/:widget_id/pressure',
  getIndexRoute (location, cb) {
    require.ensure([], (require) => {
      cb(null, {
        component: require('./pressure/page.connected').default
      })
    })
  },
  getComponent (nextState, callback) {
    require.ensure([], function (require) {
      injectAsyncReducer(store, 'mobilizations', require('~client/mobrender/redux/reducers').default)
      callback(null, require('./container.connected').default)
    })
  },
  getChildRoutes (location, cb) {
    require.ensure([], require => {
      cb(null, [
        require('./email').default(store),
        require('./autofire').default(store),
        require('./finish').default(store)
      ])
    })
  }
})
