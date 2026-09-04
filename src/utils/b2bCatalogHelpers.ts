import { Product } from '../types';

export interface MainCategoryDef {
  key: string;
  name: string;
  iconName: string;
  emoji: string;
  description: string;
  subCategories: {
    name: string;
    description: string;
    keywords: string[];
  }[];
}

export const MAIN_CATALOG_TREE: MainCategoryDef[] = [
  {
    key: 'epicerie_salee',
    name: 'Épicerie Salée',
    emoji: '🛒',
    iconName: 'ShoppingBag',
    description: 'Féculents, couscous, riz, conserves, huiles et condiments B2B.',
    subCategories: [
      {
        name: 'Féculents & Céréales',
        description: 'Pâtes, riz, couscous, lentilles, farines (sacs 1kg à 25kg)',
        keywords: ['pâte', 'spaghetti', 'riz', 'couscous', 'lentille', 'semoule', 'farine', 'féculent', 'céréale', 'sac 10kg', 'sac 25kg']
      },
      {
        name: 'Conserves & Bocaux',
        description: 'Légumes en conserve, sauces tomates, poissons en boîte, plats préparés',
        keywords: ['conserve', 'tomate', 'concentré', 'thon', 'sardine', 'légume', 'champignon', 'poisson', 'bocal']
      },
      {
        name: 'Huiles, Vinaigres & Condiments',
        description: 'Huiles (tournesol, olive), condiments, épices, moutardes, sauces (ketchup, mayo CHR)',
        keywords: ['huile', 'elio', 'fleurial', 'olive', 'tournesol', 'vinaigre', 'condiment', 'épice', 'moutarde', 'ketchup', 'mayo', 'sauce', 'chr']
      }
    ]
  },
  {
    key: 'epicerie_sucree',
    name: 'Épicerie Sucrée',
    emoji: '🍬',
    iconName: 'Cookie',
    description: 'Biscuiterie, café, sucre, confiserie et ingrédients de pâtisserie.',
    subCategories: [
      {
        name: 'Biscuits & Confiserie',
        description: 'Biscuits, bonbons, chocolats, barres céréalières, pâtes à tartiner',
        keywords: ['biscuit', 'mordjene', 'chocolat', 'bonbon', 'confiserie', 'gaufrette', 'mordjene', 'cebon', 'tartiner', 'barre']
      },
      {
        name: 'Petit-Déjeuner',
        description: 'Café (grain, moulu, dosettes), thés, sucre (poudre, morceaux), céréales, confitures',
        keywords: ['café', 'thé', 'sucre', 'confite', 'confiture', 'petit-déjeuner', 'moulu', 'grain', 'dosette', 'céréale']
      },
      {
        name: 'Pâtisserie & Ingrédients',
        description: 'Farines spéciales, levures, arômes, nappages, fruits au sirop',
        keywords: ['levure', 'arôme', 'nappage', 'pâtisserie', 'sirop', 'fruit', 'amidon', 'chocolat pâtissier']
      }
    ]
  },
  {
    key: 'laitiers_cremerie',
    name: 'Produits Laitiers & Crémerie',
    emoji: '🥛',
    iconName: 'Milk',
    description: 'Lait UHT, fromages râpés/portion, beurre pro, crème fraîche.',
    subCategories: [
      {
        name: 'Lait & Boissons lactées',
        description: 'Lait UHT (packs/palettes), laits végétaux',
        keywords: ['lait', 'uht', 'candia', 'lacté', 'pack', 'soummam']
      },
      {
        name: 'Fromages',
        description: 'Fromages à la coupe, râpés (sacs 1kg/2.5kg), portions individuelles',
        keywords: ['fromage', 'vache qui rit', 'mozzarella', 'râpé', 'portion', 'tartiner', 'camembert', 'fontaine']
      },
      {
        name: 'Beurre, Crème & Œufs',
        description: 'Beurre professionnel, crème fraîche (liquide/épaisseur), œufs frais ou liquides, margarine',
        keywords: ['beurre', 'crème', 'oeuf', 'œuf', 'margarine', 'matina', 'crème fraîche']
      }
    ]
  },
  {
    key: 'boissons',
    name: 'Boissons (Sèches & Liquides)',
    emoji: '🥤',
    iconName: 'CupSoda',
    description: 'Eaux minérales, gazouz, jus de fruits, cafés et sirops CHR.',
    subCategories: [
      {
        name: 'Eaux & Sodas',
        description: 'Eaux minérales, sodas, colas, thés glacés (bouteilles, canettes)',
        keywords: ['eau', 'soda', 'selecto', 'hamoud', 'gazouz', 'cola', 'ifri', 'saida', 'bouteille', 'canette']
      },
      {
        name: 'Jus & Sirops',
        description: 'Jus de fruits (100% pur jus, nectars), sirops professionnels pour CHR',
        keywords: ['jus', 'nectar', 'candia fruit', 'sirop', 'macedoine', 'pulpe']
      },
      {
        name: 'Boissons Chaudes',
        description: 'Café pour machines, capsules, thés & infusions',
        keywords: ['café machine', 'capsule', 'infusion', 'thé vert']
      }
    ]
  },
  {
    key: 'frais_surgeles',
    name: 'Frais & Surgelés',
    emoji: '❄️',
    iconName: 'Snowflake',
    description: 'Viandes, charcuterie CHR, frites surgelées, légumes & glaces.',
    subCategories: [
      {
        name: 'Charcuterie & Boucherie',
        description: 'Viandes sous vide, volaille, charcuterie',
        keywords: ['viand', 'poulet', 'dinde', 'kachir', 'pâté', 'saucisse', 'charcuterie', 'volaille']
      },
      {
        name: 'Produits Surgelés',
        description: 'Frites, légumes surgelés, glaces, produits traiteurs surgelés',
        keywords: ['surgelé', 'frite', 'glace', 'légume surgelé', 'croquette', 'nugget', 'poisson surgelé']
      }
    ]
  },
  {
    key: 'non_alimentaire',
    name: 'Non-Alimentaire, Emballages & Hygiène',
    emoji: '📦',
    iconName: 'Package',
    description: 'Boîtes pizza, barquettes, vaisselle jetable, produits dégraissants.',
    subCategories: [
      {
        name: 'Emballages Alimentaires',
        description: 'Barquettes, sacs, boîtes pizza, film étirable, papier cuisson',
        keywords: ['emballage', 'boîte pizza', 'boite pizza', 'barquette', 'sac plastique', 'film étirable', 'papier cuisson', 'sac alu']
      },
      {
        name: 'Vaisselle Jetable',
        description: 'Gobelets, assiettes, couverts, serviettes en papier',
        keywords: ['gobelet', 'assiette jetable', 'couvert', 'serviette', 'paille', 'serviette papier']
      },
      {
        name: 'Produits d\'Entretien',
        description: 'Dégraissants, détergents, rouleaux d\'essuie-tout, produits désinfectants',
        keywords: ['dégraissant', 'détergent', 'javel', 'essuie-tout', 'désinfectant', 'savon', 'nettoyant']
      }
    ]
  }
];

