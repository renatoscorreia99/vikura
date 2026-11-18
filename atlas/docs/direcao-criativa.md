# Atlas Interativo da História da Humanidade
## Direção criativa · Fase 1

Este documento registra as decisões da primeira etapa: as três direções de arte exploradas, a direção recomendada, a lógica da experiência, o storyboard e a organização da interface. A versão visual e navegável está em `atlas/fase-1/index.html`.

Nada aqui é protótipo final. O objetivo da Fase 1 é escolher uma direção antes de construir.

---

## 1. Premissas

Quatro regras saem do briefing e valem para qualquer direção visual.

1. **O tempo é o território.** A linha do tempo é a tela principal. Mapa, busca e fichas respondem a ela.
2. **Aproximar muda o que se vê.** Cada nível de zoom troca o tipo de informação: sociedades, depois séculos, depois objetos.
3. **Nenhuma região é a régua das outras.** O mundo aparece em faixas regionais lado a lado. "Idade Média" e "Renascimento" são fenômenos locais e aparecem na faixa a que pertencem.
4. **O vazio faz parte do acervo.** O atlas mostra onde a pesquisa já chegou e onde ainda não chegou.

A quarta regra resolve a tensão central do projeto: o produto precisa parecer completo na demonstração e, ao mesmo tempo, não pode fingir um acervo que não existe. A saída é desenhar o vazio como parte da linguagem, e não escondê-lo.

---

## 2. Três direções de arte

As três foram desenhadas sobre o mesmo conjunto de demonstração (110 registros nomeados entre 1400 e 1600 e 2.900 pontos simulados), para que a comparação seja de linguagem visual.

### A · Arquivo Vivo

> O objeto vem primeiro. A linha do tempo é a régua discreta de uma galeria.

| | |
|---|---|
| **Identidade** | Parede branca de galeria, serifa grande e leve, objeto fotografado sobre fundo neutro, legendas de museu. A cor vem dos objetos. |
| **Paleta** | Parede `#F7F7F4` · Tinta `#121314` · Grafite `#6B6E70` · Passe-partout `#DCDCD7` · Lápis-lazúli `#24409A` |
| **Tipografia** | Cormorant Garamond (títulos e nomes de obras) + Hanken Grotesk (legendas e interface) |
| **Composição** | Um objeto em destaque no centro, os vizinhos no tempo em fila à direita, régua do período no rodapé. |
| **Navegação** | Rolagem horizontal de objeto em objeto, em ordem cronológica. A régua permite saltar. O zoom troca de sala (período). |
| **Interação** | Abrir um objeto amplia a prancha em tela cheia com a legenda ao lado. |

**Vantagens.** É a mais bonita com pouco conteúdo: dez bons objetos sustentam a experiência. Cada prancha vira uma imagem pronta para o X. Leitura calma e familiar.

**Limitações.** Depende de fotografias com licença clara. Acontecimentos sem imagem ficam em segundo plano. Simultaneidade e densidade quase não aparecem. Com milhares de registros tende a virar catálogo paginado.

### B · Observatório do Tempo

> A história como campo de pontos. A densidade é a paisagem.

| | |
|---|---|
| **Identidade** | Fundo noturno azul-índigo, pontos luminosos, tipografia monoespaçada, leituras numéricas, nenhum ornamento. |
| **Paleta** | Noite `#0B0F1E` · Bruma `#121831` · Estrela `#E9ECF5` · Seleção `#F2C66B` · cinco matizes de categoria |
| **Tipografia** | IBM Plex Mono (dados e rótulos) + IBM Plex Sans (texto) |
| **Composição** | Campo de pontos em tela cheia (tempo na horizontal, regiões na vertical), histograma de densidade no rodapé, painel de leitura flutuante. |
| **Navegação** | Zoom contínuo com roda ou pinça e arrasto. Janela de tempo selecionada no histograma. |
| **Interação** | Selecionar um ponto acende seus vínculos como arcos. Filtros recolorem o campo na hora. |

**Vantagens.** Escala muito bem para milhares de registros. Padrões, lacunas e simultaneidade aparecem de imediato. Rende bons vídeos curtos.

