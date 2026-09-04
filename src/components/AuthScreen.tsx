import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole, CompanyProfile } from '../types';
import { Lock, User, MapPin, Phone, Building2, Store, Factory, Truck, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import zfAgriLogo from '../assets/images/zf_agri_logo_1785862141270.jpg';

interface AuthScreenProps {
  onLoginSuccess: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const { companies, selectCompany, setCurrentRole, updateCompanyProfile } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Signup form state
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('detaillant');
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!username.trim() || !password.trim()) {
      setLoginError('Veuillez remplir votre nom d\'utilisateur et votre mot de passe.');
      return;
    }

    // Find company or user matching, or log in with default matching role company
    const matched = companies.find(
      c => c.name.toLowerCase().includes(username.toLowerCase()) || 
           c.contactEmail.toLowerCase().includes(username.toLowerCase()) ||
           c.contactPhone.includes(username)
    );

    if (matched) {
      selectCompany(matched.id);
    } else {
      // Default to first detaillant if username doesn't match an explicit company
      const defaultComp = companies.find(c => c.role === 'detaillant') || companies[0];
      selectCompany(defaultComp.id);
    }

    onLoginSuccess();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !regPassword.trim()) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    // Create / select new company or update active profile
    const existingRoleCompany = companies.find(c => c.role === selectedRole) || companies[0];
    
    updateCompanyProfile(existingRoleCompany.id, {
      name: fullName,
      address: address || existingRoleCompany.address,
      contactPhone: phone,
      role: selectedRole
    });

    selectCompany(existingRoleCompany.id);
    setCurrentRole(selectedRole);

    setRegisterSuccess(true);
    setTimeout(() => {
      onLoginSuccess();
    }, 1200);
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    setCurrentRole(role);
    const firstCompanyOfRole = companies.find(c => c.role === role);
    if (firstCompanyOfRole) {
      selectCompany(firstCompanyOfRole.id);
    }
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Top Simple Brand Badge */}
      <div className="text-center mb-6 max-w-sm">
        <div className="inline-flex flex-col items-center gap-2 bg-slate-900/90 border border-slate-800 p-4 rounded-3xl shadow-2xl mb-2">
          <div className="w-24 h-24 rounded-2xl overflow-hidden border border-emerald-500/50 shadow-2xl bg-slate-950 flex items-center justify-center">
            <img
              src={zfAgriLogo}
              alt="Logo ZF Agri"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
        <p className="text-xs text-slate-400 font-medium mt-1">
          Plateforme B2B Agroalimentaire en Algérie
        </p>
      </div>

      {/* Auth Card Container */}
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        
        {/* Decorative Top Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-emerald-500/50 blur-sm rounded-full"></div>

        {mode === 'login' ? (
          /* LOGIN FORM - SIMPLE & DIRECT */
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-extrabold text-white">Connexion</h2>
              <p className="text-xs text-slate-400 mt-1">Saisissez vos identifiants pour accéder à votre compte</p>
            </div>

            {loginError && (
              <div className="bg-red-950/80 border border-red-800 text-red-200 text-xs p-3 rounded-xl font-medium">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Username Field */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Nom d'utilisateur <span className="text-slate-500 font-normal">(ou N° Téléphone)</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: Bab El Oued Superette ou 0550123456"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>Se connecter</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Link to Register Form */}
            <div className="pt-4 border-t border-slate-800 text-center space-y-3">
              <p className="text-xs text-slate-400">Vous n'avez pas encore de compte ?</p>
              <button
                type="button"
                onClick={() => setMode('register')}
                className="w-full bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-emerald-400 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer"
              >
                S'inscrire (Nouveau Compte)
              </button>
            </div>

            {/* Demo Instant Logins */}
            <div className="pt-4 border-t border-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-slate-500 block text-center mb-2.5">
                Accès Démo Rapide (1-Clic sans mot de passe)
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('detaillant')}
                  className="bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 border border-amber-800/60 p-2 rounded-xl text-[11px] font-bold flex flex-col items-center gap-1 transition-all"
                >
                  <Store className="w-4 h-4 text-amber-400" />
                  <span>Détaillant</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('grossiste')}
                  className="bg-blue-950/60 hover:bg-blue-900/80 text-blue-300 border border-blue-800/60 p-2 rounded-xl text-[11px] font-bold flex flex-col items-center gap-1 transition-all"
                >
                  <Truck className="w-4 h-4 text-blue-400" />
                  <span>Grossiste</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('usine')}
                  className="bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800/60 p-2 rounded-xl text-[11px] font-bold flex flex-col items-center gap-1 transition-all"
                >
                  <Factory className="w-4 h-4 text-emerald-400" />
                  <span>Usine</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* REGISTRATION FORM */
          <div className="space-y-5">
            <div className="text-center">
              <h2 className="text-2xl font-extrabold text-white">Inscription</h2>
              <p className="text-xs text-slate-400 mt-1">Créez votre profil B2B en quelques secondes</p>
            </div>

            {registerSuccess && (
              <div className="bg-emerald-950 border border-emerald-500 text-emerald-200 text-xs p-3.5 rounded-xl font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Inscription réussie ! Redirection en cours...</span>
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              
              {/* Type de compte choice */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  Sélectionnez votre type de compte :
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('detaillant')}
                    className={`p-2.5 rounded-xl border text-left flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      selectedRole === 'detaillant'
                        ? 'bg-amber-600 text-white border-amber-400 shadow-md font-bold'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <Store className="w-4 h-4" />
                    <span className="text-[11px]">Détaillant</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('grossiste')}
                    className={`p-2.5 rounded-xl border text-left flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      selectedRole === 'grossiste'
                        ? 'bg-blue-600 text-white border-blue-400 shadow-md font-bold'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                    <span className="text-[11px]">Grossiste</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('usine')}
                    className={`p-2.5 rounded-xl border text-left flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      selectedRole === 'usine'
                        ? 'bg-emerald-600 text-white border-emerald-400 shadow-md font-bold'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <Factory className="w-4 h-4" />
                    <span className="text-[11px]">Usine</span>
                  </button>
                </div>
              </div>

              {/* Nom / Raison Sociale */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Nom ou Raison Sociale *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: Superette El Yasmine ou Sarl Agro"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Adresse */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Adresse de l'établissement
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Ex: Boulevard Principal, Bab Ezzouar"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Téléphone */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  N° de Téléphone *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    placeholder="Ex: 0550 12 34 56"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Mot de passe *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-3"
              >
                <span>Valider mon inscription</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Back to Login link */}
            <div className="pt-3 border-t border-slate-800 text-center">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-bold underline cursor-pointer"
              >
                Déjà un compte ? Se connecter
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 text-[11px] text-slate-500 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-slate-600" />
        <span>Données sécurisées • Marché Grossiste & Détaillant Algérien</span>
      </div>
    </div>
  );
};
