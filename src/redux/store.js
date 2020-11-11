import { createStore } from 'redux'
import graphReducer from './graph';

const store = createStore(graphReducer)

export default store;
