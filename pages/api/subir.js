import http from 'http';
import https from 'https';
import { IncomingForm } from 'formidable'
import fs from 'fs'
import FormData from 'form-data'
import axios from 'axios'
import { supabase } from '../../lib/supabase'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  const data = await new Promise((resolve, reject) => {
    const form = new IncomingForm()
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err)
      resolve({ fields, files })
    })
  })

  const archivo = data.files.file[0]
  const metadata = data.fields

  try {
    const stream = fs.createReadStream(archivo.filepath)
    const formData = new FormData()
    formData.append('document', stream)
    // El caption lleva el título y la clase
    const captionText = `📚 Nuevo Aporte:\n${metadata.titulo[0]}\nClase: ${metadata.clase[0]}`
    formData.append('caption', captionText)

    const telegramRes = await axios.post(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendDocument?chat_id=${process.env.TELEGRAM_CHANNEL_ID}`,
      formData,
      {
        headers: formData.getHeaders(),
        // AGREGAMOS ESTO PARA FORZAR IPV4
        httpsAgent: new https.Agent({ family: 4 }),
        httpAgent: new http.Agent({ family: 4 }),
      }
    )

    const messageId = telegramRes.data.result.message_id
    const channelUsername = process.env.TELEGRAM_CHANNEL_ID.replace('@', '')
    
    // Si usaste el ID numérico (-100...), el link de t.me no funcionará igual, 
    // pero para archivos de canales públicos es mejor t.me/nombre_canal/id
    const publicLink = `https://t.me/${channelUsername}/${messageId}`

   const { error } = await supabase.from('archivos').insert([
      {
        titulo: metadata.titulo[0],
        clase: metadata.clase[0].toUpperCase(),
        tipo: metadata.tipo[0],
        facultad: metadata.facultad[0], // <--- AGREGAMOS ESTO
        public_link: publicLink,
        file_id: telegramRes.data.result.document.file_id
      }
    ])

    if (error) throw error

    return res.status(200).json({ success: true, link: publicLink })

  } catch (error) {
    // Esto nos dirá qué dice Telegram exactamente
    if (error.response) {
      console.error('Error de Telegram:', error.response.data)
    } else {
      console.error('Error general:', error.message)
    }
    return res.status(500).json({ error: 'Error interno en el servidor' })
  }
} // <--- ESTA ES LA LLAVE QUE FALTABA
