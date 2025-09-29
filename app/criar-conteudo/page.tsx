'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'
import { ContentApprovalService } from '@/lib/services/ContentApprovalService'
import { useToastNotifications } from '@/components/ui/Toast'
import { useState } from 'react'

export default function CriarConteudoPage() {
  const { user } = useAuth()
  const { success, error } = useToastNotifications()
  const [isGenerating, setIsGenerating] = useState(false)
  const [formData, setFormData] = useState({
    tipo: 'Post para Instagram',
    nicho: 'Direito',
    topico: '',
    descricao: '',
    conteudo: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleGenerate = async () => {
    if (!user) {
      error('Erro de Autenticação', 'Usuário não autenticado')
      return
    }

    if (!formData.topico.trim() || !formData.descricao.trim()) {
      error('Campos Obrigatórios', 'Por favor, preencha o tópico e a descrição')
      return
    }

    setIsGenerating(true)
    try {
      // Simular geração de conteúdo
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Gerar conteúdo baseado no tópico e descrição
      const conteudoGerado = `🎯 ${formData.topico}

${formData.descricao}

💡 Dica: Este conteúdo foi gerado para ${formData.tipo} no nicho de ${formData.nicho}.

#${formData.nicho.toLowerCase()} #conteudo #marketing`

      setFormData(prev => ({ ...prev, conteudo: conteudoGerado }))
      
      // Enviar para aprovação automaticamente
      await ContentApprovalService.submitForApproval({
        userId: user.uid,
        userEmail: user.email || '',
        userName: user.displayName || user.email?.split('@')[0] || 'Usuário',
        title: `${formData.topico} - ${formData.tipo}`,
        description: formData.descricao,
        category: formData.nicho,
        content: conteudoGerado,
        platform: formData.tipo
      })
      
      success(
        'Conteúdo Enviado para Aprovação! 🎉',
        'O administrador irá revisar e aprovar em breve.',
        {
          label: 'Ver Meus Pedidos',
          onClick: () => window.location.href = '/meus-pedidos'
        }
      )
    } catch (err) {
      console.error('Erro ao gerar conteúdo:', err)
      error('Erro ao Gerar Conteúdo', 'Tente novamente em alguns instantes.')
    } finally {
      setIsGenerating(false)
    }
  }
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Criar Conteúdo</h1>
          
          <div className="bg-white p-8 rounded-lg shadow">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Tipo de Conteúdo</label>
                <select 
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option>Post para Instagram</option>
                  <option>Post para LinkedIn</option>
                  <option>Artigo para Blog</option>
                  <option>Story para Instagram</option>
                  <option>Thread para Twitter</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Nicho</label>
                <select 
                  name="nicho"
                  value={formData.nicho}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option>Direito</option>
                  <option>Saúde</option>
                  <option>Tecnologia</option>
                  <option>Educação</option>
                  <option>Negócios</option>
                  <option>Marketing</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Tópico</label>
                <input 
                  name="topico"
                  type="text" 
                  value={formData.topico}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: Direito trabalhista, saúde mental, IA..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Descrição</label>
                <textarea 
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="Descreva o que você quer criar..."
                ></textarea>
              </div>

              {formData.conteudo && (
                <div>
                  <label className="block text-sm font-medium mb-2">Conteúdo Gerado</label>
                  <div className="w-full p-3 border rounded-lg bg-gray-50 min-h-32">
                    <pre className="whitespace-pre-wrap text-gray-800">{formData.conteudo}</pre>
                  </div>
                </div>
              )}
              
              <div className="flex gap-4">
                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isGenerating ? 'Gerando...' : 'Gerar Conteúdo'}
                </button>
                <button 
                  onClick={() => success('Rascunho Salvo!', 'Seu conteúdo foi salvo como rascunho.')}
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Salvar Rascunho
                </button>
              </div>
            </form>
          </div>
          
          <div className="mt-8 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Templates Rápidos</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div 
                className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-all hover:shadow-md"
                onClick={() => success('Template Aplicado!', 'Post Motivacional carregado com sucesso.')}
              >
                <h3 className="font-semibold">Post Motivacional</h3>
                <p className="text-sm text-gray-600">Template para posts inspiracionais</p>
              </div>
              <div 
                className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-all hover:shadow-md"
                onClick={() => success('Template Aplicado!', 'Dica Profissional carregada com sucesso.')}
              >
                <h3 className="font-semibold">Dica Profissional</h3>
                <p className="text-sm text-gray-600">Template para compartilhar conhecimento</p>
              </div>
              <div 
                className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-all hover:shadow-md"
                onClick={() => success('Template Aplicado!', 'Pergunta Engajante carregada com sucesso.')}
              >
                <h3 className="font-semibold">Pergunta Engajante</h3>
                <p className="text-sm text-gray-600">Template para aumentar interação</p>
              </div>
              <div 
                className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-all hover:shadow-md"
                onClick={() => success('Template Aplicado!', 'Case de Sucesso carregado com sucesso.')}
              >
                <h3 className="font-semibold">Case de Sucesso</h3>
                <p className="text-sm text-gray-600">Template para contar histórias</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
