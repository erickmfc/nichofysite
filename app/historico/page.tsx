import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export default function HistoricoPage() {
  const historicoConteudos = [
    {
      id: 1,
      titulo: "Direito Trabalhista: Horas Extras",
      tipo: "Post Instagram",
      nicho: "Direito",
      data: "2024-01-15",
      status: "Publicado",
      visualizacoes: 2100,
      engajamento: 4.2
    },
    {
      id: 2,
      titulo: "Saúde Mental no Trabalho",
      tipo: "Artigo Blog",
      nicho: "Saúde",
      data: "2024-01-14",
      status: "Publicado",
      visualizacoes: 1800,
      engajamento: 3.8
    },
    {
      id: 3,
      titulo: "IA e o Futuro do Direito",
      tipo: "Post LinkedIn",
      nicho: "Tecnologia",
      data: "2024-01-13",
      status: "Publicado",
      visualizacoes: 1500,
      engajamento: 5.1
    },
    {
      id: 4,
      titulo: "Marketing Digital para Advogados",
      tipo: "Thread Twitter",
      nicho: "Marketing",
      data: "2024-01-12",
      status: "Rascunho",
      visualizacoes: 0,
      engajamento: 0
    },
    {
      id: 5,
      titulo: "Story sobre Sustentabilidade",
      tipo: "Story Instagram",
      nicho: "Meio Ambiente",
      data: "2024-01-11",
      status: "Publicado",
      visualizacoes: 1200,
      engajamento: 6.3
    },
    {
      id: 6,
      titulo: "Educação Financeira",
      tipo: "Post Instagram",
      nicho: "Finanças",
      data: "2024-01-10",
      status: "Publicado",
      visualizacoes: 950,
      engajamento: 4.7
    },
    {
      id: 7,
      titulo: "Tecnologia na Medicina",
      tipo: "Artigo Blog",
      nicho: "Saúde",
      data: "2024-01-09",
      status: "Arquivado",
      visualizacoes: 800,
      engajamento: 3.2
    },
    {
      id: 8,
      titulo: "Motivação para Estudantes",
      tipo: "Post Instagram",
      nicho: "Educação",
      data: "2024-01-08",
      status: "Publicado",
      visualizacoes: 1100,
      engajamento: 5.8
    }
  ]

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Publicado': return 'bg-green-100 text-green-800'
      case 'Rascunho': return 'bg-yellow-100 text-yellow-800'
      case 'Arquivado': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTipoIcon = (tipo: string) => {
    switch(tipo) {
      case 'Post Instagram': return '📸'
      case 'Artigo Blog': return '📝'
      case 'Post LinkedIn': return '💼'
      case 'Thread Twitter': return '🐦'
      case 'Story Instagram': return '📱'
      default: return '📄'
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Histórico de Conteúdos</h1>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">
                Todos
              </button>
              <button className="px-4 py-2 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-100">
                Publicados
              </button>
              <button className="px-4 py-2 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-100">
                Rascunhos
              </button>
              <button className="px-4 py-2 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-100">
                Arquivados
              </button>
            </div>
            <div className="flex gap-2">
              <select className="px-4 py-2 border rounded-lg">
                <option>Todos os nichos</option>
                <option>Direito</option>
                <option>Saúde</option>
                <option>Tecnologia</option>
                <option>Marketing</option>
              </select>
              <select className="px-4 py-2 border rounded-lg">
                <option>Todos os tipos</option>
                <option>Post Instagram</option>
                <option>Artigo Blog</option>
                <option>Post LinkedIn</option>
                <option>Thread Twitter</option>
              </select>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Conteúdo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nicho
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Performance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {historicoConteudos.map((conteudo) => (
                    <tr key={conteudo.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-lg mr-3">{getTipoIcon(conteudo.tipo)}</span>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {conteudo.titulo}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {conteudo.tipo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {conteudo.nicho}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(conteudo.data).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(conteudo.status)}`}>
                          {conteudo.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {conteudo.status === 'Publicado' ? (
                          <div>
                            <div>{conteudo.visualizacoes.toLocaleString()} visualizações</div>
                            <div>{conteudo.engajamento}% engajamento</div>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            Ver
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            Editar
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mt-6 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Estatísticas Gerais</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">24</div>
                <div className="text-sm text-gray-500">Total de Conteúdos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">18</div>
                <div className="text-sm text-gray-500">Publicados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">4</div>
                <div className="text-sm text-gray-500">Rascunhos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">2</div>
                <div className="text-sm text-gray-500">Arquivados</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
