'use strict';

/**
 * Ingredientcategory.js controller
 *
 * @description: A set of functions called "actions" for managing `Ingredientcategory`.
 */

module.exports = {

  /**
   * Retrieve ingredientcategory records.
   *
   * @return {Object|Array}
   */

  find: async (ctx, next, { populate } = {}) => {
    if (ctx.query._q) {
      return strapi.services.ingredientcategory.search(ctx.query);
    } else {
      return strapi.services.ingredientcategory.fetchAll(ctx.query, populate);
    }
  },

  /**
   * Retrieve a ingredientcategory record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    return strapi.services.ingredientcategory.fetch(ctx.params);
  },

  /**
   * Count ingredientcategory records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.ingredientcategory.count(ctx.query);
  },

  /**
   * Create a/an ingredientcategory record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.ingredientcategory.add(ctx.request.body);
  },

  /**
   * Update a/an ingredientcategory record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.ingredientcategory.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an ingredientcategory record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.ingredientcategory.remove(ctx.params);
  }
};
