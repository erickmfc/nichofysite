'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { auth, db } from '@/lib/firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { useToastNotifications } from '@/components/ui/Toast'

function LoginForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { success, error } = useToastNotifications()
  const mode = searchParams.get('mode')
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const isSignUp = mode === 'signup'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')

    try {
      if (isSignUp) {
        // Cadastro
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user

        // Atualizar perfil
        if (name) {
          await updateProfile(user, { displayName: name })
        }

        // Salvar no Firestore
        await setDoc(doc(db, 'users', user.uid), {
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
        })

        success('Conta Criada! 🎉', 'Bem-vindo ao NichoFy! Redirecionando para o dashboard...')
        // Redirecionar
        router.push('/dashboard')
      } else {
        // Login
        await signInWithEmailAndPassword(auth, email, password)
        success('Login Realizado! ✅', 'Bem-vindo de volta! Redirecionando...')
        router.push('/dashboard')
      }
    } catch (error: any) {
      console.error('Erro de autenticação:', error)
      
      switch (error.code) {
        case 'auth/user-not-found':
          error('Usuário não encontrado', 'Verifique o email e tente novamente.')
          break
        case 'auth/wrong-password':
          error('Senha incorreta', 'Verifique sua senha e tente novamente.')
          break
        case 'auth/invalid-email':
          error('Email inválido', 'Por favor, insira um email válido.')
          break
        case 'auth/email-already-in-use':
          error('Email já está em uso', 'Este email já possui uma conta. Tente fazer login.')
          break
        case 'auth/weak-password':
          error('Senha fraca', 'A senha deve ter pelo menos 6 caracteres.')
          break
        case 'auth/too-many-requests':
          error('Muitas tentativas', 'Aguarde alguns minutos antes de tentar novamente.')
          break
        case 'auth/invalid-credential':
          error('Credenciais inválidas', 'Verifique seu email e senha e tente novamente.')
          break
        default:
          error('Erro de autenticação', 'Ocorreu um erro inesperado. Tente novamente.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">NichoFy</h1>
          <p className="text-gray-600">
            {isSignUp ? 'Crie sua conta' : 'Entre na sua conta'}
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
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Seu nome completo"
                required={isSignUp}
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
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Sua senha"
              required
              minLength={6}
            />
          </div>

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
        <div className="mt-6 text-center space-y-2">
          <a
            href={isSignUp ? '/login' : '/login?mode=signup'}
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            {isSignUp ? 'Já tem uma conta? Entre aqui' : 'Não tem uma conta? Cadastre-se'}
          </a>
          
          <div>
            <a
              href="/"
              className="text-gray-500 hover:text-gray-700 text-sm"
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