**Limitações.** Fria e abstrata, com pouco lugar para a imagem do objeto. Com pouco conteúdo parece um céu vazio. Pede familiaridade com visualização de dados. Pode lembrar um painel analítico, o oposto do museu que o briefing pede.

### C · Atlas da Humanidade

> Onde e quando ao mesmo tempo. O mapa conduz e a linha do tempo recorta.

| | |
|---|---|
| **Identidade** | Carta náutica e atlas impresso: mar verde-acinzentado, terra em cor de papel, rubricas em carmim, mares em itálico espaçado. |
| **Paleta** | Mar `#CFDDD8` · Terra `#F2EDDF` · Sépia `#2B2520` · Carmim `#A3303A` · Azul de rota `#2F5D7C` |
| **Tipografia** | Spectral (títulos, itálicos de mares) + Archivo Narrow (rótulos e dados) |
| **Composição** | Planisfério em dois terços da tela, legenda numerada à direita, faixa temporal por região no rodapé. |
| **Navegação** | A janela de tempo desliza no rodapé e o mapa se atualiza. Zoom geográfico e temporal são independentes. |
| **Interação** | Rotas se desenham conforme a janela avança. Clicar num alfinete abre a ficha ancorada ao lugar. |

**Vantagens.** A melhor para simultaneidade e relações entre territórios. A geografia orienta quem não domina a cronologia. Base natural para rotas, impérios e trocas.

**Limitações.** O mapa disputa o papel principal com a linha do tempo, que o briefing define como centro. Objetos sem lugar preciso ficam mal resolvidos. Fronteiras históricas pedem dados que o projeto ainda não tem. Em telas pequenas o mapa perde quase tudo.

---

## 3. Recomendação: D · Meridiano

> Um mapa em que a longitude foi trocada pelo tempo. As regiões do mundo são paralelos, faixas horizontais lado a lado. Cada instante é um meridiano: uma linha vertical que cruza todas as regiões no mesmo ano.

Nenhuma das três direções atende sozinha ao briefing. A cumpre o critério de museu e falha em escala e simultaneidade. B cumpre escala e falha em museu. C cumpre simultaneidade e tira a linha do tempo do centro. A quarta direção combina o que cada uma faz melhor.

**O que herda**

- Do Arquivo Vivo: as pranchas de objeto, a legenda de museu, a serifa editorial, a calma da página.
- Do Observatório: o sedimento de densidade, os grupos contados, as conexões entre registros.
- Do Atlas: as regiões como estrutura, o vocabulário cartográfico (escala, legenda, terra incógnita) e o planisfério como vista ligada, dentro do painel.

**Identidade**

| | Dia | Noite |
|---|---|---|
| Fundo | Gesso `#ECEEE8` | Verde-garrafa `#0E1716` |
| Texto | Tinta verde `#16201D` | Marfim `#E9EDE4` |
| Destaque | Latão `#7F540D` | Latão claro `#D9A541` |
| Meridiano e seleção | Rubrica `#A3352F` | Rubrica clara `#EE8A72` |

Seis matizes contidos identificam as categorias (poder, arte, ciência, religião, rotas, sociedade). Eles aparecem em marcas pequenas. As superfícies grandes ficam neutras para que as fotografias dos objetos sejam a cor da página.

Tipografia: **Newsreader** para títulos e nomes de obras (em itálico, como numa legenda de museu), **Hanken Grotesk** para a interface e **IBM Plex Mono** para datas e coordenadas, que precisam de algarismos alinhados.

O verde escuro e o latão vêm de duas referências do próprio assunto: a parede de cor profunda das salas de museu e os instrumentos de navegação e medição.

**Por que esta**

1. A linha do tempo fica no centro e ocupa quase toda a tela.
2. A simultaneidade é estrutural. Basta olhar na vertical, sem trocar de modo.
3. A periodização europeia deixa de ser moldura. Cada região tem a sua faixa e as suas durações. A faixa da Oceania, por exemplo, é atravessada por uma única barra: a presença contínua dos povos aborígenes da Austrália.
4. Funciona com 30 ou com 30 mil registros, porque marcas de datação e fichas são camadas separadas.
5. O vazio vira desenho. A hachura de "sem pesquisa" é parte da linguagem.

