import { createRequire } from 'module'
const require = createRequire(import.meta.url)
export const products = require('../assets/products.json')

export const getMaxId = () => {
  let maxId = 0
  products?.forEach(product => {
    if (product.id > maxId) {
      maxId = product.id
    }
  })
  return maxId
}

export const getProducts = (req, res, next) => {
  try {
    res.send(products)
  } catch (error) {
    error.status = 500
    next(error)
  }
}

export const getRandomProduct = (req, res, next) => {
  try {
    const randomProduct = products[Math.floor(Math.random() * products.length)]
    res.send(randomProduct)
  } catch (error) {
    error.status = 500
    next(error)
  }
}

export const getProductById = (req, res, next) => {
  try {
    const productId = Number(req.params.id)
    const product = products.find(product => product.id === productId)
    if (product) {
      res.send(product)
    } else {
      const error = new Error(`Product with id ${productId} not found`)
      error.status = 404
      throw error
    }
  } catch (error) {
    return next(error)
  }
}

export const postProduct = (req, res, next) => {
  try {
    const newProduct = {
      title: req.body.title,
      price: req.body.price,
      thumbnail: req.body.thumbnail,
      id: getMaxId() + 1
    }
    products.push(newProduct)
    res.send(newProduct)
  } catch (error) {
    error.status = 500
    next(error)
  }
}

export const updateProduct = (req, res, next) => {
  try {
    const productId = Number(req.params.id)
    const updatedProduct = req.body
    const productIndex = products.findIndex(product => product.id === productId)

    if (~productIndex) {
      products[productIndex] = {
        ...updatedProduct,
        id: productId
      }
      res.send(products[productIndex])
    } else {
      const error = new Error(`Product with id ${productId} not found`)
      error.status = 404
      throw error
    }
  } catch (error) {
    next(error)
  }
}

export const deleteProduct = (req, res, next) => {
  try {
    const productId = Number(req.params.id)
    const productIndex = products.findIndex(product => product.id === productId)

    if (~productIndex) {
      products.splice(productIndex, 1)
      res.send(products)
    } else {
      const error = new Error(`Product with id ${productId} not found`)
      error.status = 404
      throw error
    }
  } catch (error) {
    return next(error)
  }
}
