# Loja de reservas — Camões Andebol

Site de reservas de vestuário e acessórios do **Clube Desportivo Escolar Camões (Camões Andebol)**, Lisboa.
Não há pagamentos no site: as pessoas reservam e o clube contacta-as para confirmar e combinar o pagamento (MB WAY ou transferência).

## Estado

| Fase | Estado |
|---|---|
| 1. Loja pública com produtos de exemplo | ✅ feita (modo de demonstração: as reservas ainda não são guardadas) |
| 2. Supabase (base de dados e segurança) | ⏳ |
| 3. Login e painel /admin | ⏳ |
| 4. Gestão de produtos e exportação | ⏳ |
| 5. Publicação no Vercel | ⏳ |

## Onde mudar as coisas (até haver painel)

- **Produtos, preços, tamanhos, escalões:** `src/lib/catalog.ts`
- **Dados do clube (e-mail, métodos de pagamento, prazo RGPD):** `src/lib/club.ts`
- **Logótipo:** coloca o ficheiro em `public/logo.png` e ele aparece automaticamente no cabeçalho e no rodapé.
- **Fotografias:** `public/fotos/`

## Correr no computador

```bash
npm install
npm run dev   # abre http://localhost:3000
```

Tecnologia: Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · (a seguir) Supabase.
