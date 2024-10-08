# Guia de contribuição

Para este guia é considerado o uso do [Visual Studio Code](https://code.visualstudio.com/) exclusivamente

## Lista de extensões úteis

- [Wakatime](https://marketplace.visualstudio.com/items?itemName=wakatime.vscode-wakatime) - Medidor de tempo gasto

- [Conventional Commits](https://marketplace.visualstudio.com/items?itemName=vivaxy.vscode-conventional-commits) - Auxilia a fazer Conventional Commits

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) - Auxilia a fazer o linting do código

- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) - Auxilia a fazer o formatação do código

- [Material Icon Theme](https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme) - Tema de ícones para o VSCode

## Medição do tempo para tarefas

Para uma medição de tempo mais precisa para o tempo gasto nas tarefas recomendo utilizar [Wakatime](https://wakatime.com/vs-code). É necessário criar uma conta e fazer alguns procedimentos descritos ali depois disso ele mede o tempo gasto no repositório com bastante precisão

## Git

### Convenção para o git

- Usar sempre commits semânticos
  - Exemplo: `feat(scope): adiciona funcionalidade` ou `fix(scope): corrige bug`
  - **Mais informações**: [Conventional Commits](https://www.conventionalcommits.org/pt-br/)
  - **Extensão do VScode**: [Conventional Commits](https://marketplace.visualstudio.com/items?itemName=vivaxy.vscode-conventional-commits)

- Usar sempre **rebase** ao combinar commits da `develop` na `main`, para manter o histórico linear e claro.

- **Evitar merge commits:** Quando integrar suas mudanças, use `git pull --rebase` para garantir que o histórico continue linear e evitar merges automáticos com múltiplos pais.

- Quando necessário, utilize `git commit --amend` para ajustar o commit mais recente (correções de última hora, por exemplo).

### Como Trabalhar com Histórico Linear

Para garantir um histórico linear, ao trabalhar com branches e rebases, siga as seguintes práticas:

- **Rebase antes de enviar mudanças para o repositório remoto:**
  
  Sempre rebase suas mudanças no branch principal (`main` ou `develop`) antes de fazer o push:

  ```bash
  git fetch origin
  git rebase origin/main
  ```

  Isso aplicará suas alterações em cima das mais recentes no branch principal, mantendo o histórico limpo e linear.

- **Forçar push com cuidado:** Se você alterou o histórico de commits localmente, por exemplo, após um rebase ou *amend*, será necessário um *force push* para sobrescrever o histórico remoto:

  ```bash
  git push --force-with-lease
  ```

  > **Nota:** Use sempre `--force-with-lease` ao invés de `--force`, pois ele protege contra sobrescrever commits de outras pessoas, garantindo que seu *force push* só ocorra se ninguém tiver feito push de mudanças no mesmo branch.

- **Resolvendo conflitos pós-rebase:** Se ocorrerem conflitos durante o rebase, resolva-os manualmente, adicione os arquivos corrigidos e continue o rebase:

  ```bash
  git add .
  git rebase --continue
  ```

### Problemas com o Git

Caso ocorra um conflito entre sua branch local e a branch remota devido a um rebase ou situação semelhante, você pode usar essa solução alternativa, usando o seguinte comando para resetar sua branch local para o estado da branch remota:

> [!CAUTION]
> Antes de executar este comando, certifique-se de que todas as suas alterações locais foram salvas ou commitadas remotamente, pois este comando irá **sobrescrever** todas as alterações da sua branch local pela branch remota `main`.

```bash
git fetch origin
git reset --hard origin/main
```

> [!TIP]
> Se você tiver alterações que ainda não foram commitadas, você pode querer considerar o uso do `git stash` antes de executar o `git reset`.

O stash combinado com o reset pode ser feito da seguinte forma:

```bash
git stash
git fetch origin
git reset --hard origin/main
git stash apply
```

Depois de resolvido o conflito, você pode prosseguir normalmente com os commits e o fluxo de trabalho.

---

### Dicas

Não feche uma issue manualmente, ao invés disso use a extensão Conventional Commit do VSCode e no 6º passo que diz algo como "List all breaking changes", escreva todas as issues que são completadas ou devem ser fechadas com aquele commit, veja o exemplo abaixo

```
Closes #58, Closes #59
```

Com essa mensagem no commit o Github saberá automaticamente que deverá fechar essas 2 issues quando fizer o merge com a main, aqui neste [link](https://stackoverflow.com/questions/60027222/github-how-can-i-close-the-two-issues-with-commit-message) contém mais informações sobre como isso funciona.

<!-- TO DO:
## Coding conventions

> Code should be optimized for readability. Attach some custom style guide or reference some. i.e.:

In order to sanitize coding standards, please follow [this style guide](https://github.com/airbnb/javascript).
-->
