const genreModel = require('../models/genres')

exports.createGenres = (req, res) => {
  const data = req.body
  genreModel.createGenres(data, (results) => {
    console.log(results)
    return res.json({
      success: true,
      message: 'Genre created successfully',
      results: {
        id: results.insertId,
        ...data
      }
    })
  })
}
