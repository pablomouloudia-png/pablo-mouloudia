import React, { useState } from 'react';
import {
  TrendingUp,
  Calculator,
  FileSpreadsheet,
  Users,
  DollarSign,
  Receipt,
  Building2,
  Calendar,
  CheckCircle,
  Plus,
  Printer,
  X,
  PieChart,
  Award,
  ShieldCheck,
  AlertCircle,
  Download,
  Percent,
  Briefcase,
  UserPlus,
  Eye,
  FileText
} from 'lucide-react';
import { CompanyProfile, Employee, FiscalG50Declaration, ProfitabilityStudyData } from '../types';
import { formatDA } from '../utils/formatters';

interface CommercialManagementModuleProps {
  currentCompany: CompanyProfile;
}

export const CommercialManagementModule: React.FC<CommercialManagementModuleProps> = ({
  currentCompany
}) => {
  const [activeTab, setActiveTab] = useState<'rentabilite' | 'fiscalite' | 'rh_paie'>('rentabilite');

  const isUsine = currentCompany?.role === 'usine';

  // ==========================================
  // TAB 1: ÉTUDE DE RENTABILITÉ STATE
  // ==========================================
  const [profitabilityData, setProfitabilityData] = useState<ProfitabilityStudyData>({
    monthlyCAForecastDA: isUsine ? 12500000 : 6500000,
    purchaseCostRatioPercent: isUsine ? 55 : 72,
    logisticsTransportCostDA: isUsine ? 450000 : 280000,
    rentAndUtilitiesDA: 220000,
    payrollCostDA: isUsine ? 850000 : 420000,
    otherOverheadsDA: 150000,
    targetNetMarginPercent: 12
  });

  // Calculate profitability metrics
  const monthlyCA = profitabilityData.monthlyCAForecastDA;
  const purchaseCost = (monthlyCA * profitabilityData.purchaseCostRatioPercent) / 100;
  const grossMargin = monthlyCA - purchaseCost;
  const grossMarginPercent = monthlyCA > 0 ? (grossMargin / monthlyCA) * 100 : 0;

  const totalFixedCosts = profitabilityData.rentAndUtilitiesDA + profitabilityData.payrollCostDA + profitabilityData.otherOverheadsDA;
  const totalVariableCosts = purchaseCost + profitabilityData.logisticsTransportCostDA;
  const totalExpenses = totalVariableCosts + totalFixedCosts;

  const ebitda = monthlyCA - totalExpenses;
  const netMarginPercent = monthlyCA > 0 ? (ebitda / monthlyCA) * 100 : 0;

  // Break-even Point (Seuil de Rentabilité en DA)
  const marginRatio = monthlyCA > 0 ? (grossMargin - profitabilityData.logisticsTransportCostDA) / monthlyCA : 0.2;
  const breakEvenPointDA = marginRatio > 0 ? totalFixedCosts / marginRatio : 0;

  // ==========================================
  // TAB 2: FISCALITÉ ALGÉRIENNE & G50 STATE
  // ==========================================
  const [caTva9DA, setCaTva9DA] = useState<number>(monthlyCA * 0.7);
  const [caTva19DA, setCaTva19DA] = useState<number>(monthlyCA * 0.3);
  const [tvaDeductibleInput, setTvaDeductibleInput] = useState<number>(Math.round(purchaseCost * 0.09));
  const [paymentModeCashPercent, setPaymentModeCashPercent] = useState<number>(15); // 15% cash payments

  // Calculations G50
  const totalCAHT = caTva9DA + caTva19DA;
  const tvaCollectee9 = Math.round(caTva9DA * 0.09);
  const tvaCollectee19 = Math.round(caTva19DA * 0.19);
  const totalTvaCollectee = tvaCollectee9 + tvaCollectee19;
  const tvaNetteAPayer = Math.max(0, totalTvaCollectee - tvaDeductibleInput);

  // TAP: 1.5% du CA HT (si usine ou grossiste)
  const tapRate = 0.015;
  const tapAmount = Math.round(totalCAHT * tapRate);

  // IRG Salarial (estimé sur masse salariale)
  const irgSalarialEstimated = Math.round(profitabilityData.payrollCostDA * 0.08);

  // Timbre fiscal (1% sur la part réglée en espèces)
  const cashAmount = (totalCAHT * paymentModeCashPercent) / 100;
  const timbreFiscal = Math.round(cashAmount * 0.01);

  const totalG50ToPay = tvaNetteAPayer + tapAmount + irgSalarialEstimated + timbreFiscal;

  // Rate of IBS (Impôt sur le Bénéfice des Sociétés): 19% Usine, 26% Commerce/Grossiste
  const ibsRate = currentCompany.role === 'usine' ? 19 : 26;
  const estimatedAnnualProfit = Math.max(0, ebitda * 12);
  const estimatedIbsAnnual = Math.round((estimatedAnnualProfit * ibsRate) / 100);

  // ==========================================
  // TAB 3: RH & FICHES EMPLOYÉS STATE
  // ==========================================
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: 'emp-1',
      companyId: currentCompany.id,
      fullName: 'Mohamed Reda Benali',
      roleTitle: currentCompany.role === 'usine' ? 'Responsable Ligne Conditionnement' : 'Chef Magasinier & Stock',
      cnasNumber: '840512160012',
      contractType: 'CDI',
      startDate: '2022-03-15',
      baseSalaryDA: 65000,
      transportBonusDA: 4000,
      foodBonusDA: 5000,
      performanceBonusDA: 8000,
      active: true
    },
    {
      id: 'emp-2',
      companyId: currentCompany.id,
      fullName: 'Karim Brahimi',
      roleTitle: 'Chauffeur Livreur Poids Lourds',
      cnasNumber: '900218160088',
      contractType: 'CDI',
      startDate: '2023-01-10',
      baseSalaryDA: 52000,
      transportBonusDA: 4000,
      foodBonusDA: 5000,
      performanceBonusDA: 6000,
      active: true
    },
    {
      id: 'emp-3',
      companyId: currentCompany.id,
      fullName: 'Yassine Khelifi',
      roleTitle: 'Commercial Grands Comptes B2B',
      cnasNumber: '921104160144',
      contractType: 'CDI',
      startDate: '2023-09-01',
      baseSalaryDA: 75000,
      transportBonusDA: 4000,
      foodBonusDA: 5000,
      performanceBonusDA: 15000,
      active: true
    }
  ]);

  const [selectedPayslipEmp, setSelectedPayslipEmp] = useState<Employee | null>(null);
  const [isAddEmpModalOpen, setIsAddEmpModalOpen] = useState(false);

  // Form New Employee
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpRole, setNewEmpRole] = useState('');
  const [newEmpCnas, setNewEmpCnas] = useState('');
  const [newEmpContract, setNewEmpContract] = useState<'CDI' | 'CDD'>('CDI');
  const [newEmpBaseSalary, setNewEmpBaseSalary] = useState(50000);

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpName || !newEmpRole) return;

    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      companyId: currentCompany.id,
      fullName: newEmpName,
      roleTitle: newEmpRole,
      cnasNumber: newEmpCnas || '990000160000',
      contractType: newEmpContract,
      startDate: new Date().toISOString().split('T')[0],
      baseSalaryDA: newEmpBaseSalary,
      transportBonusDA: 4000,
      foodBonusDA: 5000,
      performanceBonusDA: 5000,
      active: true
    };

    setEmployees(prev => [...prev, newEmp]);
    setIsAddEmpModalOpen(false);
    setNewEmpName('');
    setNewEmpRole('');
    setNewEmpCnas('');
  };

  // Compute Algerian Payslip for an employee
  const calculatePayslipDetails = (emp: Employee) => {
    const base = emp.baseSalaryDA;
    const iep = emp.performanceBonusDA;
    const grossImposable = base + iep;
    
    // CNAS Employee (9%)
    const cnasEmployee = Math.round(grossImposable * 0.09);
    const cnasPatronal = Math.round(grossImposable * 0.26);

    // Subject to IRG = Gross Imposable - CNAS Employee
    const subjectToIrg = grossImposable - cnasEmployee;

    // Progressive IRG scale simulation
    let irg = 0;
    if (subjectToIrg > 30000) {
      if (subjectToIrg <= 35000) irg = (subjectToIrg - 30000) * 0.23;
      else if (subjectToIrg <= 120000) irg = 1150 + (subjectToIrg - 35000) * 0.27;
      else irg = 24100 + (subjectToIrg - 120000) * 0.30;
      
      // Abattement 40% (min 1000 DA, max 1500 DA)
      const abattement = Math.min(1500, Math.max(1000, irg * 0.4));
      irg = Math.max(0, Math.round(irg - abattement));
    }

    // Non-taxable allowances
    const nonTaxablePrimes = emp.transportBonusDA + emp.foodBonusDA;
    const netToPay = Math.round(subjectToIrg - irg + nonTaxablePrimes);

    return {
      base,
      iep,
      grossImposable,
      cnasEmployee,
      cnasPatronal,
      subjectToIrg,
      irg,
      nonTaxablePrimes,
      netToPay
    };
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* 1. MODULE BANNER HEADER */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/30">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded uppercase">
                  Module Inclus dans votre Abonnement {currentCompany.role === 'usine' ? 'Usine Pro' : 'Grossiste Hub'}
                </span>
                <span className="text-xs text-slate-400 font-mono">Conforme Code des Impôts & CNAS Algérie 2026</span>
              </div>
              <h2 className="text-2xl font-extrabold text-white mt-1">
                Gestion Commerce, Fiscalité G50 & Fiches Employés RH
              </h2>
              <p className="text-xs text-slate-300">
                Outils de pilotage financier, calcul de rentabilité B2B, simulation fiscale G50/IBS et gestion de la paie du personnel.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-2xl border border-slate-800 text-xs text-slate-300">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="font-bold text-white">{currentCompany.name}</div>
              <div className="text-[10px] text-slate-400 font-mono">NIF: {currentCompany.nif || '00021600123456'}</div>
            </div>
          </div>
        </div>

        {/* SUB TABS NAVIGATION */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab('rentabilite')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'rentabilite'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-950 text-slate-300 border border-slate-800 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>1. Étude de Rentabilité & Marges Nettes</span>
          </button>

          <button
            onClick={() => setActiveTab('fiscalite')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'fiscalite'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-950 text-slate-300 border border-slate-800 hover:text-white'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>2. Fiscalité Algérienne (Déclaration G50 & IBS)</span>
          </button>

          <button
            onClick={() => setActiveTab('rh_paie')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'rh_paie'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-950 text-slate-300 border border-slate-800 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>3. Fiches Employés, CNAS & Bulletins de Paie ({employees.length})</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ÉTUDE DE RENTABILITÉ & MARGES                                      */}
      {/* ========================================================================= */}
      {activeTab === 'rentabilite' && (
        <div className="space-y-6">
          
          {/* KPI CARDS OVERVIEW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">Chiffre d'Affaires Prévisionnel</span>
              <div className="text-xl font-black text-white font-mono">{formatDA(monthlyCA)} HT</div>
              <span className="text-[10px] text-amber-400 font-bold">Par Mois / Horizon Commercial</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">Marge Brute B2B</span>
              <div className="text-xl font-black text-emerald-400 font-mono">
                {formatDA(grossMargin)} ({grossMarginPercent.toFixed(1)}%)
              </div>
              <span className="text-[10px] text-slate-400">Après coût d'achat marchandises</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">Résultat Nette Mensuel (EBITDA)</span>
              <div className={`text-xl font-black font-mono ${ebitda >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {formatDA(ebitda)} ({netMarginPercent.toFixed(1)}%)
              </div>
              <span className="text-[10px] text-slate-400">Après charges fixes & logistique</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">Seuil de Rentabilité (Point Mort)</span>
              <div className="text-xl font-black text-amber-400 font-mono">
                {formatDA(breakEvenPointDA)} HT
              </div>
              <span className="text-[10px] text-slate-400">CA minimum mensuel requis</span>
            </div>

          </div>

          {/* SIMULATION FORM & VISUAL BREAKDOWN */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: Form Sliders / Inputs */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-amber-400" />
                  <h3 className="text-sm font-extrabold text-white">
                    Simulateur de Structure de Coûts B2B ({currentCompany.role === 'usine' ? 'Usine' : 'Grossiste'})
                  </h3>
                </div>
                <span className="text-xs text-amber-300 font-bold">Variables Modifiables</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* CA Forecast */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">CA Mensuel Prévisionnel (DA HT)</label>
                  <input
                    type="number"
                    value={profitabilityData.monthlyCAForecastDA}
                    onChange={(e) => setProfitabilityData(prev => ({ ...prev, monthlyCAForecastDA: Math.max(0, parseInt(e.target.value, 10) || 0) }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-amber-400 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Purchase Cost % */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-300">
                    <span>Part Coût d'Achat / Matières Premières</span>
                    <span className="text-amber-400 font-mono">{profitabilityData.purchaseCostRatioPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min={30}
                    max={90}
                    value={profitabilityData.purchaseCostRatioPercent}
                    onChange={(e) => setProfitabilityData(prev => ({ ...prev, purchaseCostRatioPercent: parseInt(e.target.value, 10) }))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-500">
                    {currentCompany.role === 'usine' ? 'Matières premières & Emballages' : 'Achat direct usines'} : {formatDA(purchaseCost)} DA
                  </span>
                </div>

                {/* Logistics */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Frais de Transport, Carburant & Livraisons (DA)</label>
                  <input
                    type="number"
                    value={profitabilityData.logisticsTransportCostDA}
                    onChange={(e) => setProfitabilityData(prev => ({ ...prev, logisticsTransportCostDA: Math.max(0, parseInt(e.target.value, 10) || 0) }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Rent & Sonelgaz */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Loyer Dépôt / Entrepôt & Sonelgaz (DA)</label>
                  <input
                    type="number"
                    value={profitabilityData.rentAndUtilitiesDA}
                    onChange={(e) => setProfitabilityData(prev => ({ ...prev, rentAndUtilitiesDA: Math.max(0, parseInt(e.target.value, 10) || 0) }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Payroll */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Masse Salariale Mensuelle (Salaires + CNAS) (DA)</label>
                  <input
                    type="number"
                    value={profitabilityData.payrollCostDA}
                    onChange={(e) => setProfitabilityData(prev => ({ ...prev, payrollCostDA: Math.max(0, parseInt(e.target.value, 10) || 0) }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Other Overheads */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Autres Frais Généraux & Assurances (DA)</label>
                  <input
                    type="number"
                    value={profitabilityData.otherOverheadsDA}
                    onChange={(e) => setProfitabilityData(prev => ({ ...prev, otherOverheadsDA: Math.max(0, parseInt(e.target.value, 10) || 0) }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

              </div>

              {/* Summary Table */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between font-bold text-slate-300 border-b border-slate-800 pb-2">
                  <span>Poste de Dépense / Marge</span>
                  <span>Montant Mensuel HT</span>
                  <span>% du CA</span>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span>Achat Marchandises / Matières Premières</span>
                  <span className="font-mono">{formatDA(purchaseCost)}</span>
                  <span className="font-mono text-amber-400 font-bold">{profitabilityData.purchaseCostRatioPercent}%</span>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span>Transport & Logistique Flotte</span>
                  <span className="font-mono">{formatDA(profitabilityData.logisticsTransportCostDA)}</span>
                  <span className="font-mono text-slate-400">{((profitabilityData.logisticsTransportCostDA / monthlyCA) * 100).toFixed(1)}%</span>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span>Charges Fixes (Loyer, Salaires, Dépôt, Assurances)</span>
                  <span className="font-mono">{formatDA(totalFixedCosts)}</span>
                  <span className="font-mono text-slate-400">{((totalFixedCosts / monthlyCA) * 100).toFixed(1)}%</span>
                </div>

                <div className="flex justify-between text-emerald-400 font-extrabold pt-2 border-t border-slate-800 text-sm">
                  <span>Marge Nette B2B Avant Impôt (EBITDA)</span>
                  <span className="font-mono">{formatDA(ebitda)} HT</span>
                  <span className="font-mono">{netMarginPercent.toFixed(1)}%</span>
                </div>
              </div>

            </div>

            {/* Right 1 Col: Visual Breakdown & Margins by Category */}
            <div className="space-y-4">
              
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <PieChart className="w-4 h-4 text-amber-400" />
                  <h4 className="text-xs font-extrabold text-white">Répartition Visuelle pour 100 DA Récoltés</h4>
                </div>

                {/* Progress Stacked Bar */}
                <div className="h-6 w-full bg-slate-950 rounded-xl overflow-hidden flex border border-slate-800">
                  <div
                    style={{ width: `${profitabilityData.purchaseCostRatioPercent}%` }}
                    className="bg-amber-500 h-full text-[9px] font-bold text-slate-950 flex items-center justify-center"
                    title="Achat"
                  >
                    {profitabilityData.purchaseCostRatioPercent}%
                  </div>
                  <div
                    style={{ width: `${((profitabilityData.logisticsTransportCostDA / monthlyCA) * 100).toFixed(1)}%` }}
                    className="bg-blue-500 h-full text-[9px] font-bold text-white flex items-center justify-center"
                    title="Transport"
                  >
                    Logistique
                  </div>
                  <div
                    style={{ width: `${((totalFixedCosts / monthlyCA) * 100).toFixed(1)}%` }}
                    className="bg-purple-500 h-full text-[9px] font-bold text-white flex items-center justify-center"
                    title="Salaires & Fixes"
                  >
                    Fixes
                  </div>
                  <div
                    style={{ width: `${Math.max(0, netMarginPercent)}%` }}
                    className="bg-emerald-500 h-full text-[9px] font-bold text-slate-950 flex items-center justify-center"
                    title="Marge Nette"
                  >
                    Nette
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span>Achats: {profitabilityData.purchaseCostRatioPercent}%</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span>Transport: {((profitabilityData.logisticsTransportCostDA / monthlyCA) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                    <span>Charges Fixes: {((totalFixedCosts / monthlyCA) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>Marge Nette: {netMarginPercent.toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              {/* Category Margin Benchmarks */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
                <h4 className="text-xs font-extrabold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Repères de Taux de Marque Marché Algérie</span>
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-white">Huiles & Semoules</div>
                      <div className="text-[10px] text-slate-400">Forte rotation / Prix réglementé</div>
                    </div>
                    <span className="font-mono font-bold text-amber-400">4% à 8%</span>
                  </div>

                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-white">Boissons, Sodas & Jus</div>
                      <div className="text-[10px] text-slate-400">Volume fort saisonnier</div>
                    </div>
                    <span className="font-mono font-bold text-amber-400">12% à 16%</span>
                  </div>

                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-white">Biscuiterie & Confiserie</div>
                      <div className="text-[10px] text-slate-400">Marge confortable B2B</div>
                    </div>
                    <span className="font-mono font-bold text-amber-400">18% à 25%</span>
                  </div>

                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-white">Emballages CHR & Non-Alimentaire</div>
                      <div className="text-[10px] text-slate-400">Fortes marges de distribution</div>
                    </div>
                    <span className="font-mono font-bold text-amber-400">25% à 35%</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: FISCALITÉ ALGÉRIENNE & G50                                         */}
      {/* ========================================================================= */}
      {activeTab === 'fiscalite' && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: G50 Calculator */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-amber-400" />
                  <h3 className="text-sm font-extrabold text-white">
                    Simulateur de Déclaration Mensuelle G50 (Impôts Algérie)
                  </h3>
                </div>
                <span className="text-xs text-emerald-400 font-bold bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-800">
                  Période: {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                </span>
              </div>

              {/* Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">CA HT Soumis à TVA 9% (Agroalimentaire)</label>
                  <input
                    type="number"
                    value={caTva9DA}
                    onChange={(e) => setCaTva9DA(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-amber-400 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">CA HT Soumis à TVA 19% (Services & Divers)</label>
                  <input
                    type="number"
                    value={caTva19DA}
                    onChange={(e) => setCaTva19DA(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-amber-400 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">TVA Déductible sur Achats Facturés (DA)</label>
                  <input
                    type="number"
                    value={tvaDeductibleInput}
                    onChange={(e) => setTvaDeductibleInput(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-emerald-400 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Part des Encaissements Espèces (% pour Timbre)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={paymentModeCashPercent}
                    onChange={(e) => setPaymentModeCashPercent(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Detailed Breakdown Table for G50 */}
              <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden text-xs">
                <div className="bg-slate-900 p-3 font-extrabold text-white border-b border-slate-800 flex justify-between items-center">
                  <span>Détail Rubriques Impôts G50</span>
                  <span>Calcul Estimatif (DA)</span>
                </div>

                <div className="divide-y divide-slate-800/80 p-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">TVA Collectée (9% sur {formatDA(caTva9DA)})</span>
                    <span className="font-mono text-amber-300 font-bold">+{formatDA(tvaCollectee9)} DA</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">TVA Collectée (19% sur {formatDA(caTva19DA)})</span>
                    <span className="font-mono text-amber-300 font-bold">+{formatDA(tvaCollectee19)} DA</span>
                  </div>

                  <div className="flex justify-between items-center text-emerald-400 font-bold">
                    <span>- Moins TVA Déductible sur Achats</span>
                    <span className="font-mono">-{formatDA(tvaDeductibleInput)} DA</span>
                  </div>

                  <div className="flex justify-between items-center font-extrabold text-white pt-1">
                    <span>= TVA Nette à Verser</span>
                    <span className="font-mono text-amber-400">{formatDA(tvaNetteAPayer)} DA</span>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-slate-300">
                      TAP (Taxe sur l'Activité Professionnelle - 1.5% sur {formatDA(totalCAHT)})
                    </span>
                    <span className="font-mono text-amber-300 font-bold">+{formatDA(tapAmount)} DA</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">IRG Salarial Retenu à la Source (Paie Personnel)</span>
                    <span className="font-mono text-amber-300 font-bold">+{formatDA(irgSalarialEstimated)} DA</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Timbre Fiscal (1% sur {formatDA(cashAmount)} réglés en espèces)</span>
                    <span className="font-mono text-amber-300 font-bold">+{formatDA(timbreFiscal)} DA</span>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-slate-700 text-sm font-black text-amber-400">
                    <span>TOTAL G50 À PAYER À LA RECETTE DES IMPÔTS</span>
                    <span className="font-mono bg-amber-500 text-slate-950 px-3 py-1 rounded-xl">
                      {formatDA(totalG50ToPay)} DA
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => alert(`Téléchargement de la déclaration G50 Pro-Forma pour ${currentCompany.name} (Montant: ${formatDA(totalG50ToPay)} DA)`)}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow cursor-pointer transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Exporter Bordereau G50 (PDF)</span>
                </button>
              </div>

            </div>

            {/* Right 1 Col: Fiscal Calendar & IBS Rates */}
            <div className="space-y-4">
              
              {/* IBS Summary */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-extrabold text-white">
                    IBS (Impôt Bénéfice Sociétés) - Taux {ibsRate}%
                  </h4>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Taux Légale Appliqué :</span>
                    <span className="font-extrabold text-amber-400 font-mono">{ibsRate}% ({currentCompany.role === 'usine' ? 'Secteur Industriel' : 'Secteur Commercial'})</span>
                  </div>

                  <div className="flex justify-between text-slate-300">
                    <span>Bénéfice Annuel Estimé :</span>
                    <span className="font-mono font-bold text-white">{formatDA(estimatedAnnualProfit)}</span>
                  </div>

                  <div className="flex justify-between text-emerald-400 font-black text-sm pt-2 border-t border-slate-800">
                    <span>IBS Annuel à Payer :</span>
                    <span className="font-mono">{formatDA(estimatedIbsAnnual)} DA</span>
                  </div>
                </div>
              </div>

              {/* Fiscal Calendar DZ */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <h4 className="text-xs font-extrabold text-white">Calendrier & Échéancier Fiscal Algérien</h4>
                </div>

                <div className="space-y-2.5 text-xs">
                  
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex justify-between items-center font-bold text-amber-400">
                      <span>G50 Mensuel</span>
                      <span className="text-[10px] bg-amber-950 px-2 py-0.5 rounded border border-amber-800">Avant le 20 du mois</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Dépôt et paiement de la TVA, TAP, IRG salarial et timbre auprès de la recette des impôts de rattachement.</p>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex justify-between items-center font-bold text-blue-400">
                      <span>1er Acompte IBS (20%)</span>
                      <span className="text-[10px] bg-blue-950 px-2 py-0.5 rounded border border-blue-800">Avant le 20 Mars</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Paiement du premier acompte provisionnel de l'IBS calculé sur le résultat de l'exercice précédent.</p>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex justify-between items-center font-bold text-purple-400">
                      <span>Dépôt Bilan Fiscal Annuel</span>
                      <span className="text-[10px] bg-purple-950 px-2 py-0.5 rounded border border-purple-800">Avant le 30 Avril</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Dépôt des états financiers (Liasse Fiscale SCF) visés par le commissaire aux comptes / expert comptable.</p>
                  </div>

                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: FICHES EMPLOYÉS, CNAS & PAIE                                       */}
      {/* ========================================================================= */}
      {activeTab === 'rh_paie' && (
        <div className="space-y-6">
          
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <div>
              <h3 className="text-sm font-extrabold text-white">Registre du Personnel & Bulletins de Paie Algériens</h3>
              <p className="text-xs text-slate-400">Effectif déclaré CNAS, gestion des salaires, cotisations 9%/26% et fiches de paie.</p>
            </div>

            <button
              onClick={() => setIsAddEmpModalOpen(true)}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow cursor-pointer transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>Nouveau Salarié (CNAS)</span>
            </button>
          </div>

          {/* Employees List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {employees.map(emp => {
              const pay = calculatePayslipDetails(emp);

              return (
                <div
                  key={emp.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg hover:border-amber-500/50 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono text-amber-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          CNAS: {emp.cnasNumber}
                        </span>
                        <h4 className="font-black text-white text-base mt-1">{emp.fullName}</h4>
                        <p className="text-xs text-slate-300">{emp.roleTitle}</p>
                      </div>

                      <span className="bg-emerald-950 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-800">
                        {emp.contractType}
                      </span>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1.5 text-xs">
                      <div className="flex justify-between text-slate-400">
                        <span>Salaire de Base :</span>
                        <span className="font-mono text-white font-bold">{formatDA(emp.baseSalaryDA)}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Prime IEP / Rendement :</span>
                        <span className="font-mono text-slate-300">+{formatDA(emp.performanceBonusDA)}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Cotisation CNAS Salarié (9%) :</span>
                        <span className="font-mono text-rose-400">-{formatDA(pay.cnasEmployee)}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>IRG Retenu (Barème 2024) :</span>
                        <span className="font-mono text-rose-400">-{formatDA(pay.irg)}</span>
                      </div>
                      <div className="flex justify-between text-emerald-400 font-extrabold pt-1 border-t border-slate-800 text-sm">
                        <span>NET À PAYER (DA) :</span>
                        <span className="font-mono">{formatDA(pay.netToPay)} DA</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedPayslipEmp(emp)}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <FileText className="w-4 h-4 text-amber-400" />
                    <span>Afficher Fiche de Paie Conforme</span>
                  </button>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* MODAL 1: ADD EMPLOYEE */}
      {isAddEmpModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-amber-400" />
                <span>Déclarer un Nouveau Salarié</span>
              </h3>
              <button onClick={() => setIsAddEmpModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEmployee} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Nom & Prénom</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Brahim Ould Kaci"
                  value={newEmpName}
                  onChange={(e) => setNewEmpName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Poste Occupé / Rôle</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Chauffeur Livreur, Magasinier, Commercial B2B"
                  value={newEmpRole}
                  onChange={(e) => setNewEmpRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">N° CNAS (Sécurité Sociale)</label>
                  <input
                    type="text"
                    placeholder="880123160099"
                    value={newEmpCnas}
                    onChange={(e) => setNewEmpCnas(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Type de Contrat</label>
                  <select
                    value={newEmpContract}
                    onChange={(e) => setNewEmpContract(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="CDI">CDI (Indéterminé)</option>
                    <option value="CDD">CDD (Déterminé)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Salaire de Base Mensuel (DA HT)</label>
                <input
                  type="number"
                  value={newEmpBaseSalary}
                  onChange={(e) => setNewEmpBaseSalary(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-amber-400 font-mono font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddEmpModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-xl cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl cursor-pointer shadow"
                >
                  Enregistrer Salarié
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: PAYSLIP PREVIEW (FICHE DE PAIE DZ) */}
      {selectedPayslipEmp && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative my-8">
            <button
              onClick={() => setSelectedPayslipEmp(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Print Header */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs">
              
              <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                <div>
                  <h3 className="font-extrabold text-white text-base">{currentCompany.name}</h3>
                  <p className="text-slate-400 text-[11px]">{currentCompany.address}</p>
                  <p className="text-slate-400 text-[11px] font-mono">NIF: {currentCompany.nif || '00021600123456'} • RC: {currentCompany.rc}</p>
                </div>

                <div className="text-right">
                  <span className="bg-amber-500 text-slate-950 font-black px-3 py-1 rounded-xl text-xs uppercase block">
                    BULLETIN DE PAYE
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Période: {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                  </span>
                </div>
              </div>

              {/* Salarié Info */}
              <div className="grid grid-cols-2 gap-3 bg-slate-900 p-3 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-400 block text-[10px]">Nom & Prénom du Salarié :</span>
                  <span className="font-extrabold text-white text-xs">{selectedPayslipEmp.fullName}</span>
                  <span className="text-slate-400 block text-[10px] mt-1">Fonction :</span>
                  <span className="text-amber-300 font-bold">{selectedPayslipEmp.roleTitle}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px]">N° Sécurité Sociale CNAS :</span>
                  <span className="font-mono text-white font-bold">{selectedPayslipEmp.cnasNumber}</span>
                  <span className="text-slate-400 block text-[10px] mt-1">Type Contrat & Entrée :</span>
                  <span className="text-slate-300 font-bold">{selectedPayslipEmp.contractType} (Depuis {selectedPayslipEmp.startDate})</span>
                </div>
              </div>

              {/* Table Breakdown */}
              {(() => {
                const pay = calculatePayslipDetails(selectedPayslipEmp);

                return (
                  <div className="space-y-3">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                          <th className="py-2">Désignation Rubrique</th>
                          <th className="py-2 text-right">Base / Gains (DA)</th>
                          <th className="py-2 text-right">Retenues (DA)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                        <tr>
                          <td className="py-2 text-white font-sans">Salaire de Base</td>
                          <td className="py-2 text-right text-emerald-400">{formatDA(pay.base)}</td>
                          <td className="py-2 text-right text-slate-600">-</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-white font-sans">Prime d'Expérience IEP / Rendement</td>
                          <td className="py-2 text-right text-emerald-400">{formatDA(pay.iep)}</td>
                          <td className="py-2 text-right text-slate-600">-</td>
                        </tr>
                        <tr className="bg-slate-900/60 font-bold">
                          <td className="py-2 text-amber-300 font-sans">SALAIRE BRUT IMPOSABLE</td>
                          <td className="py-2 text-right text-amber-300">{formatDA(pay.grossImposable)}</td>
                          <td className="py-2 text-right text-slate-600">-</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-slate-300 font-sans">Cotisation CNAS Salarié (9%)</td>
                          <td className="py-2 text-right text-slate-600">-</td>
                          <td className="py-2 text-right text-rose-400">{formatDA(pay.cnasEmployee)}</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-slate-300 font-sans">Impôt sur le Revenu IRG (Barème 2024)</td>
                          <td className="py-2 text-right text-slate-600">-</td>
                          <td className="py-2 text-right text-rose-400">{formatDA(pay.irg)}</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-slate-300 font-sans">Prime Panier & Transport Non Imposable</td>
                          <td className="py-2 text-right text-emerald-400">{formatDA(pay.nonTaxablePrimes)}</td>
                          <td className="py-2 text-right text-slate-600">-</td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="bg-emerald-950/60 border border-emerald-800 p-3 rounded-xl flex justify-between items-center">
                      <span className="font-extrabold text-white text-xs">NET À PAYER AU SALARIÉ (DA) :</span>
                      <span className="font-mono text-lg font-black text-emerald-400">{formatDA(pay.netToPay)} DA</span>
                    </div>

                    <div className="text-[10px] text-slate-400 pt-1 flex justify-between">
                      <span>Cotisation Patronale CNAS (26%) : <strong className="text-slate-200 font-mono">{formatDA(pay.cnasPatronal)} DA</strong></span>
                      <span>Mode de paiement : Virement CCP / Banque</span>
                    </div>
                  </div>
                );
              })()}

            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => window.print()}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow cursor-pointer transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimer Bulletin de Paie</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
