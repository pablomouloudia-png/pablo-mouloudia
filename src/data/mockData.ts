import { Order, SubscriptionInfo } from '../types';
import { INITIAL_COMPANIES } from './mockCompanies';
import { INITIAL_PRODUCTS } from './mockProducts';

export { INITIAL_COMPANIES, INITIAL_PRODUCTS };

export const SUBSCRIPTION_PLANS: Record<string, SubscriptionInfo> = {
  usine_pro: {
    plan: 'pro',
    name: 'Abonnement Usine Pro Algérie',
    priceMonthlyDA: 45000, // 45,000 DA / mois
    maxProducts: 2500,
    features: [
      'Importation massique automatique depuis ERP (PC Stock, Sage DZ, DLG, Odoo, Excel)',
      'Saisie & contrôle rapide par Douchette Code-Barres (EAN-13)',
      'Gestion de stock & traçabilité par N° de Lot & DLUO',
      '📊 Module Étude de Rentabilité, Marge Nette B2B & Seuil de Rentabilité',
      '📜 Module Fiscalité Algérienne (Déclarations G50, TVA 9%/19%, TAP, IBS 19%)',
      '👥 Module Gestion RH & Fiches Employés (Bulletins de Paie DZ, CNAS 9%/26%, Contrats)',
      'Facturation B2B conforme (Mentions légales: RC, NIF, NIS, Article d\'imposition)'
    ]
  },
  grossiste_pro: {
    plan: 'pro',
    name: 'Abonnement Grossiste Hub',
    priceMonthlyDA: 28000, // 28,000 DA / mois
    maxProducts: 1000,
    features: [
      'Module d\'Importation Fichier Produit ERP / Excel en 1-Clic',
      'Scanner Douchette pour inventaire physique & préparation de commandes',
      'Accès direct aux catalogues des usines partenaires (Cevital, Benamor...)',
      '📊 Module Étude de Rentabilité & Calcul Marge par Catégorie Produit',
      '📜 Module Fiscalité Algérienne (Simulateur G50, TAP 1.5%, IBS 26%, Timbre)',
      '👥 Module RH & Fiches de Paie Employés (Chauffeurs, Magasiniers, Commercial)',
      'Double stock Achat Usine & Revente Détaillants (Wilayas 01-58)'
    ]
  },
  detaillant_starter: {
    plan: 'starter',
    name: 'Abonnement Détaillant / Épicerie Pro',
    priceMonthlyDA: 8500, // 8,500 DA / mois
    maxProducts: 0,
    features: [
      'Saisie de commande ultra-rapide par Douchette Code-barres',
      'Consultation des tarifs grossistes en Dinars Algériens (DA)',
      'Commande centralisée multi-grossistes',
      'Historique des achats & Réapprovisionnement en 1-clic',
      'Support technique dédié sur l\'ensemble du territoire national'
    ]
  }
};

export const INITIAL_ORDERS: Order[] = [
  // Order placed by Grossiste 1 to Usine 1 (Cevital)
  {
    id: 'ord-101',
    orderNumber: 'CMD-DZ-2026-001',
    buyerId: 'grossiste-1',
    buyerName: 'SARL Dis-Agro Semmar (El Semmar)',
    buyerRole: 'grossiste',
    sellerId: 'usine-1',
    sellerName: 'Groupe Cevital Agro-Industrie',
    sellerRole: 'usine',
    items: [
      {
        productId: 'prod-u1-1',
        productName: 'Huile Végétale Raffinée Elio 5L (Fardeau de 4)',
        quantity: 50,
        unitPriceHT: 2600.00,
        unitType: 'Fardeau de 4 Bouteilles',
        totalHT: 130000.00,
        vatRate: 9
      },
      {
        productId: 'prod-u1-2',
        productName: 'Sucre Blanc Raffiné Cevital 1kg (Sac de 10)',
        quantity: 30,
        unitPriceHT: 900.00,
        unitType: 'Sac de 10kg',
        totalHT: 27000.00,
        vatRate: 9
      }
    ],
    totalHT: 157000.00,
    totalTVA: 14130.00,
    totalTTC: 171130.00,
    status: 'en_preparation',
    orderDate: '2026-08-01 09:15',
    expectedDeliveryDate: '2026-08-03',
    deliveryAddress: 'Zone d\'Activité Oued Smar, Lot 45, 16059 Oued Smar (Alger)',
    notes: 'Livraison par semi-remorque. Quai de déchargement N°2.',
    invoiceGenerated: true
  },

  // Order placed by Détaillant 1 to Grossiste 1
  {
    id: 'ord-102',
    orderNumber: 'CMD-DZ-2026-088',
    buyerId: 'detaillant-1',
    buyerName: 'Superette Alimentaire Bab El Oued',
    buyerRole: 'detaillant',
    sellerId: 'grossiste-1',
    sellerName: 'SARL Dis-Agro Semmar (El Semmar)',
    sellerRole: 'grossiste',
    items: [
      {
        productId: 'prod-g1-1',
        productName: 'Huile Elio 5L (Unité Bouteille)',
        quantity: 20,
        unitPriceHT: 690.00,
        unitType: 'Bouteille 5L',
        totalHT: 13800.00,
        vatRate: 9
      },
      {
        productId: 'prod-g1-2',
        productName: 'Semoule Extra Fine Amor Benamor 10kg',
        quantity: 15,
        unitPriceHT: 520.00,
        unitType: 'Sac de 10kg',
        totalHT: 7800.00,
        vatRate: 9
      },
      {
        productId: 'prod-g1-3',
        productName: 'Boisson Selecto Hamoud 1.5L (Fardeau de 6)',
        quantity: 10,
        unitPriceHT: 570.00,
        unitType: 'Fardeau de 6 Bouteilles',
        totalHT: 5700.00,
        vatRate: 19
      }
    ],
    totalHT: 27300.00,
    totalTVA: 3027.00,
    totalTTC: 30327.00,
    status: 'en_livraison',
    orderDate: '2026-08-02 11:40',
    expectedDeliveryDate: '2026-08-03',
    deliveryAddress: '18 Boulevard Colone Ramdane, 16008 Bab El Oued (Alger)',
    notes: 'Règlement par chèque à la livraison.',
    invoiceGenerated: true
  }
];
