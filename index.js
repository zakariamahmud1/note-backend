
const express= require('express')
const app = express()

app.use(express.json())


const cors = require('cors')

app.use(cors())

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
  }
  
  app.use(requestLogger)

let notes = [
    {
      id: 1,
      content: "HTML is easy",
      date: "2019-05-30T17:30:31.098Z",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only Javascript",
      date: "2019-05-30T18:39:34.091Z",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      date: "2019-05-30T19:20:14.298Z",
      important: true
    }
  ]
 
  app.get('/', (request, response)=>{
      response.send('<h1> Hello World!<h1>')
  })

  app.get('/api/notes', (request, response)=>{
      response.json(notes)
  })

  app.get('/api/notes/:id', (request, response)=>{
      const id = Number(request.params.id)
      console.log(id)
      const note = notes.find(note => note.id === id)
      if(note){
        response.json(note)
      }else{
          response.status(404).end()
      }
    
  })

  app.delete('/api/notes/:id', (request, response) =>{
      const id = Number(request.params.id)
     notes= notes.filter(note=> note.id !== id)
      response.status(204).end()
  })

  const generateId= () =>{
      const maxId = notes.length > 0 ? Math.max(...notes.map(note=> note.id)) : 0
      return maxId + 1
  }

  app.post('/api/notes', (request, response)=>{
    const body = request.body
    if(!body.content){
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(),
  }

  notes = notes.concat(note)

  response.json(note)
})

app.put('/api/notes/:id', (request, response) =>{
    console.log(JSON.stringify(request.body) + 'samsu bujhi nai')
    const id = Number(request.params.id)
    const newNote = request.body;
    const important = request.body.important
    if(!request.body.content) {
        return response.status(400).send({
            message: "Note content can not be empty"
        });
    }
  
  const index = notes.map(function(x) {return x.id; }).indexOf(id);
  notes[index].important = important

  const updateNote = notes.find(n=> n.id === id)
  response.json(updateNote)
  
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)

  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })