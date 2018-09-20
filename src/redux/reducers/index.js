

import { combineReducers } from 'redux';

import sidemenu from './sidemenu';
import Types from '../actions/actionTypes'

const appReducers = {
  sidemenu,
};

export default function createReducers() {
  return combineReducers(appReducers);
}