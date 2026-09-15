import type { AssemblyStep } from "@/lib/types";

const t = (pt: string, en: string) => ({ pt, en });

export const STEPS_TABLE: AssemblyStep[] = [
  { title: t("Prepare a superfície de trabalho", "Prepare your work surface"), detail: t("Desembale os componentes sobre uma superfície plana e macia para não riscar o tampo.", "Unpack the components on a flat, soft surface so the tabletop doesn't get scratched.") },
  { title: t("Fixe as pernas à estrutura", "Attach the legs to the frame"), detail: t("Alinhe cada perna com os furos pré-perfurados e aperte com a ferragem incluída.", "Align each leg with the pre-drilled holes and tighten using the included hardware.") },
  { title: t("Monte o tampo", "Mount the tabletop"), detail: t("Coloque o tampo sobre a estrutura e fixe pelos suportes inferiores.", "Place the tabletop onto the frame and secure it through the underside brackets.") },
  { title: t("Nivele e finalize", "Level and finish"), detail: t("Ajuste os pés niveladores e aplique o óleo de acabamento fornecido.", "Adjust the levelling feet and apply the included finishing oil.") },
];

export const STEPS_SHELF: AssemblyStep[] = [
  { title: t("Monte a estrutura lateral", "Assemble the side frame"), detail: t("Una os painéis laterais com os conectores de madeira fornecidos.", "Join the side panels using the supplied wooden connectors.") },
  { title: t("Insira as prateleiras", "Insert the shelves"), detail: t("Encaixe cada prateleira nas ranhuras correspondentes, começando de baixo para cima.", "Slot each shelf into its groove, working from the bottom up.") },
  { title: t("Fixe a estrutura à parede (opcional)", "Secure to the wall (optional)"), detail: t("Utilize os suportes anti-tombo incluídos, sobretudo em módulos altos.", "Use the included anti-tip brackets, especially for tall units.") },
];

export const STEPS_BENCH: AssemblyStep[] = [
  { title: t("Monte os apoios", "Assemble the supports"), detail: t("Fixe os dois apoios laterais à travessa central.", "Attach the two side supports to the central crossbar.") },
  { title: t("Fixe o assento", "Attach the seat"), detail: t("Posicione o assento sobre os apoios e aperte os parafusos fornecidos.", "Position the seat on top of the supports and tighten the supplied screws.") },
  { title: t("Verifique a estabilidade", "Check stability"), detail: t("Confirme que todos os apoios estão nivelados antes da primeira utilização.", "Confirm all supports are level before first use.") },
];

export const STEPS_CHAIR: AssemblyStep[] = [
  { title: t("Monte a base", "Assemble the base"), detail: t("Una as quatro pernas à estrutura do assento com os parafusos M6 incluídos.", "Join the four legs to the seat frame using the included M6 screws.") },
  { title: t("Fixe o encosto", "Attach the backrest"), detail: t("Encaixe o encosto na estrutura e aperte firmemente.", "Slot the backrest into the frame and tighten firmly.") },
  { title: t("Aplique os protetores de pé", "Apply the foot pads"), detail: t("Cole os protetores de feltro na base de cada perna.", "Stick the felt pads onto the base of each leg.") },
];

export const STEPS_BED: AssemblyStep[] = [
  { title: t("Monte a cabeceira", "Assemble the headboard"), detail: t("Fixe a cabeceira aos dois painéis laterais.", "Attach the headboard to the two side panels.") },
  { title: t("Monte a estrutura da base", "Assemble the base frame"), detail: t("Una as travessas centrais para suportar o estrado.", "Join the central slats to support the base frame.") },
  { title: t("Instale o estrado", "Install the slats"), detail: t("Encaixe as ripas do estrado nos suportes laterais.", "Slot the base slats into the side supports.") },
  { title: t("Aperte todas as ligações", "Tighten all connections"), detail: t("Reforce todos os parafusos antes de colocar o colchão.", "Re-tighten every screw before placing the mattress.") },
];

export const STEPS_CABINET: AssemblyStep[] = [
  { title: t("Monte o corpo", "Assemble the carcass"), detail: t("Una os painéis laterais, o topo e a base com os conectores excêntricos.", "Join the side panels, top and base using the cam connectors.") },
  { title: t("Instale as prateleiras internas", "Install internal shelves"), detail: t("Posicione as prateleiras ajustáveis nos suportes pré-marcados.", "Position the adjustable shelves onto the pre-marked supports.") },
  { title: t("Fixe portas ou gavetas", "Attach doors or drawers"), detail: t("Monte as dobradiças e ajuste o alinhamento das portas.", "Mount the hinges and adjust door alignment.") },
  { title: t("Verifique o acabamento", "Check the finish"), detail: t("Limpe a peça com o pano incluído para realçar o veio da madeira.", "Wipe the piece with the included cloth to bring out the wood grain.") },
];

export const STEPS_SMALL: AssemblyStep[] = [
  { title: t("Desembale com cuidado", "Unbox carefully"), detail: t("Retire todos os componentes e confirme a lista de peças.", "Remove all components and check them against the parts list.") },
  { title: t("Encaixe as peças principais", "Fit the main pieces"), detail: t("As peças encaixam sem ferramentas, por pressão.", "The pieces fit together by hand, no tools required.") },
  { title: t("Posicione no local final", "Position in place"), detail: t("Escolha uma superfície firme e nivelada.", "Choose a firm, level surface.") },
];

export const STEPS_OUTDOOR: AssemblyStep[] = [
  { title: t("Monte a estrutura", "Assemble the frame"), detail: t("Una os elementos estruturais com a ferragem resistente à intempérie.", "Join the structural elements using the weather-resistant hardware.") },
  { title: t("Fixe o assento ou tampo", "Attach the seat or top"), detail: t("Posicione e aperte firmemente todos os parafusos.", "Position and firmly tighten all screws.") },
  { title: t("Aplique o tratamento exterior", "Apply the outdoor treatment"), detail: t("Utilize o óleo protetor incluído antes da primeira exposição ao tempo.", "Use the included protective oil before first outdoor exposure.") },
];
