import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { Skeleton } from '../../components/common';
import { 
  Search, Download, Plus, Edit, Trash2, Eye, 
  Globe, MapPin, Map, Building, Home, ChevronRight, Save, X
} from 'lucide-react';
import apiService from '../../services/api';

const GestionPays = () => {
  const [activeLevel, setActiveLevel] = useState('pays');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [globalFilter, setGlobalFilter] = useState('');
  
  const [filters, setFilters] = useState({
    continent: '',
    sous_region: '',
    est_actif: '',
    pays_id: '',
    province_id: '',
    district_id: '',
    quartier_id: ''
  });

  const [lazyParams, setLazyParams] = useState({
    first: 0,
    rows: 10,
    page: 0
  });

  const [showDialog, setShowDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dialogMode, setDialogMode] = useState('view');
  const [formData, setFormData] = useState({});
  const [metadataFields, setMetadataFields] = useState([]);

  const levels = [
    { id: 'pays', label: 'Pays', icon: Globe, endpoint: 'pays' },
    { id: 'provinces', label: 'Provinces', icon: Map, endpoint: 'provinces' },
    { id: 'districts', label: 'Districts', icon: MapPin, endpoint: 'districts' },
    { id: 'quartiers', label: 'Quartiers', icon: Building, endpoint: 'quartiers' },
    { id: 'points', label: 'Points de Service', icon: Home, endpoint: 'points-de-service' }
  ];

  const continentOptions = [
    { label: 'Tous', value: '' },
    { label: 'Afrique', value: 'Afrique' },
    { label: 'Europe', value: 'Europe' },
    { label: 'Asie', value: 'Asie' }
  ];

  const booleanOptions = [
    { label: 'Tous', value: '' },
    { label: 'Oui', value: 'true' },
    { label: 'Non', value: 'false' }
  ];

  const loadData = async () => {
    setLoading(true);
    try {
      const currentLevel = levels.find(l => l.id === activeLevel);
      
      // Construire les paramètres selon le niveau
      const params = {
        page: lazyParams.page + 1,
        page_size: lazyParams.rows
      };

      // Ajouter la recherche si présente
      if (globalFilter) {
        params.search = globalFilter;
      }

      // Ajouter les filtres spécifiques selon le niveau
      if (activeLevel === 'pays') {
        if (filters.continent) params.continent = filters.continent;
        if (filters.sous_region) params.sous_region = filters.sous_region;
        if (filters.est_actif) params.est_actif = filters.est_actif;
      } else if (activeLevel === 'provinces') {
        if (filters.pays_id) params.pays_id = filters.pays_id;
        if (filters.est_actif) params.est_actif = filters.est_actif;
      } else if (activeLevel === 'districts') {
        if (filters.province_id) params.province_id = filters.province_id;
        if (filters.est_actif) params.est_actif = filters.est_actif;
      } else if (activeLevel === 'quartiers') {
        if (filters.district_id) params.district_id = filters.district_id;
        if (filters.est_actif) params.est_actif = filters.est_actif;
      } else if (activeLevel === 'points') {
        if (filters.quartier_id) params.quartier_id = filters.quartier_id;
        if (filters.est_actif) params.est_actif = filters.est_actif;
      }

      const response = await apiService.getLocalisation(currentLevel.endpoint, params);
      
      setData(response.results || []);
      setTotalRecords(response.count || 0);
      setInitialLoad(false);
    } catch (error) {
      console.error('Erreur:', error);
      setData([]);
      setTotalRecords(0);
      setInitialLoad(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset pagination quand on change de niveau
    setLazyParams({
      first: 0,
      rows: 10,
      page: 0
    });
    setInitialLoad(true);
  }, [activeLevel]);

  useEffect(() => {
    loadData();
  }, [lazyParams, filters, globalFilter, activeLevel]);

  const onPage = (event) => {
    // Vérifier que la page demandée est valide
    const maxPage = Math.ceil(totalRecords / event.rows) - 1;
    if (event.page > maxPage && totalRecords > 0) {
      // Si on dépasse, revenir à la première page
      setLazyParams({
        first: 0,
        rows: event.rows,
        page: 0
      });
    } else {
      setLazyParams(event);
    }
  };

  const handleSave = async () => {
    try {
      const currentLevel = levels.find(l => l.id === activeLevel);
      
      if (dialogMode === 'create') {
        await apiService.createLocalisation(currentLevel.endpoint, formData);
      } else if (dialogMode === 'edit') {
        await apiService.updateLocalisation(currentLevel.endpoint, selectedItem.id, formData);
      }
      
      setShowDialog(false);
      loadData();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleDelete = async (item) => {
    if (confirm(`Supprimer ${item.nom} ?`)) {
      try {
        const currentLevel = levels.find(l => l.id === activeLevel);
        await apiService.deleteLocalisation(currentLevel.endpoint, item.id);
        loadData();
      } catch (error) {
        console.error('Erreur:', error);
      }
    }
  };

  const openCreateDialog = () => {
    setSelectedItem(null);
    setDialogMode('create');
    setFormData({
      code: '',
      nom: '',
      est_actif: true,
      metadonnees: {}
    });
    setMetadataFields([]);
    setShowDialog(true);
  };

  const openEditDialog = (item) => {
    setSelectedItem(item);
    setDialogMode('edit');
    setFormData({ ...item });
    setMetadataFields(item.metadonnees ? Object.keys(item.metadonnees) : []);
    setShowDialog(true);
  };

  const openViewDialog = (item) => {
    setSelectedItem(item);
    setDialogMode('view');
    setShowDialog(true);
  };

  const addMetadataField = () => {
    const fieldName = prompt('Nom du champ:');
    if (fieldName && !metadataFields.includes(fieldName)) {
      setMetadataFields([...metadataFields, fieldName]);
      setFormData({
        ...formData,
        metadonnees: { ...formData.metadonnees, [fieldName]: '' }
      });
    }
  };

  const removeMetadataField = (fieldName) => {
    setMetadataFields(metadataFields.filter(f => f !== fieldName));
    const newMetadata = { ...formData.metadonnees };
    delete newMetadata[fieldName];
    setFormData({ ...formData, metadonnees: newMetadata });
  };

  const codeBodyTemplate = (rowData) => {
    return <Tag value={rowData.code || rowData.code_iso_2 || rowData.code_iso_3} severity="info" />;
  };

  const activeBodyTemplate = (rowData) => {
    return (
      <Tag 
        value={rowData.est_actif ? 'Actif' : 'Inactif'} 
        severity={rowData.est_actif ? 'success' : 'danger'} 
      />
    );
  };

  const metadataBodyTemplate = (rowData) => {
    if (!rowData.metadonnees || Object.keys(rowData.metadonnees).length === 0) {
      return <span className="text-gray-400 text-sm">Aucune</span>;
    }
    const count = Object.keys(rowData.metadonnees).length;
    return <Tag value={`${count} champ${count > 1 ? 's' : ''}`} severity="secondary" />;
  };

  const actionsBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => openViewDialog(rowData)}
          className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
          title="Voir"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={() => openEditDialog(rowData)}
          className="p-2 bg-secondary/10 text-secondary rounded-lg hover:bg-secondary/20 transition-colors"
          title="Modifier"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleDelete(rowData)}
          className="p-2 bg-danger/10 text-danger rounded-lg hover:bg-danger/20 transition-colors"
          title="Supprimer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    );
  };

  const stats = {
    total: totalRecords,
    actifs: data.filter(d => d.est_actif).length,
    inactifs: data.filter(d => !d.est_actif).length
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-anton uppercase text-text">Gestion Localisation</h1>
          <p className="text-sm text-gray-400 mt-1">Hiérarchie géographique complète</p>
        </div>
      </div>

      {/* Navigation par niveaux */}
      <div className="bg-card border border-darkGray rounded-lg p-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {levels.map((level, index) => {
            const Icon = level.icon;
            const isActive = activeLevel === level.id;
            
            return (
              <div key={level.id} className="flex items-center gap-2">
                <button
                  onClick={() => setActiveLevel(level.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-primary text-white shadow-lg shadow-primary/30'
                      : 'bg-background text-gray-400 hover:text-text hover:bg-darkGray'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{level.label}</span>
                </button>
                {index < levels.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-primary/20 rounded-lg">
              <Globe className="w-6 h-6 text-primary" />
            </div>
            <span className="text-3xl font-bold text-primary">{stats.total}</span>
          </div>
          <p className="text-sm text-gray-400">Total</p>
        </div>

        <div className="bg-gradient-to-br from-success/10 to-success/5 border border-success/20 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-success/20 rounded-lg">
              <Globe className="w-6 h-6 text-success" />
            </div>
            <span className="text-3xl font-bold text-success">{stats.actifs}</span>
          </div>
          <p className="text-sm text-gray-400">Actifs</p>
        </div>

        <div className="bg-gradient-to-br from-danger/10 to-danger/5 border border-danger/20 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-danger/20 rounded-lg">
              <Globe className="w-6 h-6 text-danger" />
            </div>
            <span className="text-3xl font-bold text-danger">{stats.inactifs}</span>
          </div>
          <p className="text-sm text-gray-400">Inactifs</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-card border border-darkGray rounded-lg p-4">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase mb-3">Filtres rapides</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setFilters({ ...filters, est_actif: 'true' })}
                className="px-4 py-2 bg-success/10 text-success rounded-lg hover:bg-success/20 transition-colors font-medium"
              >
                Actifs
              </button>
              <button
                onClick={() => setFilters({ ...filters, est_actif: 'false' })}
                className="px-4 py-2 bg-danger/10 text-danger rounded-lg hover:bg-danger/20 transition-colors font-medium"
              >
                Inactifs
              </button>
              {activeLevel === 'pays' && (
                <>
                  <button
                    onClick={() => setFilters({ ...filters, continent: 'Afrique' })}
                    className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors font-medium"
                  >
                    Afrique
                  </button>
                  <button
                    onClick={() => setFilters({ ...filters, continent: 'Europe' })}
                    className="px-4 py-2 bg-secondary/10 text-secondary rounded-lg hover:bg-secondary/20 transition-colors font-medium"
                  >
                    Europe
                  </button>
                </>
              )}
              <button
                onClick={() => setFilters({ continent: '', sous_region: '', est_actif: '', pays_id: '', province_id: '', district_id: '', quartier_id: '' })}
                className="px-4 py-2 bg-darkGray text-text rounded-lg hover:bg-darkGray/80 transition-colors font-medium"
              >
                Réinitialiser
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-darkGray">
            <h3 className="text-sm font-semibold text-gray-400 uppercase mb-3">Recherche et filtres</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <InputText
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  placeholder="Rechercher..."
                  className="w-full pl-10 pr-4 py-2 bg-background border border-darkGray rounded-lg text-text"
                />
              </div>

              {activeLevel === 'pays' && (
                <Dropdown
                  value={filters.continent}
                  options={continentOptions}
                  onChange={(e) => setFilters({ ...filters, continent: e.value })}
                  placeholder="Continent"
                  className="w-full"
                />
              )}

              <Dropdown
                value={filters.est_actif}
                options={booleanOptions}
                onChange={(e) => setFilters({ ...filters, est_actif: e.value })}
                placeholder="Statut"
                className="w-full"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-darkGray">
            <h3 className="text-sm font-semibold text-gray-400 uppercase mb-3">Actions</h3>
            <div className="flex gap-3">
              <button
                onClick={openCreateDialog}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                <Plus className="w-5 h-5" />
                Nouveau
              </button>

              <button
                onClick={() => console.log('Export')}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                <Download className="w-5 h-5" />
                Exporter
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DataTable */}
      <div className="bg-card border border-darkGray rounded-lg overflow-hidden">
        {initialLoad ? (
          <div className="p-6 space-y-4">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="flex items-center gap-4 py-3 border-b border-darkGray">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-24" />
                <div className="ml-auto flex gap-2">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <DataTable
            value={data}
            lazy
            paginator
            first={lazyParams.first}
            rows={lazyParams.rows}
            totalRecords={totalRecords}
            onPage={onPage}
            loading={loading}
            rowsPerPageOptions={[10, 25, 50, 100]}
            className="custom-datatable"
            emptyMessage="Aucune donnée"
            scrollable
            scrollHeight="600px"
          >
            <Column 
              field={activeLevel === 'pays' ? 'code_iso_2' : 'code'}
              header="Code" 
              body={codeBodyTemplate}
              sortable 
              frozen
              style={{ minWidth: '100px', whiteSpace: 'nowrap' }} 
            />
            <Column 
              field="nom" 
              header="Nom" 
              sortable 
              frozen
              style={{ minWidth: '200px', whiteSpace: 'nowrap' }} 
            />
            {activeLevel === 'pays' && (
              <>
                <Column 
                  field="continent" 
                  header="Continent" 
                  sortable 
                  style={{ minWidth: '150px', whiteSpace: 'nowrap' }} 
                />
                <Column 
                  field="sous_region" 
                  header="Sous-région" 
                  sortable 
                  style={{ minWidth: '150px', whiteSpace: 'nowrap' }} 
                />
                <Column 
                  field="code_iso_3" 
                  header="ISO 3" 
                  sortable 
                  style={{ minWidth: '100px', whiteSpace: 'nowrap' }} 
                />
              </>
            )}
            <Column 
              header="Métadonnées" 
              body={metadataBodyTemplate} 
              style={{ minWidth: '120px', whiteSpace: 'nowrap' }} 
            />
            <Column 
              field="est_actif" 
              header="Statut" 
              body={activeBodyTemplate} 
              sortable 
              style={{ minWidth: '100px', whiteSpace: 'nowrap' }} 
            />
            <Column 
              header="Actions" 
              body={actionsBodyTemplate} 
              frozen 
              alignFrozen="right" 
              style={{ width: '150px', whiteSpace: 'nowrap' }} 
            />
          </DataTable>
        )}
      </div>

      {/* Dialog */}
      <Dialog
        visible={showDialog}
        onHide={() => setShowDialog(false)}
        header={dialogMode === 'create' ? 'Nouveau' : dialogMode === 'edit' ? 'Modifier' : 'Détails'}
        style={{ width: '900px', maxHeight: '90vh' }}
        className="custom-dialog"
      >
        {dialogMode === 'view' && selectedItem ? (
          <div className="space-y-6">
            {/* Informations principales */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-400 mb-1">Code ISO 2</p>
                <p className="font-semibold text-text">{selectedItem.code || selectedItem.code_iso_2}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Code ISO 3</p>
                <p className="font-semibold text-text">{selectedItem.code_iso_3 || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Nom</p>
                <p className="font-semibold text-text">{selectedItem.nom}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Nom anglais</p>
                <p className="font-semibold text-text">{selectedItem.nom_anglais || '-'}</p>
              </div>
              {selectedItem.continent && (
                <div>
                  <p className="text-sm text-gray-400 mb-1">Continent</p>
                  <p className="font-semibold text-text">{selectedItem.continent}</p>
                </div>
              )}
              {selectedItem.sous_region && (
                <div>
                  <p className="text-sm text-gray-400 mb-1">Sous-région</p>
                  <p className="font-semibold text-text">{selectedItem.sous_region}</p>
                </div>
              )}
              {selectedItem.latitude_centre && (
                <div>
                  <p className="text-sm text-gray-400 mb-1">Latitude</p>
                  <p className="font-semibold text-text">{selectedItem.latitude_centre}</p>
                </div>
              )}
              {selectedItem.longitude_centre && (
                <div>
                  <p className="text-sm text-gray-400 mb-1">Longitude</p>
                  <p className="font-semibold text-text">{selectedItem.longitude_centre}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-400 mb-1">Autorisé système</p>
                <Tag 
                  value={selectedItem.autorise_systeme ? 'Oui' : 'Non'} 
                  severity={selectedItem.autorise_systeme ? 'success' : 'secondary'} 
                />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Statut</p>
                {activeBodyTemplate(selectedItem)}
              </div>
            </div>

            {/* Métadonnées détaillées */}
            {selectedItem.metadonnees && Object.keys(selectedItem.metadonnees).length > 0 && (
              <div className="pt-6 border-t border-darkGray">
                <h3 className="text-lg font-semibold text-text mb-4">Informations complémentaires</h3>
                <div className="space-y-4">
                  {/* Langues en chips */}
                  {selectedItem.metadonnees.langues && Array.isArray(selectedItem.metadonnees.langues) && (
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Langues parlées</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedItem.metadonnees.langues.map((langue, index) => (
                          <Tag 
                            key={index} 
                            value={langue} 
                            severity="info"
                            className="px-3 py-1"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Autres métadonnées en grille */}
                  <div className="grid grid-cols-2 gap-4">
                    {selectedItem.metadonnees.capitale && (
                      <div className="p-3 bg-background rounded-lg">
                        <p className="text-xs text-gray-400 mb-1">Capitale</p>
                        <p className="text-sm text-text font-medium">{selectedItem.metadonnees.capitale}</p>
                      </div>
                    )}
                    {selectedItem.metadonnees.population && (
                      <div className="p-3 bg-background rounded-lg">
                        <p className="text-xs text-gray-400 mb-1">Population</p>
                        <p className="text-sm text-text font-medium">{selectedItem.metadonnees.population.toLocaleString()}</p>
                      </div>
                    )}
                    {selectedItem.metadonnees.devise && (
                      <div className="p-3 bg-background rounded-lg">
                        <p className="text-xs text-gray-400 mb-1">Devise</p>
                        <p className="text-sm text-text font-medium">{selectedItem.metadonnees.devise}</p>
                      </div>
                    )}
                    {selectedItem.metadonnees.indicatif_tel && (
                      <div className="p-3 bg-background rounded-lg">
                        <p className="text-xs text-gray-400 mb-1">Indicatif téléphonique</p>
                        <p className="text-sm text-text font-medium">{selectedItem.metadonnees.indicatif_tel}</p>
                      </div>
                    )}
                    {selectedItem.metadonnees.fuseau_horaire && (
                      <div className="p-3 bg-background rounded-lg">
                        <p className="text-xs text-gray-400 mb-1">Fuseau horaire</p>
                        <p className="text-sm text-text font-medium">{selectedItem.metadonnees.fuseau_horaire}</p>
                      </div>
                    )}
                    {selectedItem.metadonnees.superficie_km2 && (
                      <div className="p-3 bg-background rounded-lg">
                        <p className="text-xs text-gray-400 mb-1">Superficie</p>
                        <p className="text-sm text-text font-medium">{selectedItem.metadonnees.superficie_km2.toLocaleString()} km²</p>
                      </div>
                    )}
                    
                    {/* Autres métadonnées non standard */}
                    {Object.entries(selectedItem.metadonnees)
                      .filter(([key]) => !['langues', 'capitale', 'population', 'devise', 'indicatif_tel', 'fuseau_horaire', 'superficie_km2'].includes(key))
                      .map(([key, value]) => (
                        <div key={key} className="p-3 bg-background rounded-lg">
                          <p className="text-xs text-gray-400 mb-1">{key}</p>
                          <p className="text-sm text-text font-medium">
                            {typeof value === 'object' ? JSON.stringify(value) : value}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* Dates */}
            <div className="pt-6 border-t border-darkGray">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Date de création</p>
                  <p className="text-sm text-text">{new Date(selectedItem.date_creation).toLocaleString('fr-FR')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Dernière modification</p>
                  <p className="text-sm text-text">{new Date(selectedItem.date_modification).toLocaleString('fr-FR')}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Code {activeLevel === 'pays' ? 'ISO 2' : ''} *
                </label>
                <InputText
                  value={formData.code || formData.code_iso_2 || ''}
                  onChange={(e) => setFormData({ ...formData, [activeLevel === 'pays' ? 'code_iso_2' : 'code']: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-darkGray rounded-lg text-text"
                  placeholder="Ex: BI"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Nom *</label>
                <InputText
                  value={formData.nom || ''}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-darkGray rounded-lg text-text"
                  placeholder="Ex: Burundi"
                />
              </div>

              {activeLevel === 'pays' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Code ISO 3</label>
                    <InputText
                      value={formData.code_iso_3 || ''}
                      onChange={(e) => setFormData({ ...formData, code_iso_3: e.target.value })}
                      className="w-full px-4 py-2 bg-background border border-darkGray rounded-lg text-text"
                      placeholder="Ex: BDI"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Continent</label>
                    <Dropdown
                      value={formData.continent || ''}
                      options={continentOptions.filter(c => c.value !== '')}
                      onChange={(e) => setFormData({ ...formData, continent: e.value })}
                      placeholder="Sélectionner"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Sous-région</label>
                    <InputText
                      value={formData.sous_region || ''}
                      onChange={(e) => setFormData({ ...formData, sous_region: e.target.value })}
                      className="w-full px-4 py-2 bg-background border border-darkGray rounded-lg text-text"
                      placeholder="Ex: Afrique de l'Est"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Latitude</label>
                <InputText
                  type="number"
                  step="0.0001"
                  value={formData.latitude_centre || ''}
                  onChange={(e) => setFormData({ ...formData, latitude_centre: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 bg-background border border-darkGray rounded-lg text-text"
                  placeholder="Ex: -3.3731"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Longitude</label>
                <InputText
                  type="number"
                  step="0.0001"
                  value={formData.longitude_centre || ''}
                  onChange={(e) => setFormData({ ...formData, longitude_centre: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 bg-background border border-darkGray rounded-lg text-text"
                  placeholder="Ex: 29.9189"
                />
              </div>

              <div className="col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.est_actif || false}
                    onChange={(e) => setFormData({ ...formData, est_actif: e.target.checked })}
                    className="w-5 h-5 text-primary rounded border-darkGray"
                  />
                  <span className="text-sm text-text">Actif</span>
                </label>
              </div>
            </div>

            <div className="pt-6 border-t border-darkGray">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text">Métadonnées</h3>
                <button
                  onClick={addMetadataField}
                  className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter un champ
                </button>
              </div>

              {metadataFields.length > 0 ? (
                <div className="space-y-3">
                  {metadataFields.map((field) => (
                    <div key={field} className="flex items-center gap-3">
                      <div className="flex-1">
                        <label className="block text-xs text-gray-400 mb-1">{field}</label>
                        <InputText
                          value={formData.metadonnees?.[field] || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            metadonnees: { ...formData.metadonnees, [field]: e.target.value }
                          })}
                          className="w-full px-3 py-2 bg-background border border-darkGray rounded-lg text-text text-sm"
                        />
                      </div>
                      <button
                        onClick={() => removeMetadataField(field)}
                        className="p-2 text-danger hover:bg-danger/10 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-4">Aucune métadonnée</p>
              )}
            </div>

            <div className="flex gap-3 pt-4 border-t border-darkGray">
              <button
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                Enregistrer
              </button>
              <button
                onClick={() => setShowDialog(false)}
                className="flex-1 px-4 py-3 bg-darkGray hover:bg-darkGray/80 text-text rounded-lg transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default GestionPays;
