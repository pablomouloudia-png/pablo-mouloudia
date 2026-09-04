import React, { useState } from 'react';
import { CompanyProfile } from '../types';
import { useApp } from '../context/AppContext';
import { Building2, MapPin, ShieldCheck, Phone, Mail, Award, Edit3, Save, Truck, Thermometer, Check } from 'lucide-react';

interface CompanyProfileViewProps {
  company: CompanyProfile;
  isEditable?: boolean;
}

export const CompanyProfileView: React.FC<CompanyProfileViewProps> = ({ company, isEditable = true }) => {
  const { updateCompanyProfile } = useApp();
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: company.name,
    slogan: company.slogan,
    siret: company.siret,
    haccpNumber: company.haccpNumber,
    address: company.address,
    city: company.city,
    postalCode: company.postalCode,
    region: company.region,
    contactEmail: company.contactEmail,
    contactPhone: company.contactPhone,
    description: company.description,
    minOrderAmountHT: company.minOrderAmountHT,
    deliveryLeadDays: company.deliveryLeadDays,
    paymentTerms: company.paymentTerms,
    certificationsStr: company.certifications.join(', ')
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompanyProfile(company.id, {
      ...formData,
      certifications: formData.certificationsStr.split(',').map(s => s.trim()).filter(Boolean)
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 text-slate-100 shadow-xl space-y-6">
      {/* Header Profile Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white font-bold text-2xl shadow-lg border border-emerald-500/30">
            {company.role === 'usine' ? '🏭' : company.role === 'grossiste' ? '🚛' : '🏪'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                {company.role === 'usine' ? 'Usine de Production' : company.role === 'grossiste' ? 'Centrale Grossiste' : 'Commerce Détaillant'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">SIRET: {company.siret}</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">{company.name}</h2>
            <p className="text-xs text-slate-400">{company.slogan}</p>
          </div>
        </div>

        {isEditable && (
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            {isEditing ? <Save className="w-4 h-4 text-emerald-400" /> : <Edit3 className="w-4 h-4 text-amber-400" />}
            <span>{isEditing ? 'Annuler' : 'Éditer la Présentation'}</span>
          </button>
        )}
      </div>

      {isEditing ? (
        /* Edit Mode Form */
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Nom de la Structure</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Slogan / Sous-titre</label>
              <input
                type="text"
                value={formData.slogan}
                onChange={e => setFormData({ ...formData, slogan: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">N° SIRET</label>
              <input
                type="text"
                value={formData.siret}
                onChange={e => setFormData({ ...formData, siret: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">N° Agrément Sanitaire / HACCP</label>
              <input
                type="text"
                value={formData.haccpNumber}
                onChange={e => setFormData({ ...formData, haccpNumber: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Certifications (séparées par virgules)</label>
              <input
                type="text"
                value={formData.certificationsStr}
                onChange={e => setFormData({ ...formData, certificationsStr: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Adresse</label>
              <input
                type="text"
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Ville & Code Postal</label>
              <input
                type="text"
                value={`${formData.postalCode} ${formData.city}`}
                onChange={e => {
                  const parts = e.target.value.split(' ');
                  setFormData({ ...formData, postalCode: parts[0] || '', city: parts.slice(1).join(' ') || '' });
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Région</label>
              <input
                type="text"
                value={formData.region}
                onChange={e => setFormData({ ...formData, region: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div>
              <label className="block text-emerald-400 font-bold mb-1">Minimum de Commande (€ HT)</label>
              <input
                type="number"
                value={formData.minOrderAmountHT}
                onChange={e => setFormData({ ...formData, minOrderAmountHT: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-emerald-300 font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Délai d'expédition (Jours)</label>
              <input
                type="number"
                value={formData.deliveryLeadDays}
                onChange={e => setFormData({ ...formData, deliveryLeadDays: parseInt(e.target.value) || 1 })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Conditions de Règlement</label>
              <input
                type="text"
                value={formData.paymentTerms}
                onChange={e => setFormData({ ...formData, paymentTerms: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Présentation Complète</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2 rounded-xl flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Mettre à Jour la Fiche</span>
            </button>
          </div>
        </form>
      ) : (
        /* View Mode Presentation */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Description & Presentation */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Présentation Officielle</h3>
              <p className="text-slate-300 text-sm leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                {company.description}
              </p>
            </div>

            {/* Certifications Badge Grid */}
            <div>
              <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Certifications Sanitaires & Qualité</h3>
              <div className="flex flex-wrap gap-2">
                {company.certifications.map((cert, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 px-3 py-1.5 rounded-lg text-xs font-semibold"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>{cert}</span>
                  </div>
                ))}
                <div className="flex items-center gap-1.5 bg-slate-950 text-slate-400 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-medium">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>N° Agrément : {company.haccpNumber}</span>
                </div>
              </div>
            </div>

            {/* Logistics & Cold Chain Capabilities */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-start gap-3">
                <Thermometer className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-200">Chaîne du Froid Garantit</div>
                  <div className="text-[11px] text-slate-400">Transport sous température dirigée (0°C à 4°C et -18°C)</div>
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-start gap-3">
                <Truck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-200">Zones Desservies</div>
                  <div className="text-[11px] text-slate-400">{company.deliveryZones.join(', ')}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Commercial Conditions */}
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold uppercase text-emerald-400 tracking-wider border-b border-slate-800 pb-2">
              Conditions Commerciales B2B
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Minimum de Commande (MOQ)</span>
                <span className="text-lg font-bold text-white">{company.minOrderAmountHT} € HT</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Délai d'Expédition Moyen</span>
                <span className="font-semibold text-slate-200">{company.deliveryLeadDays} jour(s) ouvré(s)</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Modalités de Règlement</span>
                <span className="font-semibold text-slate-200">{company.paymentTerms}</span>
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-1.5 text-slate-300 text-[11px]">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{company.address}, {company.postalCode} {company.city}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{company.contactEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{company.contactPhone}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
