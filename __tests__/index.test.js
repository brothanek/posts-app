import React from 'react'
// Using render and screen from test-utils.js instead of
// @testing-library/react
import { render, screen } from '@testing-library/react'
import Home from '@pages/index'

describe('HomePage', () => {
	it('renders a heading', () => {
		render(<Home />)

		const heading = screen.getByRole('heading', {
			name: /Recent articles/i,
		})
		// we can only use toBeInTheDocument because it was imported
		// in the jest.setup.js and configured in jest.config.js
		expect(heading).toBeInTheDocument()
	})
})
