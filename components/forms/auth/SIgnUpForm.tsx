import { Formik } from 'formik'
import { useAuth } from 'contexts/AuthContext'
import { SignUpProps } from 'types'

const SignUpForm = ({ setCreatingAcc }: { setCreatingAcc: (bool: boolean) => void }) => {
	const { signUp } = useAuth()

	const handleSubmit = async ({ username, password, confirmPassword }: SignUpProps) => {
		signUp({ username, password, confirmPassword })
	}

	const handleValidation = (values: SignUpProps) => {
		const errors: any = {}
		if (!values.username) {
			errors.username = 'Required'
		}
		if (!values.password) {
			errors.password = 'Required'
		}
		if (values.password !== values.confirmPassword) {
			errors.confirmPassword = 'Passwords must match'
		}
		return errors
	}

	return (
		<Formik
			initialValues={{ username: '', password: '', confirmPassword: '' }}
			validate={handleValidation}
			onSubmit={handleSubmit}
		>
			{({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => {
				return (
					<div className="w-full max-w-sm m-auto mt-20">
						<form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
							<h1 className="mb-6">Sign Up</h1>

							<div className="mb-6">
								<label className="block text-gray-700 mb-2">User</label>
								<input
									className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
									type="text"
									name="username"
									placeholder="username"
									onChange={handleChange}
									onBlur={handleBlur}
									value={values.username}
								/>
								<p className="form-error">{touched.username && errors.username}</p>
							</div>

							<div className="mb-6">
								<label className="block text-gray-700 mb-2">Password</label>
								<input
									className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
									type="password"
									name="password"
									placeholder="*****"
									onChange={handleChange}
									onBlur={handleBlur}
									value={values.password}
								/>
								<p className="form-error">{touched.password && errors.password}</p>
							</div>
							<div className="mb-6">
								<label className="block text-gray-700 mb-2">Confirm Password</label>
								<input
									className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
									type="password"
									name="confirmPassword"
									placeholder="*****"
									onChange={handleChange}
									onBlur={handleBlur}
									value={values.confirmPassword}
								/>
								<p className="form-error">{touched.confirmPassword && errors.confirmPassword}</p>
							</div>

							<div className="flex flex-col items-center mt-8">
								<button
									className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
									type="submit"
									disabled={isSubmitting}
								>
									{!isSubmitting ? 'Sign Up' : 'Loading...'}
								</button>
								<div className="divider" />
								<div className="text-sm text-center">
									<span className="">Already have an account?</span>
									<br />
									<button className="text-blue-500" onClick={() => setCreatingAcc(false)}>
										Log In
									</button>
								</div>
							</div>
						</form>
					</div>
				)
			}}
		</Formik>
	)
}
export default SignUpForm
