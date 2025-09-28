'use client'

import { useState, Suspense } from 'react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { auth, db } from '@/lib/firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { GoogleLoginButton } from '@/components/ui/GoogleLoginButton'
import { CredentialsDiagnostic } from '@/components/ui/CredentialsDiagnostic'

function LoginForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const mode = searchParams.get('mode')
  const isSignUp = mode === 'signup'

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      if (isSignUp) {
        // Validação de senha
        if (formData.password !== formData.confirmPassword) {
          setError('As senhas não coincidem')
          setIsLoading(false)
          return
        }

        if (formData.password.length < 6) {
          setError('A senha deve ter pelo menos 6 caracteres')
          setIsLoading(false)
          return
        }

        // Criar usuário no Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
          auth, 
          formData.email, 
          formData.password
        )

        // Atualizar perfil do usuário
        await updateProfile(userCredential.user, {
          displayName: formData.name
        })

        // Salvar dados do usuário no Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          name: formData.name,
          email: formData.email,
          role: 'client',
          plan: 'basic',
          status: 'active',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          preferences: {
            language: 'pt',
            notifications: true,
            theme: 'light'
          }
        })

        alert('Cadastro realizado com sucesso!')
        // Redirecionar para dashboard após cadastro
        setTimeout(() => {
          router.push('/dashboard')
        }, 500)
      } else {
        // Login
        console.log('🔐 Login: Fazendo login com:', formData.email)
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password)
        console.log('🔐 Login: Login realizado com sucesso:', userCredential.user.email)
        
        alert('Login realizado com sucesso!')
        // Redirecionar para dashboard após login
        setTimeout(() => {
          console.log('🔐 Login: Redirecionando para dashboard')
          router.push('/dashboard')
        }, 500)
      }
    } catch (error: any) {
      console.error('Erro de autenticação:', error)
      
      // Mensagens de erro mais amigáveis
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('Este email já está em uso')
          break
        case 'auth/invalid-email':
          setError('Email inválido')
          break
        case 'auth/weak-password':
          setError('Senha muito fraca')
          break
        case 'auth/user-not-found':
          setError('Usuário não encontrado')
          break
        case 'auth/wrong-password':
          setError('Senha incorreta')
          break
        case 'auth/too-many-requests':
          setError('Muitas tentativas. Tente novamente mais tarde')
          break
        case 'auth/operation-not-allowed':
          setError('Operação não permitida. Verifique as configurações do Firebase')
          break
        case 'auth/network-request-failed':
          setError('Erro de rede. Verifique sua conexão')
          break
        case 'auth/invalid-credential':
          setError('Credenciais inválidas')
          break
        default:
          setError(`Erro: ${error.code} - ${error.message}`)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <h1 className="text-3xl font-bold text-white">NichoFy</h1>
          </Link>
          <h2 className="text-2xl font-bold text-white mb-2">
            {isSignUp ? 'Comece Agora' : 'Bem-vindo de Volta'}
          </h2>
          <p className="text-white/80">
            {isSignUp 
              ? 'Crie sua conta e comece a gerar conteúdo profissional' 
              : 'Entre na sua conta para continuar'
            }
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Seu nome completo"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Sua senha"
              />
            </div>

            {isSignUp && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Senha
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Confirme sua senha"
                />
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-medium py-3 rounded-lg transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {isSignUp ? 'Criando conta...' : 'Entrando...'}
                </div>
              ) : (
                isSignUp ? 'Criar Conta' : 'Entrar'
              )}
            </Button>

            {/* Divisor */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">ou</span>
              </div>
            </div>

            {/* Google Login */}
            <GoogleLoginButton
              onSuccess={() => {
                alert('Login com Google realizado com sucesso!')
                router.push('/')
              }}
              onError={(error) => setError(error)}
            />
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isSignUp ? 'Já tem uma conta?' : 'Não tem uma conta?'}
              <Link 
                href={isSignUp ? '/login' : '/login?mode=signup'} 
                className="text-primary-600 hover:text-primary-700 font-medium ml-1"
              >
                {isSignUp ? 'Entrar' : 'Criar conta'}
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link 
            href="/" 
            className="text-white/80 hover:text-white transition-colors"
          >
            ← Voltar para o início
          </Link>
        </div>
      </div>
      
      {/* Diagnóstico de credenciais */}
      <CredentialsDiagnostic />
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
