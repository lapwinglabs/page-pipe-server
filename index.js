/**
 * Environment variables
 */

require('localenv');

var envvar = require('envvar');
envvar.string('ALCHEMY_KEY');
envvar.string('READABILITY_PARSER_KEY');

/**
 * Module Dependencies
 */

var roo = require('roo')(__dirname);
var Pagepipe = require('page-pipe');
var port = process.env.PORT || 5000;
var throng = require('throng');

/**
 * Plugins
 *
 * TODO: move these into separate repos
 */

var readability = require('page-pipe/plugins/readability');
var alchemy = require('page-pipe/plugins/alchemy');
var tika = require('page-pipe/plugins/tika');

/**
 * Setup the page pipe
 */

var pagepipe = Pagepipe()
  .use(alchemy({ key: process.env.ALCHEMY_KEY }))
  .use(readability({ key: process.env.READABILITY_PARSER_KEY }))
  .use(tika());


/**
 * /:url
 */

roo.get(/\/(.+)/, function *(next) {
  var url = this.params[0];
  console.log(url);
  if (!url) return yield next;

  // run the page pipe
  // TODO: yieldable
  this.body = yield function(done) {
    pagepipe(url, done);
  }
})

/**
 * /
 */

roo.get('/', function *(next) {
  this.body = 'hello from the page pipe!';
});

/**
 * Listen
 */

throng(function listen() {
  roo.listen(port, function() {
    var addr = this.address();
    console.log('listening on [%s]:%d', addr.address, addr.port);
  })
}, { lifetime: Infinity });