export interface TradeShortcut {
  id: 'pizzeria' | 'epicerie' | 'restaurant' | 'boulangerie';
  title: string;
  subtitle: string;
  emoji: string;
  badge: string;
  featuredKeywords: string[];
}

export const TRADE_SHORTCUTS: TradeShortcut[] = [
  {
    id: 'pizzeria',
    title: 'Pizzeria & Fast-Food',
    subtitle: 'Farine 25kg, Mozzarella râpée, Sauces, Boîtes Pizza & Sodas',
    emoji: '🍕',
    badge: 'CHR & Snack',
    featuredKeywords: ['boîte pizza', 'mozzarella', 'farine', 'sauce', 'tomate', 'mayo', 'ketchup', 'frite', 'gobelet', 'selecto', 'huile']
  },
  {
    id: 'epicerie',
    title: 'Épicerie & Supérette',
    subtitle: 'Produits grande consommation, huiles, semoules, jus & confiserie',
    emoji: '🛒',
    badge: 'Rayon Alimentaire',
    featuredKeywords: ['lio', 'semoule', 'pâte', 'candia', 'jus', 'sucre', 'mordjene', 'biscuit', 'fromage', 'café']
  },
  {
    id: 'restaurant',
    title: 'Restaurant & Café',
    subtitle: 'Formats CHR, café grain/moulu, condiments 5kg, produits d\'entretien',
    emoji: '🍽️',
    badge: 'Restauration',
    featuredKeywords: ['café', 'sucre', 'crème', 'viand', 'sauce', 'dégraissant', 'serviette', 'eau', 'jus', 'beurre']
  },
  {
    id: 'boulangerie',
    title: 'Boulangerie & Pâtisserie',
    subtitle: 'Farines spéciales 25kg, levure, beurre pro, chocolat & emballages',
    emoji: '🥖',
    badge: 'Boulanger-Pâtissier',
    featuredKeywords: ['farine', 'levure', 'beurre', 'margarine', 'chocolat', 'sucre', 'sac', 'pâtisserie', 'arôme']
  }
];

