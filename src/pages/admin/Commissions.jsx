import { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import {
  DollarSign, TrendingUp, Edit, Save, Download,
  BarChart3, Users, Activity, Calendar
} from 'lucide-react';

function Commissions() {
  const toast = useRef(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedGrille, setSelectedGrille] = useState(null);
  const [period, setPeriod] = useState('month');

  const periods = [
    { label: 'Aujourd\'hui', value: 'today' },
    { label: 'Cette semaine', value: 'week' },
    { label: 'Ce mois', value: 'month' },
    { label: 'Cette année', value: 'year' }
  ];

  // Grilles de commissions
  const grillesCommissions = [
    {
      id: 1,
      type: 'Dépôt',
      tranche: '0 - 50,000 BIF',
      tauxAgent: 1.5,
      tauxPlateforme: 0.5,
      montantFixe: 0,
      actif: true
    },
    {
      id: 2,
      type: 'Dépôt',
      tranche: '50,001 - 200,000 BIF',
      tauxAgent: 1.2,
      tauxPlateforme: 0.3,
      montantFixe: 0,
      actif: true
    },
    {
      id: 3,
      type: 'Dépôt',
      tranche: '200,001+ BIF',
      tauxAgent: 1.0,
      tauxPlateforme: 0.2,
      montantFixe: 0,
      actif: true
    },
    {
      id: 4,
      type: 'Retrait',
      tranche: '0 - 50,000 BIF',
      tauxAgent: 2.0,
      tauxPlateforme: 0.5,
      montantFixe: 0,
      actif: true
    },
    {
      id: 5,
      type: 'Retrait',
      tranche: '50,001 - 200,000 BIF',
      tauxAgent: 1.8,
      tauxPlateforme: 0.4,
      montantFixe: 0,
      actif: true
    },
    {
      id: 6,
      type: 'Retrait',
      tranche: '200,001+ BIF',
      tauxAgent: 1.5,
      tauxPlateforme: 0.3,
      montantFixe: 0,
      actif: true
    },
    {
      id: 7,
      type: 'Transfert',
      tranche: 'Toutes tranches',
      tauxAgent: 0.8,
      tauxPlateforme: 0.2,
      montantFixe: 100,
      actif: true
    },
    {
      id: 8,
      type: 'Paiement Facture',
      tranche: 'Toutes tranches',
      tauxAgent: 0.5,
      tauxPlateforme: 0.1,
      montantFixe: 50,
      actif: true
    }
  ];

  // Stats commissions
  const statsCommissions = {
    totalMois: 45678900,
    totalAgents: 38456700,
    totalPlateforme: 7222200,
    croissance: 12.5,
    nbTransactions: 145678
  };

  // Commissions par agent (Top 10)
  const commissionsParAgent = [
    { agent: 'AG001 - Jean Mukiza', depot: 456789, retrait: 234567, transfert: 123456, total: 814812 },
    { agent: 'AG002 - Marie Ndayisenga', depot: 423456, retrait: 212345, transfert: 112345, total: 748146 },
    { agent