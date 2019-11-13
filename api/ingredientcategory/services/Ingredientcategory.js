'use strict';

/* global Ingredientcategory */

/**
 * Ingredientcategory.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

// Public dependencies.
const _ = require('lodash');
const { convertRestQueryParams, buildQuery } = require('strapi-utils');

module.exports = {

  /**
   * Promise to fetch all ingredientcategories.
   *
   * @return {Promise}
   */

  fetchAll: (params, populate) => {
    const filters = convertRestQueryParams(params);
    const populateOpt = populate || Ingredientcategory.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias)

    return buildQuery({
      model: Ingredientcategory,
      filters,
      populate: populateOpt,
    });
  },

  /**
   * Promise to fetch a/an ingredientcategory.
   *
   * @return {Promise}
   */

  fetch: (params) => {
    // Select field to populate.
    const populate = Ingredientcategory.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias)
      .join(' ');

    return Ingredientcategory
      .findOne(_.pick(params, _.keys(Ingredientcategory.schema.paths)))
      .populate(populate);
  },

  /**
   * Promise to count ingredientcategories.
   *
   * @return {Promise}
   */

  count: (params) => {
    const filters = convertRestQueryParams(params);

    return buildQuery({
      model: Ingredientcategory,
      filters: { where: filters.where },
    })
      .count()
  },

  /**
   * Promise to add a/an ingredientcategory.
   *
   * @return {Promise}
   */

  add: async (values) => {
    // Extract values related to relational data.
    const relations = _.pick(values, Ingredientcategory.associations.map(ast => ast.alias));
    const data = _.omit(values, Ingredientcategory.associations.map(ast => ast.alias));

    // Create entry with no-relational data.
    const entry = await Ingredientcategory.create(data);

    // Create relational data and return the entry.
    return Ingredientcategory.updateRelations({ _id: entry.id, values: relations });
  },

  /**
   * Promise to edit a/an ingredientcategory.
   *
   * @return {Promise}
   */

  edit: async (params, values) => {
    // Extract values related to relational data.
    const relations = _.pick(values, Ingredientcategory.associations.map(a => a.alias));
    const data = _.omit(values, Ingredientcategory.associations.map(a => a.alias));

    // Update entry with no-relational data.
    const entry = await Ingredientcategory.updateOne(params, data, { multi: true });

    // Update relational data and return the entry.
    return Ingredientcategory.updateRelations(Object.assign(params, { values: relations }));
  },

  /**
   * Promise to remove a/an ingredientcategory.
   *
   * @return {Promise}
   */

  remove: async params => {
    // Select field to populate.
    const populate = Ingredientcategory.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias)
      .join(' ');

    // Note: To get the full response of Mongo, use the `remove()` method
    // or add spent the parameter `{ passRawResult: true }` as second argument.
    const data = await Ingredientcategory
      .findOneAndRemove(params, {})
      .populate(populate);

    if (!data) {
      return data;
    }

    await Promise.all(
      Ingredientcategory.associations.map(async association => {
        if (!association.via || !data._id || association.dominant) {
          return true;
        }

        const search = _.endsWith(association.nature, 'One') || association.nature === 'oneToMany' ? { [association.via]: data._id } : { [association.via]: { $in: [data._id] } };
        const update = _.endsWith(association.nature, 'One') || association.nature === 'oneToMany' ? { [association.via]: null } : { $pull: { [association.via]: data._id } };

        // Retrieve model.
        const model = association.plugin ?
          strapi.plugins[association.plugin].models[association.model || association.collection] :
          strapi.models[association.model || association.collection];

        return model.update(search, update, { multi: true });
      })
    );

    return data;
  },

  /**
   * Promise to search a/an ingredientcategory.
   *
   * @return {Promise}
   */

  search: async (params) => {
    // Convert `params` object to filters compatible with Mongo.
    const filters = strapi.utils.models.convertParams('ingredientcategory', params);
    // Select field to populate.
    const populate = Ingredientcategory.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias)
      .join(' ');

    const $or = Object.keys(Ingredientcategory.attributes).reduce((acc, curr) => {
      switch (Ingredientcategory.attributes[curr].type) {
        case 'integer':
        case 'float':
        case 'decimal':
          if (!_.isNaN(_.toNumber(params._q))) {
            return acc.concat({ [curr]: params._q });
          }

          return acc;
        case 'string':
        case 'text':
        case 'password':
          return acc.concat({ [curr]: { $regex: params._q, $options: 'i' } });
        case 'boolean':
          if (params._q === 'true' || params._q === 'false') {
            return acc.concat({ [curr]: params._q === 'true' });
          }

          return acc;
        default:
          return acc;
      }
    }, []);

    return Ingredientcategory
      .find({ $or })
      .sort(filters.sort)
      .skip(filters.start)
      .limit(filters.limit)
      .populate(populate);
  }
};
