const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} = require('@whiskeysockets/baileys')

async function startWhatsApp () {
  const { state, saveCreds } = await useMultiFileAuthState('./session')

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', (update) => {
    const { connection } = update

    if (connection === 'open') {
      console.log('✅ WhatsApp CONNECTED & LINKED')
    }

    if (connection === 'close') {
      console.log('❌ Disconnected')
      startWhatsApp()
    }
  })
}

startWhatsApp()
