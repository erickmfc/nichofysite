export default function Custom500() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">500</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Erro Interno do Servidor
        </h2>
        <p className="text-gray-600 mb-8">
          Algo deu errado no nosso servidor. Estamos trabalhando para resolver isso.
        </p>
        <a
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Voltar ao Início
        </a>
      </div>
    </div>
  )
}