**Riscos assumidos**

- Sete faixas pedem altura. Em telas baixas as faixas ficam compactas e uma se abre por vez.
- Dividir o mundo em regiões é uma decisão editorial. Ela precisa estar explicada na página Sobre e poder mudar.
- É mais trabalhosa de implementar do que o Arquivo Vivo.
- A simulação repete o viés das fontes mais acessíveis, com a Europa super-representada (34% dos pontos). O desenho deixa isso visível na contagem de cada faixa. Compensar é trabalho de pesquisa.

---

## 4. A linha do tempo

### 4.1 Estrutura

- **Faixas regionais.** Sete, na ordem de oeste para leste, como um planisfério desenrolado: Américas, África, Europa, Ásia Ocidental e Central, Sul da Ásia, Leste e Sudeste Asiático, Oceania e Pacífico. A ordem pode ser alterada.
- **Duas camadas por faixa.** Na base, a *tira do acervo*: uma marca por registro, sempre visível, com a forma da datação. Acima, a camada editorial: barras de sociedades, grupos contados, fichas e pranchas, conforme o nível.
- **Meridiano.** Linha vertical que acompanha o cursor e mostra o ano. Pode ser fixada para um corte no tempo.
- **Minimapa.** Mostra a história inteira, a janela atual e onde o acervo tem registros.
- **Faixa aberta.** Clicar numa faixa dá a ela três vezes mais altura e pranchas grandes. As outras encolhem e continuam na tela.

### 4.2 Zoom semântico

| | Panorama | Era | Vitrine |
|---|---|---|---|
| **Janela** | acima de 1.500 anos | de 170 a 700 anos | abaixo de 90 anos |
| **Unidade** | Sociedades e Estados de longa duração | Grupos de registros e acontecimentos estruturantes | O registro individual |
| **Eixo** | Milênios e séculos | Séculos e décadas | Décadas e anos |
| **Na faixa** | Barras com nome, marcos do tempo profundo | Estados viram linhas de contexto; círculos com contagem | Pranchas com imagem e fichas de texto |
| **Rótulos** | Só o que tem largura para o nome | Só registros de peso máximo | Por prioridade: peso, imagem, espaço |
| **Tira do acervo** | Bloco de sedimento onde há registros | Sedimento em código de barras | Uma marca por registro |

Entre um nível e outro a transição é contínua: as barras de sociedades afinam até virar linhas de contexto, os grupos se desfazem em marcas. Nada desaparece. O que não cabe como ficha permanece como marca na tira do acervo e ganha ficha ao aproximar.

### 4.3 Escala do tempo

- Linear de 3200 AEC em diante.
- Logarítmica antes disso, para que 300 mil anos de pré-história caibam em cerca de 9% da largura do panorama. A quebra de escala é sinalizada no eixo.

### 4.4 Notação de datas

| Tipo | Exemplo | Desenho |
|---|---|---|
| Data exata | 1513 | Ponto cheio |
| Data aproximada | c. 1450 | Ponto vazado com margem pontilhada |
| Intervalo documentado | 1405–1433 | Barra cheia |
| Intervalo estimado | c. 1502–1521 | Barra clara, contorno tracejado |
| Datação por século | sécs. XV–XVI | Barra larga e tênue |
| Data debatida | entre 1142 e 1451 | Só o contorno pontilhado |
| Longa duração | c. 1250–1600 | A barra atravessa a janela; o rótulo acompanha a borda |

- No arquivo, anos são inteiros. Anos antes da era comum são negativos, em numeração astronômica (ISO 8601).
- Na tela, proposta: "AEC" e "EC", com opção de "a.C." e "d.C.". O ano zero nunca aparece.
- A data no calendário de origem é preservada como nota (exemplo: 919 AH).

### 4.5 Densidade

