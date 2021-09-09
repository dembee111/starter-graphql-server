const { gql } = require("apollo-server-express");

const me = () => "Hello world 2479900";

module.exports = {
  Query: {
    me,
  },
};
