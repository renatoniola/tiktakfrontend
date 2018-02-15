import API from '../../api/client'

export const MAKE_MOVE = 'MAKE_MOVE'

const api = new API()

export default (data) => {
  return (dispatch) => {
    dispatch({ type: MAKE_MOVE })

    api.post('/turns', data)
      .then(() => {

      })
      .catch((error) => {
        console.log(error)
      })
  }
}
