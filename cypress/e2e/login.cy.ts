describe('Test login', () => {
	const username = 'testUser'
	const password = 'testpass'

	beforeEach(() => {
		cy.visit('http://localhost:3000/auth')
	})
	it('Login with invalid credentials', () => {
		cy.get('[data-cy="username"]').type('testUser')
		cy.get('[data-cy="password"]').type('invalidPass')
		cy.get('[data-cy="submit"]').click()
		// Ensure login fails:
		cy.location('pathname').should('not.include', '/dashboard')
		cy.get('[data-cy=user-bar]').should('not.exist')
	})

	it('Login with valid credentials', () => {
		cy.get('[data-cy="username"]').type(username, { delay: 100 }).should('have.value', username)
		cy.get('[data-cy="password"]').type(password, { delay: 100 }).should('have.value', password)
		cy.get('[data-cy="submit"]').click()

		// Ensure login is successful:
		// Successfully route to `/profile` path
		cy.location('pathname').should('include', '/dashboard')
		// Ensure user avatar is visible in navbar
		cy.get('[data-cy=user-bar]').should('be.visible')
	})
})

export {}
