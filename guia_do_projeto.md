# Guia de Construção do Projeto: Compartilha AI

## Para Quem é Este Guia?

Este documento é para você, futuro desenvolvedor.

Ele foi escrito assumindo que você nunca construiu uma aplicação web completa antes. O objetivo não é apenas documentar o que foi feito, mas ensinar **como e por que** foi feito. Use este projeto como seu laboratório, seu exemplo, seu primeiro passo para construir suas próprias ideias.

---

## Parte 1: A Cozinha (Construindo o Backend com FastAPI)

A "cozinha" é o nosso **Backend**. É um programa que roda em um servidor, invisível para o usuário, e tem duas tarefas principais:
1.  **Executar a lógica pesada** (como falar com a IA, fazer cálculos).
2.  **Guardar e gerenciar os dados** (no nosso caso, as "sessões" de divisão de conta).

### 1.1. As Ferramentas da Cozinha (Tecnologias)

*   **Linguagem:** **Python**. Escolhido por ser uma linguagem clara, legível e excelente para iniciantes, além de ser a mais popular para trabalhar com Inteligência Artificial.
*   **Framework:** **FastAPI**. Um framework é um "kit de ferramentas e plantas" que acelera a construção. FastAPI é moderno, extremamente rápido e tem uma feature fantástica: ele cria uma documentação interativa da sua API automaticamente.
*   **Servidor:** **Uvicorn**. FastAPI escreve as "receitas", mas é o Uvicorn que "liga o fogão" e faz a cozinha funcionar, ou seja, ele executa o servidor que fica esperando os pedidos do frontend.

### 1.2. Montando a Cozinha do Zero

Vamos ver como a pasta `backend/` foi construída.

**Passo 1: O Ambiente de Trabalho (Virtual Environment)**

Antes de tudo, em um projeto Python, criamos um "ambiente virtual" (`venv`). Imagine isso como uma **caixa de ferramentas separada para cada projeto**. Isso evita que as ferramentas de um projeto se misturem com as de outro.

```bash
# 1. Navegue até a pasta do projeto
cd compartilha-ai

# 2. Crie o ambiente virtual (só precisa fazer uma vez)
python -m venv venv

# 3. Ative o ambiente (precisa fazer toda vez que for trabalhar no projeto)
# No Windows:
.\venv\Scripts\activate
# No Mac/Linux:
# source venv/bin/activate
```

**Passo 2: Instalando as Ferramentas**

Com o ambiente ativo, instalamos nossas ferramentas com o `pip`, o gerenciador de pacotes do Python.

```bash
pip install fastapi "uvicorn[standard]" python-dotenv google-generativeai pillow
```

**Passo 3: O Primeiro "Olá, Mundo" (`main.py`)**

Todo projeto FastAPI começa com um arquivo principal (nós o chamamos de `main.py`) e algumas linhas de código:

```python
# 1. Importamos a ferramenta principal do nosso kit
from fastapi import FastAPI

# 2. Criamos a "instância" da nossa aplicação. Pense nisso como
#    dar um nome ao nosso restaurante. A variável `app` é a referência
#    principal para toda a nossa API.
app = FastAPI()

# 3. Criamos nosso primeiro "endpoint" (item do cardápio).
#    O `@app.get("/")` diz: "Quando alguém acessar o endereço principal ('/'),
#    execute a função que está logo abaixo."
@app.get("/")
def read_root():
    # 4. A função retorna um dicionário, que o FastAPI converte para JSON.
    return {"message": "Bem-vindo à Cozinha!"}
```

Para testar isso, você salvaria o código acima e rodaria no terminal: `uvicorn main:app --reload`. Ao acessar `http://127.0.0.1:8000` no navegador, você veria a mensagem!

### 1.3. A Importância das Regras (Schemas com Pydantic)

**Por que usamos `schemas.py`?**

Imagine pedir um bolo e o cliente te entrega os ingredientes em um saco de papel todo amassado. Ovo quebrado, farinha derramada... um caos. Seria impossível cozinhar.

