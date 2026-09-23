# Guardar os formulários num Google Sheet

No Vercel o site não consegue guardar ficheiros. Com este passo, **cada formulário, cada foto e cada visita** passam a ficar num Google Sheet teu. As fotos ficam numa pasta do teu Google Drive. Leva cerca de 10 minutos e é gratuito.

## 1. Criar a folha e o script

1. Cria um Google Sheet novo (sheets.new) e dá-lhe um nome, por exemplo **ReMade — dados**.
2. No menu, vai a **Extensões → Apps Script**.
3. Apaga o código que lá está e cola **todo** o conteúdo de [`google-sheets.gs`](./google-sheets.gs).
4. Carrega em **Guardar** (ícone de disquete).
5. No topo, escolhe a função **`setup`** e carrega em **Executar**. O Google pede autorização:
   - escolhe a tua conta;
   - se aparecer "A Google não validou esta app", carrega em **Avançadas → Aceder a … (não seguro)**. O script é teu e só mexe nesta folha e numa pasta do teu Drive;
   - carrega em **Permitir**.

   A folha passa a ter os separadores **Resumo, Builders, Designers, Requests e Events**.

## 2. Publicar o script como "aplicação web"

1. No Apps Script, carrega em **Implementar → Nova implementação**.
2. No ícone da roda dentada, escolhe **Aplicação Web**.
3. Preenche assim:
   - **Executar como:** Eu
   - **Quem tem acesso:** **Qualquer pessoa**. É necessário para o site conseguir enviar dados. Ninguém consegue *ler* a folha por esta via.
4. Carrega em **Implementar** e copia o **URL da aplicação Web**. Termina em `/exec`.

## 3. Ligar ao Vercel

1. No Vercel, abre o projeto e vai a **Settings → Environment Variables**.
2. Adiciona estas variáveis:
   - `SUBMISSIONS_WEBHOOK_URL` = o URL que copiaste (`…/exec`)
   - `ADMIN_KEY` = uma palavra-passe tua, para abrir `/admin?key=...`
3. Vai a **Deployments**, abre o menu (⋯) da última implementação e carrega em **Redeploy**. As variáveis só entram em vigor depois de uma nova implementação.

## 4. Testar

Abre o site, preenche o formulário **"I'm looking for wood"** e confirma que aparece uma linha nova no separador **Designers**. Depois abre o separador **Resumo** para veres os números.

> Se mudares o código do script mais tarde, vai a **Implementar → Gerir implementações → editar (lápis) → Versão: Nova versão**. Assim o URL continua o mesmo.
