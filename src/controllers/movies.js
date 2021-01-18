const { LIMIT_DATA, APP_URL } = process.env

exports.listMovies = (req, res) => {
  const { limit = LIMIT_DATA, search = null } = req.query
  let { page = 1 } = req.query
  if (typeof (page) !== 'number') {
    page = Number(page)
  }
  const data = require('../helpers/listMovies')
  const paging = (page * limit) - limit
  const offset = limit * page
  const nextPage = ((page + 1) * limit) - limit
  const nextPageOffset = limit * (page + 1)
  let nextPageData = []

  let results = []

  if (search) {
    results = data.filter(movie => {
      console.log(movie.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
      return movie.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
    })
    nextPageData = results.slice(nextPage, nextPageOffset)
    results = results.slice(paging, offset)
  } else {
    nextPageData = data.slice(nextPage, nextPageOffset)
    // console.log(nextPageData)
    results = data.slice(paging, offset)
  }

  return res.json({
    success: true,
    message: 'List of Movies',
    results,
    pageInfo: {
      totalData: results.length,
      currentPage: page,
      nextLink: nextPageData.length > 0 ? `${APP_URL}/movies?page=${page + 1}` : null,
      prevLink: page > 1 ? `${APP_URL}/movies?page=${page - 1}` : null
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
