'use strict';

/**
 * Chef.js controller
 *
 * @description: A set of functions called "actions" for managing `Chef`.
 */

const neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver('bolt://127.0.0.1:7687', neo4j.auth.basic('neo4j', '#IAMcloud123'));
const session = driver.session();

module.exports = {


	recommendedRecipes: async ctx => {
	
var output = new Array();
      var detailed = new Array();

        let chef = await Chef.findOne({_id: ctx.params._id});
          console.log(chef);

          var chefname = chef.name;

          var query = [
            ' MATCH (c:Chef {name: $name})-[:LIKED]->(:Recipe)<-[:LIKED]-(o:Chef)',
            ' MATCH (o)-[:LIKED]->(rec:Recipe) ' ,
            ' WHERE NOT EXISTS( (c)-[:LIKED]->(rec) )',
            ' RETURN rec',
            ' LIMIT 5',  
          ].join('\n');

          return session
          .run(
            query,
               {name : chefname}
          )
          .then(result => {
result.records.map(record => {
              detailed.push(record._fields[0]);
              output.push(record._fields[0].properties['recipeid']);
            })

            ctx.status = 200;
            ctx.response.body = {"output" : output , "detailed" : detailed};

              })
          .catch(error => {
            console.log(error);
            session.close();
            throw error;
          });
    },	







  /**
   * Retrieve chef records.
   *
   * @return {Object|Array}
   */

  find: async (ctx, next, { populate } = {}) => {
    if (ctx.query._q) {
      return strapi.services.chef.search(ctx.query);
    } else {
      return strapi.services.chef.fetchAll(ctx.query, populate);
    }
  },

  /**
   * Retrieve a chef record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    return strapi.services.chef.fetch(ctx.params);
  },

  /**
   * Count chef records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.chef.count(ctx.query);
  },

  /**
   * Create a/an chef record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.chef.add(ctx.request.body);
  },

  /**
   * Update a/an chef record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.chef.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an chef record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.chef.remove(ctx.params);
  }
};
