import { useAuth } from '@/contexts/AuthContext/useAuth'
import { useFetch } from '@/hooks/useFetch'

function Home() {
  const { usuario } = useAuth()

  // const { data: usuarios, loading, error } = useFetch({
  //   url: '/notitas_auth/api/v1/usuarios',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${usuario.token}`
  //   }
  // })

  return (
    // <pre>
    //   {!loading && JSON.stringify(usuarios, null, 2)}
    // </pre>
    <div>
      <h1>Home</h1>
    </div>
  )
}

export { Home }