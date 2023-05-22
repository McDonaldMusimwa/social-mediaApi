const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    version: '',      // by default: '1.0.0'
    title: 'Social Api',        // by default: 'REST API'
    description: `Social media api designed to allow users to create profile and contact business ads and find clients.On the sother hand user can reviews services and provide feedback.
    This documentation is for working with OAuth google`,  // by default: ''
  },
  host: 'social-events.onrender.com/',      // by default: 'localhost:3000'
  basePath: '',  // by default: '/'
  schemes: ['https'],   // by default: ['http']
  consumes: [],  // by default: ['application/json']
  produces: [],  // by default: ['application/json']
  tags: [        // by default: empty Array
    {
      name: '',         // Tag name
      description: '',  // Tag description
    },
    // { ... }
  ],
  securityDefinitions: {},  // by default: empty object
  definitions: {},          // by default: empty object (Swagger 2.0)
  components: {}            // by default: empty object (OpenAPI 3.x)
};

const outputFile = 'swagger-output.json';
const endpointsFiles = ['./routes/auth.js'];

/* NOTE: if you use the express Router, you must pass in the 
   'endpointsFiles' only the root file where the route starts,
   such as: index.js, app.js, routes.js, ... */

swaggerAutogen(outputFile, endpointsFiles, doc);