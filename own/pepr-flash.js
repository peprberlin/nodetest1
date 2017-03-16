/**
 * Module dependencies.
 * DAS IST NUR ZUM TESTEN KOPIERT AUS 
 * https://github.com/jaredhanson/connect-flash/blob/master/lib/flash.js
 */
var format = require('util').format;
var isArray = require('util').isArray;
var debug = require('debug')('nodetest1:pepr-flash');

/**
 * Expose `peprFlash()` function on requests.
 *
 * @return {Function}
 * @api public
 */
module.exports = function peprFlash(options) {
  options = options || {};
  var safe = (options.unsafe === undefined) ? true : !options.unsafe;
  debug('init peprFlash!');
  return function(req, res, next) {
    if (req.flash && safe) { return next(); }
    req.peprFlash = _flash;
    next();
  }
}

/**
 * Queue flash `msg` of the given `type`.
 *
 * Examples:
 *
 *      req.flash('info', 'email sent');
 *      req.flash('error', 'email delivery failed');
 *      req.flash('info', 'email re-sent');
 *      // => 2
 *
 *      req.flash('info');
 *      // => ['email sent', 'email re-sent']
 *
 *      req.flash('info');
 *      // => []
 *
 *      req.flash();
 *      // => { error: ['email delivery failed'], info: [] }
 *
 * Formatting:
 *
 * Flash notifications also support arbitrary formatting support.
 * For example you may pass variable arguments to `req.flash()`
 * and use the %s specifier to be replaced by the associated argument:
 *
 *     req.flash('info', 'email has been sent to %s.', userName);
 *
 * Formatting uses `util.format()`, which is available on Node 0.6+.
 *
 * @param {String} type
 * @param {String} msg
 * @return {Array|Object|Number}
 * @api public
 */
function _flash(type, msg) {
  if (this.session === undefined) throw Error('req.peprFlash() requires sessions');
  var msgs = this.session.peprFlash = this.session.peprFlash || {};
  if (type && msg) {
    // util.format is available in Node.js 0.6+
    if (arguments.length > 2 && format) {
      var args = Array.prototype.slice.call(arguments, 1);
      msg = format.apply(undefined, args);
    } else if (isArray(msg)) {
      msg.forEach(function(val){
        (msgs[type] = msgs[type] || []).push(val);
      });
      return msgs[type].length;
    }
    return (msgs[type] = msgs[type] || []).push(msg);
  } else if (type) {
    var arr = msgs[type];
    delete msgs[type];
    return arr || [];
  } else {
    this.session.peprFlash = {};
    return msgs;
  }
}
