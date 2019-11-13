'use strict';

/**
 * Recipe.js controller
 *
 * @description: A set of functions called "actions" for managing `Recipe`.
 */
const neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver('bolt://127.0.0.1:7687', neo4j.auth.basic('neo4j', '#IAMcloud123'));
const session = driver.session();

module.exports = {

like: async (ctx, next) => {
        let recipe = await Recipe.findOne({_id: ctx.params._id});
        let isExist = recipe.likedbychefs.filter(r => {
		return r == ctx.request.body.chefId;
	});
	let likeCount = recipe.likescount;
        if (isExist.length > 0) {
            recipe.likedbychefs.splice(recipe.likedbychefs.indexOf(isExist[0], 1));
            likeCount -= 1;
        } else {
            likeCount += 1;
            recipe.likedbychefs.push(ctx.request.body.chefId);
        }

	await Recipe.update({_id: ctx.params._id}, {
		likescount: likeCount,
		likedbychefs:  recipe.likedbychefs
	});
	return strapi.services.recipe.fetch(ctx.params);
    },

exporttoneo4jdb: async ctx => {

        Recipe
            .find({})
            .populate('ingredients', 'title').populate('chef', 'name').populate('likedbychefs')
            .exec(function (err, recipes) {
                if (err) console.log('err ' + err);
                //this will log all of the users with each of their posts 
                else {
                    session
                        .run(
                            ' match (n:Recipe) DETACH DELETE n',
                            {}
                        )
                        .then(result => {
                        })
                        .catch(error => {
                            console.log(error);
                            session.close();
                            throw error;
                        });

                    // delete Recipe nodes
                    // match (n:Recipe) DETACH DELETE n
                    // match (n:Chef) DETACH DELETE n
                    recipes.forEach(function (item, index) {

                        var recipeid = item._id;
                        var recipename = item.title;
                        var recipeauthorname = item.chef.name;
                        var likes = item.likedbychefs;
			var updatedAt = item.updatedAt;
			var createdAt = item.createdAt;
           		 var likescount = item.likescount;
           		 var myDate = new Date(updatedAt);
          		  var createdAt = new Date(createdAt);

//				console.log('updatedAt -' + updatedAt);




                        session
                            .run(
                                ' CREATE (r:Recipe { title: $title , recipeid : $recipeid, updatedat : $updatedat, likescount : $likescount , createdAt : $createdAt}) RETURN r  ',
                                {
					title: recipename,
                			  recipeid: "" + recipeid,
                  			updatedat: myDate.toISOString(),
                  			likescount: likescount,
                 			 createdAt: createdAt.toISOString()

                                }
                            )
                            .then(result => {
				ctx.status = 200;
                		ctx.response.body = result;

                            })
                            .catch(error => {
                                console.log(error);
                                session.close();
                                throw error;
                            });


                        session
                            .run(
                                ' MATCH (c:Chef) , (r:Recipe) WHERE c.name = $name AND r.title = $title CREATE (c)-[r1:CREATED_BY]->(r) RETURN r1',
                                {
                                    name: recipeauthorname,
                                    title: recipename
                                }
                            )
                            .then(result => {
                            })
                            .catch(error => {
                                console.log(error);
                                session.close();
                                throw error;
                            });

                        likes.forEach(element => {
                            var chefid = element;

                            Chef.find({ _id: chefid }).exec((err, populatedchef) => {
                                var likedbychefname = populatedchef[0].name;
                                session
                                    .run(
                                        ' MATCH (c:Chef) , (r:Recipe) WHERE c.name = $name AND r.title = $title CREATE (c)-[r1:LIKED]->(r) RETURN r1',
                                        {
                                            name: likedbychefname,
                                            title: recipename
                                        }
                                    )
                                    .then(result => {
                                    })
                                    .catch(error => {
                                        console.log(error);
                                        session.close();
                                        throw error;
                                    });

                            });




                        });
                        var list = item.ingredients;
                        list.forEach(element => {
                            var ingredientname = element.name
                        });
                    });
                }
            })

return ctx;
    },
    getMostLikedRecipes: async ctx => {

var output = new Array();
    var detailed = new Array();
var query = [
      ' match (r:Recipe) WITH ',
      ' r.recipeid as recipeid, r.likescount as likescount, r.title as title, r.createdAt as createdAt , datetime() as now , (((duration.inSeconds(datetime(), ',
      ' datetime(r.createdAt))).seconds/1000)^2) as score , r.likescount/(((duration.inSeconds(datetime(),',
      ' datetime(r.createdAt))).seconds/1000)^2) as final return  recipeid, createdAt, now , score, title , likescount, final order by final desc limit 3',
    ].join('\n');

    return session
      //.run(' MATCH (c:Chef)-[:LIKED]->(r:Recipe) WITH r.title as recipename, count(*) as likecount return recipename, likecount order by likecount DESC',
      .run(query,
        {}
      )
      .then(result => {

result.records.map(record => {
          console.log(record._fields[0]);
          output.push(record._fields[0]);
          detailed.push(record);
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
   * Retrieve recipe records.
   *
   * @return {Object|Array}
   */

  find: async (ctx, next, { populate } = {}) => {
    if (ctx.query._q) {
      return strapi.services.recipe.search(ctx.query);
    } else {
      return strapi.services.recipe.fetchAll(ctx.query, populate);
    }
  },

  /**
   * Retrieve a recipe record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    return strapi.services.recipe.fetch(ctx.params);
  },


  /**
   * Create a/an recipe record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.recipe.add(ctx.request.body);
  },

  /**
   * Update a/an recipe record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.recipe.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an recipe record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.recipe.remove(ctx.params);
  }
};
