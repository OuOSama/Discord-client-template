module.exports = (player) => {
  player.events.on('playerStart', (queue, track) => {
    if (queue.metadata?.channel) {
      queue.metadata.channel.send(`🎵 Now playing: **${track.title}**`)
    }
  })
}
