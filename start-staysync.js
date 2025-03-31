const { spawn } = require('child_process');
const path = require('path');

// Configuração dos serviços
const services = [
    {
        name: 'Frontend (Vite)',
        command: 'npm',
        args: ['run', 'dev'],
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
        }, 1000);
    });
}

// Função principal
async function main() {
    console.log('\x1b[34m=== Starting StaySync Services ===\x1b[0m\n');

    try {
        // Inicia os serviços em sequência
        for (const service of services) {
            await startService(service);
        }

        console.log('\n\x1b[34m=== All services are running ===\x1b[0m');
        
        // Aguarda um momento para garantir que tudo está pronto
        setTimeout(() => {
            console.log('\n\x1b[34mOpening browser...\x1b[0m');
            openBrowser('http://localhost:5173/auth/login');
        }, 2000);

    } catch (error) {
        console.error('\x1b[31mError starting services:', error, '\x1b[0m');
    }
}

// Inicia o script
main();
