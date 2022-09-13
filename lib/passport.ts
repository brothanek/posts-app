import User, { IUser } from 'models/User'
import passport from 'passport'
import { Strategy as LocalStrategy, VerifyFunction } from 'passport-local'
import bcrypt from 'bcrypt'

const getUserByUsername = async (username: string) => {
	const user = await User.findOne({ username })
	return user
}

const authenticateUser: VerifyFunction = async (username: string, password: string, done) => {
	const user: IUser = await getUserByUsername(username)

	if (!user) {
		return done(null, false, { message: 'No user with that email' })
	}

	try {
		if (await bcrypt.compare(password, user.password)) {
			return done(null, user)
		} else {
			return done(null, false, { message: 'Password is incorrect' })
		}
	} catch (e) {
		return done(e)
	}
}

passport.serializeUser(function (user: any, cb) {
	process.nextTick(function () {
		cb(null, { id: user.id, username: user.username })
	})
})

passport.deserializeUser(function (user: any, cb) {
	process.nextTick(function () {
		return cb(null, user)
	})
})

passport.use(new LocalStrategy(authenticateUser))

export default passport
