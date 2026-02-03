import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Subir() {
  const router = useRouter()
  const [subiendo, setSubiendo] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setSubiendo(true)
    const form = e.target
    const formData = new FormData(form)

    try {
      const res = await fetch('/api/subir', {
        method: 'POST',
        body: formData,
      })
      if (res.ok) {
        alert('¡Gracias maje! Tu archivo ya está en el repositorio.')
        router.push('/')
      } else {
        const errorData = await res.json()
        alert('Error: ' + (errorData.error || 'No se pudo subir'))
      }
    } catch (error) {
      alert('Error de conexión con el servidor')
    }
    setSubiendo(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md border border-gray-200">
        <h1 className="text-2xl font-bold text-blue-900 mb-6 text-center">Subir Aporte 📤</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nombre del Archivo</label>
            <input 
              name="titulo" 
              required 
              type="text" 
              placeholder="Ej: Pauta Examen I - Lic. Perdomo"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Código Clase</label>
              <input 
                name="clase" 
                required 
                type="text" 
                placeholder="Ej: MM110"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase text-gray-900 bg-white"
              />
            </div>

            {/* SELECT DE FACULTAD */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Facultad</label>
              <select name="facultad" className="w-full p-3 border rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500">
                <option value="Generales">Clases Generales</option>
                <option value="Ingenieria">Ingeniería / Sistemas</option>
                <option value="Salud">Ciencias Médicas / Salud</option>
                <option value="Economicas">Ciencias Económicas</option>
                <option value="Sociales">Ciencias Sociales / Derecho</option>
                <option value="Humanidades">Humanidades / Artes</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Tipo</label>
            <select name="tipo" className="w-full p-3 border rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500">
              <option value="Examen">Examen</option>
              <option value="Pauta">Pauta</option>
              <option value="Libro">Libro</option>
              <option value="Apuntes">Apuntes</option>
            </select>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition cursor-pointer relative">
            <input type="file" name="file" required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <p className="text-gray-500 text-sm">Elegir archivo (PDF o Imagen)</p>
          </div>

          <button type="submit" disabled={subiendo} className={`w-full py-4 rounded-lg font-bold text-white transition ${subiendo ? 'bg-gray-400' : 'bg-blue-900 hover:bg-blue-800'}`}>
            {subiendo ? 'Subiendo...' : 'ENVIAR APORTE 🚀'}
          </button>

          <a href="/" className="block text-center text-gray-500 text-sm hover:underline">Volver al inicio</a>
        </form>
      </div>
    </div>
  )
}