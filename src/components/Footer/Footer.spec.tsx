import { render, screen } from '@testing-library/react'
import { Footer } from './index'

describe('Footer Component', () => {
    it('renders correctly', () => {
        render(
            <Footer />
        )
        expect(screen.getByText('Vantagem válida para compras na loja física.')).toBeInTheDocument()
        expect(screen.getByText('Shopping Mestre Álvaro - 2º piso')).toBeInTheDocument()
        expect(screen.getByText('Av. João Palácio, 300 - Eurico Salles, Serra - ES, 29160-161')).toBeInTheDocument()
    })
})