# Loja de reservas — Camões Andebol

Site de reservas de vestuário e acessórios do **Clube Desportivo Escolar Camões (Camões Andebol)**, Lisboa.
Não há pagamentos no site: as pessoas reservam e o clube contacta-as para confirmar e combinar o pagamento (MB WAY ou transferência).

## Estado

Loja pública, encomendas guardadas na base de dados e back office (Área reservada → /admin, acesso por código) prontos.

## Configuração no Vercel (uma vez)

1. **Base de dados:** Vercel → projeto → **Storage** → **Create Database** → **Upstash for Redis** (plano grátis, região Frankfurt) → **Connect** ao projeto. O Vercel cria sozinho `KV_REST_API_URL` e `KV_REST_API_TOKEN`.
2. **Deployments → ⋯ → Redeploy.**

Sem a base de dados ligada, a loja recusa reservas ("temporariamente indisponível") em vez de as perder.

## Segurança do back office

- O acesso faz-se com um único código (Área reservada, no rodapé). Como o repositório é público, o código não está escrito em lado nenhum: guarda-se apenas a sua impressão digital (scrypt com sal) em `src/lib/auth.ts`. Qualquer outro código recebe "Código incorreto."
- A chave que assina as sessões é gerada ao acaso e guardada na base de dados (nunca no código).
- 5 tentativas falhadas bloqueiam esse endereço durante 15 minutos.
- A sessão é um cookie assinado, `HttpOnly` e `Secure`, válido 12 horas. A página `/admin` e todas as ações (marcar como paga, eliminar) verificam a sessão no servidor.
- O público só consegue criar reservas; nunca as consegue ler, alterar ou apagar.

## Onde mudar as coisas (até haver painel)

- **Produtos, preços, tamanhos, escalões:** `src/lib/catalog.ts`
- **Dados do clube (métodos de pagamento, prazo RGPD):** `src/lib/club.ts`
- **Logótipo:** coloca o ficheiro em `public/logo.png` e ele aparece automaticamente no cabeçalho e no rodapé.
- **Fotografias:** `public/fotos/`

## Correr no computador

```bash
npm install
npm run dev   # abre http://localhost:3000
```

Tecnologia: Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Upstash Redis (via Vercel).

Para testar no computador sem base de dados: `LOCAL_DB=1 npm run dev` (guarda em `.data/`).
