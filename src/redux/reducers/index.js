

import { combineReducers } from 'redux';

import sidemenu from './sidemenu';
import Types from '../actions/actionTypes'
import event from './event';

const appReducers = {
  sidemenu,
  event
};

export default function createReducers() {
  return combineReducers(appReducers);
}