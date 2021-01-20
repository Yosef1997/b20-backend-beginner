const routes = require('express').Router()
const genresController = require('../controllers/genres')

routes.post('/', genresController.createGenres)

module.exports = routes
