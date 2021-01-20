// const { LIMIT_DATA, APP_URL } = process.env
const movieModel = require('../models/movies')
const genreModel = require('../models/genres')
const movieGenreModel = require('../models/movieGenres')
const multer = require('multer')
const upload = require('../helpers/upload').single('picture')

exports.listMovies = (req, res) => {
  const cond = req.query
  cond.search = cond.search || ''
  cond.page = Number(cond.page) || 1
  cond.limit = Number(cond.limit) || 5
  cond.dataLimit = cond.limit * cond.page
  cond.offset = (cond.page - 1) * cond.limit
  cond.sort = cond.sort || 'id'
  cond.order = cond.order || 'ASC'

  movieModel.getMoviesByCondition(cond, results => {
    return res.json({
      success: true,
      message: 'List of all Movies',
      results
    })
  })
}

exports.detailMovies = (req, res) => {
  const { id } = req.params
  movieModel.getMovieById(id, results => {
    if (results.length > 0) {
      return res.json({
        success: true,
        message: 'Details of Movie',
        results: results[0]
      })
    }
    return res.status(400).json({
      success: false,
      message: 'Movies not exists'
    })
  })
}

exports.createMovies = (req, res) => {
  upload(req, res, async err => {
    const data = req.body
    const selectedGenre = []
    if (err instanceof multer.MulterError) {
      return res.json({
        success: false,
        message: 'Error uploading file'
      })
    } else if (err) {
      return res.json({
        success: false,
        message: 'Error uploading file'
      })
    }
    if (typeof data.idGenre === 'object') {
      const results = await genreModel.checkGenresAsync(data.idGenre)
      if (results.length !== data.idGenre.length) {
        return res.json({
          success: false,
          message: 'Some genre are unavailable'
        })
      } else {
        results.forEach(item => {
          selectedGenre.push(item.id)
        })
      }
    } else if (typeof data.idGenre === 'string') {
      const results = await genreModel.checkGenresAsync([data.idGenre])
      if (results.length !== data.idGenre.length) {
        return res.json({
          success: false,
          message: 'Some genre are unavailable'
        })
      } else {
        results.forEach(item => {
          selectedGenre.push(item.id)
        })
      }
    }
    console.log(data)
    const movieData = {
      name: data.name,
      releaseDate: data.releaseDate,
      picture: (req.file && req.file.path) || null
    }
    const initialResult = await movieModel.createMoviesAsync(movieData)
    if (initialResult.affectedRows > 0) {
      if (selectedGenre.length > 0) {
        await movieGenreModel.createBulkMovieGenres(initialResult.insertId, selectedGenre)
      }
      const movies = await movieModel.getMovieByIdWithGenreAsync(initialResult.insertId)
      if (movies.length > 0) {
        return res.json({
          success: true,
          message: 'Movie successfully created',
          results: {
            id: movies[0].id,
            name: movies[0].name,
            releaseDate: movies[0].releaseDate,
            genres: movies.map(item => item.genreName)
          }
        })
      } else {
        return res.status(400).json({
          success: false,
          message: 'Failed to create Movie'
        })
      }
    }
  })
}

exports.deleteMovie = async (req, res) => {
  const { id } = req.params
  const initialResult = await movieModel.getMovieByIdAsync(id)
  if (initialResult.length > 0) {
    const results = await movieModel.getMovieByIdAsync(id)
    if (results) {
      return res.json({
        success: true,
        message: 'Data deleted successfully',
        results: initialResult[0]
      })
    }
  }
  return res.json({
    success: false,
    message: 'Failed to delete data'
  })
  // movieModel.getMovieById(id, (initialResult) => {
  //   if (initialResult.length > 0) {
  //     movieModel.deleteMovieById(id, results => {
  //       return res.json({
  //         success: true,
  //         message: 'Data deleted successfully',
  //         results: initialResult[0]
  //       })
  //     })
  //   } else {
  //     return res.json({
  //       success: false,
  //       message: 'Failed to delete data'
  //     })
  //   }
  // })
}

exports.updateMovie = (req, res) => {
  const { id } = req.params
  const data = req.body
  movieModel.getMovieById(id, initialResult => {
    if (initialResult.length > 0) {
      movieModel.updateMovie(id, data, results => {
        return res.json({
          success: true,
          message: 'Update data success',
          results: {
            ...initialResult[0],
            ...data
          }
        })
      })
    } else {
      return res.json({
        success: false,
        message: 'Failed to update data'
      })
    }
  })
}
