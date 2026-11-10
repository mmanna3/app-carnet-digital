import React from 'react'
import { render, screen } from '@testing-library/react-native'
import HomeMobile from '@/home/home'

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
}))
jest.mock('@/lib/config/liga', () => ({
  getColorLiga600: () => '#16a34a',
  useConfigLiga: () => ({ leagueId: 'edefi', leagueDisplayName: 'EDeFI' }),
}))

describe('Home', () => {
  it('muestra las cards públicas', () => {
    render(<HomeMobile />)
    expect(screen.getByTestId('card-resultados')).toBeTruthy()
    expect(screen.getByTestId('card-fichaje')).toBeTruthy()
    expect(screen.getByTestId('card-delegados')).toBeTruthy()
  })

  it('no muestra la card de árbitros: al registro se entra solo por el link', () => {
    render(<HomeMobile />)
    expect(screen.queryByTestId('card-arbitros')).toBeNull()
    expect(screen.queryByText('Árbitros')).toBeNull()
  })
})