- A tira do acervo mostra todos os registros em qualquer nível. É a camada exata.
- As fichas são a camada editorial. Entram por prioridade e nunca se sobrepõem.
- Os grupos contados se recalculam com o zoom e com os filtros. Clicar num grupo aproxima até ele se desfazer.

---

## 5. Storyboard

Seis cenas, navegáveis na página da Fase 1.

### Cena 1 · Panorama: toda a história numa tela
- **Na tela.** Sete faixas regionais, de 300 mil anos atrás até hoje. Barras de sociedades e Estados de longa duração. Na base de cada faixa, a tira do acervo: hachurada onde não há pesquisa, marcada onde há registros.
- **Hierarquia.** Faixas e nomes das sociedades; depois a sala aberta (1400–1600); depois eixo e minimapa.
- **Navegação.** O cursor carrega o meridiano com o ano. Arrastar percorre o tempo.
- **Transição.** Zoom contínuo sobre 1400–1600. As barras afinam até virar linhas de contexto e o bloco de sedimento se abre em grupos contados.

### Cena 2 · Uma era de perto (1300–1700)
- **Na tela.** Estados e dinastias como linhas de contexto. Registros agrupados em círculos com contagem. Só os acontecimentos estruturantes têm rótulo.
- **Hierarquia.** Rótulos dos acontecimentos estruturantes; depois os grupos e seu tamanho; depois contexto político e eixo.
- **Navegação.** Clicar num grupo aproxima. Filtros por categoria recalculam os grupos.
- **Transição.** Zoom para 1496–1546 e abertura da faixa Ásia Ocidental e Central.

### Cena 3 · A vitrine de uma região (1496–1546)
- **Na tela.** A faixa aberta mostra pranchas de objetos e fichas de acontecimentos. As outras seguem visíveis em versão compacta. Uma marca por registro na base de cada faixa.
- **Hierarquia.** Pranchas com imagem; depois fichas de texto; depois marcas de datação e faixas vizinhas.
- **Navegação.** Clicar em outra faixa troca a vitrine. Arrastar percorre os anos.
- **Transição.** Clique na prancha do Mapa de Piri Reis. O painel entra pela direita e a linha do tempo se comprime para continuar inteira.

### Cena 4 · Um registro aberto
- **Na tela.** Painel com imagem, título, datação com grau de precisão, lugar, texto, conexões, fontes e status. A linha do tempo permanece à esquerda.
- **Hierarquia.** Imagem e título; datação e lugar; conexões; fontes, crédito e status.
- **Navegação.** Cada conexão leva a linha do tempo até o outro registro.
- **Transição.** Botão "Ver o mundo em 1513". O meridiano fica fixo.

### Cena 5 · Enquanto isso (1513 ± 5 anos)
- **Na tela.** Meridiano fixo. Registros que cruzam o corte ficam acesos e o resto recua. O painel lista até dois registros por região e mostra os pontos num planisfério.
- **Hierarquia.** Linha do meridiano e registros acesos; lista por região; planisfério.
- **Navegação.** A margem do corte muda entre ±1, ±5 e ±25 anos. Regiões sem data exata no corte dizem isso.
- **Transição.** Afastar e deslizar até 780–1030.

### Cena 6 · Um trecho em branco (780–1030)
- **Na tela.** Duzentos e cinquenta anos com oito registros. Linhas de contexto, tira do acervo hachurada e um painel com o estado do acervo.
- **Hierarquia.** A frase que explica o vazio; os poucos registros; o mapa de cobertura por região.
- **Navegação.** Atalho para o trecho mais denso. No produto, o painel também leva ao diário de pesquisa.
- **Transição.** Fim do percurso.

---

## 6. Organização da interface

**Uma tela principal e um painel que nunca a esconde.**

1. Barra superior: marca, janela de tempo atual, busca (tecla `/`), Acervo, Sobre.
2. Filtros por categoria. Região e tipo de registro entram no mesmo lugar.
3. Faixas regionais, o centro da experiência.
4. Eixo e minimapa.
5. Painel lateral: registro aberto, corte no tempo ou estado do acervo. A linha do tempo se comprime para caber ao lado.
6. Barra de nível: em que nível de zoom a pessoa está e o que cada marca significa.

