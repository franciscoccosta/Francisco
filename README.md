# Loja de reservas — Camões Andebol

Site de reservas de vestuário e acessórios do **Clube Desportivo Escolar Camões (Camões Andebol)**, Lisboa.
Não há pagamentos no site: as pessoas reservam e o clube contacta-as para confirmar e combinar o pagamento (MB WAY ou transferência).

## Estado

Loja pública, reservas guardadas na base de dados e back office (/login → /admin) prontos.

## Configuração no Vercel (uma vez)

1. **Base de dados:** Vercel → projeto → **Storage** → **Create Database** → **Upstash for Redis** (plano grátis, região Frankfurt) → **Connect** ao projeto. O Vercel cria sozinho `KV_REST_API_URL` e `KV_REST_API_TOKEN`.
2. **Acesso ao back office:** Vercel → **Settings → Environment Variables**:
   - `ADMIN_USERNAME` — o username de acesso
   - `ADMIN_PASSWORD` — a palavra-passe (nunca no código nem no GitHub)
3. **Deployments → ⋯ → Redeploy.**

Sem a base de dados ligada, a loja recusa reservas ("temporariamente indisponível") em vez de as perder.

## Segurança do back office

- Só há uma conta: a definida em `ADMIN_USERNAME` / `ADMIN_PASSWORD`. Qualquer outra combinação recebe "Credenciais incorretas."
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

Para testar no computador sem base de dados: `LOCAL_DB=1 ADMIN_USERNAME=… ADMIN_PASSWORD=… npm run dev` (guarda em `.data/`).
