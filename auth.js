/**
 * @file The auth file implements the authentication login registered user 
 * @requires passport implements HTTP authentication
 * @requires jwt To generate JWT using username to authorizing the endpoints
 */ 


const jwtSecret = 'your_jwt_secret';
const jwt = require('jsonwebtoken'),
  passport = require('passport');

require('./passport');
/**
 * @function generateJWTToken
 * @param {user} user attempts login with username and password
 * @returns {string} JSON wen token.
 */

let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username,
    // This is the username you’re encoding in the JWT
    expiresIn: '7d',
    // This specifies that the token will expire in 7 days
    algorithm: 'HS256'
    // This is the algorithm used to “sign” or encode the values of the JWT
  });
}

/**
 * POST login process
 * Check that the username and password in the body of the request exist in the database. 
 * If they do, you use the generateJWTToken(); 
 * function to create a JWT based on the username and password, 
 * which you then send back as a response to the client
 * @function
 * @param {router} 
 * @returns {Object} An object conatining logged user and JWT data
 */

module.exports = (router) => {
  router.use(passport.initialize());
  //Important! Without using this line of code it will throw an error when trying to login with Postman due to updated passport dependency:Changelog Passport 0.5.0 -2021-09-23
  router.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(401).json({
          message: 'Something is not right',
          user: user
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
}