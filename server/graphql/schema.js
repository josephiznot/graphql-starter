const { buildSchema } = require("graphql");
const axios = require("axios");
const express = require("express");
const app = express();
const massive = require("massive");

massive(process.env.DATABASE_KEY).then(db => {
  app.set("db", db);
});

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
        person(id: Int!): Person!
    },
    type Mutation {
        signup(userName: String!, password: String!): Int
    }
    `
);

const root = {
  //root is almost like controller
  //queries go in root
  //queries send back a single object called args...so destructure them

  people() {
    return users.map(val => {
      // console.log(val);
      return new Person(val);
    });
  },
  person({ id }) {
    console.log("person");
    const selected = users.filter(val => val.id === id)[0];
    //array of one
    if (!selected) throw new Error(`No Person matching i: ${id}`);
    //Throw an error if doesnt exist
    return new Person(selected);
  },
  //A mutation is just another root resolver
  deletePerson({ id }) {
    users = users.filter(val => val.id !== id);
    return id;
  }
};

module.exports = {
  root,
  schema
};
