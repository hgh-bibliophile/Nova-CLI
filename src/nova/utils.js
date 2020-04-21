module.exports = (nova, options, signale, debug) => {
  const files = ['scss', 'js', 'prettier', 'img', 'html', 'helper']
  files.forEach((name)=> {
    let path = './utils/' + name + '-utils.js'
    require(path)(nova, options, signale, debug)
  })
}
