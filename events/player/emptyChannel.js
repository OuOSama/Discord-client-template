module.exports = (player) => {
  player.events.on('emptyChannel', (queue) => {
    queue.metadata.channel.send(
      `Voice channel is empty, see ya 👋🎶`
    )
  })
}
