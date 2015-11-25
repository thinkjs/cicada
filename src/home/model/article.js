'use strict';
/**
 * model
 */
export default class extends think.model.relation {
  /**
   * relation
   * @type {Object}
   */
  relation = {
    snapshot: think.model.HAS_ONE,
    tag: think.model.MANY_TO_MANY
  }
}