**Telas do produto**

- **Explorar.** A linha do tempo. É a página inicial.
- **Registro.** Painel sobre a linha do tempo, com endereço próprio para compartilhar.
- **Busca e filtros.** Uma caixa só. Os resultados aparecem como lista e acendem na linha do tempo.
- **Acervo.** O que existe, o que está em pesquisa, o que entrou por último.
- **Sobre.** O projeto autoral, o método, os critérios de datação e a divisão em regiões.

**Celular.** O tempo corre na vertical, porque rolar já é o gesto de avançar. As faixas viram filtros de região, a tira do acervo desce pela borda direita, o painel vira uma folha que sobe da base e o meridiano vira uma lista por região.

**Primeira visita.** Abre na sala mais preenchida, e não no panorama vazio. Três convites na tela, sem tutorial: arrastar, aproximar, abrir uma faixa.

---

## 7. Conteúdo em Markdown (prévia da Fase 3)

Um registro é uma pasta com um `index.md` e suas imagens.

```yaml
---
titulo: Mapa de Piri Reis
tipo: documento          # acontecimento | processo | objeto | construcao | documento
categoria: ciencia-e-tecnica
regiao: asia-ocidental-e-central
data:
  inicio: 1513
  fim: null
  precisao: exata        # exata | aproximada | intervalo | intervalo-estimado | seculo | debatida
  nota: "919 AH, registrado no próprio mapa"
lugar:
  nome: Galípoli
  lat: 40.41
  lon: 26.67
imagens:
  - arquivo: mapa.jpg
    credito: ""          # instituição e autoria da fotografia
    licenca: ""          # domínio público, CC0, CC BY 4.0…
fontes: []               # sem fonte, o registro não sai de rascunho
conexoes:
  - id: 1492-colombo-chega-as-antilhas
    relacao: fonte citada nas anotações
peso: 3                  # 1 a 3, decide o que ganha rótulo primeiro
status: rascunho         # rascunho | em-revisao | publicado
---
```

Fluxo: escrever, validar (esquema na compilação; registro publicado sem fonte ou imagem sem licença interrompe a compilação), indexar (metadados num índice único; o texto só é lido quando o painel abre), publicar (só registros com status `publicado`).

Preparado para depois: MDX para registros mais ricos; Supabase/PostgreSQL trocando apenas a origem do índice; importação de acervos de acesso aberto com crédito e licença gravados no registro.

---

## 8. O que é real e o que é simulado

- **118 registros nomeados.** Fatos históricos conhecidos, escritos de memória como material de demonstração. Datas e descrições não foram conferidas em fontes e nenhuma fonte é citada. Não devem ser publicados como conteúdo do atlas.
- **2.900 pontos simulados.** Anônimos, gerados por semente, só entre 1400 e 1600.
- **Imagens.** Silhuetas ilustrativas no lugar de fotografias. O ambiente em que a Fase 1 foi feita não alcança os servidores de acervos abertos; as fotografias reais entram na Fase 2.
- **Rotas e posições no mapa.** Esquemáticas.

---

## 9. Decisões em aberto

| Decisão | Recomendação |
|---|---|
| Direção visual (A, B, C ou D) | D, Meridiano. É possível trazer de A as pranchas em tela cheia. |
| Notação de era | AEC / EC como padrão, a.C. / d.C. nas preferências. |
| Regiões e ordem das faixas | Sete faixas, de oeste para leste. Conferir se combina com a forma de estudar. |
| Primeira sala | O protótipo usa 1400–1600 como referência visual; a primeira época pesquisada pode ser outra. |
| Nome do produto | Os mockups usam "Atlas" como marca provisória. |

## 10. Próximas fases

- **Fase 2, protótipo funcional.** Next.js (App Router), TypeScript, Tailwind, D3 para a linha do tempo. O motor do storyboard (`fase-1/src/stage.js`) já separa estado, escala e desenho, e serve de referência para os componentes.
- **Fase 3, sistema de conteúdo.** Pastas Markdown, validação e índice.
