const { ApolloServer, gql } = require("apollo-server");

const typeDefs = gql`
  type Camper {
    email: ID!
    name: String!
  }
  type UserActions {
    actionOne: String
    actionTwo: String
  }

  type Query {
    me: Camper! # will say if you're logged in or not
  }

  type Mutation {
    me: UserActions # throw an error if user doesn't have a token
  }
`;

const resolvers = {
  Query: {
    me: (parent, args, { currentCamper }) => {
      if (!currentCamper) {
        throw new Error(
          "To see yourself, you must identify yourself."
        );
      }
      return currentCamper;
    }
  },
  UserActions: {
    actionOne: (parent, args, { currentCamper }) => {
      return currentCamper.name;
    },
    actionTwo: (parent, args, { currentCamper }) => {
      return currentCamper.email;
    }
  },
  Mutation: {
    me: (parent, args, { currentCamper }) => {
      if (!currentCamper) {
        throw new Error(
          "You have to be logged in to access these actions"
        );
      } else {
        return {};
      }
    }
  }
};

const context = async ({ req }) => {
  const campers = [
    {
      email: "eve@moonhighway.com",
      name: "Eve Porcello",
      token: "123"
    },
    {
      email: "alex@moonhighway.com",
      name: "Alex Banks",
      token: "124"
    },
    {
      email: "bill@moonhighway.com",
      name: "Bill Wilson",
      token: "125"
    }
  ];
  const token = req ? req.headers.authorization : null;
  const currentCamper = campers.find(
    (camper) => camper.token === token
  );
  return { campers, currentCamper };
};

const server = new ApolloServer({ typeDefs, resolvers, context });

server
  .listen()
  .then(({ url }) =>
    console.log(`Lo! Something interesting runs here: ${url}`)
  );