**Schemas são a receita e o formulário de pedido.** Eles garantem que o frontend (cliente) nos entregue os "ingredientes" (dados) no formato exato que precisamos.

Veja um exemplo do nosso `schemas.py`:

```python
# Importamos as ferramentas do Pydantic
from pydantic import BaseModel

# Criamos uma "classe" que herda de BaseModel. Isso a transforma em um schema.
class ItemPayload(BaseModel):
    # Definimos os campos e seus "tipos"
    nome: str          # O nome TEM que ser um texto (string)
    quantidade: int    # A quantidade TEM que ser um número inteiro
    valor_unitario: float # O valor TEM que ser um número com casas decimais (float)
```

Quando usamos isso em um endpoint, o FastAPI valida os dados automaticamente.

```python
# Em main.py
@app.post("/api/divisao/{divisao_id}/item")
# Aqui, FastAPI garante que o `item_payload` que recebemos
# seguirá as regras do schema `ItemPayload`.
async def adicionar_item_endpoint(divisao_id: str, item_payload: ItemPayload):
    # ... lógica do endpoint ...
```

Se o frontend enviar `{ "nome": "Pizza", "quantidade": "uma" }`, a API nem vai executar nossa função. Ela vai retornar um erro 422 dizendo que `"uma"` não é um número inteiro válido. Isso nos poupa de incontáveis bugs.

---

## Parte 2: O Salão do Restaurante (Construindo o Frontend com React)

O "salão" é o nosso **Frontend**. É a parte visual, interativa, que roda no navegador do usuário.

### 2.1. As Ferramentas do Salão (Tecnologias)

*   **Linguagem:** **JavaScript**. É a linguagem padrão da web, que permite criar interatividade nas páginas.
*   **Biblioteca de UI:** **React**. Uma "biblioteca" é um conjunto de códigos prontos que facilitam uma tarefa. A tarefa do React é construir interfaces de usuário (UI). A ideia principal do React é quebrar a UI em pequenos blocos reutilizáveis chamados **Componentes**. Pense neles como **peças de Lego**.
*   **Ferramenta de Build:** **Vite**. Vite cria o projeto React para nós e nos dá um servidor de desenvolvimento super-rápido que atualiza a página instantaneamente conforme codificamos.
*   **Estilização:** **TailwindCSS**. Um framework de CSS que nos permite estilizar os componentes diretamente no HTML (JSX), usando classes utilitárias como `text-white`, `font-bold`, `p-4`. É como ter peças de Lego de todas as cores e formatos à disposição.

### 2.2. Montando o Salão do Zero

**Passo 1: Criando o Projeto com Vite**

Vite torna o início de um projeto muito simples.

```bash
# 1. No terminal, na pasta onde você guarda seus projetos, rode:
npm create vite@latest

# 2. O Vite vai te fazer algumas perguntas:
#    - Project name: compartilha-ai/frontend
#    - Select a framework: React
#    - Select a variant: JavaScript

# 3. O Vite cria a pasta e a estrutura básica do projeto.
```

**Passo 2: Instalando as Ferramentas (Dependências)**

Assim como o `pip` no Python, o `npm` (Node Package Manager) instala as ferramentas para o JavaScript.

```bash
# 1. Navegue para a nova pasta
cd compartilha-ai/frontend

# 2. Instale as dependências listadas no `package.json`
npm install

# 3. Instale as ferramentas extras que usamos (axios para API, tailwind para estilo)
npm install axios
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```
*(A configuração do Tailwind envolve mais alguns passos que estão nos arquivos `tailwind.config.js` e `postcss.config.js`)*

**Passo 3: Ligando o Servidor do Salão**

```bash
npm run dev
```
Este comando inicia o servidor de desenvolvimento do Vite. Ele te dará um endereço (como `http://localhost:5173`) para abrir no navegador e ver sua aplicação ao vivo.

