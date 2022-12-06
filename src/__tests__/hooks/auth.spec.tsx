import { renderHook } from "@testing-library/react"
import { AuthProvider, useAuth } from "../../hooks/auth"
import MockAdapter from 'axios-mock-adapter'
import api from '../../services/api'

const apiMock = new MockAdapter(api)

describe('Auth hook', () => {
  it('should be able to sign in', async () => {
    const apiReponse = {
        user: {
          id: 'user-123',
          name: 'John Doe',
          email: 'johndoe@example.com.br'
        },
        token: 'token-123'
     
    }

     apiMock.onPost('sessions').reply(200, apiReponse) 
     
     const setIntemSpy = jest.spyOn(Storage.prototype, 'setItem')

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    })

    result.current.signIn({
      email: 'johndoe@example.com.br',
      password: '123456'
    })

    await waitForNextUpdate()

    expect(setIntemSpy).toHaveBeenCalledWith('@Gobaber: token', apiReponse.token)
    expect(setIntemSpy).toHaveBeenCalledWith('@Gobaber: user', JSON.stringify(apiReponse.user))
    expect(result.current.user.email).toEqual('johndoe@example.com.br')
  })
})