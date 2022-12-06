import React, {createContext, useContext, useCallback, useState} from 'react'
import ToastContainer from '../components/ToastContainer'

interface ToastContextDate {
  addToast(message: Omit<ToastMessage, 'id'>): void
  removeToast(id: string): void
}

interface ToastProps {
  children: React.ReactNode
}

export interface ToastMessage {
  id: string
  type?: 'success' | 'error' | 'info'
  title: string
  description?: string 
}


const ToastContext = createContext<ToastContextDate>({} as ToastContextDate) 

const ToastProvider: React.FC<ToastProps> = ({children}) => {
    const [ message, setMessage] = useState<ToastMessage[]>([])

    const addToast = useCallback(({title, description, type}: Omit<ToastMessage, 'id'>) => {
      const id = String(message.length + 1)

      const toast = {
        id,
        type,
        title,
        description,
      }

      setMessage(oldMessage => [...oldMessage, toast])

    }, [message])

    const removeToast = useCallback((id: string) => {
      setMessage(state => state.filter(message => message.id !== id))
    }, [])

  return (
    <ToastContext.Provider value={{addToast, removeToast}}>
      {children}
      <ToastContainer messages={message} />
    </ToastContext.Provider>
  )
}

function useToast(): ToastContextDate {
  const context = useContext(ToastContext)

  if(!context){
    throw new Error('useToast must be used within a ToastPtovider')
  }

  return context
}

export {ToastProvider, useToast}