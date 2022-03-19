import express from 'express'
import productRouter from './src/Routes/products.routes.js'
import { engine } from 'express-handlebars'
import { products, getMaxId } from './src/Controllers/products.controllers.js'
import path from 'path'

const app = express()
const PORT = 8080
const __dirname = path.resolve()

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🔥🔥🔥`)
})
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: 'layout.hbs',
  layoutsDir: __dirname + '/src/Views/Layouts',
  partialsDir: __dirname + '/src/Views/Partials'
}))
app.set('view engine', 'hbs')
app.set('views', __dirname + '/src/Views/Layouts')

app.get('/products', (req, res) => {
  res.render('layout', { products })
})
app.post('/products', (req, res) => {
  const newProduct = {
    title: req.body.title,
    price: req.body.price,
    thumbnail: req.body.thumbnail,
    id: getMaxId() + 1
  }
  products.push(newProduct)
  res.redirect('/products')
})

app.use('/api', productRouter)

app.use(function (err, req, res, next) {
  console.log(err)
  res.status(err.status).send({ err: err.message })
})