### 2.3. Entendendo os Componentes (As Peças de Lego)

No React, tudo é um componente. Um componente é basicamente uma função JavaScript que retorna um bloco de HTML (na verdade, JSX, que é uma mistura de JS e HTML).

**Exemplo: `ItemCard.jsx`**

```jsx
// Um componente recebe "props" (propriedades), que são dados passados
// pelo componente "pai". Aqui, recebemos o `item` e algumas funções.
export default function ItemCard({ item, onDistributeClick, onEditClick, onDeleteClick }) {
  // ... (lógica para ver se o item está completo)

  // A função retorna o JSX que será renderizado na tela.
  return (
    // Usamos classes do TailwindCSS para estilizar tudo.
    <div className="p-3 rounded-lg bg-gray-700">
      <div>
        <p className="font-bold text-white">{item.nome}</p>
        <p className="text-sm text-gray-400">
          {item.quantidade} un. x R$ {item.valor_unitario.toFixed(2)}
        </p>
      </div>
      {/* ... mais JSX ... */}
      <button onClick={() => onDistributeClick(item)}>
        Distribuir
      </button>
    </div>
  );
}
```

### 2.4. A "Memória" dos Componentes (Estado com `useState`)

Como um componente "lembra" de alguma coisa? Por exemplo, como a tela de upload lembra qual arquivo o usuário selecionou?

Para isso, usamos "Hooks" do React. O principal deles é o `useState`.

**Exemplo: `UploadScreen.jsx`**

```jsx
// 1. Importamos o `useState` do React.
import { useState } from 'react';

export default function UploadScreen({ onScanComplete }) {
  // 2. Declaramos uma "variável de estado".
  //    `useState(null)` significa: "Crie uma memória chamada `selectedFile`
  //    e seu valor inicial é `null`".
  //    `setSelectedFile` é a ÚNICA função que podemos usar para mudar esse valor.
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    // 3. Quando o usuário escolhe um arquivo, usamos a função para atualizar o estado.
    //    Quando o estado muda, o React automaticamente re-renderiza o componente
    //    para mostrar a mudança na tela (ex: a pré-visualização da imagem).
    setSelectedFile(file);
  };

  // ...
}
```

### 2.5. Conversando com a Cozinha (Fetch API e `useEffect`)

Como o frontend (salão) faz um pedido para o backend (cozinha)? Usamos a `fetch` API, que já vem nos navegadores.

Quando precisamos fazer algo assim que o componente aparece na tela (como buscar os dados iniciais), usamos outro Hook: o `useEffect`.

**Exemplo: `DistributionScreen.jsx`**

```jsx
import { useState, useEffect, useCallback } from 'react';

export default function DistributionScreen({ initialDivisionData }) {
  const [divisionData, setDivisionData] = useState(initialDivisionData);
  const [totais, setTotais] = useState(null);

  // O `useEffect` recebe uma função para executar.
  // O array no final `[divisionData]` é a "lista de dependências".
  // Isso diz ao React: "Execute esta função sempre que o valor de `divisionData` mudar".
  useEffect(() => {
    // Definimos uma função `async` para poder usar `await`.
    const fetchTotals = async () => {
      try {
        // Fazemos o "pedido" para o nosso backend.
        const response = await fetch(`http://192.168.1.103:8001/api/calcular-totais/${divisionData.id}`);
        // Convertemos a resposta JSON em um objeto JavaScript.
        const data = await response.json();
        // Atualizamos o estado `totais` com os dados recebidos.
        setTotais(data);
      } catch (error) {
        console.error(error);
      }
    };

    // Chamamos a função.
    fetchTotals();
  }, [divisionData]); // Dependência

  // ...
}
```

---

Este guia é o ponto de partida. A melhor forma de aprender é ler o código dos arquivos, ver os comentários e tentar fazer pequenas mudanças. Quebre, conserte, experimente. É assim que nos tornamos desenvolvedores. Boa sorte!
