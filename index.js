const fs = require('fs')
const http = require('http')
const url = require('url')
const path = require('path')

// SERVER SETTINGS
const port = 7000
const host = '127.0.0.1'

/////////////////////////////////////////////////////////
// OWN-MODULES
const replaceTemplate = require('./modules/replaceTemplate')

/////////////////////////////////////////////////////////
// TEMPLATE
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8')
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8')
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8')

/////////////////////////////////////////////////////////
// DATA
const data = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8')
const dataObj = JSON.parse(data)

// CREATE SERVER
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true)

  // OVERVIEW PAGE
  if(pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    const cards = dataObj.map(el => replaceTemplate(tempCard, el)).join('')
    const viewCards = tempOverview.replace('{%PRODUCT_CARDS%}', cards)
    res.end(viewCards)

    // PRODUCT PAGE
  } else if(pathname === '/product') {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    const product = dataObj[query.id]
    const productDetails = replaceTemplate(tempProduct, product)
    res.end(productDetails)

    // API
  } else if(pathname === '/api') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(data)

    // NOT FOUND
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' })
    res.end('<h1>Page not found!!!</h1>')
  }
})

// SERVER LISTENING CONFIGS:
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`)
})