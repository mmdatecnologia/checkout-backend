# JCPM Checkout Backend

## Ajustes e melhorias

O projeto ainda está em desenvolvimento e as próximas atualizações serão voltadas nas seguintes tarefas:

- [ ] some_task

## 💻 Pré-requisitos

Antes de começar, verifique se você atendeu aos seguintes requisitos:

- Você instalou a versão `nodejs16`
- Você instalou a versão mais recente de `yarn`
- Você tem uma máquina `<Windows / Linux / Mac>`

## 🚀 Clonando e Instalando ``<checkout-backend>``

Para clonar o repositorio `<checkout-backend>`, siga estas etapas:

```bash
git clone git@gitlab.com:jcpm-checkout/backend.git
```

Para instalar as dependencias `<checkout-backend>`, siga estas etapas:

```bash
yarn install
```

## ☕ Usando `<checkout-backend>`

Para usar `<checkout-backend>`, siga estas etapas:

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# debug watch mode
$ yarn start:debug

# production mode
$ yarn start:prod
```

## Testes

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## Gerando arquivo de change log

```bash
auto-changelog --template changelog-template.hbs -p -u --commit-limit false 
```

ou

```bash
yarn changelog 
```

- auto-changelog — comando node module
- --template changelog-template.hbs — parâmetro para configurar um arquivo de padrão para suas mensagens de changelog
- -p — use a versão SEMVER do package.json como a versão mais recente
- -u — inclui mudanças não lançadas no changelog
- --commit-limit false — remova o limite sobre o número de commits por lançamento no changelog (padrão: 3)