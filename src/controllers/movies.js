const { LIMIT_DATA, APP_URL } = process.env

exports.listMovies = (req, res) => {
  const { page = 1, limit = LIMIT_DATA, search = null } = req.query
  const data = require('../helpers/listMovies')
  const paging = (Number(page) * limit) - limit
  const nextPage = Number(page) + 1
  let nextPageData = []
  const offset = limit * Number(page)

  let results = []

  if (search) {
    results = data.filter(movie => {
      console.log(movie.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
      return movie.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
    })
    nextPageData = results.slice(nextPage, offset)
    results = results.slice(paging, offset)
  } else {
    nextPageData = data.slice(nextPage, offset)
    results = data.slice(paging, offset)
  }

  return res.json({
    success: true,
    message: 'List of Movies',
    results,
    pageInfo: {
      totalData: results.length,
      currentPage: Number(page),
      nextLink: nextPageData.length > 0 ? `${APP_URL}/movies?page=${Number(page) + 1}` : null,
      prevLink: page > 1 ? `${APP_URL}/movies?page=${Number(page) - 1}` : null
    }
  })
}

exports.detailMovies = (req, res) => {
  return res.json({
    success: true,
    message: 'Details of Movie',
    results: {

    }
  })
}
