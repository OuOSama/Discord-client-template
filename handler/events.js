// handler/event.js
const fs = require('fs')
const path = require('path')

// function getAllEventFiles
function getAllEventFiles(dir) {
  let files = []
  const items = fs.readdirSync(dir, { withFileTypes: true })

  for (const item of items) {
    const fullPath = path.join(dir, item.name)
    if (item.isDirectory()) {
      files = files.concat(getAllEventFiles(fullPath))
    } else if (item.isFile() && item.name.endsWith('.js')) {
      files.push(fullPath)
    }
  }
  return files
}

module.exports = (client) => {
  const eventPath = path.join(__dirname, '../events')
  const eventFiles = getAllEventFiles(eventPath)

  for (const filePath of eventFiles) {
    const event = require(filePath)
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args))
    } else {
      client.on(event.name, (...args) => event.execute(...args))
    }
  }
}
