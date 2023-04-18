import { createStore, combineReducers } from 'redux'

import reducer from './reducer'

const indexRuducer = combineReducers({
  web: reducer
})

export default createStore(indexRuducer)