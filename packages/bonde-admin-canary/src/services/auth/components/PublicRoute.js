import { connect } from 'services/redux'
import Route from './Route'
import authSession from '../session'

const mapStateToProps = () => ({
  assert: !authSession.isAuthenticated()
})

/**
 * A PublicRoute connected with AuthAPI to discovery
 * when user is authenticated.
 *
 * Component representing a Route, used to render component.
 *
 * @param {string} [redirectTo] - Redirect used when authenticated is false.
 * @param {function} component - Component  used on render when authenticated
 * is false or not pass redirectTo.
 *
 */
export default connect(mapStateToProps)(Route)
