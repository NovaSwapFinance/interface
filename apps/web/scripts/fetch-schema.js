/* eslint-env node */

require('dotenv').config({ path: '.env.production' })
const child_process = require('child_process')
const fs = require('fs/promises')
const { promisify } = require('util')
const thegraphConfig = require('../graphql.thegraph.config')

const exec = promisify(child_process.exec)

function fetchSchema(url, outputFile) {
  exec(
    `npx --silent get-graphql-schema -h Origin=https://novaswap.fi ${url}`,
  )
    .then(({ stderr, stdout }) => {
      if (stderr) {
        throw new Error(stderr);
      } else {
        fs.writeFile(outputFile, stdout);
      }
    })
    .catch((err) => {
      console.error(err);
      console.error(`Failed to fetch schema from ${url}`);
    });
}

fetchSchema(process.env.THE_GRAPH_SCHEMA_ENDPOINT, thegraphConfig.schema)
