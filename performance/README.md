# Testes de Performance com k6

Este diretório contém testes de performance usando [k6](https://k6.io/), uma ferramenta moderna de teste de carga e performance.

## Estrutura de Diretórios

```
performance/
├── data/                # Dados de configuração e carga
│   └── config.json      # Configurações para os testes
├── results/             # Resultados dos testes de performance
├── src/                 # Código fonte dos testes
│   ├── auth-test.js     # Teste de autenticação
│   ├── tasks-test.js    # Teste CRUD de tarefas
│   ├── api-endpoints-test.js  # Teste de endpoints da API
│   ├── spike-test.js    # Teste de pico de carga
│   └── endurance-test.js  # Teste de resistência
├── scripts/             # Scripts para execução dos testes
│   ├── run-tests.sh     # Script shell para executar testes (Linux/Mac)
│   ├── run-tests.bat    # Script batch para executar testes (Windows)
│   ├── run-tests-docker.sh # Script para Docker (Linux/Mac)
│   └── run-tests-docker.bat # Script para Docker (Windows)
├── INSTALL.md           # Instruções de instalação detalhadas
├── QUICKSTART.md        # Guia rápido de uso
└── README.md            # Documentação
```

## Pré-requisitos

1. [k6](https://k6.io/docs/getting-started/installation/) instalado em sua máquina
   **OU**
2. [Docker](https://www.docker.com/get-started) instalado (alternativa quando k6 não está disponível)
3. Aplicação Weid (backend) em execução

## Instalando o k6

### Windows

Usando Chocolatey:
```bash
choco install k6
```

Usando WinGet:
```bash
winget install k6 --source winget
```

Ou baixe o instalador em: https://github.com/grafana/k6/releases

### macOS

Usando Homebrew:
```bash
brew install k6
```

### Linux

Usando APT (Ubuntu/Debian):
```bash
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

Usando YUM (CentOS/RHEL):
```bash
sudo yum install https://dl.k6.io/rpm/repo.rpm
sudo yum install k6
```

## Configuração

Edite o arquivo `data/config.json` para ajustar:

1. URL base da API
2. Usuários de teste
3. Limiares de performance
4. Configurações de cenários

## Executando os Testes

### Usando k6 instalado no sistema

```bash
# Execute todos os testes
npm run test:performance

# Ou execute um teste específico
npm run test:performance:auth
npm run test:performance:tasks
npm run test:performance:api
npm run test:performance:spike
npm run test:performance:endurance

# Teste de autenticação com diferentes IPs
npm run test:performance:auth:different-ips
```

### Usando Docker (se k6 não estiver instalado)

```bash
# Execute todos os testes com Docker
npm run test:performance:docker

# Ou execute um teste específico com Docker
npm run test:performance:docker:auth
```

### Opções disponíveis

```
Opções:
  -t, --test       Tipo de teste (auth, tasks, api, spike, endurance, all) [padrão: auth]
  -e, --env        Ambiente (local, dev, staging) [padrão: local]
  -o, --output     Formato de saída (json, csv, html) [padrão: json]
  -d, --output-dir Diretório de saída [padrão: ../results]
  -h, --help       Mostra esta mensagem de ajuda
```

## Tipos de Testes

1. **auth-test**: Testa o fluxo de autenticação com múltiplos usuários
2. **tasks-test**: Testa operações CRUD em tarefas
3. **api-endpoints-test**: Testa os principais endpoints da API
4. **spike-test**: Simula picos de tráfego para testar resistência a cargas súbitas
5. **endurance-test**: Testa o comportamento do sistema sob carga constante por períodos prolongados

## Interpretando os Resultados

Os resultados dos testes são salvos no diretório `results` no formato especificado (json, csv). Você pode analisar esses resultados usando ferramentas como:

- [k6 Cloud](https://k6.io/cloud/)
- [Grafana k6 Dashboard](https://grafana.com/grafana/dashboards/2587)
- Scripts personalizados para processar os arquivos JSON/CSV

## Solução de Problemas

### O comando k6 não é reconhecido

Se você receber o erro `'k6' is not recognized as an internal or external command`, tente:

1. **Verificar a instalação**: Certifique-se de que o k6 está instalado corretamente:
   ```bash
   # No Windows
   where k6
   
   # No Linux/Mac
   which k6
   ```

2. **Locais verificados pelos scripts**: Os scripts foram atualizados para procurar o k6 nestes locais:
   - `%USERPROFILE%\.k6\bin\k6.exe`
   - `%LOCALAPPDATA%\Programs\k6\k6.exe`
   - `%ProgramFiles%\k6\k6.exe`
   - `%ProgramFiles(x86)%\k6\k6.exe`
   - `C:\k6\k6.exe`

3. **Adicionar ao PATH**: Se o k6 estiver instalado em um local diferente, adicione-o ao PATH do sistema:
   ```bash
   # Adicionar temporariamente ao PATH no Windows
   set PATH=%PATH%;C:\caminho\para\k6
   
   # Adicionar temporariamente ao PATH no Linux/Mac
   export PATH=$PATH:/caminho/para/k6
   ```

4. **Reiniciar o terminal**: Às vezes, é necessário reiniciar o terminal após a instalação

5. **Usar Docker**: Use os comandos com sufixo `:docker` para executar via Docker sem precisar instalar o k6:
   ```bash
   npm run test:performance:docker
   npm run test:performance:docker:auth
   ```

   Exemplo de comando Docker manual:
   ```bash
   docker run --rm -v "%cd%:/k6" grafana/k6 run /k6/src/auth-test.js
   ```

### Erro: "Muitas tentativas de login, tente novamente após 15 minutos"

O servidor possui um limitador de taxa para rotas de autenticação que restringe a 10 requisições por IP a cada 15 minutos. Para testes de performance de autenticação, você pode:

1. **Usar o teste com diferentes IPs**: 
   ```
   npm run test:performance:auth:different-ips
   ```
   
   Este teste simula diferentes IPs para cada usuário virtual, contornando a limitação de taxa.

2. **Temporariamente ajustar o limitador de taxa**: Você pode modificar o arquivo `backend/src/middleware/rateLimiter.middleware.ts` para aumentar o limite durante os testes.

3. **Focar em outros endpoints**: Teste outros endpoints que não possuem limitação tão restritiva.

### Erro de conexão com a API

Certifique-se de que:
1. O backend está em execução
2. A URL base no arquivo `data/config.json` está correta
3. Os usuários de teste existem no sistema

## Métricas Importantes

- **http_req_duration**: Tempo total de requisição
- **http_req_failed**: Taxa de falhas nas requisições
- **iterations**: Número de iterações completas do teste
- **vus**: Número de usuários virtuais
- **auth_duration**: Duração específica de autenticação (métrica personalizada)
- **successful_logins**: Contagem de logins bem-sucedidos (métrica personalizada)

## Ajustando Limiares de Performance

Edite o arquivo `data/config.json` para ajustar os limiares de performance:

```json
"thresholds": {
  "http_req_duration": ["p(95)<500"]
}
```

Isso significa que 95% das requisições devem ser concluídas em menos de 500ms.

## Referências

- [Documentação do k6](https://k6.io/docs/)
- [Melhores práticas de teste de performance](https://k6.io/docs/testing-guides/api-load-testing/)