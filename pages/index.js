import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [archivos, setArchivos] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(true)

  // Esta función corre cuando abrís la página: Busca los archivos
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

  // Filtra los archivos cuando escribís en el buscador
  const archivosFiltrados = archivos.filter(archivo => 
    archivo.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    archivo.clase.toLowerCase().includes(busqueda.toLowerCase())
    
  )

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      
      {/* HEADER / ENCABEZADO */}
      <nav className="bg-blue-900 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tighter">REPO UNAH 🇭🇳</h1>
          <a href="/subir" className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-full font-bold hover:bg-yellow-300 transition">
            + Subir Aporte
          </a>
        </div>
      </nav>

      {/* BUSCADOR HERO */}
      <div className="bg-blue-800 py-12 px-4 text-center">
        <h2 className="text-3xl md:text-4xl text-white font-bold mb-4">
          No pagués por estudiar.
        </h2>
        <p className="text-blue-200 mb-8">Exámenes, pautas y libros gratis. De estudiantes para estudiantes.</p>
        
        <input 
          type="text" 
          placeholder="Buscar por clase (Ej: MM110) o tema..." 
          className="w-full max-w-2xl p-4 rounded-lg shadow-xl text-lg focus:outline-none focus:ring-4 focus:ring-yellow-400"
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* LISTA DE ARCHIVOS */}
      <div className="container mx-auto p-4 -mt-8">
        {cargando ? (
          <p className="text-center mt-10 text-gray-500">Cargando la biblioteca...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {archivosFiltrados.map((archivo) => (
              <div key={archivo.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow border border-gray-100">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded uppercase">
                        {archivo.clase}
                      </span>
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded uppercase">
                        {archivo.facultad || 'General'}
                      </span>
                    </div>
                    <span className="text-gray-400 text-xs">{new Date(archivo.created_at).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 leading-tight">{archivo.titulo}</h3>
                  <p className="text-gray-500 text-sm mb-4">Tipo: {archivo.tipo}</p>
                  
                  <a 
                    href={archivo.public_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-gray-100 hover:bg-blue-600 hover:text-white text-gray-700 font-bold py-2 rounded-lg transition-colors"
                  >
                    ⬇️ DESCARGAR / VER
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SI NO HAY NADA */}
        {!cargando && archivosFiltrados.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-400">No encontramos nada con ese nombre, maje. 🤷‍♂️</p>
            <p className="text-gray-500">¡Sé el primero en subirlo!</p>
          </div>
        )}
      </div>

    </div>
  )
}