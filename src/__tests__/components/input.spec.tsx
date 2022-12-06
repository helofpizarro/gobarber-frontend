import React from 'react'

import Input from '../../components/Input'
import {fireEvent, render ,getByTestId} from '@testing-library/react'
import { wait } from '@testing-library/user-event/dist/utils'

jest.mock('@unform/core', () =>{
  return {
    useField() {
      return {
        fieldName: 'email',
        defaultValue: '',
        error: '',
        registerField: jest.fn()
      }
    }
  }
})

describe('Input component', () => {
  it('should be able to render an input', () => {
    const {getByPlaceholderText} = render(
      <Input name='email' placeholder='Email'/>
    )
    expect(getByPlaceholderText('Email')).toBeTruthy()
  })

  it('should render hightlight on input focus', async () => {
    const {getByPlaceholderText} = render(
      <Input name='email' placeholder='Email'/>
    )
     const inputElement = getByPlaceholderText('Email') 
     const containerElement = getByTestId('input-container') 
     
     fireEvent.focus(inputElement)
    
     await waitFor(() => {
       expect(containerElement).not.toHaveStyle('border-color: #ff9000')
       expect(containerElement).not.toHaveStyle('color: #ff9000')
     })

    fireEvent.blur(inputElement)
    
    await waitFor(() => {
      expect(containerElement).not.toHaveStyle('border-color: #ff9000')
      expect(containerElement).not.toHaveStyle('color: #ff9000')
    })

  })

  it('should keep input border hightlight when input filled', async () => {
    const {getByPlaceholderText} = render(
      <Input name='email' placeholder='Email'/>
    )
     const inputElement = getByPlaceholderText('Email') 
     const containerElement = getByTestId('input-container')
    
     fireEvent.change(inputElement, {
        target: {value: 'johndoe@example.com'}
     })
    
    fireEvent.blur(inputElement)
    
    await wait(() => {
      expect(containerElement).not.toHaveStyle('color: #ff9000')
    })

  })
})