export interface VolumeShortcut {
  id: 'all' | 'unite' | 'carton' | 'palette';
  label: string;
  badge: string;
}

export const VOLUME_SHORTCUTS: VolumeShortcut[] = [
  { id: 'all', label: 'Tous les conditionnements', badge: 'Tous Volumes' },
  { id: 'unite', label: 'Unités & Boîtes', badge: 'Détail / Unité' },
  { id: 'carton', label: 'Cartons & Fardeaux', badge: 'Colisage Standard' },
  { id: 'palette', label: 'Palettes & Sacs 25kg', badge: 'Gros Volumes B2B' }
];

/**
 * Intelligent mapper to categorize any product into 1 of the 6 categories + subcategory,
 * trade suitability, packaging volume, and promo details.
 */
export function getProductMetadata(product: Product) {
  if (!product) {
    return {
      mainCategoryKey: 'epicerie_salee' as const,
      subCategory: 'Féculents & Céréales',
      packagingVolume: 'carton' as const,
      suitableTrades: ['epicerie' as const],
      isPromo: false,
      promoTag: undefined
    };
  }

  const nameStr = product.name || '';
  const catStr = product.category || '';
  const descStr = product.description || '';
  const unitStr = product.unitType || '';

  const nameLower = (nameStr + ' ' + catStr + ' ' + descStr + ' ' + unitStr).toLowerCase();

  // 1. Determine main category
  let mainCategoryKey: 'epicerie_salee' | 'epicerie_sucree' | 'laitiers_cremerie' | 'boissons' | 'frais_surgeles' | 'non_alimentaire' = 'epicerie_salee';
  let subCategory = 'Féculents & Céréales';

  if (product.mainCategoryKey) {
    mainCategoryKey = product.mainCategoryKey;
    subCategory = product.subCategory || 'Général';
  } else {
    // Auto-detect based on keywords
    if (nameLower.includes('boîte pizza') || nameLower.includes('emballage') || nameLower.includes('gobelet') || nameLower.includes('serviette') || nameLower.includes('détergent') || nameLower.includes('dégraissant')) {
      mainCategoryKey = 'non_alimentaire';
      if (nameLower.includes('pizza') || nameLower.includes('sac') || nameLower.includes('film')) subCategory = 'Emballages Alimentaires';
      else if (nameLower.includes('gobelet') || nameLower.includes('serviette') || nameLower.includes('assiette')) subCategory = 'Vaisselle Jetable';
      else subCategory = 'Produits d\'Entretien';
    } else if (nameLower.includes('jus') || nameLower.includes('soda') || nameLower.includes('eau') || nameLower.includes('selecto') || nameLower.includes('hamoud') || nameLower.includes('boisson') || nameLower.includes('nectar') || nameLower.includes('gazouz')) {
      mainCategoryKey = 'boissons';
      if (nameLower.includes('jus') || nameLower.includes('nectar')) subCategory = 'Jus & Sirops';
      else if (nameLower.includes('café') || nameLower.includes('capsule')) subCategory = 'Boissons Chaudes';
      else subCategory = 'Eaux & Sodas';
    } else if (nameLower.includes('fromage') || nameLower.includes('lait') || nameLower.includes('beurre') || nameLower.includes('crème') || nameLower.includes('matina') || nameLower.includes('vache qui rit') || nameLower.includes('mozzarella')) {
      mainCategoryKey = 'laitiers_cremerie';
      if (nameLower.includes('lait') && !nameLower.includes('fromage')) subCategory = 'Lait & Boissons lactées';
      else if (nameLower.includes('beurre') || nameLower.includes('crème') || nameLower.includes('matina')) subCategory = 'Beurre, Crème & Œufs';
      else subCategory = 'Fromages';
    } else if (nameLower.includes('biscuit') || nameLower.includes('mordjene') || nameLower.includes('chocolat') || nameLower.includes('sucre') || nameLower.includes('café') || nameLower.includes('confiserie') || nameLower.includes('levure')) {
      mainCategoryKey = 'epicerie_sucree';
      if (nameLower.includes('café') || nameLower.includes('sucre') || nameLower.includes('thé')) subCategory = 'Petit-Déjeuner';
      else if (nameLower.includes('levure') || nameLower.includes('arôme') || nameLower.includes('nappage')) subCategory = 'Pâtisserie & Ingrédients';
      else subCategory = 'Biscuits & Confiserie';
    } else if (nameLower.includes('frite') || nameLower.includes('surgelé') || nameLower.includes('viande') || nameLower.includes('kachir') || nameLower.includes('poulet')) {
      mainCategoryKey = 'frais_surgeles';
      if (nameLower.includes('viande') || nameLower.includes('kachir') || nameLower.includes('poulet')) subCategory = 'Charcuterie & Boucherie';
      else subCategory = 'Produits Surgelés';
    } else {
      mainCategoryKey = 'epicerie_salee';
      if (nameLower.includes('huile') || nameLower.includes('sauce') || nameLower.includes('mayo') || nameLower.includes('ketchup') || nameLower.includes('condiment') || nameLower.includes('épice')) {
        subCategory = 'Huiles, Vinaigres & Condiments';
      } else if (nameLower.includes('tomate') || nameLower.includes('conserve') || nameLower.includes('thon')) {
        subCategory = 'Conserves & Bocaux';
      } else {
        subCategory = 'Féculents & Céréales';
      }
    }
  }

  // 2. Determine volume packaging
  let packagingVolume: 'unite' | 'carton' | 'palette' = product.packagingVolume || 'carton';
  const unitLower = unitStr.toLowerCase();
  if (unitLower.includes('palette') || unitLower.includes('25kg') || unitLower.includes('50kg') || unitLower.includes('sac de 10') || unitLower.includes('sac de 25')) {
    packagingVolume = 'palette';
  } else if (unitLower.includes('carton') || unitLower.includes('fardeau') || unitLower.includes('pack')) {
    packagingVolume = 'carton';
  } else if (unitLower.includes('unite') || unitLower.includes('unité') || unitLower.includes('bouteille') || unitLower.includes('boîte') || unitLower.includes('pot')) {
    packagingVolume = 'unite';
  }

  // 3. Trade suitability
  const suitableTrades: ('pizzeria' | 'epicerie' | 'restaurant' | 'boulangerie')[] = product.suitableTrades || [];
  if (suitableTrades.length === 0) {
    if (nameLower.includes('pizza') || nameLower.includes('mozzarella') || nameLower.includes('sauce') || nameLower.includes('ketchup') || nameLower.includes('mayo') || nameLower.includes('frite') || nameLower.includes('25kg') || nameLower.includes('elio')) {
      suitableTrades.push('pizzeria');
    }
    if (nameLower.includes('café') || nameLower.includes('sucre') || nameLower.includes('serviette') || nameLower.includes('jus') || nameLower.includes('dégraissant') || nameLower.includes('crème')) {
      suitableTrades.push('restaurant');
    }
    if (nameLower.includes('farine') || nameLower.includes('levure') || nameLower.includes('beurre') || nameLower.includes('chocolat') || nameLower.includes('sucre')) {
      suitableTrades.push('boulangerie');
    }
    // Most products match epicerie
    suitableTrades.push('epicerie');
  }

  // 4. Promo tag
  const isPromo = Boolean(product.isPromo || (product.minOrderQty && product.minOrderQty > 10) || (product.priceHT && product.priceHT < 500));
  const promoTag = product.promoTag || (isPromo ? '5 cartons achetés = 1 offert' : undefined);

  return {
    mainCategoryKey,
    subCategory,
    packagingVolume,
    suitableTrades,
    isPromo,
    promoTag
  };
}
