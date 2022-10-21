import { render, screen } from '@testing-library/react'
import { Input } from './Input'

describe('Footer Component', () => {
    it('renders correctly', () => {
        render(
            <Input placeholder='name' name='name' className='inputName' />
        )
        expect(screen.getByPlaceholderText('name')).toHaveClass('inputName')
    })
})