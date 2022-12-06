import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'
import SignIn from '../../pages/SignIn'

const mockedHistoryPush = jest.fn()
const mockAddToast = jest.fn()
const mockSignIn = jest.fn()

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    Link: ({children}: {children: React.ReactNode}) => children,
  }
})

jest.mock('../../hooks/auth', () => {
  return {
    useAuth: () => ({
      signIn: jest.fn(),
    })
  }
})

jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      addToast: mockAddToast
    })
  }
})


describe('SignIn Page', () => {
    beforeEach(() => {
      mockedHistoryPush.mockClear()
    })

  it('should be able to sign in' , async () => {
    const {getByPlaceholderText, getByText} = render(<SignIn/>)

    const emailField = getByPlaceholderText('E-mail')
    const passwordField = getByPlaceholderText('Senha')
    const buttonElement = getByText('Entrar')
    
    fireEvent.change(emailField, {target: {value: 'johndoe@example'}})

    fireEvent.change(passwordField, {target: {value: '1234'}})

    fireEvent.click(buttonElement)

    await waitFor(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard')

    })
    
  })

  it('should be able to sign in with invalid credentials' , async () => {
    const {getByPlaceholderText, getByText} = render(<SignIn/>)

    const emailField = getByPlaceholderText('E-mail')
    const passwordField = getByPlaceholderText('Senha')
    const buttonElement = getByText('Entrar')
    
    fireEvent.change(emailField, {target: {value: 'not-valid-email'}})

    fireEvent.change(passwordField, {target: {value: '1234'}})

    fireEvent.click(buttonElement)

    await waitFor(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled()

    })
    
  })

  it('should display a error if login fails' , async () => {
      mockSignIn.mockImplementation(() => {
        throw new Error()
      })

  
    const {getByPlaceholderText, getByText} = render(<SignIn/>)

    const emailField = getByPlaceholderText('E-mail')
    const passwordField = getByPlaceholderText('Senha')
    const buttonElement = getByText('Entrar')
    
    fireEvent.change(emailField, {target: {value: 'johndoe@example'}})

    fireEvent.change(passwordField, {target: {value: '1234'}})

    fireEvent.click(buttonElement)

    await waitFor(() => {
      expect(mockAddToast).not.toHaveBeenCalledWith(expect.objectContaining({
        type: 'error'
      }))

    })
    
  })
})