//==========SITE GLOBALS==================
/* setzt Globale Variablen, für die komplette Seite
 * Hier werden auch view Helper Gesetzt
 * @return {Object}
 * @api public
 */
module.exports = function(req, res) {
    res.locals.user = req.user;
    res.locals.peprMessages = req.peprFlash();
}
