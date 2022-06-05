const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')


async function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
    const user = await getUserByEmail(email)
    // console.log(user)
    if (user == null) {
      return done(null, false, { message: 'No user with that Email' })
    }

    try {
      if (await bcrypt.compare(password, user.Password)) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Password incorrect' })
      }
    } catch (e) {
      return done(e)
    }
  }
  // const getUserByIdv = await getUserById(id)
  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
  passport.serializeUser((user, done) => {
  done(null, user.Id)
})
  passport.deserializeUser((id, done) => {
    getUserById(id).then(user=>{
    return done(null, user)
    })
  })
}

module.exports = initialize