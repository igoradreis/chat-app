'use client'
import { useRouter } from "next/navigation"
import { ReactNode, createContext, useContext, useState, useEffect } from "react"
import { jwtDecode } from "jwt-decode"
import { useCookies } from "react-cookie"
import socket from '@/lib/socket'

interface AuthContextType {
    user: User|null
    //userList: User[]
    //userMessages: Message[]
    nav: string|null
    error: Error|null
    //error: string|null
    login: (username: string, password: string) => Promise<void>
    logout: () => void
    
    register: () => void
    registerDB: (name: string, username: string, password: string, password_confirmation: string) => Promise<void>
    listDB: () => Promise<User[]>
    selectDB: (user_from: number|undefined, user_to: number|undefined) => Promise<Messages[]>
    insertDB: (user_from: number|undefined, user_to: number|undefined, message: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: {children: ReactNode}) => {
    const [user, setUser] = useState<User | null>(null)
    //const [userList, setUserList] = useState<User[]>([])
    //const [userMessages, setUserMessages] = useState<Message[]>([])
    const [nav, setNav] = useState<string | null>(null)
    const [error, setError] = useState<Error | null>(null)
    //const [error, setError] = useState<string | null>(null)
    const [cookie, setCookie, removeCookie] = useCookies(['token'])

    const router = useRouter()

    useEffect(() => {
        //let token = ''
        //token = cookie.token
        const token = cookie.token

        if (!token) {
            return;
        }

        console.log(token)
        let decodedToken = jwtDecode(token)
        setUser(decodedToken as User)

        socket.auth = {user: decodedToken}
        socket.connect()
    }, [router])


    const login = async (username: string, password: string) => {
        if (!username || !password) {
          return;
        }
      
        const headers = new Headers()
        headers.append('Accept', 'application/json')
        headers.append('Content-Type', 'application/json')
        const data = await fetch('http://localhost:8888/api/auth/login', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({email: username, password: password})
        })
        .then((res) => res.json())    
        .catch((e: Error) => setError(e))
        //.catch((e: Error) => setError('Erro: Login'))
        
        if (!data.token) {
          return;
        }
      
        console.log(data.token)
        let decodedToken = jwtDecode(data.token)
        setUser(decodedToken as User)

        setCookie('token', data.token, {path: '/'})
        //setNav('on')

        socket.auth = {user: decodedToken}
        socket.connect()

        router.push('/chat')
    }

    const logout = async () => {
        setUser(null)
        removeCookie('token', {path: '/'})
        router.push('/login')
    }


   const register = async () => {
      router.push('/register')
   }

   const registerDB = async (name: string, username: string, password: string, password_confirmation: string) => {
      //console.log('Valores: ' + name + username + password)

      const headers = new Headers()
      headers.append('Accept', 'application/json')
      headers.append('Content-Type', 'application/json')
      const data = await fetch('http://localhost:8888/api/auth/register', {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({name: name, email: username, password: password, password_confirmation: password_confirmation})
      })
      .then((res) => res.json())    
      .catch((e: Error) => setError(e))
      //.catch((e: Error) => setError('Erro: Register'))
      
      if (!data) {
          return;
      }

      router.push('/login')
   }


   // const listDB = async () => {
   //    const headers = new Headers()
   //    headers.append('Accept', 'application/json')
   //    headers.append('Content-Type', 'application/json')

   //    try {
   //       const data = await fetch('http://localhost:8888/api/message/list', {
   //          method: 'POST',
   //          headers: headers,
   //          body: JSON.stringify({})
   //       })
   //       const list = await data.json()
         
   //       setUserList(list as User[])
         
   //       return list
   //    }
   //    catch (error) {
   //       return []
   //    }
   // }

   const listDB = async () => {
      const headers = new Headers()
      headers.append('Accept', 'application/json')
      headers.append('Content-Type', 'application/json')

      const data = await fetch('http://localhost:8888/api/message/list', {
         method: 'POST',
         headers: headers,
         body: JSON.stringify({})
      })
      .then((res) => res.json())
      .catch((e: Error) => setError(e))
      //.catch((e: Error) => setError('Erro: List'))
      
      if (!data) {
         return;
      }

      //setUserList(data.list as User[])

      //return JSON.stringify(data.list)
      //return Promise.resolve(data.list)
      return data.list
   }


   const selectDB = async (user_from: number|undefined, user_to: number|undefined) => {
      if (!user_from || !user_to) {
         return;
      }

      console.log('Valores: ' + user_from + ' ' + user_to)
      
      const headers = new Headers()
      headers.append('Accept', 'application/json')
      headers.append('Content-Type', 'application/json')
      const data = await fetch('http://localhost:8888/api/message/select', {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({user_from: user_from, user_to: user_to})
      })
      .then((res) => res.json())
      .catch((e: Error) => setError(e))
      //.catch((e: Error) => setError('Erro: Select'))
      
      if (!data) {
          return;
      }

      //return JSON.stringify(data.messages)
      return data.messages
   }

   const insertDB = async (user_from: number|undefined, user_to: number|undefined, message: string) => {
      if (!user_from || !user_to) {
         return;
      }
      
      const headers = new Headers()
      headers.append('Accept', 'application/json')
      headers.append('Content-Type', 'application/json')
      const data = await fetch('http://localhost:8888/api/message/insert', {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({user_from: user_from, user_to: user_to, message: message})
      })
      .then((res) => res.json())    
      .catch((e: Error) => setError(e))
      //.catch((e: Error) => setError('Erro: Insert'))
      
      if (!data) {
          return;
      }

      router.push('/chat')
   }


    return (
        <AuthContext.Provider value={{user, nav, error, login, logout, register, registerDB, listDB, selectDB, insertDB}}>
            {children}
        </AuthContext.Provider>
    )
}


export const useAuth = () => {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error('Contexto Inválido')
    }

    return context
}
