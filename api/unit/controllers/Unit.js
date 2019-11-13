'use strict';

/**
 * Unit.js controller
 *
 * @description: A set of functions called "actions" for managing `Unit`.
 */

module.exports = {

  /**
   * Retrieve unit records.
   *
   * @return {Object|Array}
   */

  find: async (ctx, next, { populate } = {}) => {
    if (ctx.query._q) {
      return strapi.services.unit.search(ctx.query);
    } else {
      return strapi.services.unit.fetchAll(ctx.query, populate);
    }
  },

  /**
   * Retrieve a unit record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    return strapi.services.unit.fetch(ctx.params);
  },

  /**
   * Count unit records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.unit.count(ctx.query);
  },

  /**
   * Create a/an unit record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.unit.add(ctx.request.body);
  },

  /**
   * Update a/an unit record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.unit.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an unit record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.unit.remove(ctx.params);
  }
};
