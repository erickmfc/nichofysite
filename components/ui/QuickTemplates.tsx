'use client'

import { useState } from 'react'

const templates = {
  instagram: [
    {
      name: "Post Motivacional",
      template: "💪 {tema}\n\n{conteudo}\n\n#{hashtag1} #{hashtag2} #{hashtag3}",
      description: "Template para posts inspiracionais"
    },
    {
      name: "Dica Rápida",
      template: "💡 DICA: {tema}\n\n{conteudo}\n\nSalve este post! 📌",
      description: "Template para compartilhar conhecimento"
    },
    {
      name: "Pergunta Engajante",
      template: "🤔 {tema}\n\n{conteudo}\n\nO que você acha? Comenta aí! 👇",
      description: "Template para aumentar interação"
    },
    {
      name: "Case de Sucesso",
      template: "🎉 {tema}\n\n{conteudo}\n\nCompartilhe sua experiência! 📤",
      description: "Template para contar histórias"
    }
  ],
  linkedin: [
    {
      name: "Artigo Profissional",
      template: "{tema}: {conteudo}\n\nO que você acha sobre isso? Deixe seu comentário! 👇",
      description: "Template para conteúdo profissional"
    },
    {
      name: "Insight de Carreira",
      template: "💼 {tema}\n\n{conteudo}\n\nQual sua opinião sobre este tema?",
      description: "Template para insights profissionais"
    }
  ],
  twitter: [
    {
      name: "Thread Educativa",
      template: "🧵 {tema}\n\n1/ {conteudo}\n\n2/ Continue lendo...",
      description: "Template para threads educativas"
    },
    {
      name: "Tweet Direto",
      template: "{tema}: {conteudo}\n\nO que você pensa sobre isso?",
      description: "Template para tweets diretos"
    }
  ]
}

interface QuickTemplatesProps {
  platform?: keyof typeof templates
  onSelectTemplate?: (template: any) => void
}

export const QuickTemplates = ({ platform = 'instagram', onSelectTemplate }: QuickTemplatesProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState(0)
  const platformTemplates = templates[platform] || templates.instagram

  const handleSelectTemplate = (template: any) => {
    setSelectedTemplate(platformTemplates.indexOf(template))
    onSelectTemplate?.(template)
  }

  const getPlatformEmoji = () => {
    const emojis = {
      instagram: '📸',
      linkedin: '💼',
      twitter: '🐦'
    }
    return emojis[platform] || '📝'
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {getPlatformEmoji()} Templates Rápidos
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {platform.charAt(0).toUpperCase() + platform.slice(1)}
        </span>
      </div>
      
      <div className="space-y-3 mb-4">
        {platformTemplates.map((template, index) => (
          <button
            key={index}
            onClick={() => handleSelectTemplate(template)}
            className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
              selectedTemplate === index 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
            }`}
          >
            <div className="font-medium text-gray-900 dark:text-white">
              {template.name}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {template.description}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-2 font-mono bg-gray-100 dark:bg-gray-700 p-2 rounded">
              {template.template.substring(0, 60)}...
            </div>
          </button>
        ))}
      </div>
      
      <button 
        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors font-medium"
        onClick={() => onSelectTemplate?.(platformTemplates[selectedTemplate])}
      >
        ✨ Usar Template Selecionado
      </button>

      <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <p className="text-sm text-green-800 dark:text-green-200 text-center">
          💡 Templates prontos para acelerar sua criação de conteúdo!
        </p>
      </div>
    </div>
  )
}
