const routes = require('express').Router()
const moviesController = require('../controllers/movies')

routes.get('/', moviesController.listMovies)
routes.get('/:id', moviesController.detailMovies)

module.exports = routes
