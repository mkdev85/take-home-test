const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['./src/routes/api/v1/index.ts']

swaggerAutogen(outputFile, endpointsFiles)