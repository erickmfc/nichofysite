'use client'

import { useState, useCallback, useMemo, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { auth, db } from '@/lib/firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { PublicNavbar } from '@/components/layout/PublicNavbar'
import { useToast } from '@/components/ui/Toast'

function LoginForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const mode = searchParams.get('mode')
  const { addToast } = useToast()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isSignUp = mode === 'signup'

  const isFormValid = useMemo(() => {
    if (isSignUp) {
      return email.length > 0 && password.length > 0 && name.length > 0
    }
    return email.length > 0 && password.length > 0
  }, [email, password, name, isSignUp])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    console.log('🔐 Tentativa de login:', { email, isSignUp })

    try {
      if (isSignUp) {
        console.log('📝 Criando nova conta...')
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        console.log('✅ Usuário criado:', userCredential.user.uid)
        
        await updateProfile(userCredential.user, { displayName: name })
        console.log('👤 Perfil atualizado')
        
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          uid: userCredential.user.uid,
          email: email,
          displayName: name,
          createdAt: serverTimestamp(),
          role: 'user',
        })
        console.log('💾 Dados salvos no Firestore')
        
        addToast({
          type: 'success',
          title: 'Conta criada!',
          message: 'Sua conta foi criada com sucesso. Faça login para continuar.',
        })
        router.push('/login')
      } else {
        console.log('🔑 Fazendo login...')
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        console.log('✅ Login bem-sucedido:', userCredential.user.uid)
        
        addToast({
          type: 'success',
          title: 'Login bem-sucedido!',
          message: 'Você foi redirecionado para o dashboard.',
        })
        router.push('/dashboard')
      }
    } catch (error: any) {
      console.error('❌ Erro de autenticação:', error)
      console.error('❌ Código do erro:', error.code)
      console.error('❌ Mensagem do erro:', error.message)
      
      const errorMessages: { [key: string]: string } = {
        'auth/email-already-in-use': 'Este e-mail já está em uso.',
        'auth/invalid-email': 'Formato de e-mail inválido.',
        'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
        'auth/user-not-found': 'Usuário não encontrado. Verifique seu e-mail.',
        'auth/wrong-password': 'Senha incorreta. Tente novamente.',
        'auth/invalid-credential': 'Credenciais inválidas. Verifique email e senha.',
        'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
        'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.',
        'auth/user-disabled': 'Esta conta foi desabilitada.',
        'auth/operation-not-allowed': 'Operação não permitida.',
      }

      const errorCode = error.code as string
      const errorMessage = errorMessages[errorCode] || 'Erro ao fazer login. Tente novamente.'
      
      setError(errorMessage)
      addToast({
        type: 'error',
        title: 'Erro de autenticação',
        message: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }, [email, password, name, isSignUp, isFormValid, addToast, router])

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
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="flex min-h-screen">
        {/* Left Side - Promotional */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-32 h-32 bg-teal-300/20 rounded-full blur-xl"></div>
            <div className="absolute top-40 right-32 w-24 h-24 bg-cyan-300/20 rounded-full blur-lg"></div>
            <div className="absolute bottom-32 left-40 w-40 h-40 bg-blue-300/20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-20 right-20 w-28 h-28 bg-teal-300/20 rounded-full blur-xl"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-center px-16 text-white">
            <h2 className="text-5xl font-bold mb-4 leading-tight">
              Sua marca, sua voz.
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Conteúdo criado por especialistas, para você.
            </p>

            {/* Simple Animation */}
            <div className="relative w-full h-64 overflow-hidden">
              {/* Briefing Card */}
              <div className="absolute bottom-4 left-4 bg-white/15 backdrop-blur-md rounded-xl p-4 max-w-xs border border-white/20 animate-pulse">
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 bg-blue-400 rounded-full mr-2"></div>
                  <span className="text-sm font-medium text-white">Cliente</span>
                </div>
                <p className="text-white/90 text-sm">"Preciso de um post para o Dia dos Pais na minha barbearia"</p>
              </div>

              {/* Post Final */}
              <div className="absolute top-8 right-8 bg-white/20 backdrop-blur-md rounded-xl p-4 max-w-xs border border-white/30 animate-bounce">
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 bg-orange-500 rounded-full mr-2"></div>
                  <span className="text-sm font-medium text-white">Barbearia Estilo</span>
                </div>
                <p className="text-white/90 text-sm mb-2">🎁 Dia dos Pais chegando!</p>
                <p className="text-white/80 text-xs">Presenteie seu pai com um corte especial. Agende já!</p>
                <div className="flex items-center mt-2 space-x-2 text-xs text-white/70">
                  <span>❤️</span>
                  <span>💬</span>
                  <span>📤</span>
                </div>
              </div>

              {/* Process Indicator */}
              <div className="absolute bottom-8 right-8 flex space-x-1">
                <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <div className="w-2 h-2 bg-white/80 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-8">
              <Link href="/" className="inline-block group mb-6">
                <h1 className="text-3xl font-bold text-blue-600 group-hover:text-blue-700 transition-colors duration-200">
                  NichoFy
                </h1>
              </Link>

              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {isSignUp ? 'Criar conta' : 'Bem-vindo(a) de volta!'}
              </h2>
              <p className="text-gray-600">
                {isSignUp ? 'Comece sua jornada criativa hoje' : 'Entre na sua conta para continuar criando'}
              </p>
            </div>

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

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Google Login Button */}
              <button
                type="button"
                onClick={() => addToast({ type: 'info', title: 'Em desenvolvimento', message: 'Login com Google em breve!' })}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Entrar com Google
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">ou</span>
                </div>
              </div>

              {/* Form Fields */}
              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome completo
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={handleNameChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Seu nome completo"
                    autoComplete="name"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seu e-mail
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="seu@email.com"
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sua senha
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Sua senha"
                    autoComplete={isSignUp ? "new-password" : "current-password"}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              {!isSignUp && (
                <div className="text-right">
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
                    Esqueci minha senha
                  </a>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  isFormValid && !isLoading
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {isSignUp ? 'Criando conta...' : 'Entrando...'}
                  </div>
                ) : (
                  isSignUp ? 'Criar conta' : 'Entrar'
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                {isSignUp ? 'Já tem uma conta?' : 'Ainda não tem uma conta?'}
                <button
                  onClick={() => router.push(isSignUp ? '/login' : '/login?mode=signup')}
                  className="ml-1 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  {isSignUp ? 'Entrar' : 'Começar Agora'}
                </button>
              </p>

              <p className="text-xs text-gray-500 mt-4">
                Ao continuar, você concorda com nossos{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700">Termos de Uso</a>
                {' '}e{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700">Política de Privacidade</a>
              </p>
            </div>
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