export const defaultSiteData = {
  navLinks: [
    { label: "Inici", href: "https://www.vilajuga.org/", active: true },
    { label: "Activitats 2026", href: "https://www.vilajuga.org/1957-2/" },
    { label: "Ludoteca", href: "https://www.vilajuga.org/ludoteca/" },
    { label: "Sobre Nosaltres", href: "https://www.vilajuga.org/about-us/" },
    { label: "Contacta'ns", href: "https://www.vilajuga.org/services/" },
    { label: "Com arribar", href: "https://www.vilajuga.org/projects/" }
  ],
  heroSlides: [
    "https://www.vilajuga.org/wp-content/uploads/2025/07/Disseny-web-banners-scaled.jpg",
    "https://www.vilajuga.org/wp-content/uploads/2025/07/de-scaled.png"
  ],
  intro: {
    title: "FESTIVAL DEL JOC DEL PENEDÈS VILAJUGA",
    description:
      "És un festival destinat a acostar els jocs de taula, jocs de rol, jocs familiars i aquelles activitats més mogudes a tot el públic, a Vilafranca del Penedès."
  },
  introGallery: [
    {
      src: "https://www.vilajuga.org/wp-content/uploads/2024/10/IMG-20191021-WA0046-1024x768.jpg",
      alt: "Participants jugant",
      tall: false
    },
    {
      src: "https://www.vilajuga.org/wp-content/uploads/2024/10/b1ae7700-2831-4f82-9d49-8f2ae1426036-1024x768.jpg",
      alt: "Taula de joc",
      tall: false
    },
    {
      src: "https://www.vilajuga.org/wp-content/uploads/2024/10/72D58D4C-E7FA-453A-AF2E-1B9322602867-576x1024.jpg",
      alt: "Espai del festival",
      tall: true
    }
  ],
  cards: [
    {
      title: "Ludoteca pròpia",
      image:
        "https://www.vilajuga.org/wp-content/uploads/2024/10/bdca90e8-1708-41a1-808a-62fc3bb2089d-1024x768.jpg",
      alt: "Ludoteca",
      text:
        "Amb una ludoteca pròpia de més de 300 jocs de taula de diferents categories i estils, podràs sol·licitar algun títol de la ludoteca o bé deixar-te assessorar pels voluntaris que organitzen les Vilajuga, per a poder-lo gaudir juntament amb la teva companyia en una de les moltes taules llestes per a tu."
    },
    {
      title: "Activitats preparades per a totes les edats",
      image:
        "https://www.vilajuga.org/wp-content/uploads/2024/10/eaeb896f-afe1-47e4-a12f-a123278cc8ae-1024x768.jpg",
      alt: "Activitats",
      text:
        "Des de torneigs de jocs de taula i jocs de cartes a espais preparats per gaudir tota la família junta, les Vilajuga disposen de diferents espais (o zones) preparades perquè puguis gaudir d'un dia d'allò més jugaire."
    },
    {
      title: "Demostracions de jocs",
      image:
        "https://www.vilajuga.org/wp-content/uploads/2025/05/Demostracio-de-jocs-1024x768.jpg",
      alt: "Demostracions de jocs",
      text:
        "Podràs gaudir de l'explicació de jocs publicats per les diferents editorials col·laboradores, així com de l'explicació de jocs que encara no han estat publicats, de la mà dels seus autors."
    }
  ],
  timelineItems: [
    {
      side: "left",
      label: "Ludoteca de lliure accés",
      subLabel: "Amb més de 300 jocs de taula!",
      iconClass: "fas fa-dice",
      title: "Jocs de taula de lliure accés",
      description:
        "Amb la nostra ludoteca, on de manera gratuïta podreu demanar aquell joc que vulgueu provar, o bé deixar-vos assessorar pels membres de l'organització."
    },
    {
      side: "right",
      label: "Explicacions de jocs publicats",
      subLabel: "De mà de les pròpies editorials col·laboradores.",
      iconClass: "fas fa-dice-d6",
      title: "Demostracions de jocs de taula",
      description:
        "Demostracions de prototips de jocs que encara no han estat publicats, explicats de la mà dels seus creadors."
    },
    {
      side: "left",
      label: "Wargames",
      subLabel: "Per poder gaudir de jocs estratègics i de recreació de guerres amb miniatures.",
      iconClass: "fas fa-dice-d20",
      title: "Jocs de rol",
      description:
        "Deixa volar la teva imaginació i protagonitza una història narrada pels nostres col·laboradors i Directors de Joc!"
    },
    {
      side: "right",
      label: "Jocs de NO taula",
      subLabel:
        "Amb tot un espai per seguir explorant maneres de divertir-se que no requereixen estar asseguts a taula.",
      iconClass: "fas fa-dice-six",
      title: "Zona de jocs familiars",
      description:
        "Zona destinada a que els més petits puguin gaudir dels seus primers jocs de taula i explorar les seves capacitats motrius i sensorials."
    }
  ],
  visit: {
    title: "Veniu a gaudir!",
    address: "Pavelló Firal de Vilafranca, Av. Catalunya, 20, 08720, Vilafranca del Penedès",
    backgroundImage: "https://www.vilajuga.org/wp-content/uploads/2025/07/Diseno-sin-titulo-3.png"
  }
};

export function cloneDefaultSiteData() {
  return JSON.parse(JSON.stringify(defaultSiteData));
}
