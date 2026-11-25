export const AMAZON_TAG_US = "paseocompacto-20";
export const AMAZON_TAG_ES = "paseocompacto-21";

export type AmazonStoreRegion = "US" | "ES";

export type AmazonCategoryType =
  | "compact-stroller"
  | "one-hand-fold"
  | "carseat-2in1"
  | "travel-bag"
  | "rain-cover"
  | "organizer";

export interface AmazonProductRecommendation {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  features: string[];
  categoryType: AmazonCategoryType;
  specs?: {
    weight: string;
    foldedMeasures: string;
    oneHandFold: string;
    trunkSpace: string;
  };
  asinUS?: string;
  asinES?: string;
  queryUS: string;
  queryES: string;
  ctaLabel: string;
}

export function buildAmazonUrl(
  product: AmazonProductRecommendation,
  region: AmazonStoreRegion
): string {
  if (region === "ES") {
    if (product.asinES) {
      return `https://www.amazon.es/dp/${product.asinES}?tag=${AMAZON_TAG_ES}`;
    }
    const q = encodeURIComponent(product.queryES);
    return `https://www.amazon.es/s?k=${q}&tag=${AMAZON_TAG_ES}`;
  }

  if (product.asinUS) {
    return `https://www.amazon.com/dp/${product.asinUS}?tag=${AMAZON_TAG_US}`;
  }
  const q = encodeURIComponent(product.queryUS);
  return `https://www.amazon.com/s?k=${q}&tag=${AMAZON_TAG_US}`;
}

export function detectUserAmazonRegion(): AmazonStoreRegion {
  if (typeof window === "undefined") {
    return "US";
  }
  try {
    const saved = window.localStorage.getItem("pc_amazon_region");
    if (saved === "US" || saved === "ES") return saved;
  } catch {
    // ignore
  }
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    const lang = (navigator.language || "").toLowerCase();
    if (
      tz === "Europe/Madrid" ||
      tz === "Atlantic/Canary" ||
      tz === "Europe/Ceuta" ||
      tz.startsWith("Europe/") ||
      lang === "es-es"
    ) {
      return "ES";
    }
    return "US";
  } catch {
    return "US";
  }
}

