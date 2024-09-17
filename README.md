<div align='center'><img src='Images\presentation cover.jpeg' width=500></img><div>
<h1 align='center'>QUIZ-RPG</h1>

Live site: https://rpg-engineers.github.io/Quiz-RPG/

## Descrição
<p>Quiz-RPG é um projeto de site desenvolvido majoritariamete em React, com o objetivo de oferecer aos jogadores de RPG uma opção para otimizar o tempo de preparação dos personagens, alem de facilitar o processo de criação para jogadores iniciantes. <br> A solução propota é disponibilizar ao usuário um formulário no formato de quiz. Este fomulário contem 20 perguntas que serão usadas para indicar a raça, classe e backgraund dos três personagens que melhor se encaixam nas respostas do quiz.<p>

## Funcionalidade

* <font size="3">Encontre seu personagem</font>
    * Responda um questionário simples para saber qual personagem é o ideal para sua jornada.
* <font size="3">Explore caracteristicas</font>
    * Saiba mais sobre classas, raças e backgrounds.
* <font size="3">Quiz personalizados</font>
    * Crie perguntas, respostas e personagens mais adequados para seu tipo de jogo.
* <font size="3">Exporte as alterações</font>
    * Usamos JSON para permitir exportar e importar os dados, resultados e quiz personalizados.
    * É possivel adicionar as imagens que mais se adequem com seu personagem.
* <font size="3">Precisão no Resultado</font>
    * É usado tags nas perguntas para calcular a resposta final, aumentando a precisão e coerência.
* <font size="3">Hanking</font>
    * Ao final do Quiz, é mostrado os três personagens que mais se adequam às suas respostas.

<br><br>

  <div align='center'>
      <video width=auto height='700' autoplay loop controls>    <source src="Images\VideoDemostracao.mp4"  type="video/mp4">
      </video>
    </div>

<h4 align="center"> 
    :construction:  Projeto em construção  :construction:
</h4>

## Como Funciona?
### Página inicial
Na página inicial está disponivel uma bar, aqual permite acessar as Caracteristicas, Mestre e Exportar ou Importar arqivos.

### Caracteristicas
Esta página mostra todos os cards de classes, raças e backgrounds adicionados. Cada card contem o nome da caracteristica, sua descrição e uma imagem.
O objetivo dessa parte é permitir ao usuário ter conhecimento de todas as caracterisiticas disponíveis para criar seu personagem.
Para tanto pode ser usado uma barra de pesquisa na parte superior da tela para encontrar as caracteristicas.

### Mestre
A parte do mestre disponibiliza as ferramentas essenciais para o desenvolvimento dos personagens de sua historia.<br>
Classe, raça e background permitem ao mestre adicionar novos cards. Ao acessar a página o usuário é guiado para um formulário onde pode inserir nome, descrição e a imagem do card em questão. Além disso, é pode linkar ao card as tags que julgar mais adequadas para a caracteristica em desenvolvimento, essa será usada posteriormente para relacionar a resposta do jogador à caracteristica.

### Tags
Esta página permite ao mestre criar novas tags e, consequentemente, novas possibilides de calcular as caracteristicas mais adequadas. A lógica do calculo é, ao final do quiz, observar quais tags foram mais selecionadas, quais caracteristicas estão relacionadas a essas tags e os cards cujas tags obtiveram mais seleções serão as mais adequadas para o jogador.<BR>
A tag pode ter sua cor personalizada.

### Perguntas
Na seção das perguntas é possivel personalizar as quesões de seu Quiz, criando quantas perguntas achar necessárias.
No entanto, por uma questão de limitação armazenamento, é possivel adicionar apenas até 263 alternativas para cada nova pergunta. Cada alternativa pode ser conectada com uma tag para realização do cálculo posteriormente.

### Questionário
Nessa seção é onde tudo se finda. O mestre pode montar quantos quiz quiser com as perguntas que lhe convir.
Ao iniciar o questionário, o usuário pode ver o progresso do quiz por uma barra que é preenchida conforme as questões são respondidas.

### Exportar e Importar
No canto superior o usuário pode encontrar uma pasta com as opções Exportar e Importar. A primeira permite o usuário baixar as informações atuais do site na forma de um arquivo JSON. Este pode ser compartilhado ou usado posteriormente para recuperar as informações do site. Para usar as informações do arquivo, basta selecionar Importar, navegar até o arquivo e abrí-lo.

## NPC
Apesar desta aplicação não ter sido pensada para facilitar a vida do jogador, ela pode ser usada também pelo mestre para saber qual classe, raça e background mais combinam com seu NPC.
<br>

## Autores

<a href="https://github.com/RPG-Engineers/Quiz-RPG/graphs/contributors">
  <img src="https://avatars.githubusercontent.com/u/124915887?v=4" alt="contrib.rocks image" height=50>
</a><a href="https://github.com/RPG-Engineers/Quiz-RPG/graphs/contributors">
  <img src="https://avatars.githubusercontent.com/u/106046273?v=4" alt="contrib.rocks image" height=50>
</a><a href="https://github.com/RPG-Engineers/Quiz-RPG/graphs/contributors">
  <img src="https://avatars.githubusercontent.com/u/69222902?v=4" alt="contrib.rocks image" height=50>
</a><a href="https://github.com/RPG-Engineers/Quiz-RPG/graphs/contributors">
  <img src="https://avatars.githubusercontent.com/u/150836154?v=4" alt="contrib.rocks image" height=50>
</a><a href="https://github.com/RPG-Engineers/Quiz-RPG/graphs/contributors">
  <img src="https://avatars.githubusercontent.com/u/130514344?v=4" alt="contrib.rocks image" height=50>
</a>
<br>

## Conclusão
"Exploramos calabouços de código, enfrentamos dragões de bugs e finalmente, chegamos à sala do tesouro: um quiz RPG completo e funcional. Este projeto foi uma verdadeira aventura, repleta de desafios e recompensas. E assim como em todo bom RPG, a jornada é tão importante quanto o destino."


## Tecnologias
![NPM Version](https://img.shields.io/npm/v/react?style=plastic&logo=react&logoColor=%2361DAFB)<br>
![Static Badge](https://img.shields.io/badge/Dexie%20-%20Data%20Bank%20-%20red?style=plastic&cacheSeconds=https%3A%2F%2Fdexie.org%2F&link=https%3A%2F%2Fdexie.org%2F)<br>
![Static Badge](https://img.shields.io/badge/logo-javascript-blue?logo=javascript)<br>
![Static Badge](https://img.shields.io/static/v1?style=plastic&message=ts-node&color=3178C6&logo=ts-node&logoColor=FFFFFF&label=)

![GitHub Org's stars](https://img.shields.io/github/stars/RPG-Engineers/Quiz-RPG?style=social)

