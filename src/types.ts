export type UserRole = 'usine' | 'grossiste' | 'detaillant';

export type SubscriptionPlan = 'starter' | 'pro' | 'enterprise';

export interface SubscriptionInfo {
  plan: SubscriptionPlan;
  name: string;
  priceMonthlyDA: number;
  maxProducts: number;
  features: string[];
}

export interface CompanyProfile {
  id: string;
  role: UserRole;
  name: string;
  slogan: string;
  siret?: string; // Standard or legacy
  rc: string; // Registre de Commerce (ex: 16/00-0123456B22)
  rcNumber?: string;
  nif: string; // Numéro d'Identification Fiscale (ex: 002216012345678)
  nis: string; // Numéro d'Identification Statistique
  artNumber: string; // Article d'imposition (AI)
  haccpNumber: string; // Agrément Sanitaire Algérien
  certifications: string[]; // e.g. ['Norme Algérienne IANOR', 'HACCP', 'ISO 22000', 'Halal']
  address: string;
  city: string;
  postalCode: string;
  wilaya: string; // e.g. '16 - Alger', '31 - Oran', '25 - Constantine'
  region: string;
  contactEmail: string;
  contactPhone: string; // e.g. "+213 23 45 67 89"
  logoUrl?: string;
  bannerUrl?: string;
  description: string;
  
  // Specific properties
  minOrderAmountHT: number; // Minimum de commande en DA
  deliveryLeadDays: number; // Délais de livraison
  deliveryZones: string[]; // Wilayas couvertes
  coldChainAvailable: boolean;
  paymentTerms: string; // e.g. "Chèque à la livraison", "Virement / CICE", "30 jours"
  wholesaleZone?: 'essemar' | 'belfort' | 'jolie_vue' | 'cheraga' | 'bab_ezzouar' | 'autres'; // Hub grossiste en Algérie
}

export interface Product {
  id: string;
  ownerId: string; // Usine ID or Grossiste ID
  ownerName: string;
  ownerRole: 'usine' | 'grossiste';
  name: string;
  category: string; // e.g. 'Huiles & Semoules', 'Produits Laitiers', 'Boissons & Jus', 'Conserves & Sauces', 'Biscuits & Confiserie'
  mainCategoryKey?: 'epicerie_salee' | 'epicerie_sucree' | 'laitiers_cremerie' | 'boissons' | 'frais_surgeles' | 'non_alimentaire';
  subCategory?: string;
  suitableTrades?: ('pizzeria' | 'epicerie' | 'restaurant' | 'boulangerie')[];
  packagingVolume?: 'unite' | 'carton' | 'palette';
  promoTag?: string;
  isPromo?: boolean;
  sku: string;
  barcode: string; // Code-barres EAN-13
  unitType: string; // e.g. 'Fardeau de 6 Bouteilles 1.5L', 'Palette de 40 Sacs 10kg', 'Carton de 24 Briques'
  priceHT: number; // Prix HT en DA
  vatRate: number; // 9% (Taux réduit alimentaire) ou 19% (Taux normal)
  stockQuantity: number;
  minOrderQty: number; // Quantité minimale de commande
  batchNumber: string; // N° de lot
  expiryDate: string; // DLUO / DLC (YYYY-MM-DD)
  description: string;
  imageUrl: string;
  origin: string; // e.g. "Algérie - Bejaia", "Algérie - Blida"
  isPublished: boolean; // Publié pour les détaillants
  createdAt: string;
  sourceERP?: string; // Nom du logiciel source (Sage, PC Stock, DLG, Douchette, etc.)
}

export type OrderStatus = 
  | 'en_attente' 
  | 'validee' 
  | 'en_preparation' 
  | 'en_livraison' 
  | 'livree' 
  | 'annulee';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPriceHT: number; // en DA
  unitType: string;
  totalHT: number; // en DA
  vatRate: number;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. CMD-DZ-2026-0801
  buyerId: string;
  buyerName: string;
  buyerRole: UserRole;
  sellerId: string;
  sellerName: string;
  sellerRole: UserRole;
  items: OrderItem[];
  totalHT: number; // en DA
  totalTVA: number; // en DA
  totalTTC: number; // en DA
  status: OrderStatus;
  orderDate: string;
  expectedDeliveryDate: string;
  deliveryAddress: string;
  notes?: string;
  invoiceGenerated: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

// ERP Import Preset definitions
export type ERPSoftwarePreset = 'pc_stock' | 'sage_dz' | 'dlg_compta' | 'odoo_dz' | 'excel_standard';

export interface ERPImportPresetInfo {
  id: ERPSoftwarePreset;
  name: string;
  description: string;
  softwareVendor: string;
  delimiter: string;
  expectedHeaders: string[];
}

export interface Employee {
  id: string;
  companyId: string;
  fullName: string;
  roleTitle: string; // e.g., 'Chauffeur Livreur CHR', 'Chef Magasinier', 'Opérateur Ligne Conditionnement', 'Responsable Commercial'
  cnasNumber: string; // Numéro Sécurité Sociale CNAS
  contractType: 'CDI' | 'CDD' | 'SIVP' | 'CTA';
  startDate: string;
  baseSalaryDA: number; // Salaire de base imposable
  transportBonusDA: number; // Prime de transport non imposable (ex: 4000 DA)
  foodBonusDA: number; // Prime de panier (ex: 5000 DA)
  performanceBonusDA: number; // IEP / Performance
  active: boolean;
}

export interface FiscalG50Declaration {
  monthYear: string; // e.g. "Juillet 2026"
  caTTC: number;
  caHT: number;
  tvaCollectee9: number; // 9%
  tvaCollectee19: number; // 19%
  tvaDeductible: number;
  tvaNetteAPayer: number;
  tapAmount: number; // TAP 1.5% ou 1%
  irgSalarial: number; // Barème IRG retenu à la source
  timbreFiscal: number; // Espèces 1%
  totalG50ToPay: number;
  status: 'paye' | 'en_attente' | 'brouillon';
}

export interface ProfitabilityStudyData {
  monthlyCAForecastDA: number;
  purchaseCostRatioPercent: number; // e.g. 68%
  logisticsTransportCostDA: number;
  rentAndUtilitiesDA: number;
  payrollCostDA: number;
  otherOverheadsDA: number;
  targetNetMarginPercent: number;
}

export interface DouchetteScanLog {
  timestamp: string;
  barcode: string;
  status: 'added_to_cart' | 'found' | 'not_found' | 'error';
  productName?: string;
  quantityAdded?: number;
}

