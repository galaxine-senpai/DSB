const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('DSB is online')
})

app.listen(port, () => {
  console.log(`DSB listening at http://localhost:${port}`)
})