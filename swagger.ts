import swaggerAutogen from "swagger-autogen"

const swaggerAutogenInstance = swaggerAutogen()

const outputFile = './swagger_output.json'
const endpointsFiles = ['./src/routes/api/v1/index.ts']

swaggerAutogenInstance(outputFile, endpointsFiles)