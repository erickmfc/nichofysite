import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export default function TemplatesPage() {
  const templates = [
    {
      id: 1,
      name: "Post Motivacional",
      category: "Instagram",
      description: "Template para posts inspiracionais e motivacionais",
      usage: 15,
      color: "bg-pink-100"
    },
    {
      id: 2,
      name: "Dica Profissional",
      category: "LinkedIn",
      description: "Template para compartilhar conhecimento profissional",
      usage: 12,
      color: "bg-blue-100"
    },
    {
      id: 3,
      name: "Pergunta Engajante",
      category: "Instagram",
      description: "Template para aumentar interação com perguntas",
      usage: 8,
      color: "bg-purple-100"
    },
    {
      id: 4,
      name: "Case de Sucesso",
      category: "Blog",
      description: "Template para contar histórias de sucesso",
      usage: 6,
      color: "bg-green-100"
    },
    {
      id: 5,
      name: "Thread Educativa",
      category: "Twitter",
      description: "Template para threads informativas",
      usage: 10,
      color: "bg-sky-100"
    },
    {
      id: 6,
      name: "Story Interativo",
      category: "Instagram",
      description: "Template para stories com perguntas",
      usage: 7,
      color: "bg-yellow-100"
    },
    {
      id: 7,
      name: "Artigo Informativo",
      category: "Blog",
      description: "Template para artigos educativos",
      usage: 9,
      color: "bg-indigo-100"
    },
    {
      id: 8,
      name: "Post Promocional",
      category: "LinkedIn",
      description: "Template para promover serviços",
      usage: 4,
      color: "bg-red-100"
    }
  ]

  const categories = ["Todos", "Instagram", "LinkedIn", "Blog", "Twitter"]

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Templates</h1>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map(category => (
              <button 
                key={category}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  category === "Todos" 
                    ? "bg-blue-600 text-white" 
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {templates.map(template => (
              <div key={template.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className={`h-32 ${template.color} rounded-t-lg flex items-center justify-center`}>
                  <div className="text-4xl">📝</div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{template.name}</h3>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                      {template.category}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{template.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Usado {template.usage} vezes
                    </span>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                      Usar Template
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Templates Mais Usados</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <div>
                    <span className="font-medium">Post Motivacional</span>
                    <div className="text-sm text-gray-500">Instagram</div>
                  </div>
                  <span className="font-semibold">15 usos</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <div>
                    <span className="font-medium">Dica Profissional</span>
                    <div className="text-sm text-gray-500">LinkedIn</div>
                  </div>
                  <span className="font-semibold">12 usos</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <div>
                    <span className="font-medium">Thread Educativa</span>
                    <div className="text-sm text-gray-500">Twitter</div>
                  </div>
                  <span className="font-semibold">10 usos</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <div>
                    <span className="font-medium">Artigo Informativo</span>
                    <div className="text-sm text-gray-500">Blog</div>
                  </div>
                  <span className="font-semibold">9 usos</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Criar Novo Template</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nome do Template</label>
                  <input 
                    type="text" 
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: Post sobre Tecnologia"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Categoria</label>
                  <select className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Instagram</option>
                    <option>LinkedIn</option>
                    <option>Blog</option>
                    <option>Twitter</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Descrição</label>
                  <textarea 
                    className="w-full p-3 border rounded-lg h-20 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Descreva o template..."
                  ></textarea>
                </div>
                <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700">
                  Criar Template
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