export const CATALOG: Record<string, AmazonProductRecommendation> = {
  INGENUITY_3DLITE: {
    id: "ingenuity-3dlite-convenience",
    badge: "🏆 Referente Equilibrio Peso-Reclinado · Ingenuity",
    title:
      "Ingenuity 3Dlite Convenience Stroller — Chasis Aluminio Ultraligero, Reclinado 4 Posiciones y Correa de Viaje",
    subtitle:
      "Uno de los modelos compactos más buscados en Amazon EE. UU. para viajes familiares: pesa solo 13 lb (5.9 kg), reclina casi plano para siestas, lleva correa de hombro integrada y soporta niños hasta 50 lb (22.6 kg).",
    features: [
      "Plegado 3D compacto con bloqueo automático lateral y correa acolchada para colgar al hombro en escaleras o aeropuertos",
      "Capota extra grande con visera abatible, canasta inferior amplia (hasta 10 lb) y bolsillo trasero con cremallera",
      "Compatible con fundas Gate Check tamaño paraguas, burbujas de lluvia universales y organizadores de doble manillar",
    ],
    categoryType: "compact-stroller",
    specs: {
      weight: "13 lb (5.9 kg) · Resiste hasta 50 lb (22.6 kg)",
      foldedMeasures: "43\" × 10\" × 12\" (109 × 25 × 30 cm)",
      oneHandFold: "Cierre rápido con pie y bloqueo lateral en 3 seg",
      trunkSpace: "Deja +75 % de la maletera libre (entra en diagonal o fondo)",
    },
    queryUS: "Ingenuity 3Dlite Convenience Stroller",
    queryES: "Ingenuity 3Dlite silla de paseo ligera",
    ctaLabel: "Ver Disponibilidad de Ingenuity 3Dlite en Amazon",
  },

  KOLCRAFT_CLOUD_PLUS: {
    id: "kolcraft-cloud-plus-lightweight",
    badge: "✋ Verdadero Plegado con 1 Sola Mano · Kolcraft",
    title:
      "Kolcraft Cloud Plus Lightweight Easy-Fold Stroller — Plegado de Pie con 1 Mano (11.8 lb / 5.3 kg)",
    subtitle:
      "Diseñado para padres que cargan al bebé en un brazo y cierran el coche con la otra mano: se pliega en un segundo desde el manillar corrido, se mantiene de pie solo e incluye doble bandeja.",
    features: [
      "Verdadero cierre con una sola mano desde la barra superior que se mantiene erguido sin tocar el piso sucio",
      "Incluye bandeja desmontable para el niño con portavasos y bandeja superior para padres + canasta accesible",
      "Soporta hasta 50 lb (22.6 kg) con ruedas delanteras con suspensión y capota extensible de 3 paneles",
    ],
    categoryType: "one-hand-fold",
    specs: {
      weight: "11.8 lb (5.3 kg) · Resiste hasta 50 lb (22.6 kg)",
      foldedMeasures: "18\" × 12\" × 34\" (46 × 30 × 86 cm)",
      oneHandFold: "100 % con 1 sola mano desde el manillar (se sostiene de pie)",
      trunkSpace: "Deja espacio para 2 maletas grandes de 23 kg en sedán",
    },
    queryUS: "Kolcraft Cloud Plus Lightweight Easy Fold Stroller",
    queryES: "Kolcraft Cloud Plus silla de paseo plegado una mano",
    ctaLabel: "Consultar Kolcraft Cloud Plus en Amazon",
  },

  DOONA_CAR_SEAT_STROLLER: {
    id: "doona-car-seat-stroller",
    badge: "✈️ Sistema 2-en-1 Certificado FAA · 0 % Maletera",
    title:
      "Doona Car Seat & Stroller — Silla de Auto Certificada Avión FAA + Coche Integrado",
    subtitle:
      "Solución integral para recién nacidos y bebés de hasta 12–15 meses que viajan en avión, taxi o Uber: presionas un botón y las ruedas se despliegan o retraen en 1 segundo sin despertar al bebé.",
    features: [
      "Certificación FAA para viajar en asiento de avión sin despachar la silla y cumple FMVSS 213 en EE. UU.",
      "No ocupa espacio en la maletera porque viaja instalada en el asiento trasero con o sin base LATCH",
      "Compatible con la mochila acolchada Doona Padded Travel Bag, el protector de lluvia Snap-On y el bolso Essentials",
    ],
    categoryType: "carseat-2in1",
    specs: {
      weight: "16.5 lb (7.5 kg) · Bebés de 4 a 35 lb y hasta 32\"",
      foldedMeasures: "23.6\" × 17.3\" × 26\" (60 × 44 × 66 cm) modo silla",
      oneHandFold: "Botón trasero + palanca telescópica en 1 segundo",
      trunkSpace: "Deja el 100 % de la maletera libre (va en asiento auto/avión)",
    },
    queryUS: "Doona Infant Car Seat Stroller",
    queryES: "Doona silla de coche y paseo 2 en 1",
    ctaLabel: "Consultar Doona 2-en-1 en Amazon",
  },

  INGENUITY_3DMINI: {
    id: "ingenuity-3dmini-convenience",
    badge: "🪶 Ultraligero Compacto (11 lb / 4.9 kg) · Ingenuity",
    title:
      "Ingenuity 3Dmini Convenience Stroller — Ultraligero 11 lb (4.9 kg) para Vuelos y Taxis",
    subtitle:
      "Alternativa ultraliviana para traslados urbanos y escapadas cortas: el 3Dmini pesa apenas 4.9 kg, entra en maleteras pequeñas de city-car y suma respaldo acolchado multiposición + 2 portavasos.",
    features: [
      "Chasis ultraligero de 11 lb fácil de subir por escaleras de metro, buses o pasarelas de aeropuerto",
      "Plegado ultradelgado de apenas 9.5\" × 10.5\" de grosor que se acomoda al lado de cualquier valija",
      "Arnés de seguridad de 5 puntos, almohadilla acolchada para siestas y bloqueo automático al cerrar",
    ],
    categoryType: "compact-stroller",
    specs: {
      weight: "11 lb (4.9 kg) · Resiste hasta 45 lb (20.4 kg)",
      foldedMeasures: "43\" × 9.5\" × 10.5\" (109 × 24 × 27 cm)",
      oneHandFold: "Cierre rápido compacto con seguro automático lateral",
      trunkSpace: "Ocupa el volumen de un paraguas grueso (+82 % cajuela libre)",
    },
    queryUS: "Ingenuity 3Dmini Convenience Stroller",
    queryES: "Ingenuity 3Dmini silla paseo ultraligera",
    ctaLabel: "Ver Disponibilidad de Ingenuity 3Dmini en Amazon",
  },

  INGENUITY_3DQUICKCLOSE: {
    id: "ingenuity-3dquickclose-cs",
    badge: "🚗 Plegado Cuadrado con 1 Mano para Hatchback",
    title:
      "Ingenuity 3Dquickclose CS+ Compact Fold Stroller — Plegado Libro Ultracorto con 1 Mano",
    subtitle:
      "A diferencia de los coches tipo paraguas largos, el 3Dquickclose pliega a la mitad en formato cuadrado compacto (solo 56 cm de largo) con una sola mano y admite silla de auto para recién nacido.",
    features: [
      "Mecanismo Quick-Close con una mano que reduce el largo total a 22 pulgadas (56 cm) para maleteras cortas",
      "Compatible con sillas de auto infantiles (sistema CS+) y canasta de gran acceso",
      "Barra frontal desmontable, reposapiés ajustable y suspensión en ruedas delanteras",
    ],
    categoryType: "one-hand-fold",
    specs: {
      weight: "17.5 lb (7.9 kg) · Resiste hasta 50 lb (22.6 kg)",
      foldedMeasures: "22\" × 20.5\" × 12.5\" (56 × 52 × 32 cm)",
      oneHandFold: "Plegado libro automático con 1 mano desde el asiento",
      trunkSpace: "Entra de pie en maleteras cortas de hatchback y SUV compactas",
    },
    queryUS: "Ingenuity 3Dquickclose CS Compact Fold Stroller",
    queryES: "Ingenuity coche compacto plegado libro una mano",
    ctaLabel: "Consultar Ingenuity 3Dquickclose en Amazon",
  },

  KOLCRAFT_CLOUD_UMBRELLA: {
    id: "kolcraft-cloud-umbrella",
    badge: "☀️ Tipo Bastón con Malla Ventilada (9.5–11 lb) · Kolcraft",
    title:
      "Kolcraft Cloud Umbrella Stroller — 9.5 a 11 lb con Capota Extensible y Respaldo Ventilado",
    subtitle:
      "Solución ligera y veloz para conexiones de aeropuerto, abuelos y viajes de verano: respaldo con malla respirable enrollable y capota amplia para proteger del sol.",
    features: [
      "Pesa menos de 11 lb con chasis estable y doble manillar acolchado de agarre alto",
      "Almohadilla de asiento enrollable que deja al descubierto malla fresca en climas cálidos y playas",
      "Incluye portavasos para padres, canasta inferior y trabas rápidas de cierre",
    ],
    categoryType: "compact-stroller",
    specs: {
      weight: "9.5–11 lb (4.3–4.9 kg) · Resiste hasta 40 lb (18 kg)",
      foldedMeasures: "41\" × 11\" × 9\" (104 × 28 × 23 cm)",
      oneHandFold: "Cierre ágil en bastón con traba lateral",
      trunkSpace: "Cabe pegado al borde de la cajuela sin quitar maletas",
    },
    queryUS: "Kolcraft Cloud Umbrella Stroller",
    queryES: "Kolcraft Cloud silla de paseo paraguas ligera",
    ctaLabel: "Consultar Kolcraft Cloud Umbrella en Amazon",
  },

  GB_POCKIT_CABIN: {
    id: "gb-pockit-all-terrain",
    badge: "🧳 Formato Cabina IATA (Cabe en Overhead Bin)",
    title:
      "gb Pockit+ All-Terrain / Stokke YOYO3 — Ultracompacto Apto Compartimento Superior de Avión",
    subtitle:
      "Si prefieres evitar la entrega en puerta de embarque (Gate Check) y subir el coche contigo a la cabina del avión o guardarlo tras el asiento del auto, su plegado ultracompacto cabe en una mochila.",
    features: [
      "Plegado ultracompacto de 2 pasos (34 × 20 × 42 cm) dentro de medidas habituales de equipaje de cabina",
      "Ruedas delanteras dobles todo terreno con bloqueo para adoquines, terminales y pasillos estrechos",
      "Compatible con mochilas acolchadas de transporte aéreo y protectores de lluvia transparentes",
    ],
    categoryType: "compact-stroller",
    specs: {
      weight: "12.3 lb (5.6 kg) · Resiste hasta 55 lb (25 kg)",
      foldedMeasures: "13.4\" × 7.9\" × 16.5\" (34 × 20 × 42 cm)",
      oneHandFold: "Plegado compacto tipo bolso en 2 movimientos",
      trunkSpace: "Entra en el piso tras el asiento del copiloto o maletera llena",
    },
    queryUS: "gb Pockit All Terrain Ultra Compact Stroller",
    queryES: "gb Pockit All Terrain silla de paseo plegado cabina avion",
    ctaLabel: "Consultar Coche de Cabina IATA en Amazon",
  },

  BAG_GATE_CHECK_TRAVEL: {
    id: "gate-check-travel-bag",
    badge: "🛡️ Protección Impermeable en Puerta de Avión",
    title:
      "J.L. Childress Gate Check Bag / Mochila Acolchada de Transporte (Paraguas, Libro y Doona)",
    subtitle:
      "Protección esencial para recibir tu coche limpio e intacto al aterrizar: funda impermeable de alta visibilidad con correas de mochila que evita raspones y manchas en la bodega.",
    features: [
      "Disponible en corte largo para coches paraguas (Ingenuity 3Dlite/3Dmini) y corte mochila acolchada para Kolcraft Cloud Plus / Doona",
      "Tela ripstop impermeable con costuras reforzadas, cierre de cordón doble y recuadro blanco para nombre y vuelo",
      "Se pliega dentro de su propio estuche de mano (18 × 14 cm) para guardarlo en la canasta del coche",
    ],
    categoryType: "travel-bag",
    specs: {
      weight: "0.7 a 2.2 lb según versión (Gate Check vs Acolchada)",
      foldedMeasures: "Se guarda plano en estuche de 7\" × 5.5\" (18 × 14 cm)",
      oneHandFold: "Cierre rápido con cordón bloqueable + solapa velcro",
      trunkSpace: "Protege la maletera del polvo y humedad de las ruedas",
    },
    queryUS:
      "J.L. Childress Gate Check Bag Stroller Umbrella Padded Travel Backpack Doona",
    queryES:
      "bolsa transporte silla paseo avion gate check impermeable mochila",
    ctaLabel: "Ver Bolsos de Transporte Compatibles en Amazon",
  },

  RAIN_COVER_UNIVERSAL: {
    id: "universal-rain-cover-eva",
    badge: "🌧️ Protector de Lluvia Transparente Libre de PVC",
    title:
      "Protector de Lluvia Universal Ventilado EVA (Ajuste Ingenuity 3Dlite, Kolcraft Cloud Plus y Doona)",
    subtitle:
      "Imprescindible si viajas a climas cambiantes, parques o ciudades ventosas: material EVA cristalino sin olor químico, malla lateral respirable contra el empañamiento y ventana frontal con cremallera.",
    features: [
      "Cubre desde la capota hasta el reposapiés con velcros elásticos inferiores que resisten ráfagas de viento",
      "Ventana frontal amplia con doble cremallera para darle agua o sacar al bebé sin desmontar la funda",
      "Plegado ultraligero en bolsa portátil que no roba espacio en la canasta ni en la maletera",
    ],
    categoryType: "rain-cover",
    specs: {
      weight: "0.6 lb (280 g) con estuche incluido",
      foldedMeasures: "9\" × 7\" × 2\" (23 × 18 × 5 cm) doblado",
      oneHandFold: "Colocación rápida de velcro en menos de 20 segundos",
      trunkSpace: "Cabe en el bolsillo trasero o canasta inferior del coche",
    },
    queryUS:
      "Universal Stroller Rain Cover EVA Waterproof Clear Window Ingenuity Kolcraft Doona",
    queryES:
      "protector lluvia silla paseo universal transparente impermeable velcro",
    ctaLabel: "Ver Protectores de Lluvia Compatibles en Amazon",
  },

  STROLLER_ORGANIZER_UNIVERSAL: {
    id: "stroller-handlebar-organizer",
    badge: "🥤 Organizador Compatible Doble Manillar y Barra Corrida",
    title:
      "Momcozy / Universal Stroller Organizer — 2 Portavasos Térmicos, Bolsillo Celular y Correa Hombro",
    subtitle:
      "Resuelve la falta de espacio en coches compactos: correas ajustables antideslizantes compatibles tanto con doble mango curvo (Ingenuity 3Dlite/3Dmini) como con barra corrida (Kolcraft / Doona).",
    features: [
      "Dos portavasos aislados térmicos que evitan derrames de biberones y café en adoquines o aeropuerto",
      "Compartimento central amplio para pañales, toallitas y pasaportes + bolsita frontal desmontable con cierre",
      "Centro de gravedad pegado al chasis que minimiza el riesgo de vuelco en coches ultraligeros",
    ],
    categoryType: "organizer",
    specs: {
      weight: "0.8 lb (360 g) resistente lavable",
      foldedMeasures: "Flexible: se pliega junto con el coche sin desmontar",
      oneHandFold: "Se convierte en bolso de hombro con un clic al abordar",
      trunkSpace: "No roba ni 1 cm de maletera y reemplaza pañaleras gigantes",
    },
    queryUS:
      "Momcozy Universal Stroller Organizer Insulated Cup Holder Detachable Pocket",
    queryES:
      "organizador carrito bebe universal portavasos termico correas",
    ctaLabel: "Ver Organizadores Compatibles en Amazon",
  },
};

