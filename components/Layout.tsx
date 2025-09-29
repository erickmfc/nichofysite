import Footer from '@/components/Footer'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <main>
        {children}
      </main>
      <Footer />
    </>
  )
}
