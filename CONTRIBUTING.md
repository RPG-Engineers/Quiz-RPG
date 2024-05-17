# Guia de contribuição

## Git

### Convenção para o git

- Usar sempre commits semânticos
    - Exemplo: `feat(scope): adiciona funcionalidade` ou `fix(scope): corrige bug`
  - **Mais informações**: [Conventional Commits](https://www.conventionalcommits.org/pt-br/)
  - **Extensão do VScode**: [Conventional Commits](https://marketplace.visualstudio.com/items?itemName=vivaxy.vscode-conventional-commits)
- Usar sempre rebase para combinar commits da develop na main

### Problemas com o git

Caso ocorra um conflito entre sua branch local e a branch remota devido a um rebase ou situação semelhante, você pode usar o seguinte comando para resetar sua branch local para o estado da branch remota:

> [!CAUTION] 
> Antes de executar este comando, certifique-se de que todas as suas alterações locais foram salvas ou commitadas remotamente, pois este comando irá **sobrescrever** todas as alterações da sua branch local pela branch remota main.
```bash
git fetch origin
git reset --hard origin/main
```
> [!TIP] 
> Se você tiver alterações que ainda não foram commitadas, você pode querer considerar o uso do ``git stash`` antes de executar o ``git reset``. 

O stash combinado com o reset pode ser feito da seguinte forma:
```bash
git stash
git fetch origin
git reset --hard origin/main
git stash apply
```


Depois de resolvido o conflito pode prosseguir com o commitando normalmente.

<!-- TO DO:
## Coding conventions

> Code should be optimized for readability. Attach some custom style guide or reference some. i.e.:

In order to sanitize coding standards, please follow [this style guide](https://github.com/airbnb/javascript). 
-->