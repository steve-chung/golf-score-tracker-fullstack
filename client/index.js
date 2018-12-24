require('dotenv/config')
const server = require('json-server')
const yelp = require('yelp-fusion')
const path = require('path')
const app = server.create()
const middleware = server.defaults()
const router = server.router('db.json')
const client = yelp.client(process.env.YELPKEY)
const errorHandler = require('./error')
app.use(middleware)

app.get('/api/courses', (req, response, next) => {
  client.search({
    latitude: +req.query.lat,
    longitude: +req.query.lng,
    radius: 25000,
    categories: 'golf',
    sort_by: 'distance'
  })
    .then(res => {
      console.log(res)
      return response.json(res.jsonBody.businesses)
    })
    .catch(e => {
      console.log(e)
      next(e)
    })
})
app.use('/data', router)
// app.use('/data', router)

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'src', 'index.html'))
})

app.use(errorHandler)

app.listen(process.env.PORT, () => {
  console.log('Listening on port', process.env.PORT)
})
