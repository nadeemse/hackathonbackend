'use strict';

/**
 * Recipecomments.js controller
 *
 * @description: A set of functions called "actions" for managing `Recipecomments`.
 */

module.exports = {

  /**
   * Retrieve recipecomments records.
   *
   * @return {Object|Array}
   */

  find: async (ctx, next, { populate } = {}) => {
    if (ctx.query._q) {
      return strapi.services.recipecomments.search(ctx.query);
    } else {
      return strapi.services.recipecomments.fetchAll(ctx.query, populate);
    }
  },

  /**
   * Retrieve a recipecomments record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    return strapi.services.recipecomments.fetch(ctx.params);
  },

  /**
   * Count recipecomments records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.recipecomments.count(ctx.query);
  },

  /**
   * Create a/an recipecomments record.
   *
   * @return {Object}
   */

   create: async (ctx) => {
    const body = ctx.request.body;
    let recipe = await Recipe.findOne({_id: body.recipeId});
    let count = recipe.commentscount;
    count += 1;
    await Recipe.update({_id: body.recipeId}, {
            commentscount:  count
    });
    return strapi.services.recipecomments.add(body);
  },

  /**
   * Update a/an recipecomments record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.recipecomments.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an recipecomments record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.recipecomments.remove(ctx.params);
  }
};
