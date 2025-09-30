'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'
import { ContentApprovalService } from '@/lib/services/ContentApprovalService'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CriarConteudoPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    tipo: 'Post para Instagram',
    nicho: 'Direito',
    topico: '',
    descricao: '',
    conteudo: '',
    template: ''
  })

  const nichosDisponiveis = [
    'Direito', 'Saúde & Bem-Estar', 'Tecnologia', 'Gastronomia', 'Beleza & Estética',
    'Varejo & E-commerce', 'Fitness & Esportes', 'Mercado Imobiliário', 'Contabilidade & Finanças',
    'Pet Shops & Veterinária', 'Educação & Cursos', 'Turismo & Hotelaria', 'Psicologia & Saúde Mental',
    'Odontologia', 'Farmácia & Medicamentos', 'Marketing & Publicidade', 'Consultoria Empresarial'
  ]

  const templates = [
    {
      id: 'motivacional',
      title: 'Post Motivacional',
      description: 'Template para posts inspiracionais',
      icon: '💪',
      color: 'from-yellow-400 to-orange-500',
      content: '🌟 [Seu tópico aqui]\n\n💡 [Sua mensagem motivacional]\n\n✨ Lembre-se: [Dica inspiracional]\n\n#motivação #inspiração #[seu-nicho]'
    },
    {
      id: 'dica',
      title: 'Dica Profissional',
      description: 'Template para compartilhar conhecimento',
      icon: '💡',
      color: 'from-blue-400 to-purple-500',
      content: '🎯 DICA PROFISSIONAL\n\n📋 [Seu tópico aqui]\n\n✅ [Passo 1]\n✅ [Passo 2]\n✅ [Passo 3]\n\n💼 [Conclusão prática]\n\n#dicas #[seu-nicho] #profissional'
    },
    {
      id: 'pergunta',
      title: 'Pergunta Engajante',
      description: 'Template para aumentar interação',
      icon: '❓',
      color: 'from-green-400 to-teal-500',
      content: '🤔 PERGUNTA PARA VOCÊ:\n\n[Seu tópico aqui]\n\n❓ [Pergunta engajante]\n\n💬 Comenta aí sua opinião!\n\n#engajamento #[seu-nicho] #interação'
    },
    {
      id: 'case',
      title: 'Case de Sucesso',
      description: 'Template para contar histórias',
      icon: '📈',
      color: 'from-purple-400 to-pink-500',
      content: '🏆 CASE DE SUCESSO\n\n📊 [Seu tópico aqui]\n\n🎯 Desafio: [Problema]\n💡 Solução: [Como resolveu]\n📈 Resultado: [Benefícios]\n\n✨ [Lição aprendida]\n\n#casodesucesso #[seu-nicho] #resultados'
    }
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template.id)
    setFormData(prev => ({
      ...prev,
      template: template.content,
      conteudo: template.content
    }))
  }

  const showNotification = (title: string, message: string, type: 'success' | 'error' = 'success') => {
    // Criar notificação visual
    const notification = document.createElement('div')
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform transition-all duration-300 ${
      type === 'success' 
        ? 'bg-green-500 text-white' 
        : 'bg-red-500 text-white'
    }`
    notification.innerHTML = `
      <div class="flex items-center">
        <span class="text-xl mr-2">${type === 'success' ? '✅' : '❌'}</span>
        <div>
          <div class="font-semibold">${title}</div>
          <div class="text-sm opacity-90">${message}</div>
        </div>
      </div>
    `
    document.body.appendChild(notification)
    
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)'
      setTimeout(() => document.body.removeChild(notification), 300)
    }, 3000)
  }

  const handleGenerate = async () => {
    if (!user) {
      showNotification('Erro de Autenticação', 'Usuário não autenticado', 'error')
      return
    }

    if (!formData.topico.trim() || !formData.descricao.trim()) {
      showNotification('Campos Obrigatórios', 'Por favor, preencha o tópico e a descrição', 'error')
      return
    }

    setIsGenerating(true)
    try {
      // Simular geração de conteúdo com animação
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Gerar conteúdo baseado no tópico e descrição
      const conteudoGerado = formData.template || `🎯 ${formData.topico}

${formData.descricao}

💡 Dica: Este conteúdo foi gerado para ${formData.tipo} no nicho de ${formData.nicho}.

#${formData.nicho.toLowerCase().replace(/\s+/g, '')} #conteudo #marketing`

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
      
      showNotification('Conteúdo Enviado para Aprovação! 🎉', 'O administrador irá revisar e aprovar em breve.')
      
      // Redirecionar após sucesso
      setTimeout(() => {
        router.push('/meus-pedidos')
      }, 2000)
      
    } catch (err) {
      console.error('Erro ao gerar conteúdo:', err)
      showNotification('Erro ao Gerar Conteúdo', 'Tente novamente em alguns instantes.', 'error')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveDraft = async () => {
    setIsSaving(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      showNotification('Rascunho Salvo!', 'Seu conteúdo foi salvo como rascunho.')
    } catch (err) {
      showNotification('Erro ao Salvar', 'Não foi possível salvar o rascunho.', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <button
                  onClick={() => router.back()}
                  className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  ← Voltar
                </button>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Criar Conteúdo
                  </h1>
                  <p className="text-gray-600 mt-1">Transforme suas ideias em conteúdo profissional</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  Passo {currentStep} de 3
                </div>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentStep / 3) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Formulário Principal */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                
                {/* Step 1: Informações Básicas */}
                {currentStep === 1 && (
                  <div className="p-8">
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Informações Básicas</h2>
                      <p className="text-gray-600">Vamos começar com os detalhes do seu conteúdo</p>
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">
                            📱 Tipo de Conteúdo
                          </label>
                          <select 
                            name="tipo"
                            value={formData.tipo}
                            onChange={handleChange}
                            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200 text-gray-900"
                          >
                            <option>Post para Instagram</option>
                            <option>Post para LinkedIn</option>
                            <option>Artigo para Blog</option>
                            <option>Story para Instagram</option>
                            <option>Thread para Twitter</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">
                            🎯 Nicho
                          </label>
                          <select 
                            name="nicho"
                            value={formData.nicho}
                            onChange={handleChange}
                            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200 text-gray-900"
                          >
                            {nichosDisponiveis.map((nicho) => (
                              <option key={nicho} value={nicho}>{nicho}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          💡 Tópico
                        </label>
                        <input 
                          name="topico"
                          type="text" 
                          value={formData.topico}
                          onChange={handleChange}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200 text-gray-900"
                          placeholder="Ex: Direito trabalhista, saúde mental, IA..."
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          📝 Descrição
                        </label>
                        <textarea 
                          name="descricao"
                          value={formData.descricao}
                          onChange={handleChange}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl h-32 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200 text-gray-900 resize-none" 
                          placeholder="Descreva o que você quer criar..."
                        ></textarea>
                      </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                      <button 
                        onClick={nextStep}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        Próximo →
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Templates */}
                {currentStep === 2 && (
                  <div className="p-8">
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Escolha um Template</h2>
                      <p className="text-gray-600">Selecione um template para acelerar sua criação</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {templates.map((template) => (
                        <div
                          key={template.id}
                          onClick={() => handleTemplateSelect(template)}
                          className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                            selectedTemplate === template.id
                              ? 'border-blue-400 bg-blue-50 shadow-lg'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className={`absolute top-4 right-4 w-12 h-12 rounded-full bg-gradient-to-r ${template.color} flex items-center justify-center text-white text-xl`}>
                            {template.icon}
                          </div>
                          
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{template.title}</h3>
                          <p className="text-gray-600 mb-4">{template.description}</p>
                          
                          {selectedTemplate === template.id && (
                            <div className="absolute inset-0 bg-blue-500 bg-opacity-10 rounded-xl flex items-center justify-center">
                              <div className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold">
                                ✓ Selecionado
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 flex justify-between">
                      <button 
                        onClick={prevStep}
                        className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 transition-all duration-200"
                      >
                        ← Anterior
                      </button>
                      <button 
                        onClick={nextStep}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        Próximo →
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Revisão e Geração */}
                {currentStep === 3 && (
                  <div className="p-8">
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Revisão Final</h2>
                      <p className="text-gray-600">Revise suas informações e gere o conteúdo</p>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Resumo do Conteúdo</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-600">Tipo:</span>
                            <span className="ml-2 text-gray-900">{formData.tipo}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Nicho:</span>
                            <span className="ml-2 text-gray-900">{formData.nicho}</span>
                          </div>
                          <div className="md:col-span-2">
                            <span className="font-medium text-gray-600">Tópico:</span>
                            <span className="ml-2 text-gray-900">{formData.topico}</span>
                          </div>
                          <div className="md:col-span-2">
                            <span className="font-medium text-gray-600">Descrição:</span>
                            <span className="ml-2 text-gray-900">{formData.descricao}</span>
                          </div>
                        </div>
                      </div>

                      {formData.conteudo && (
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">
                            📄 Conteúdo Gerado
                          </label>
                          <div className="w-full p-6 border-2 border-gray-200 rounded-xl bg-gradient-to-br from-gray-50 to-white min-h-40">
                            <pre className="whitespace-pre-wrap text-gray-800 font-medium leading-relaxed">{formData.conteudo}</pre>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-8 flex justify-between">
                      <button 
                        onClick={prevStep}
                        className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 transition-all duration-200"
                      >
                        ← Anterior
                      </button>
                      
                      <div className="flex space-x-4">
                        <button 
                          onClick={handleSaveDraft}
                          disabled={isSaving}
                          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 transition-all duration-200 disabled:opacity-50"
                        >
                          {isSaving ? 'Salvando...' : '💾 Salvar Rascunho'}
                        </button>
                        
                        <button 
                          onClick={handleGenerate}
                          disabled={isGenerating}
                          className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
                        >
                          {isGenerating ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                              Gerando...
                            </div>
                          ) : (
                            '🚀 Gerar Conteúdo'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar com Templates Rápidos */}
            <div className="space-y-6">
              
              {/* Templates Rápidos */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">⚡ Templates Rápidos</h3>
                <div className="space-y-4">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => handleTemplateSelect(template)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedTemplate === template.id
                          ? 'border-blue-400 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${template.color} flex items-center justify-center text-white text-lg mr-3`}>
                          {template.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{template.title}</h4>
                          <p className="text-sm text-gray-600">{template.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dicas */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">💡 Dicas</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Seja específico no tópico para melhores resultados</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Use templates para acelerar a criação</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Revise sempre antes de enviar</span>
                  </div>
                </div>
              </div>

              {/* Progresso */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Progresso</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Informações Básicas</span>
                    <span className={`text-sm ${currentStep >= 1 ? 'text-green-500' : 'text-gray-400'}`}>
                      {currentStep >= 1 ? '✓' : '○'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Template</span>
                    <span className={`text-sm ${currentStep >= 2 ? 'text-green-500' : 'text-gray-400'}`}>
                      {currentStep >= 2 ? '✓' : '○'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Revisão</span>
                    <span className={`text-sm ${currentStep >= 3 ? 'text-green-500' : 'text-gray-400'}`}>
                      {currentStep >= 3 ? '✓' : '○'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
