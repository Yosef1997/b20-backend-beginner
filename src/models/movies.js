const db = require('../helpers/db')

exports.createMovies = (data = {}, cb) => {
  const query = db.query(`
  INSERT INTO movies
  (${Object.keys(data).join()})
  VALUES
  (${Object.values(data).map(item => `"${item}"`).join(',')})
  `, (err, res, field) => {
    if (err) throw err
    console.log(field)
    cb(res)
  })
  console.log(query.sql)
}

exports.getAllMovies = (cb) => {
  const query = db.query('SELECT * FROM movies', (err, res, field) => {
    if (err) throw err
    console.log(field)
    cb(res)
  })
  console.log(query.sql)
}

exports.getMoviesByCondition = (cond, cb) => {
  const query = db.query(`
    SELECT * FROM
    movies WHERE name LIKE "%${cond.search}%"
    ORDER BY ${cond.sort} ${cond.order}
    LIMIT ${cond.dataLimit} OFFSET ${cond.offset}
    `, (err, res, field) => {
    if (err) throw err
    // console.log(field)
    cb(res)
  })
  console.log(query.sql)
}

exports.getMovieById = (id, cb) => {
  const query = db.query(`
    SELECT * FROM movies WHERE id=${id}
  `, (err, res, field) => {
    if (err) throw err
    // console.log(field)
    cb(res)
  })
  console.log(query.sql)
}

exports.getMovieByIdAsync = (id, cb) => {
  return new Promise((resolve, reject) => {
    const query = db.query(`
    SELECT * FROM movies WHERE id=${id}
  `, (err, res, field) => {
      if (err) reject(err)
      // console.log(field)
      resolve(res)
    })
    console.log(query.sql)
  })
}

exports.deleteMovieById = (id, cb) => {
  const query = db.query(`
    DELETE FROM movies WHERE id=${id}
  `, (err, res, field) => {
    if (err) throw err
    // console.log(field)
    cb(res)
  })
  console.log(query.sql)
}

exports.deleteMovieByIdAsync = (id) => {
  return new Promise((resolve, reject) => {
    const query = db.query(`
  DELETE FROM movies WHERE id=${id}
`, (err, res, field) => {
      if (err) reject(err)
      // console.log(field)
      resolve(res)
    })
    console.log(query.sql)
  })
}

exports.updateMovie = (id, data, cb) => {
  // {name: 'apa', releaseDate: '2000-01-01'}
  const key = Object.keys(data)
  const value = Object.values(data)
  const query = db.query(`
    UPDATE movies
    SET ${key.map((item, index) => `${item}="${value[index]}"`)}
    WHERE id=${id}
  `, (err, res, field) => {
    if (err) throw err
    // console.log(field)
    cb(res)
  })
  console.log(query.sql)
}
