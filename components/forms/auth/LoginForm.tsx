import { Formik, FormikHelpers } from 'formik'
import { useAuth } from 'contexts/AuthContext'
import { SignInProps } from 'types'

const LoginForm = ({ setCreatingAcc }: { setCreatingAcc: (bool: boolean) => void }) => {
	const { signIn } = useAuth()

	const handleSubmit = async ({ username, password }: SignInProps, { setSubmitting }: FormikHelpers<SignInProps>) => {
		setSubmitting(true)
		signIn({ username, password })
		setSubmitting(false)
	}

	const handleValidation = (values: SignInProps) => {
		const errors: any = {}
		if (!values.username) {
			errors.username = 'Required'
		}
		if (!values.password) {
			errors.password = 'Required'
		}
		return errors
	}

	return (
		<Formik initialValues={{ username: '', password: '' }} validate={handleValidation} onSubmit={handleSubmit}>
			{({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => {
				return (
					<div className="w-full max-w-xs m-auto mt-20">
						<form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
							<h1 className="mb-6">Log In</h1>

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

							<div className="flex flex-col items-center mt-14">
								<button
									className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline mx-auto"
									type="submit"
									disabled={isSubmitting}
								>
									{!isSubmitting ? 'Log In' : 'Loading...'}
								</button>

								<div className="divider text-gray-600" />

								<button className="text-sm text-blue-500" onClick={() => setCreatingAcc(true)}>
									Create an account
								</button>
							</div>
						</form>
					</div>
				)
			}}
		</Formik>
	)
}
export default LoginForm
