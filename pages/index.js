import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [archivos, setArchivos] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    fetchArchivos()
  }, [])

  async function fetchArchivos() {
    setCargando(true)
    let { data, error } = await supabase.from('archivos').select('*').order('created_at', { ascending: false })
    if (error) console.log('Error:', error)
    else setArchivos(data)
    setCargando(false)
  }

  const archivosFiltrados = archivos.filter(archivo => 
    archivo.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    archivo.clase.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <nav className="bg-blue-900 text-white p-4 shadow-lg sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold tracking-tighter">REPO UNAH 🇭🇳</Link>
          <Link href="/subir" className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-full font-bold">
            + Subir Aporte
          </Link>
        </div>
      </nav>

      <div className="bg-blue-800 py-12 px-4 text-center">
        <h2 className="text-3xl text-white font-bold mb-4">La biblioteca libre de la UNAH.</h2>
        <input type="text" placeholder="Buscar por clase (Ej: MM110) o tema..." className="w-full max-w-2xl p-4 rounded-lg shadow-xl" onChange={(e) => setBusqueda(e.target.value)} />
      </div>

      <div className="container mx-auto p-4 -mt-8">
        {cargando ? <p className="text-center mt-10">Cargando...</p> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {archivosFiltrados.map((archivo) => (
              <div key={archivo.id} className="bg-white rounded-xl shadow-md overflow-hidden border">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">{archivo.clase}</span>
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded">{archivo.facultad || 'General'}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4">{archivo.titulo}</h3>
                  <a href={archivo.public_link} target="_blank" rel="noopener noreferrer"
                     className={`block w-full text-center font-bold py-2 rounded-lg transition-colors ${archivo.es_video ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-gray-100 hover:bg-blue-600 hover:text-white'}`}>
                    {archivo.es_video ? '▶️ VER CLASE' : '⬇️ DESCARGAR'}
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
        {!cargando && archivosFiltrados.length === 0 && <p className="text-center py-20 text-gray-500">No se encontraron archivos.</p>}
      </div>
    </div>
  )
}