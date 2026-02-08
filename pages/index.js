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
    let { data, error } = await supabase
      .from('archivos')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) console.log('Error:', error)
    else setArchivos(data)
    setCargando(false)
  }

  // Lógica de búsqueda
  const archivosFiltrados = archivos.filter(archivo => 
    archivo.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    archivo.clase.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
      
      {/* NAVBAR */}
      <nav className="bg-[#003B71] text-white p-4 shadow-xl sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-black tracking-tighter flex items-center gap-2">
            REPO UNAH <span className="text-xl">🇭🇳</span>
          </Link>
          <Link href="/subir" className="bg-[#FFD100] text-[#003B71] px-5 py-2 rounded-full font-bold hover:bg-yellow-400 transition transform hover:scale-105 active:scale-95 shadow-md">
            + Subir Aporte
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="bg-[#004A8F] py-16 px-4 text-center border-b-4 border-[#FFD100]">
        <h2 className="text-3xl md:text-5xl text-white font-black mb-4 drop-shadow-md">
          ¡La biblioteca del pueblo!
        </h2>
        <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto font-medium">
          Descarga pautas, exámenes y libros gratis. Sin registros, sin pagos, sin pajas.
        </p>
        
        <div className="max-w-2xl mx-auto relative">
          <input 
            type="text" 
            placeholder="Buscar por clase (Ej: MM110) o tema..." 
            className="w-full p-5 rounded-2xl shadow-2xl text-lg focus:outline-none focus:ring-4 focus:ring-yellow-400 text-gray-900 bg-white placeholder-gray-400"
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <span className="absolute right-5 top-5 text-2xl">🔍</span>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <main className="container mx-auto p-6 -mt-10">
        {cargando ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-900 mx-auto mb-4"></div>
            <p className="text-gray-600 font-bold">Cargando recursos...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {archivosFiltrados.map((archivo) => (
                <div key={archivo.id} className="bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-gray-100 flex flex-col hover:border-blue-300 transition-all duration-300 group">
                  <div className="p-6 flex-grow">
                    <div className="flex justify-between items-center mb-4">
                      <span className="bg-blue-800 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                        {archivo.clase}
                      </span>
                      <span className="bg-yellow-400 text-blue-900 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                        {archivo.facultad || 'General'}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 leading-tight mb-4 group-hover:text-blue-700 transition-colors capitalize">
                      {archivo.titulo}
                    </h3>
                  </div>

                  <div className="p-6 pt-0">
                    <a 
                      href={archivo.public_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`block w-full text-center font-black py-4 rounded-2xl transition-all shadow-lg hover:shadow-none transform active:scale-95 ${
                        archivo.es_video 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'bg-gray-100 hover:bg-blue-600 text-gray-900 hover:text-white border-b-4 border-gray-300 hover:border-blue-800'
                      }`}
                    >
                      {archivo.es_video ? '▶️ VER CLASE' : '⬇️ DESCARGAR'}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* SI NO HAY RESULTADOS */}
            {archivosFiltrados.length === 0 && (
              <div className="text-center py-24">
                <p className="text-5xl mb-4">🤷‍♂️</p>
                <p className="text-2xl text-gray-500 font-bold">No hallamos nada parecido, maje.</p>
                <p className="text-gray-400 mt-2 text-lg">Probá con otra palabra o subí el tuyo.</p>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="text-center py-10 text-gray-500 text-sm font-medium">
        REPO UNAH - Hecho por estudiantes para estudiantes.
      </footer>
    </div>
  )
}