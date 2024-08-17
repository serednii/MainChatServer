// //LinkItem.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const linkSchema = new Schema({
    link: String
});

module.exports = mongoose.model('Link', linkSchema);

// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const linkItemSchema = new Schema({
//     link: String,
//     name: String,
//     idArticle: Number,
// });

// module.exports = linkItemSchema;


// modelsLink/LinkItem.js
// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const linkItemSchema = new Schema({
//     link: { type: String },
//     name: { type: String, required: true },
//     idArticle: { type: Number }
// });

// const LinkItem = mongoose.models.LinkItem || mongoose.model('LinkItem', linkItemSchema);
// module.exports = LinkItem;





// const { ApolloServer, gql } = require('apollo-server');

// // Схема GraphQL
// const typeDefs = gql`
//   type Query {
//     getMenu: Menu
//   }

//   type Menu {
//     level: Int
//     type: String
//     menu: [MenuItem]
//     idLinks: [LinkItem]
//   }

//   type MenuItem {
//     level: Int
//     nameMenu: String
//     type: String
//     menu: [MenuItem]
//     idLinks: [LinkItem]
//   }

//   type LinkItem {
//     link: String
//     name: String
//     idArticle: Int
//   }
// `;

// // Дані
// const data = {
//     level: 0,
//     type: "menu",
//     menu: [
//         {
//             level: 1,
//             nameMenu: "java",
//             type: null
//         },
//         {
//             level: 1,
//             nameMenu: "js",
//             type: 'menu',
//             menu: [
//                 {
//                     level: 2,
//                     nameMenu: "java",
//                     type: null
//                 },
//                 {
//                     level: 2,
//                     nameMenu: "js",
//                     type: null
//                 }
//             ]
//         },
//         {
//             level: 1,
//             nameMenu: "java",
//             type: "idLinks",
//             idLinks: [
// {
//     "link": "https://vertex-academy.com/tutorials/ru/sozdanie-peremennyx-i-tipy-peremenny/",
//         "name": "Переменные в Java"
// },
// {
//     "link": "https://javarush.com/groups/posts/peremennie-v-java",
//         "name": "Переменные в Java и константы"
// },
// {
//     "link": "https://metanit.com/java/tutorial/2.1.php",
//         "name": "Переменные и константы"
// },
// {
//     "idArticle": 1,
//         "name": "Переменные и константы"
//                 },
// {
//     "idArticle": 1,
//         "name": "Переменные и константы"
//                 }
//             ]
//         }
//     ]
// };

// // Резолвери
// const resolvers = {
//     Query: {
//         getMenu: () => data,
//     },
// };

// // Створення та запуск сервера
// const server = new ApolloServer({ typeDefs, resolvers });

// server.listen().then(({ url }) => {
//     console.log(`Server ready at ${url}`);
// });

