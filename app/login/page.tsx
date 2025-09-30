'use client'

import { useState, useCallback, useMemo, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { auth, db } from '@/lib/firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { PublicNavbar } from '@/components/layout/PublicNavbar'

function LoginForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const mode = searchParams.get('mode')
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const isSignUp = mode === 'signup'

  // Memoizar validação para evitar re-renders
  const isFormValid = useMemo(() => {
    if (isSignUp) {
      return email && password && name && password.length >= 6
    }
    return email && password
  }, [email, password, name, isSignUp])

  // Otimizar handleSubmit com useCallback
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isFormValid) return
    
    setIsLoading(true)
    setError('')

    try {
      if (isSignUp) {
        // CADASTRO OTIMIZADO - Operações paralelas
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user

        // Executar operações em paralelo para máxima velocidade
        const promises = []
        
        // Atualizar perfil (se necessário)
        if (name) {
          promises.push(updateProfile(user, { displayName: name }))
        }
        
        // Salvar no Firestore
        promises.push(setDoc(doc(db, 'users', user.uid), {
          name: name || user.displayName || 'Usuário',
          email: user.email,
          role: 'client',
          plan: 'basic',
          status: 'active',
          createdAt: serverTimestamp(),
          preferences: {
            language: 'pt',
            theme: 'light'
          }
        }))

        // Executar todas as operações em paralelo
        await Promise.all(promises)

        // Aguardar um momento para garantir que o estado seja atualizado
        await new Promise(resolve => setTimeout(resolve, 100))
        
        // Redirecionamento com router.push para melhor controle
        console.log('🔐 Login: Redirecionando para dashboard após CADASTRO')
        router.push('/dashboard')
      } else {
        // LOGIN OTIMIZADO
        await signInWithEmailAndPassword(auth, email, password)
        
        // Aguardar um momento para garantir que o estado seja atualizado
        await new Promise(resolve => setTimeout(resolve, 100))
        
        // Redirecionamento com router.push para melhor controle
        console.log('🔐 Login: Redirecionando para dashboard após LOGIN')
        router.push('/dashboard')
      }
    } catch (error: any) {
      console.error('Erro de autenticação:', error)
      
      // Tratamento de erro otimizado
      const errorMessages: Record<string, string> = {
        'auth/user-not-found': 'Usuário não encontrado',
        'auth/wrong-password': 'Senha incorreta',
        'auth/invalid-email': 'Email inválido',
        'auth/email-already-in-use': 'Email já está em uso',
        'auth/weak-password': 'Senha deve ter pelo menos 6 caracteres',
        'auth/too-many-requests': 'Muitas tentativas. Aguarde alguns minutos.',
        'auth/invalid-credential': 'Credenciais inválidas. Verifique email e senha.'
      }
      
      const errorCode = error.code as string
      setError(errorMessages[errorCode] || 'Erro ao fazer login. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }, [email, password, name, isSignUp, isFormValid])

  // Otimizar handlers com useCallback
  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }, [])

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }, [])

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700">
      {/* Navbar */}
      <PublicNavbar />
      
      {/* Main Content */}
      <div className="flex items-center justify-center p-4 pt-20">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block group">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
              NichoFy
            </h1>
          </Link>
          
          {/* Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6 max-w-xs mx-auto">
            <button
              onClick={() => router.push('/login')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                !isSignUp 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => router.push('/login?mode=signup')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                isSignUp 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Cadastrar
            </button>
          </div>
          
          <p className="text-gray-600">
            {isSignUp ? 'Crie sua conta gratuita' : 'Entre na sua conta'}
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome completo
              </label>
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Seu nome completo"
                required={isSignUp}
                autoComplete="name"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="seu@email.com"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Sua senha"
              required
              minLength={6}
              autoComplete={isSignUp ? "new-password" : "current-password"}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm animate-fade-in">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !isFormValid}
            className={`
              w-full font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform
              ${isLoading || !isFormValid
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 active:scale-95'
              }
            `}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                {isSignUp ? 'Criando conta...' : 'Entrando...'}
              </div>
            ) : (
              isSignUp ? 'Criar Conta' : 'Entrar'
            )}
          </button>
        </form>

        {/* Links */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
          >
            ← Voltar para o início
          </a>
        </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Carregando página de login...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}