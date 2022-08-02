import { useState, useContext } from 'react'
import { Formik } from 'formik'
import { useEffect } from 'react'
import { useAuth } from 'contexts/AuthContext'

const LoginForm = () => {
	const { user, signIn } = useAuth()

	const handleSubmit = async (credentials: { username: string; password: string }) => {
		signIn(credentials)
	}

	return (
		<Formik
			initialValues={{ username: '', password: '' }}
			validate={(values) => {
				const errors: any = {}
				if (!values.username) {
					errors.username = 'Required'
				}
				if (!values.password) {
					errors.password = 'Required'
				}
				return errors
			}}
			onSubmit={handleSubmit}
		>
			{({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => {
				return (
					<div className="w-full max-w-xs">
						<form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
							<h1 className="mb-6">Log In</h1>
							<div className="mb-6">
								<label className="block text-gray-700 mb-2">User</label>
								<input
									className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
									type="username"
									name="username"
									placeholder="username"
									onChange={handleChange}
									onBlur={handleBlur}
									value={values.username}
								/>
								<p className="text-red-500 text-xs italic">{errors.username && touched.username && errors.username}</p>
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
								<p className="text-red-500 text-xs italic">{errors.password && touched.password && errors.password}</p>
							</div>

							<div className="flex items-center justify-end">
								<button
									className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
									type="submit"
									disabled={isSubmitting}
								>
									{!isSubmitting ? 'Log In' : 'Logging in'}
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
