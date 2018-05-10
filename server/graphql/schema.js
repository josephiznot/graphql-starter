const { buildSchema } = require("graphql");
const axios = require("axios");

let users = require(`${__dirname}/model`);

function getFilms(url) {
  return axios.get(url).then(({ data }) => new Film(data));
}

class Person {
  constructor({ id, name, height, films, homeworld }) {
    this.id = id;
    this.name = name;
    this.height = height;
    this.films = this.getFilms(films);
    this.homeworld = this.getHomeworld(homeworld);
  }
  //resolvers
  getFilms(films) {
    return films[0] ? films.map(getFilms) : [];
  }
  getHomeworld(homeworld) {
    return axios.get(homeworld).then(({ data }) => new Homeworld(data));
  }
}

class Homeworld {
  constructor({ name, population }) {
    this.name = name;
    this.population = population;
  }
}

class Film {
  constructor({ title, release_date }) {
    this.title = title;
    this.releaseDate = release_date;
  }
}

const schema = buildSchema(
  `
    type Person {
        id: Int!
        name: String
        height: Int
        films: [Film]!
        homeworld: Homeworld
    },
    type Homeworld {
        name: String!
        population: Int
    },
    type Film {
        title: String!
        releaseDate: String
    },
    type Query {
        people: [Person]!
    }
    `
);

const root = {
  people() {
    const formatted = users.map(val => new Person(val));
    return formatted;
  }
};

module.exports = {
  root,
  schema
};
