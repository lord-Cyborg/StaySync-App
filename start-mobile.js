// Script para iniciar o StaySync com acesso para dispositivos móveis
const { spawn } = require('child_process');
const os = require('os');
const path = require('path');

// Função para obter o endereço IP local
function getLocalIpAddress() {
  const networkInterfaces = os.networkInterfaces();
  let ipAddress = '';
  
  Object.keys(networkInterfaces).forEach((ifname) => {
    networkInterfaces[ifname].forEach((iface) => {
      if (iface.family === 'IPv4' && !iface.internal) {
        ipAddress = iface.address;
      }
    });
  });
  
  return ipAddress;
}

// Obter o IP local
const ipAddress = getLocalIpAddress();
console.log(`\n🚀 Iniciando o StaySync com acesso para dispositivos móveis...\n`);

// Caminhos para os serviços
const frontendPath = path.join(__dirname, 'frontend');
const backendPath = path.join(__dirname, 'backend');
const inventoryPath = path.join(__dirname, 'backend', 'inventory');

// Iniciar o backend principal
console.log('📡 Iniciando Backend Principal...');
const backendProcess = spawn('node', ['server.js'], { cwd: backendPath, stdio: 'inherit' });

// Iniciar o serviço de inventário
console.log('📦 Iniciando Serviço de Inventário...');
const inventoryProcess = spawn('node', ['server_inventory.js'], { cwd: backendPath, stdio: 'inherit' });

// Iniciar o frontend com a flag --host para permitir acesso externo
console.log('🌐 Iniciando Frontend (acessível na rede local)...');
const frontendProcess = spawn('npm', ['run', 'dev', '--', '--host'], { cwd: frontendPath, stdio: 'inherit' });

// Mostrar informações de acesso
if (ipAddress) {
  setTimeout(() => {
    console.log('\n-------------------------------------------');
    console.log('📱 ACESSO PELO CELULAR');
    console.log('-------------------------------------------');
    console.log(`\nAcesse o StaySync no seu celular usando:\nhttp://${ipAddress}:5173\n`);
    console.log('Certifique-se de que o celular está conectado à mesma rede Wi-Fi.');
    console.log('\nA porta pode variar, verifique a porta exibida no console acima.');
    console.log('-------------------------------------------\n');
    
    try {
      const qrcode = require('qrcode-terminal');
      console.log('Escaneie o QR Code abaixo com a câmera do seu celular:');
      qrcode.generate(`http://${ipAddress}:5173`, { small: true });
      console.log('\n-------------------------------------------\n');
    } catch (err) {
      console.log('Para gerar um QR Code para acesso mais fácil, instale o módulo qrcode-terminal:');
      console.log('npm install qrcode-terminal');
      console.log('\n-------------------------------------------\n');
    }
  }, 5000);
}

// Configurar manipulação de encerramento
process.on('SIGINT', () => {
  console.log('\n🛑 Encerrando todos os serviços...');
  backendProcess.kill();
  inventoryProcess.kill();
  frontendProcess.kill();
  process.exit();
});

console.log('\nPressione Ctrl+C para encerrar todos os serviços.\n');
