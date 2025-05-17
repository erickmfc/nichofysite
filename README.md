# Nichofy

Uma plataforma moderna para gerenciamento de nichos, construída com Next.js 14.

## Tecnologias Utilizadas

- Next.js 14
- TypeScript
- Tailwind CSS
- Supabase
- Stripe

## Pré-requisitos

- Node.js 18.17 ou superior
- npm ou yarn
- Conta no Supabase
- Conta no Stripe

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/nichofysite.git
cd nichofysite
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```
Edite o arquivo `.env.local` com suas credenciais do Supabase e Stripe.

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

O projeto estará disponível em `http://localhost:3000`

## Estrutura do Projeto

```
nichofysite/
├── app/                # Páginas e layouts do Next.js
├── components/         # Componentes React reutilizáveis
│   └── ui/            # Componentes de UI básicos
├── lib/               # Configurações e utilitários
│   ├── supabase.ts    # Configuração do Supabase
│   └── stripe.ts      # Configuração do Stripe
└── public/            # Arquivos estáticos
```

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a build de produção
- `npm run start` - Inicia o servidor de produção
- `npm run lint` - Executa o linter

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request 