const jsonServer = require('json-server')
const cors = require('cors')
const db = require('./db')

const server = jsonServer.create()
const router = jsonServer.router(db())
const middlewares = jsonServer.defaults()


server.use(middlewares)
server.use(cors())
server.use(router)

server.listen(9090, () => {
  console.log('Noteful json-server started at http://localhost:9090')
})

/*Design and build a Noteful database with tables to represent folders and notes. Demonstrate how these two tables are related.

    Perform database design and normalization for the Noteful app. Sketch an Entity Relationship Diagram of the database.

    Write SQL migration scripts to create Noteful database with tables for folders and notes including relationships and CASCADES

    Write Note and Folder service objects for the new tables designed above.
    Write routers to perform CRUD operations for Notes and Folders.

    Write an Express server for the Noteful API with the endpoints /notes and /folders.

    Refactor the client application to use this API. Start by changing the URL used to 
    request data and see if that works. If not, make necessary modifications to the client application.
*/