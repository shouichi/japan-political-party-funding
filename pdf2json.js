'use strict'

const MapUtility = require('./lib/map-utility')
const RawParser = require('./lib/raw-parser')
const RawFormatter = require('./lib/raw-formatter')

/**
 * Main function.
 */
async function main() {
  try {
    const pdfPaths = process.argv.slice(2)

    const parser = new RawParser()
    const text = await parser.parse(pdfPaths)

    const formatter = new RawFormatter(text)
    const result = await formatter.format()

    const mapUtility = new MapUtility()
    const json = await mapUtility.toObject(result)
    console.log(JSON.stringify(json))
  } catch (error) {
    console.log(error)
  }
}
main()
