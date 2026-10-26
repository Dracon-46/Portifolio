# Portfólio · Arthur Gaspare Camzano

Portfólio pessoal e vitrine da **Falkyria**: Nicx, Ascend, AetherTable e Lumen.

Uma única cena WebGL acompanha a leitura: 15 mil partículas (7 mil no celular), num só
draw call, se transformam no núcleo da abertura, no slime do Nicx, na escada do Ascend,
nas cartas do AetherTable, nas colunas de dados do Lumen e, no fim, num campo de estrelas.

## Stack

| Camada | Tecnologia |
|---|---|
| Base | React 19, TypeScript, Vite 8, Tailwind CSS 4 |
| 3D | three.js + React Three Fiber, shaders GLSL próprios (morph entre formas, ruído simplex, cursor) |
| Movimento | GSAP + ScrollTrigger, Lenis, SplitType |
| Tipografia | Instrument Serif, Geist e Geist Mono (Fontsource) |

Detalhes que importam:

- a cena carrega sob demanda depois que a página fica interativa; sem WebGL2 entra um fundo estático na mesma paleta;
- a resolução do canvas cai sozinha se o FPS cair;
- com `prefers-reduced-motion`, não há rolagem suave nem animações, e a cena só redesenha quando muda de forma;
- tema escuro e claro, com a escolha salva no navegador;
- todo o texto fica em `src/content.ts`: atualizar o portfólio é editar dados, não componentes.

## Rodando

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + build em dist/
```

## Publicação

O workflow `.github/workflows/deploy.yml` gera o site e publica no GitHub Pages a cada push na `main`.
Uma vez só: **Settings → Pages → Source: GitHub Actions**.
