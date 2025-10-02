// Script para popular o Firestore com dados de exemplo
// Execute este script no console do navegador na página do admin

const populateFirestore = async () => {
  const { collection, addDoc, serverTimestamp } = await import('firebase/firestore')
  const { db } = await import('@/lib/firebase')

  console.log('🚀 Iniciando população do Firestore com dados de exemplo...')

  try {
    // Criar usuários de exemplo
    const users = [
      {
        name: 'João Silva',
        email: 'joao@exemplo.com',
        createdAt: serverTimestamp(),
        status: 'active'
      },
      {
        name: 'Maria Santos',
        email: 'maria@exemplo.com',
        createdAt: serverTimestamp(),
        status: 'active'
      },
      {
        name: 'Pedro Oliveira',
        email: 'pedro@exemplo.com',
        createdAt: serverTimestamp(),
        status: 'active'
      },
      {
        name: 'Ana Costa',
        email: 'ana@exemplo.com',
        createdAt: serverTimestamp(),
        status: 'active'
      },
      {
        name: 'Carlos Ferreira',
        email: 'carlos@exemplo.com',
        createdAt: serverTimestamp(),
        status: 'active'
      }
    ]

    console.log('👥 Criando usuários...')
    const userIds = []
    for (const user of users) {
      const docRef = await addDoc(collection(db, 'users'), user)
      userIds.push(docRef.id)
      console.log('✅ Usuário criado:', docRef.id)
    }

    // Criar posts de exemplo
    const posts = [
      {
        title: 'Dicas de Marketing Digital para 2024',
        content: 'O marketing digital está em constante evolução. Aqui estão as principais tendências para 2024...',
        category: 'Marketing',
        userId: userIds[0],
        status: 'approved',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        title: 'Estratégias de Vendas Online',
        content: 'Como aumentar suas vendas online com estratégias comprovadas...',
        category: 'Vendas',
        userId: userIds[1],
        status: 'approved',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        title: 'Tendências de E-commerce',
        content: 'As principais tendências do e-commerce que você precisa conhecer...',
        category: 'E-commerce',
        userId: userIds[2],
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        title: 'Como Criar Conteúdo Viral',
        content: 'Dicas práticas para criar conteúdo que engaja e viraliza...',
        category: 'Conteúdo',
        userId: userIds[3],
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        title: 'Automação de Processos',
        content: 'Como automatizar processos para aumentar a produtividade...',
        category: 'Produtividade',
        userId: userIds[4],
        status: 'approved',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        title: 'Redes Sociais para Negócios',
        content: 'Como usar as redes sociais para promover seu negócio...',
        category: 'Redes Sociais',
        userId: userIds[0],
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        title: 'SEO para Iniciantes',
        content: 'Guia completo de SEO para quem está começando...',
        category: 'SEO',
        userId: userIds[1],
        status: 'approved',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        title: 'Email Marketing Eficaz',
        content: 'Como criar campanhas de email marketing que convertem...',
        category: 'Email Marketing',
        userId: userIds[2],
        status: 'rejected',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
    ]

    console.log('📝 Criando posts...')
    for (const post of posts) {
      const docRef = await addDoc(collection(db, 'posts'), post)
      console.log('✅ Post criado:', docRef.id, '-', post.title)
    }

    // Criar atividades administrativas
    const activities = [
      {
        type: 'user_registered',
        message: 'Novo usuário registrado: João Silva',
        timestamp: serverTimestamp(),
        userId: userIds[0]
      },
      {
        type: 'post_approved',
        message: 'Post aprovado: "Dicas de Marketing Digital para 2024"',
        timestamp: serverTimestamp(),
        postId: 'post1'
      },
      {
        type: 'user_registered',
        message: 'Novo usuário registrado: Maria Santos',
        timestamp: serverTimestamp(),
        userId: userIds[1]
      },
      {
        type: 'post_created',
        message: 'Novo post criado: "Tendências de E-commerce"',
        timestamp: serverTimestamp(),
        postId: 'post3'
      },
      {
        type: 'post_approved',
        message: 'Post aprovado: "Estratégias de Vendas Online"',
        timestamp: serverTimestamp(),
        postId: 'post2'
      }
    ]

    console.log('📋 Criando atividades...')
    for (const activity of activities) {
      const docRef = await addDoc(collection(db, 'adminActivities'), activity)
      console.log('✅ Atividade criada:', docRef.id)
    }

    console.log('🎉 Firestore populado com sucesso!')
    console.log('📊 Dados criados:')
    console.log('-', users.length, 'usuários')
    console.log('-', posts.length, 'posts')
    console.log('-', activities.length, 'atividades')

  } catch (error) {
    console.error('❌ Erro ao popular Firestore:', error)
  }
}

// Executar a função
populateFirestore()

