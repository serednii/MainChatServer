const graphql = require('graphql');
const mongoose = require('mongoose');
const { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLSchema, GraphQLList, GraphQLID } = graphql;
const { GraphQLJSON } = require('graphql-type-json');
const Menu = require('../models/Menu');
const LinkItem = require('../models/LinkItem');
const Article = require('../models/Article');
const Link = require('../models/Link');

const LinkType = new GraphQLObjectType({
    name: 'Link',
    fields: () => ({
        id: { type: GraphQLID },
        link: { type: new GraphQLNonNull(GraphQLString) },
    })
});

const ArticleType = new GraphQLObjectType({
    name: 'Article',
    fields: () => ({
        id: { type: GraphQLID },
        article: { type: new GraphQLNonNull(GraphQLString) },
    })
});

const LinkItemType = new GraphQLObjectType({
    name: 'LinkItem',
    fields: () => ({
        id: { type: GraphQLID },
        IdLink: { type: GraphQLString },
        name: { type: new GraphQLNonNull(GraphQLString) },
    })
});

const MenuType = new GraphQLObjectType({
    name: 'Menu',
    fields: () => ({
        id: { type: GraphQLID },
        idUser: { type: GraphQLString },
        menu: { type: GraphQLJSON },
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        menus: {
            type: new GraphQLList(MenuType),
            async resolve() {
                try {
                    return await Menu.find({});
                } catch (error) {
                    throw new Error("Failed to fetch menus");
                }
            }
        },

        menuByUserId: {
            type: new GraphQLList(MenuType),
            args: { idUser: { type: GraphQLString } },
            async resolve(_, args) {
                try {
                    return await Menu.find({ idUser: args.idUser });
                } catch (error) {
                    throw new Error("Failed to fetch menu by idUser");
                }
            }
        },
        linkItems: {
            type: new GraphQLList(LinkItemType),
            async resolve() {
                try {
                    return await LinkItem.find({});
                } catch (error) {
                    throw new Error("Failed to fetch link items");
                }
            }
        },
        linkItem: {
            type: LinkItemType,
            args: { id: { type: GraphQLID } },
            async resolve(_, args) {
                try {
                    return await LinkItem.findById(args.id);
                } catch (error) {
                    throw new Error("Failed to fetch link item");
                }
            }
        },
        links: {
            type: new GraphQLList(LinkType),
            async resolve() {
                try {
                    return await Link.find({});
                } catch (error) {
                    throw new Error("Failed to fetch links");
                }
            }
        },
        link: {
            type: LinkType,
            args: { id: { type: GraphQLID } },
            async resolve(_, { id }) {
                try {
                    return await Link.findById(id);
                } catch (error) {
                    throw new Error("Failed to fetch link");
                }
            }
        },
        articles: {
            type: new GraphQLList(ArticleType),
            async resolve() {
                try {
                    return await Article.find({});
                } catch (error) {
                    throw new Error("Failed to fetch articles");
                }
            }
        },
        article: {
            type: ArticleType,
            args: { id: { type: GraphQLID } },
            async resolve(_, args) {
                try {
                    return await Article.findById(args.id);
                } catch (error) {
                    throw new Error("Failed to fetch article");
                }
            }
        },
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createMenu: {
            type: MenuType,
            args: {
                idUser: { type: new GraphQLNonNull(GraphQLString) },  // idUser як ключ для пошуку
            },
            async resolve(_, { idUser }) {
                try {
                    // Спочатку спробуйте знайти існуюче меню за idUser
                    const existingMenu = await Menu.findOne({ idUser });
                    console.log(existingMenu)
                    if (!existingMenu) {
                        // Якщо меню не знайдено, створити нове
                        const newMenu = new Menu({ idUser, menu: { empty: null } });
                        return await newMenu.save();
                    } else {
                        // Якщо меню існує, оновити його
                        throw new Error("this menu already exists");
                    }
                } catch (error) {
                    throw new Error("Failed to create menu");
                }
            }
        },

        updateMenu: {
            type: MenuType,
            args: {
                idUser: { type: new GraphQLNonNull(GraphQLString) },  // idUser як ключ для пошуку
                menu: { type: new GraphQLNonNull(GraphQLJSON) }
            },
            async resolve(_, { idUser, menu }) {
                try {
                    // Спочатку спробуйте знайти існуюче меню за idUser
                    const existingMenu = await Menu.findOne({ idUser });
                    console.log(existingMenu)
                    if (existingMenu) {
                        // Якщо меню існує, оновити його
                        return await Menu.findByIdAndUpdate(existingMenu._id, { menu }, { new: true });
                    } else {
                        // Якщо меню не знайдено, створити нове
                        // const newMenu = new Menu({ idUser, menu });
                        // return await newMenu.save();
                    }
                } catch (error) {
                    throw new Error("Failed to update or create menu");
                }
            }
        },

        deleteMenu: {
            type: MenuType,
            args: {
                idUser: { type: new GraphQLNonNull(GraphQLString) },  // idUser як ключ для пошуку
            },
            async resolve(_, { idUser }) {
                try {
                    // Знайти існуюче меню за idUser
                    const existingMenu = await Menu.findOne({ idUser });

                    if (existingMenu) {
                        // Якщо меню існує, видалити його
                        return await Menu.findByIdAndDelete(existingMenu._id);
                    } else {
                        // Якщо меню не знайдено, повернути null або повідомлення
                        throw new Error("Menu not found for the specified user.");
                    }
                } catch (error) {
                    throw new Error("Failed to delete menu");
                }
            }
        },

        addLink: {
            type: LinkType,
            args: {
                link: { type: new GraphQLNonNull(GraphQLString) },
            },
            async resolve(_, { link }) {
                try {
                    const newLink = new Link({ link });
                    return await newLink.save();
                } catch (error) {
                    throw new Error("Failed to add link");
                }
            }
        },
        updateLink: {
            type: LinkType,
            args: {
                id: { type: GraphQLID },
                link: { type: new GraphQLNonNull(GraphQLString) },
            },
            async resolve(_, { id, link }) {
                try {
                    return await Link.findByIdAndUpdate(id, { link }, { new: true });
                } catch (error) {
                    throw new Error("Failed to update link");
                }
            }
        },
        deleteLink: {
            type: LinkType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
            },
            async resolve(_, { id }) {
                try {
                    return await Link.findByIdAndDelete(id);
                } catch (error) {
                    throw new Error("Failed to delete link");
                }
            }
        },
        addArticle: {
            type: ArticleType,
            args: {
                article: { type: new GraphQLNonNull(GraphQLString) },
            },
            async resolve(_, { article }) {
                try {
                    const newArticle = new Article({ article });
                    return await newArticle.save();
                } catch (error) {
                    throw new Error("Failed to add article");
                }
            }
        },
        updateArticle: {
            type: ArticleType,
            args: {
                id: { type: GraphQLID },
                article: { type: new GraphQLNonNull(GraphQLString) },
            },
            async resolve(_, { id, article }) {
                try {
                    return await Article.findByIdAndUpdate(id, { article }, { new: true });
                } catch (error) {
                    throw new Error("Failed to update article");
                }
            }
        },
        deleteArticle: {
            type: ArticleType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
            },
            async resolve(_, { id }) {
                try {
                    return await Article.findByIdAndDelete(id);
                } catch (error) {
                    throw new Error("Failed to delete article");
                }
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});
