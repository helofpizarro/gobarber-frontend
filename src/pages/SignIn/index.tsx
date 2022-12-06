import React, {useCallback, useRef} from 'react'

import * as Yup from 'yup'
import { Link, useHistory} from 'react-router-dom'
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'
import getValidationError from '../../utils/getValidationError'
import {FiLogIn, FiMail, FiLock} from 'react-icons/fi'

import { useAuth } from '../../hooks/auth'
import {useToast} from '../../hooks/toast'
import Button from '../../components/Button'
import Input from '../../components/Input'

import {Container, Content, Background, AnimationContainer} from './styles'

import logImg from '../../assets/image/logo.svg'


interface SignInFormData {
   email: string
   password: string
}

const SignIn: React.FC = () => {
   const formRef = useRef<FormHandles>(null)
   const history = useHistory()
   const { signIn} = useAuth()
   const {addToast} = useToast()
   
   const handleSubmit = useCallback( async (data: SignInFormData) => {
       
      try {
         formRef.current?.setErrors({})
         const schema = Yup.object().shape({
            email: Yup.string().required('Email obrigatório').email('Digite um email válido'),
            password: Yup.string().required('Senha obrigatória'),
         })

         await schema.validate(data, {
            abortEarly: false,
         })  
          await signIn({
            email: data.email,
            password: data.password
         })
         
         history.push('/dashboard')
      } catch (err) {
         if(err instanceof Yup.ValidationError){
            const errors = getValidationError(err as Yup.ValidationError)
            formRef.current?.setErrors(errors)
         }

         addToast({
            type: 'error',
            title: 'Erro na autenticação',
            description: 'Ocorreu um erro ao fazer login, cheque as credenciais',
         })
      }
    }, [signIn, addToast, history])   



   return (

   <Container>
      <Content>
         <AnimationContainer>
         <img src={logImg} alt='Gobarber'/>
         <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Faça seu logon</h1>

            <Input name='email' icon={FiMail}  placeholder='E-mail'/>

            <Input name='password' icon={FiLock} type='password' placeholder='Senha' />

            <Button type='submit'>Entrar</Button>

            <a href='forgot'>Esqueci a minha senha</a>
         </Form>

         <Link to='/signup'>
            <FiLogIn/>
            Criar conta
         </Link>
         </AnimationContainer>
      </Content>
      <Background/>
   </Container>    

   )
}
   


export default SignIn