export function getContextualAmazonProducts(
  slug: string,
  pillar: string,
  title: string
): {
  sectionTitle: string;
  sectionSubtitle: string;
  products: [
    AmazonProductRecommendation,
    AmazonProductRecommendation,
    AmazonProductRecommendation,
  ];
  vsCompetitor?: AmazonProductRecommendation;
} {
  const text = `${slug} ${pillar} ${title}`.toLowerCase();

  if (pillar === "comparativas-coches-de-bebe" || text.includes("-vs-")) {
    if (text.includes("doona")) {
      return {
        sectionTitle:
          "Comparativa Directa en Amazon: Doona 2-en-1 vs Kolcraft / Ingenuity",
        sectionSubtitle:
          "Compara la comodidad de la silla de auto FAA (0 % espacio en maletera) frente al coche compacto tradicional hasta 50 lb, más su bolso de protección aérea:",
        products: [
          CATALOG.DOONA_CAR_SEAT_STROLLER,
          text.includes("kolcraft")
            ? CATALOG.KOLCRAFT_CLOUD_PLUS
            : CATALOG.INGENUITY_3DLITE,
          CATALOG.BAG_GATE_CHECK_TRAVEL,
        ],
        vsCompetitor: text.includes("kolcraft")
          ? CATALOG.KOLCRAFT_CLOUD_PLUS
          : CATALOG.INGENUITY_3DLITE,
      };
    }
    if (text.includes("kolcraft") && text.includes("ingenuity")) {
      return {
        sectionTitle:
          "Duelo Clásico de Viaje en Amazon: Ingenuity 3Dlite vs Kolcraft Cloud Plus",
        sectionSubtitle:
          "Reclinado de 4 posiciones y correa al hombro (Ingenuity) frente a verdadero plegado con 1 sola mano de pie y bandejas (Kolcraft) + organizador compatible:",
        products: [
          CATALOG.INGENUITY_3DLITE,
          CATALOG.KOLCRAFT_CLOUD_PLUS,
          CATALOG.STROLLER_ORGANIZER_UNIVERSAL,
        ],
        vsCompetitor: CATALOG.KOLCRAFT_CLOUD_PLUS,
      };
    }
    if (text.includes("pockit") || text.includes("cabina") || text.includes("yoyo")) {
      return {
        sectionTitle:
          "Comparativa Cabina de Avión vs Gate Check: gb Pockit+ vs Ingenuity 3Dlite",
        sectionSubtitle:
          "Elige entre subir el coche al compartimento superior (Overhead Bin) o plegado cómodo diario con bolso protector:",
        products: [
          CATALOG.GB_POCKIT_CABIN,
          CATALOG.INGENUITY_3DLITE,
          CATALOG.BAG_GATE_CHECK_TRAVEL,
        ],
        vsCompetitor: CATALOG.INGENUITY_3DLITE,
      };
    }
    return {
      sectionTitle:
        "Modelos Destacados Comparados por Peso, Plegado 1 Mano y Maletera",
      sectionSubtitle:
        "Consulta disponibilidad actual en Amazon EE. UU. y los accesorios compatibles verificados:",
      products: [
        CATALOG.INGENUITY_3DLITE,
        CATALOG.KOLCRAFT_CLOUD_PLUS,
        CATALOG.DOONA_CAR_SEAT_STROLLER,
      ],
      vsCompetitor: CATALOG.KOLCRAFT_CLOUD_PLUS,
    };
  }

  if (
    pillar === "bolsos-de-transporte-y-fundas-avion" ||
    text.includes("bolso") ||
    text.includes("funda") ||
    text.includes("gate-check") ||
    text.includes("mochila")
  ) {
    const companion = text.includes("doona")
      ? CATALOG.DOONA_CAR_SEAT_STROLLER
      : text.includes("kolcraft")
      ? CATALOG.KOLCRAFT_CLOUD_PLUS
      : CATALOG.INGENUITY_3DLITE;
    return {
      sectionTitle:
        "Bolsos de Transporte Gate Check y Mochilas Compatibles en Amazon",
      sectionSubtitle:
        "Protege el chasis, tapizado y ruedas de golpes, lluvia y suciedad en bodega de avión o maletera:",
      products: [
        CATALOG.BAG_GATE_CHECK_TRAVEL,
        companion,
        CATALOG.RAIN_COVER_UNIVERSAL,
      ],
    };
  }

  if (
    pillar === "protectores-de-lluvia-y-clima" ||
    text.includes("lluvia") ||
    text.includes("burbuja") ||
    text.includes("mosquitero") ||
    text.includes("solar")
  ) {
    const companion = text.includes("doona")
      ? CATALOG.DOONA_CAR_SEAT_STROLLER
      : text.includes("kolcraft")
      ? CATALOG.KOLCRAFT_CLOUD_PLUS
      : CATALOG.INGENUITY_3DLITE;
    return {
      sectionTitle:
        "Protectores de Lluvia EVA Ventilados y Compatibilidad por Coche",
      sectionSubtitle:
        "Material transparente libre de PVC con ventana de cremallera, ajustado a capotas compactas:",
      products: [
        CATALOG.RAIN_COVER_UNIVERSAL,
        companion,
        CATALOG.STROLLER_ORGANIZER_UNIVERSAL,
      ],
    };
  }

  if (
    pillar === "organizadores-y-accesorios-compatibles" ||
    text.includes("organizador") ||
    text.includes("portavasos") ||
    text.includes("bandeja") ||
    text.includes("gancho")
  ) {
    return {
      sectionTitle:
        "Organizadores de Manillar y Accesorios Compatibles en Amazon",
      sectionSubtitle:
        "Diseños antideslizantes que encajan tanto en doble manillar curvo (Ingenuity) como en barra corrida (Kolcraft / Doona):",
      products: [
        CATALOG.STROLLER_ORGANIZER_UNIVERSAL,
        CATALOG.INGENUITY_3DLITE,
        CATALOG.KOLCRAFT_CLOUD_PLUS,
      ],
    };
  }

  if (
    text.includes("doona") ||
    text.includes("recien-nacido") ||
    text.includes("faa") ||
    text.includes("0-a-6") ||
    text.includes("silla-de-auto")
  ) {
    return {
      sectionTitle:
        "Sistema 2-en-1 Doona y Accesorios Certificados de Viaje en Amazon",
      sectionSubtitle:
        "Viaja desde el nacimiento sin ocupar espacio en la maletera y con protección integral en vuelos y taxis:",
      products: [
        CATALOG.DOONA_CAR_SEAT_STROLLER,
        CATALOG.BAG_GATE_CHECK_TRAVEL,
        CATALOG.RAIN_COVER_UNIVERSAL,
      ],
    };
  }

  if (
    text.includes("kolcraft") ||
    text.includes("una-mano") ||
    text.includes("1-mano") ||
    text.includes("cloud-plus") ||
    text.includes("quickclose")
  ) {
    const primary = text.includes("umbrella")
      ? CATALOG.KOLCRAFT_CLOUD_UMBRELLA
      : text.includes("quickclose")
      ? CATALOG.INGENUITY_3DQUICKCLOSE
      : CATALOG.KOLCRAFT_CLOUD_PLUS;
    return {
      sectionTitle:
        "Coches con Cierre Real con Una Sola Mano y Kit de Viaje en Amazon",
      sectionSubtitle:
        "Cierra el coche en un segundo sosteniendo a tu bebé en brazos + bolso Gate Check y protector de lluvia:",
      products: [
        primary,
        CATALOG.BAG_GATE_CHECK_TRAVEL,
        CATALOG.STROLLER_ORGANIZER_UNIVERSAL,
      ],
    };
  }

  if (
    pillar === "viajar-en-avion-cabina-y-gate-check" ||
    text.includes("cabina") ||
    text.includes("overhead") ||
    text.includes("pockit") ||
    text.includes("avion")
  ) {
    return {
      sectionTitle:
        "Coches Aptos para Avión (Cabina IATA y Gate Check) + Bolso Protector",
      sectionSubtitle:
        "Modelos ultraligeros que superan las pruebas de aeropuerto + funda impermeable recomendada en puerta de embarque:",
      products: [
        text.includes("pockit") || text.includes("overhead")
          ? CATALOG.GB_POCKIT_CABIN
          : CATALOG.INGENUITY_3DLITE,
        CATALOG.BAG_GATE_CHECK_TRAVEL,
        CATALOG.DOONA_CAR_SEAT_STROLLER,
      ],
    };
  }

  if (
    pillar === "espacio-en-maletera-y-viajes-en-auto" ||
    text.includes("maletera") ||
    text.includes("cajuela") ||
    text.includes("3dmini") ||
    text.includes("economico")
  ) {
    return {
      sectionTitle:
        "Coches Compactos que Dejan Máximo Espacio en la Maletera + Organizador",
      sectionSubtitle:
        "Cabida comprobada en sedanes y hatchbacks junto a tus maletas de viaje sin sacrificar reclinado ni comodidad:",
      products: [
        text.includes("3dmini") || text.includes("economico")
          ? CATALOG.INGENUITY_3DMINI
          : CATALOG.KOLCRAFT_CLOUD_PLUS,
        CATALOG.INGENUITY_3DLITE,
        CATALOG.STROLLER_ORGANIZER_UNIVERSAL,
      ],
    };
  }

  return {
    sectionTitle:
      "Coches Compactos de Viaje y Accesorios Compatibles en Amazon EE. UU.",
    sectionSubtitle:
      "Compara peso real, medidas plegado, cierre con 1 mano y espacio libre en la maletera junto a sus complementos clave:",
    products: [
      CATALOG.INGENUITY_3DLITE,
      CATALOG.KOLCRAFT_CLOUD_PLUS,
      CATALOG.BAG_GATE_CHECK_TRAVEL,
    ],
  };
}
