# Análise do Layout e Componentes do Frontend - Compartilha AI

Este documento descreve a arquitetura do frontend da aplicação "Compartilha AI", detalhando o fluxo de telas e a responsabilidade de cada componente React.

## Visão Geral da Aplicação

O "Compartilha AI" é uma ferramenta para digitalizar e dividir contas (comandas de restaurante, recibos, etc.) entre várias pessoas. O fluxo principal envolve o upload de uma imagem, a extração de itens via IA, a atribuição desses itens às pessoas e, por fim, a visualização de um resumo com o valor que cada um deve pagar.

## Fluxo de Telas e Lógica Principal

A lógica de navegação e o estado global são gerenciados pelo componente `App.jsx`. Ele funciona como uma máquina de estados que renderiza a tela apropriada com base no progresso do usuário.

O fluxo é o seguinte:

1.  **Tela de Upload (`UploadScreen.jsx`)**:
    *   É a tela inicial.
    *   O usuário pode fazer o upload de uma imagem da conta ou optar por iniciar a divisão manualmente (sem itens pré-cadastrados).
    *   Após o upload, a imagem é enviada para a API (`/api/scan-comanda`) para processamento.

2.  **Diálogo de Nomes (`NomesDialog.jsx`)**:
    *   Aparece logo após o scan da imagem ser bem-sucedido ou quando o usuário inicia manualmente.
    *   O usuário insere os nomes de todas as pessoas que participarão da divisão.
    *   Ao confirmar, os dados dos itens (se houver) e os nomes das pessoas são enviados para a API (`/api/criar-divisao`) para criar uma nova sessão de divisão.

3.  **Tela de Distribuição (`DistributionScreen.jsx`)**:
    *   É a tela principal e mais interativa da aplicação.
    *   A tela é dividida em duas seções principais:
        *   **Coluna de Itens**: Lista todos os itens da conta usando o componente `ItemCard`. Permite adicionar novos itens manualmente.
        *   **Área de Pessoas**: Exibe um card para cada pessoa (`PersonCard`) com os itens já atribuídos e o subtotal.
    *   Nesta tela, o usuário pode gerenciar taxas de serviço, descontos e distribuir os itens entre as pessoas.

4.  **Tela de Resumo (`SummaryScreen.jsx`)**:
    *   É a tela final, exibida após o usuário clicar em "Finalizar" na tela de distribuição.
    *   Mostra o valor total que cada pessoa deve pagar.
    *   Oferece funcionalidades para compartilhar o resumo (ex: via WhatsApp) e para reiniciar o processo.

---

## Detalhamento dos Componentes

### Componentes de Tela (Screens)

*   **`UploadScreen.jsx`**:
    *   **Layout**: Centralizado, com um grande botão de upload de arquivo e um botão secundário para iniciar a divisão manual.
    *   **Função**: Captura a imagem da conta, exibe uma pré-visualização e a envia para a API. Gerencia o estado de `isLoading` durante o processamento.

*   **`DistributionScreen.jsx`**:
    *   **Layout**: Um dashboard dividido. À esquerda, uma lista de itens rolável. À direita, uma área para configurações (taxa/desconto) e uma lista horizontal de cards de pessoas.
    *   **Função**: Orquestra a lógica de divisão. Faz chamadas à API para atualizar o estado da divisão (adicionar/remover itens, distribuir, etc.). Renderiza os modais para ações específicas.

*   **`SummaryScreen.jsx`**:
    *   **Layout**: Tela de finalização, com foco no resumo dos valores. Apresenta uma lista clara com o nome de cada pessoa e seu total a pagar.
    *   **Função**: Exibe os dados finais calculados. Implementa a lógica de compartilhamento de texto e navegação para voltar ou reiniciar.

### Componentes Reutilizáveis (Cards)

*   **`ItemCard.jsx`**:
    *   **Layout**: Um card individual que mostra o nome, quantidade, valor unitário e valor total de um item.
    *   **Função**: Contém botões para **Editar**, **Excluir** e **Distribuir** o item. O estado visual do card muda (ex: cor de fundo) quando o item já foi completamente distribuído.

*   **`PersonCard.jsx`**:
    *   **Layout**: Um card que exibe o nome da pessoa, uma lista dos itens que lhe foram atribuídos e o cálculo do seu subtotal, taxas, descontos e total final.
    *   **Função**: Visualiza os dados de uma única pessoa, que são recebidos do componente pai (`DistributionScreen`).

### Componentes de Interação (Modais e Diálogos)

*   **`NomesDialog.jsx`**:
    *   **Layout**: Um pop-up (modal) com campos de texto para inserir nomes. Permite adicionar e remover campos dinamicamente.
    *   **Função**: Coleta os nomes dos participantes antes de iniciar a divisão.

*   **`ModalAdicionarPessoa.jsx`**:
    *   **Layout**: Modal simples com um campo de texto para o nome da nova pessoa.
    *   **Função**: Permite adicionar uma pessoa à divisão que já está em andamento.

*   **`ModalGerenciarItem.jsx`**:
    *   **Layout**: Modal com um formulário para **adicionar ou editar** um item, contendo campos para nome, quantidade e valor unitário.
    *   **Função**: Serve tanto para criar um novo item do zero quanto para editar um item existente.

*   **`ModalDistribuir.jsx`**:
    *   **Layout**: Modal complexo que permite duas formas de divisão:
        1.  **Por Quantidade**: O usuário define quantas unidades de um item cada pessoa consumiu.
        2.  **Por Valor**: O valor total do item é dividido igualmente entre as pessoas selecionadas.
    *   **Função**: Gerencia a lógica de atribuição de um item específico às pessoas.
