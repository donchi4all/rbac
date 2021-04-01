// TEMPORARY file

import ac from 'accesscontrol';

import Database from '../database';

class AccessControl {
  private accessControl: ac.AccessControl;

  constructor () {
    this.accessControl = new ac.AccessControl();
  }
}

export default new AccessControl;