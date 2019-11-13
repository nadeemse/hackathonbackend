'use strict';

/**
 * Recipecategory.js controller
 *
 * @description: A set of functions called "actions" for managing `Recipecategory`.
 */

module.exports = {

  /**
   * Retrieve recipecategory records.
   *
   * @return {Object|Array}
   */

  find: async (ctx, next, { populate } = {}) => {
    if (ctx.query._q) {
      return strapi.services.recipecategory.search(ctx.query);
    } else {
      return strapi.services.recipecategory.fetchAll(ctx.query, populate);
    }
  },

  /**
   * Retrieve a recipecategory record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    return strapi.services.recipecategory.fetch(ctx.params);
  },

  /**
   * Count recipecategory records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.recipecategory.count(ctx.query);
  },

  /**
   * Create a/an recipecategory record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.recipecategory.add(ctx.request.body);
  },

  /**
   * Update a/an recipecategory record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.recipecategory.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an recipecategory record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.recipecategory.remove(ctx.params);
  }
};
