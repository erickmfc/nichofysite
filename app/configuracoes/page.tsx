import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export default function ConfiguracoesPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Configurações</h1>
          
          <div className="space-y-6">
            {/* Perfil */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Perfil</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Nome</label>
                  <input 
                    type="text" 
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    defaultValue="João Silva"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input 
                    type="email" 
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    defaultValue="joao@exemplo.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Profissão</label>
                  <input 
                    type="text" 
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    defaultValue="Advogado"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Empresa</label>
                  <input 
                    type="text" 
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    defaultValue="Silva & Associados"
                  />
                </div>
              </div>
              <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700">
                Salvar Alterações
              </button>
            </div>

            {/* Preferências de Conteúdo */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Preferências de Conteúdo</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nichos Principais</label>
                  <div className="flex flex-wrap gap-2">
                    {['Direito', 'Saúde', 'Tecnologia', 'Marketing', 'Educação', 'Finanças'].map(nicho => (
                      <label key={nicho} className="flex items-center">
                        <input type="checkbox" className="mr-2" defaultChecked={['Direito', 'Saúde'].includes(nicho)} />
                        <span className="text-sm">{nicho}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Plataformas Preferidas</label>
                  <div className="flex flex-wrap gap-2">
                    {['Instagram', 'LinkedIn', 'Blog', 'Twitter', 'Facebook'].map(plataforma => (
                      <label key={plataforma} className="flex items-center">
                        <input type="checkbox" className="mr-2" defaultChecked={['Instagram', 'LinkedIn'].includes(plataforma)} />
                        <span className="text-sm">{plataforma}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tom de Voz</label>
                  <select className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Profissional</option>
                    <option>Casual</option>
                    <option>Autoritário</option>
                    <option>Amigável</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notificações */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Notificações</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Email de Conteúdos Prontos</div>
                    <div className="text-sm text-gray-500">Receber email quando conteúdo for gerado</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Lembretes de Postagem</div>
                    <div className="text-sm text-gray-500">Receber lembretes para postar conteúdo</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Atualizações do Sistema</div>
                    <div className="text-sm text-gray-500">Receber informações sobre novas funcionalidades</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Privacidade */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Privacidade</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Compartilhar Dados de Uso</div>
                    <div className="text-sm text-gray-500">Permitir uso de dados para melhorar o serviço</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Perfil Público</div>
                    <div className="text-sm text-gray-500">Tornar perfil visível para outros usuários</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Conta */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Conta</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Alterar Senha</div>
                    <div className="text-sm text-gray-500">Atualizar sua senha de acesso</div>
                  </div>
                  <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300">
                    Alterar
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Exportar Dados</div>
                    <div className="text-sm text-gray-500">Baixar todos os seus dados</div>
                  </div>
                  <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300">
                    Exportar
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-red-600">Excluir Conta</div>
                    <div className="text-sm text-gray-500">Remover permanentemente sua conta</div>
                  </div>
                  <button className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700">
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
