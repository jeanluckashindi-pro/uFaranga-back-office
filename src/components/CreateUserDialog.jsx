import { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { RadialSpinner } from './common/Spinner';
import DatePicker from './common/DatePicker';
import apiService from '../services/api';

function CreateUserDialog({ visible, onHide }) {
  const [formData, setFormData] = useState({
    courriel: '',
    numero_telephone: '',
    mot_de_passe: '',
    mot_de_passe_confirmation: '',
    prenom: '',
    nom_famille: '',
    date_naissance: '',
    lieu_naissance: '',
    nationalite: 'BI',
    type_utilisateur_id: 'CLIENT',
    niveau_kyc_id: 0,
    statut_id: 'ACTIF',
    pays_id: '',
    province_id: '',
    district_id: '',
    quartier_id: '',
    pays_residence: 'BI',
    province: '',
    ville: '',
    commune: '',
    quartier: '',
    avenue: '',
    numero_maison: '',
    code_postal: '',
    telephone_verifie: false,
    courriel_verifie: false
  });

  const [typesUtilisateurs, setTypesUtilisateurs] = useState([]);
  const [niveauxKYC, setNiveauxKYC] = useState([]);
  const [statuts, setStatuts] = useState([]);
  const [paysList, setPaysList] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [quartiers, setQuartiers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingQuartiers, setLoadingQuartiers] = useState(false);

  useEffect(() => {
    if (visible) {
      loadReferenceData();
    }
  }, [visible]);

  const loadReferenceData = async () => {
    try {
      const [typesData, kycData, statutsData, paysData] = await Promise.all([
        apiService.getTypesUtilisateurs(),
        apiService.getNiveauxKYC(),
        apiService.getStatutsUtilisateurs(),
        apiService.getPays()
      ]);

      setTypesUtilisateurs(typesData);
      setNiveauxKYC(kycData);
      setStatuts(statutsData);
      setPaysList(paysData);
    } catch (error) {
      console.error('Erreur chargement données:', error);
    }
  };

  const loadProvinces = async (paysId) => {
    setLoadingProvinces(true);
    try {
      const data = await apiService.getProvinces();
      const filtered = data.filter(p => p.pays === paysId);
      setProvinces(filtered);
      setDistricts([]);
      setQuartiers([]);
      setFormData(prev => ({ ...prev, province_id: '', district_id: '', quartier_id: '' }));
    } catch (error) {
      console.error('Erreur chargement provinces:', error);
    } finally {
      setLoadingProvinces(false);
    }
  };

  const loadDistricts = async (provinceId) => {
    setLoadingDistricts(true);
    try {
      const data = await apiService.getDistricts();
      const filtered = data.filter(d => d.province === provinceId);
      setDistricts(filtered);
      setQuartiers([]);
      setFormData(prev => ({ ...prev, district_id: '', quartier_id: '' }));
    } catch (error) {
      console.error('Erreur chargement districts:', error);
    } finally {
      setLoadingDistricts(false);
    }
  };

  const loadQuartiers = async (districtId) => {
    setLoadingQuartiers(true);
    try {
      const data = await apiService.getQuartiers();
      const filtered = data.filter(q => q.district === districtId);
      setQuartiers(filtered);
      setFormData(prev => ({ ...prev, quartier_id: '' }));
    } catch (error) {
      console.error('Erreur chargement quartiers:', error);
    } finally {
      setLoadingQuartiers(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        ...formData,
        date_naissance: formData.date_naissance
      };

      await apiService.createUser(payload);
      onHide();
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header="Créer un nouvel utilisateur"
      style={{ width: '60vw' }}
      className="custom-dialog"
      maximizable
    >
      <div className="space-y-6 pr-2">
        {/* Informations personnelles */}
        <div>
          <h3 className="text-lg font-semibold text-text mb-4">Informations personnelles</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Prénom *</label>
              <InputText
                value={formData.prenom}
                onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                placeholder="Ex: Pierre"
                className="w-full px-4 py-2 bg-background border border-darkGray rounded-lg text-text"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Nom de famille *</label>
              <InputText
                value={formData.nom_famille}
                onChange={(e) => setFormData({ ...formData, nom_famille: e.target.value })}
                placeholder="Ex: Nkurunziza"
                className="w-full px-4 py-2 bg-background border border-darkGray rounded-lg text-text"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Date de naissance *</label>
              <DatePicker
                value={formData.date_naissance}
                onChange={(date) => setFormData({ ...formData, date_naissance: date })}
                placeholder="Sélectionner une date"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Lieu de naissance</label>
              <InputText
                value={formData.lieu_naissance}
                onChange={(e) => setFormData({ ...formData, lieu_naissance: e.target.value })}
                placeholder="Ex: Bujumbura"
                className="w-full px-4 py-2 bg-background border border-darkGray rounded-lg text-text"
              />
            </div>
          </div>
        </div>

        {/* Coordonnées */}
        <div>
          <h3 className="text-lg font-semibold text-text mb-4">Coordonnées</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email *</label>
              <InputText
                type="email"
                value={formData.courriel}
                onChange={(e) => setFormData({ ...formData, courriel: e.target.value })}
                placeholder="exemple@ufaranga.bi"
                className="w-full px-4 py-2 bg-background border border-darkGray rounded-lg text-text"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Téléphone *</label>
              <InputText
                value={formData.numero_telephone}
                onChange={(e) => setFormData({ ...formData, numero_telephone: e.target.value })}
                placeholder="+25768987654"
                className="w-full px-4 py-2 bg-background border border-darkGray rounded-lg text-text"
              />
            </div>
          </div>
        </div>

        {/* Mot de passe */}
        <div>
          <h3 className="text-lg font-semibold text-text mb-4">Sécurité</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Mot de passe *</label>
              <InputText
                type="password"
                value={formData.mot_de_passe}
                onChange={(e) => setFormData({ ...formData, mot_de_passe: e.target.value })}
                placeholder="Minimum 8 caractères"
                className="w-full px-4 py-2 bg-background border border-darkGray rounded-lg text-text"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Confirmation *</label>
              <InputText
                type="password"
                value={formData.mot_de_passe_confirmation}
                onChange={(e) => setFormData({ ...formData, mot_de_passe_confirmation: e.target.value })}
                placeholder="Confirmer le mot de passe"
                className="w-full px-4 py-2 bg-background border border-darkGray rounded-lg text-text"
              />
            </div>
          </div>
        </div>

        {/* Type et statut */}
        <div>
          <h3 className="text-lg font-semibold text-text mb-4">Type de compte</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Type utilisateur *</label>
              <Dropdown
                value={formData.type_utilisateur_id}
                options={typesUtilisateurs.map(t => ({ label: t.libelle, value: t.code }))}
                onChange={(e) => setFormData({ ...formData, type_utilisateur_id: e.value })}
                placeholder="Sélectionner un type"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Niveau KYC *</label>
              <Dropdown
                value={formData.niveau_kyc_id}
                options={niveauxKYC.map(k => ({ label: k.libelle, value: k.niveau }))}
                onChange={(e) => setFormData({ ...formData, niveau_kyc_id: e.value })}
                placeholder="Sélectionner un niveau"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Statut *</label>
              <Dropdown
                value={formData.statut_id}
                options={statuts.map(s => ({ label: s.libelle, value: s.code }))}
                onChange={(e) => setFormData({ ...formData, statut_id: e.value })}
                placeholder="Sélectionner un statut"
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Localisation */}
        <div>
          <h3 className="text-lg font-semibold text-text mb-4">Localisation</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Pays *</label>
              <Dropdown
                value={formData.pays_id}
                options={paysList.map(p => ({ label: p.nom, value: p.id }))}
                onChange={(e) => {
                  setFormData({ ...formData, pays_id: e.value });
                  loadProvinces(e.value);
                }}
                placeholder="Sélectionner un pays"
                className="w-full"
                filter
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                Province *
                {loadingProvinces && <RadialSpinner size="small" color="primary" />}
              </label>
              <Dropdown
                value={formData.province_id}
                options={provinces.map(p => ({ label: p.nom, value: p.id }))}
                onChange={(e) => {
                  setFormData({ ...formData, province_id: e.value });
                  loadDistricts(e.value);
                }}
                placeholder={loadingProvinces ? "Chargement..." : "Sélectionner une province"}
                className="w-full"
                disabled={!formData.pays_id || loadingProvinces}
                filter
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                District *
                {loadingDistricts && <RadialSpinner size="small" color="primary" />}
              </label>
              <Dropdown
                value={formData.district_id}
                options={districts.map(d => ({ label: d.nom, value: d.id }))}
                onChange={(e) => {
                  setFormData({ ...formData, district_id: e.value });
                  loadQuartiers(e.value);
                }}
                placeholder={loadingDistricts ? "Chargement..." : "Sélectionner un district"}
                className="w-full"
                disabled={!formData.province_id || loadingDistricts}
                filter
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                Quartier *
                {loadingQuartiers && <RadialSpinner size="small" color="primary" />}
              </label>
              <Dropdown
                value={formData.quartier_id}
                options={quartiers.map(q => ({ label: q.nom, value: q.id }))}
                onChange={(e) => setFormData({ ...formData, quartier_id: e.value })}
                placeholder={loadingQuartiers ? "Chargement..." : "Sélectionner un quartier"}
                className="w-full"
                disabled={!formData.district_id || loadingQuartiers}
                filter
              />
            </div>
          </div>
        </div>

        {/* Adresse détaillée */}
        <div>
          <h3 className="text-lg font-semibold text-text mb-4">Adresse détaillée</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Ville</label>
              <InputText
                value={formData.ville}
                onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                placeholder="Ex: Bujumbura"
                className="w-full px-4 py-2 bg-background border border-darkGray rounded-lg text-text"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Commune</label>
              <InputText
                value={formData.commune}
                onChange={(e) => setFormData({ ...formData, commune: e.target.value })}
                placeholder="Ex: Mukaza"
                className="w-full px-4 py-2 bg-background border border-darkGray rounded-lg text-text"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Avenue</label>
              <InputText
                value={formData.avenue}
                onChange={(e) => setFormData({ ...formData, avenue: e.target.value })}
                placeholder="Ex: Avenue du Commerce"
                className="w-full px-4 py-2 bg-background border border-darkGray rounded-lg text-text"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Numéro maison</label>
              <InputText
                value={formData.numero_maison}
                onChange={(e) => setFormData({ ...formData, numero_maison: e.target.value })}
                placeholder="Ex: 123"
                className="w-full px-4 py-2 bg-background border border-darkGray rounded-lg text-text"
              />
            </div>
          </div>
        </div>

        {/* Vérifications */}
        <div>
          <h3 className="text-lg font-semibold text-text mb-4">Vérifications</h3>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={formData.telephone_verifie}
                onChange={(e) => setFormData({ ...formData, telephone_verifie: e.checked })}
              />
              <label className="text-sm text-text">Téléphone vérifié</label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={formData.courriel_verifie}
                onChange={(e) => setFormData({ ...formData, courriel_verifie: e.checked })}
              />
              <label className="text-sm text-text">Email vérifié</label>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-6 border-t border-darkGray mt-6">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <RadialSpinner size="small" color="white" />
              <span>Création en cours...</span>
            </>
          ) : (
            'Créer l\'utilisateur'
          )}
        </button>
        <button
          onClick={onHide}
          disabled={loading}
          className="px-4 py-2.5 text-gray-400 hover:text-text hover:bg-background/50 rounded-lg transition-all disabled:opacity-50"
        >
          Annuler
        </button>
      </div>
    </Dialog>
  );
}

export default CreateUserDialog;
