import * as t from '~client/community/action-types'

const select = id => (dispatch, getState) => {
  // TODO: Save select on cross-storage
  return dispatch({ type: t.SELECT, id })
}

export default select
