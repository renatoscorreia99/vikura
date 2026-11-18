# Atlas Interativo da História da Humanidade

Projeto autoral: uma linha do tempo visual e navegável da história humana. Vive nesta pasta, separado do site da Vikura que ocupa a raiz do repositório.

## Fase 1 · Direção criativa (concluída, aguardando escolha)

| | |
|---|---|
| `fase-1/index.html` | Exploração visual: três direções de arte, a direção recomendada e o storyboard navegável de seis cenas. |
| `docs/direcao-criativa.md` | Documento de direção criativa, com as decisões justificadas. |

Para ver:

```sh
npx http-server -p 8765 atlas/fase-1
# abrir http://127.0.0.1:8765/
```

A página carrega D3 e as fontes pela rede.

Para editar, mexa em `fase-1/src/` e recompile:

```sh
node atlas/fase-1/build.mjs
```

```
fase-1/src/page.html     texto e estrutura da página
fase-1/src/styles.css    estilos da página, dos três mockups e do storyboard
fase-1/src/data.js       dados de demonstração e silhuetas
fase-1/src/land.json     contorno simplificado dos continentes (Natural Earth 110m, domínio público)
fase-1/src/concepts.js   mockups dos conceitos A, B e C
fase-1/src/stage.js      motor do storyboard (direção Meridiano)
fase-1/src/page.js       controles da página
```

## Sobre os dados

Os 118 registros nomeados são material de demonstração, escritos de memória e **sem validação de fontes**. Os 2.900 pontos restantes são simulados. As imagens são silhuetas ilustrativas. Nada disso é conteúdo do atlas.

## Próximas fases

- **Fase 2.** Protótipo funcional em Next.js, TypeScript, Tailwind e D3, na direção escolhida.
- **Fase 3.** Conteúdo em Markdown com frontmatter, validação e índice.
