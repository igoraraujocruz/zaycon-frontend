import { render, screen } from '@testing-library/react'
import Product, { getServerSideProps } from '../../pages/product/[productSlug]'

describe('Product Page', () => {
    it('teste222', async () => {
        const response = await getServerSideProps({
            params: {
                productSlug: 'productSlug'
            }
        } as any)

        expect(response).toEqual(expect.objectContaining({
            props: {
                productSlug: "productSlug"
            }
        }))
    })
})