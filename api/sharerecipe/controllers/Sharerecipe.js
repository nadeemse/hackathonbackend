'use strict';

/**
 * Sharerecipe.js controller
 *
 * @description: A set of functions called "actions" for managing `Sharerecipe`.
 */

module.exports = {

  /**
   * Retrieve sharerecipe records.
   *
   * @return {Object|Array}
   */

  find: async (ctx, next, { populate } = {}) => {
    if (ctx.query._q) {
      return strapi.services.sharerecipe.search(ctx.query);
    } else {
      return strapi.services.sharerecipe.fetchAll(ctx.query, populate);
    }
  },

  /**
   * Retrieve a sharerecipe record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    return strapi.services.sharerecipe.fetch(ctx.params);
  },

  /**
   * Count sharerecipe records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.sharerecipe.count(ctx.query);
  },

  /**
   * Create a/an sharerecipe record.
   *
   * @return {Object}
   */

create: async (ctx) => {
    const body = ctx.request.body;
    let recipe = await Recipe.findOne({_id: body.recipeId});
    let count = recipe.sharescount;
    await Recipe.update({_id: body.recipeId}, {
        sharescount: count
    });

    let share = null;
    body.chefs.forEach(chef => {
        share = strapi.services.sharerecipe.add({
            comment: body.comment,
            sharedby: body.sharedby,
            sharedwith: chef
        });
    });

    return share;
  },
  /**
   * Update a/an sharerecipe record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.sharerecipe.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an sharerecipe record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.sharerecipe.remove(ctx.params);
  }
};
