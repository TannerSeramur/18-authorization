'use strict';

const User = require('./users-model.js');
const expiredTokens = require('./expiredTokens.js');

module.exports = (req, res, next) => {
  console.log('middleware.js');
  
  // expiredTokens.save({token: authString});
  
  // Basic am9objpqb2hubnk=
  // Bearer Token ...
  try {
    console.log('hit');
    
    let [authType, authString] = req.headers.authorization.split(/\s+/);
    
    // if(db.expiredTokens.find({token: authString}.count() > 0)){
    //   // throw 'token expired';
    //   console.log('true');
      
    // }
    console.log(authType);
    console.log(authString);



    switch( authType.toLowerCase() ) {
      case 'basic': 
        return _authBasic(authString);
      case 'bearer':
        return _authBearer(authString);
      default: 
        return _authError();
    }
  }
  catch(e) {
    console.log('Resource Not Available');
  }
  
  
  function _authBasic(str) {
    // str: am9objpqb2hubnk=
    let base64Buffer = Buffer.from(str, 'base64'); // <Buffer 01 02 ...>
    let bufferString = base64Buffer.toString();    // john:mysecret
    let [username, password] = bufferString.split(':'); // john='john'; mysecret='mysecret']
    let auth = {username,password}; // { username:'john', password:'mysecret' }
    
    return User.authenticateBasic(auth)
      .then(user => _authenticate(user) )
      .catch(next);
  }

  function _authBearer(str){
    return User.authenticateToken(str)
    .then(user => _authenticate(user))
    .catch(next)
  }

  function _authenticate(user) {
    console.log({user});
    if(user) {
      req.user = user;
      req.token = user.generateToken();
      console.log(user, "⭐️");
      
      next();
    }
    else {
      _authError();
    }
  }
  
  function _authError() {
    next('Invalid User ID/Password');
  }
  
};