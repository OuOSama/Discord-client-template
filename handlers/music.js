const { readdirSync } = require('fs')
const path = require('path')

module.exports = (player) => {
  const musicEventsPath = path.join(__dirname, '../events/player')
  const musicFiles = readdirSync(musicEventsPath).filter((file) =>
    file.endsWith('.js')
  )

  for (const file of musicFiles) {
    const filePath = path.join(musicEventsPath, file)
    const MusicEventHandler = require(filePath)

    if (typeof MusicEventHandler === 'function') {
      MusicEventHandler(player)
    }
  }
}
