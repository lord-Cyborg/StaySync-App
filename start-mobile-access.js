const { spawn } = require('child_process');
const path = require('path');
const os = require('os');

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

// Configuração dos serviços
const services = [
    {
        name: 'Frontend (Vite)',
        command: 'npm',
        args: ['run', 'dev', '--', '--host'], // Adicionado --host para permitir acesso pela rede
        cwd: './frontend',
        color: '\x1b[36m', // Cyan
        ready: (output) => output.includes('Local:')
    },
    {
        name: 'Backend Principal',
        command: 'node',
        args: ['server.js'],
        cwd: './backend',
        color: '\x1b[32m', // Green
        ready: (output) => output.includes('Server is running')
    },
    {
        name: 'Backend Inventory',
        command: 'node',
        args: ['server_inventory.js'],
        cwd: './backend',
        color: '\x1b[33m', // Yellow
        ready: (output) => output.includes('Inventory server is running')
    }
];

// Função para abrir o navegador
function openBrowser(url) {
    const start = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
    spawn(start, [url], { shell: true });
}

// Função para formatar logs
function formatLog(serviceName, color, message) {
    const timestamp = new Date().toLocaleTimeString();
    return `${color}[${timestamp}] [${serviceName}]\x1b[0m ${message}`;
}

// Função para iniciar um serviço
function startService(service) {
    return new Promise((resolve) => {
        console.log(formatLog(service.name, service.color, 'Starting...'));

        const proc = spawn(service.command, service.args, {
            cwd: path.join(__dirname, service.cwd),
            shell: true
        });

        let buffer = '';
        let serviceReady = false;

        proc.stdout.on('data', (data) => {
            const output = data.toString();
            buffer += output;

            // Verifica se o serviço está pronto
            if (!serviceReady && service.ready(buffer)) {
                serviceReady = true;
                console.log(formatLog(service.name, service.color, 'Ready!'));
                resolve();
            }

            // Log das saídas
            output.split('\n').forEach(line => {
                if (line.trim()) {
                    console.log(formatLog(service.name, service.color, line));
                }
            });
        });

        proc.stderr.on('data', (data) => {
            const output = data.toString();
            output.split('\n').forEach(line => {
                if (line.trim()) {
                    console.log(formatLog(service.name, '\x1b[31m', line)); // Red for errors
                }
            });
        });

        proc.on('close', (code) => {
            if (code !== 0) {
                console.log(formatLog(service.name, '\x1b[31m', `Process exited with code ${code}`));
            }
        });

        // Timeout de segurança (30 segundos)
        setTimeout(() => {
            if (!serviceReady) {
                console.log(formatLog(service.name, '\x1b[31m', 'Timeout waiting for ready signal'));
                resolve();
            }
        }, 30000);
    });
}

// Função para exibir informações de acesso móvel
function displayMobileAccess() {
    if (ipAddress) {
        console.log('\n\x1b[35m=== Acesso pelo Celular ===\x1b[0m');
        console.log(`\n\x1b[35mURL para acesso: http://${ipAddress}:5173\x1b[0m`);
        console.log('\x1b[35mCertifique-se de que o celular está conectado à mesma rede Wi-Fi.\x1b[0m');
        
        try {
            const qrcode = require('qrcode-terminal');
            console.log('\n\x1b[35mEscaneie o QR Code abaixo com a câmera do seu celular:\x1b[0m');
            qrcode.generate(`http://${ipAddress}:5173`, { small: true });
        } catch (err) {
            console.log('\n\x1b[35mPara gerar um QR Code para acesso mais fácil, instale o módulo qrcode-terminal:\x1b[0m');
            console.log('\x1b[35mnpm install qrcode-terminal\x1b[0m');
        }
    }
}

// Função principal
async function main() {
    console.log('\x1b[34m=== Iniciando StaySync com Acesso Móvel ===\x1b[0m\n');

    try {
        // Inicia os serviços em sequência
        for (const service of services) {
            await startService(service);
        }

        console.log('\n\x1b[34m=== Todos os serviços estão rodando ===\x1b[0m');
        
        // Aguarda um momento para garantir que tudo está pronto
        setTimeout(() => {
            console.log('\n\x1b[34mAbrindo navegador...\x1b[0m');
            openBrowser('http://localhost:5173/auth/login');
            
            // Exibir informações de acesso móvel
            displayMobileAccess();
        }, 2000);

    } catch (error) {
        console.error('\x1b[31mErro ao iniciar serviços:', error, '\x1b[0m');
    }
}

// Inicia o script
main();
