import React, { useCallback, useRef } from 'react'
import {FiArrowLeft, FiMail, FiLock, FiUser} from 'react-icons/fi'
import {Form} from '@unform/web'
import * as Yup from 'yup'
import api from '../../services/api'
import getValidationError from '../../utils/getValidationError'
import { useToast } from '../../hooks/toast'
import { useHistory } from 'react-router-dom'

import Button from '../../components/Button'
import Input from '../../components/Input'

import {Container, Content, Background, AnimationContainer} from './styles'

import logImg from '../../assets/image/logo.svg'
import { FormHandles } from '@unform/core'

interface SignUpFormData {
   name: string
   email: string
   password: string   
}

const SignUp: React.FC = () => {
   const formRef = useRef<FormHandles>(null)
   const {addToast} = useToast()
   const history = useHistory()
   
   const handleSubmit = useCallback( async (data: SignUpFormData) => {
       
      try {
         formRef.current?.setErrors({})
         const schema = Yup.object().shape({
            name: Yup.string().required('Nome obrigatório'),
            email: Yup.string().required('Email obrigatório').email('Digite um email válido'),
            password: Yup.string().min(6, 'No minimo 6 digitoes'),
         })

         await schema.validate(data, {
            abortEarly: false,
         })  
         await api.post('/user', data)
         history.push('/')

         addToast({
            type: 'success',
            title: 'Cadastro realizado',
            description: 'Você já pode fazer seu logon'
         })

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
    }, [addToast, history])  

   return (
      <Container>
      <Background/>
        <Content>
         <AnimationContainer>
           <img src={logImg} alt='Gobarber'/>
           <Form ref={formRef} onSubmit={handleSubmit}>
              <h1>Faça seu cadastro</h1>
              <Input name='name' icon={FiUser} type='text' placeholder='Nome'/>
              <Input name='email' icon={FiMail} type='text' placeholder='E-mail'/>
              <Input name='password' icon={FiLock} type='password' placeholder='Senha' />
              <Button type='submit'>Cadastrar</Button>
           </Form>
  
           <a href='/'>
              <FiArrowLeft/>
              Voltar para logon
           </a>
         </AnimationContainer>
        </Content>
        
     </Container> 
   )
}

export default SignUp