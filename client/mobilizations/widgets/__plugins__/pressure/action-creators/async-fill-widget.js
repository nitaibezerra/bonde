import AnalyticsEvents from '~mobilizations/widgets/utils/analytics-events'
import MobSelectors from '~client/mobrender/redux/selectors'
import * as t from '../action-types'
import * as MobActionTypes from '~client/mobrender/redux/action-types'
import { createAction } from './create-action'

//
// The name of this action needs to be refactored to make more sense.
// Besides to have to refact this action name, needs to refact
// API endpoint too.
//
const asyncFillWidget = ({ payload: fill, widget }) => (dispatch, getState, { api }) => {
  const state = getState()

  // For endpoint reference, see: https://github.com/ourcities/hub-api/issues/39
  const endpoint = `/widgets/${widget.id}/fill`
  const body = { fill }

  dispatch({ type: t.WIDGET_PRESSURE_FILL_REQUEST })
  return api.post(endpoint, body)
    .then(response => {
      dispatch({ type: t.WIDGET_PRESSURE_FILL_SUCCESS })
      dispatch(createAction(
        MobActionTypes.UPDATE_WIDGET_SUCCESS,
        updateWidget(state, response.data)
      ))

      AnalyticsEvents.pressureSavedData()

      return Promise.resolve()
    })
    .catch(failure => {
      dispatch(createAction(t.WIDGET_PRESSURE_FILL_FAILURE, failure))
      return Promise.reject({ _error: `Response ${failure}` })
    })
}

const updateWidget = (state, payload) => {
  const { widget_id: id, count } = payload
  const widget = MobSelectors(state).getWidget(id)
  return { ...widget, count }
}

export default asyncFillWidget