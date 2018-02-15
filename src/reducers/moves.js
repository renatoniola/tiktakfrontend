import { MAKE_MOVE } from '../actions/moves/moves'

export default (state = [], { type, payload } = {}) => {
  switch (type) {

    case MAKE_MOVE :

      return payload

      default :
        return state

    }
  }
