import { useState } from 'react';
import { Search, Users, ChevronLeft, ChevronDown, Trophy, Calendar, Clock, Building2, ClipboardList, Camera, Upload, ScanFace, CreditCard, Check, ArrowRight, Send, Home, Plus, Trash2, LogOut, UserPlus } from 'lucide-react';
const edefiLogo = new URL('../assets/edefi-logo.svg', import.meta.url).href;

interface Team {
  id: string;
  name: string;
  category: string;
  zone: string;
  keywords: string[];
  shield: string;
}

interface JugadorFichado {
  id: number;
  dni: string;
  nombre: string;
  apellido: string;
  fechaNac: string;
  categoria: string;
  equipo: string;
  torneo: string;
  foto: string | null;
}

const teams: Team[] = [
  { 
    id: '1', 
    name: 'Haedo Sur', 
    category: 'Fútbol 11 Infantiles 2024',
    zone: 'Zona A',
    keywords: ['haedo', 'sur', 'haedo sur'],
    shield: '🔴'
  },
  { 
    id: '2', 
    name: 'Haedo Sur Azul', 
    category: 'Vespertino 2025',
    zone: 'Zona A',
    keywords: ['haedo', 'sur', 'azul', 'haedo sur azul'],
    shield: '🔵'
  },
  { 
    id: '3', 
    name: 'Haedo Sur', 
    category: 'Fútbol 11 Infantiles 2024',
    zone: 'Zona B',
    keywords: ['haedo', 'sur', 'haedo sur'],
    shield: '🟢'
  },
  { 
    id: '4', 
    name: 'Haedo Norte', 
    category: 'Fútbol 7 Menores 2024',
    zone: 'Zona C',
    keywords: ['haedo', 'norte', 'haedo norte'],
    shield: '🟡'
  },
  { 
    id: '5', 
    name: 'Atlético Central', 
    category: 'Fútbol 11 Juveniles 2024',
    zone: 'Zona A',
    keywords: ['atletico', 'central', 'atletico central'],
    shield: '⚫'
  },
  { 
    id: '6', 
    name: 'Deportivo Unidos', 
    category: 'Vespertino 2025',
    zone: 'Zona B',
    keywords: ['deportivo', 'unidos', 'deportivo unidos'],
    shield: '⚪'
  },
  { 
    id: '7', 
    name: 'Racing FC', 
    category: 'Fútbol 7 Infantiles 2024',
    zone: 'Zona A',
    keywords: ['racing', 'fc', 'racing fc'],
    shield: '🟣'
  },
  { 
    id: '8', 
    name: 'Club Victoria', 
    category: 'Fútbol 11 Infantiles 2024',
    zone: 'Zona C',
    keywords: ['club', 'victoria', 'club victoria'],
    shield: '🟠'
  },
];

// Razones comunes para tarjetas amarillas
const RAZONES_AMARILLA = [
  'Juego brusco',
  'Conducta antideportiva',
  'Desaprobar con palabras o acciones',
  'Retardar la reanudación del juego',
  'No respetar la distancia reglamentaria',
  'Entrar o salir del campo sin permiso',
  'OTRO'
];

// Razones comunes para tarjetas rojas
const RAZONES_ROJA = [
  'Juego brusco grave',
  'Conducta violenta',
  'Escupir a un adversario',
  'Malograr oportunidad de gol con mano',
  'Malograr oportunidad de gol con falta',
  'Lenguaje/gestos ofensivos',
  'Segunda amarilla',
  'OTRO'
];

// Razones comunes para suspensión de partido
const RAZONES_SUSPENSION = [
  'Mal estado del campo de juego',
  'Condiciones climáticas adversas',
  'Falta de jugadores',
  'Incidentes de público',
  'Falta de árbitro',
  'Corte de luz',
  'OTRO'
];



export function TeamSelector() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showTournamentSelection, setShowTournamentSelection] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState<{type: string, name: string} | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [activeTab, setActiveTab] = useState<'posiciones' | 'fixture' | 'jornadas' | 'clubes'>('posiciones');
  const [showFichaje, setShowFichaje] = useState(false);
  const [showFichajeJugadorYaFichado, setShowFichajeJugadorYaFichado] = useState(false);
  const [showFichajeIntro, setShowFichajeIntro] = useState(false);
  const [showArbitrosDelegados, setShowArbitrosDelegados] = useState(false);
  const [arbitroUsername, setArbitroUsername] = useState('');
  const [arbitroPassword, setArbitroPassword] = useState('');
  const [isArbitroLoggedIn, setIsArbitroLoggedIn] = useState(false);
  const [isDelegado, setIsDelegado] = useState(false);
  const [arbitroUsernameError, setArbitroUsernameError] = useState('');
  const [arbitroPasswordError, setArbitroPasswordError] = useState('');
  const [selectedDelegadoTeam, setSelectedDelegadoTeam] = useState<string | null>(null);
  const [selectedCategoriaFiltro, setSelectedCategoriaFiltro] = useState<string | null>(null);
  const [activeDelegadoTab, setActiveDelegadoTab] = useState<'jugadores' | 'buscar' | 'pendientes'>('jugadores');
  const [buscarCodigoEquipo, setBuscarCodigoEquipo] = useState('');
  const [buscarResultados, setBuscarResultados] = useState(false);
  const [buscarAnoFiltro, setBuscarAnoFiltro] = useState<string | null>(null);
  const [showDelegadoMenu, setShowDelegadoMenu] = useState(false);
  const [showArbitroMenu, setShowArbitroMenu] = useState(false);
  const [showDelegadoTeamProfile, setShowDelegadoTeamProfile] = useState(false);
  const [jugadorAEliminar, setJugadorAEliminar] = useState<number | null>(null);
  const [jugadoresFichados, setJugadoresFichados] = useState<JugadorFichado[]>([]);
  const [fichajeCodigoEquipo, setFichajeCodigoEquipo] = useState('');
  const [fichajeStep, setFichajeStep] = useState(1);
  const [fichajeNombre, setFichajeNombre] = useState('');
  const [fichajeApellido, setFichajeApellido] = useState('');
  const [fichajeDni, setFichajeDni] = useState('');
  const [fichajeDiaNacimiento, setFichajeDiaNacimiento] = useState('');
  const [fichajeMesNacimiento, setFichajeMesNacimiento] = useState('');
  const [fichajeAnioNacimiento, setFichajeAnioNacimiento] = useState('');
  const [fichajeFoto, setFichajeFoto] = useState<string | null>(null);
  const [fichajeDniFrente, setFichajeDniFrente] = useState<string | null>(null);
  const [fichajeDniDorso, setFichajeDniDorso] = useState<string | null>(null);
  const [selectedJornada, setSelectedJornada] = useState<number | null>(null);
  const [selectedCategoria, setSelectedCategoria] = useState<string | null>(null);
  const [showInformePartido, setShowInformePartido] = useState(false);
  const [golesEquipoA, setGolesEquipoA] = useState<Array<{jugador: string, minuto: string}>>([]);
  const [golesEquipoB, setGolesEquipoB] = useState<Array<{jugador: string, minuto: string}>>([]);
  const [amarillasEquipoA, setAmarillasEquipoA] = useState<Array<{jugador: string, motivo: string}>>([]);
  const [amarillasEquipoB, setAmarillasEquipoB] = useState<Array<{jugador: string, motivo: string}>>([]);
  const [rojasEquipoA, setRojasEquipoA] = useState<Array<{jugador: string, motivo: string}>>([]);
  const [rojasEquipoB, setRojasEquipoB] = useState<Array<{jugador: string, motivo: string}>>([]);
  const [categoriasCompletadas, setCategoriasCompletadas] = useState<string[]>([]);
  const [horarioInicio, setHorarioInicio] = useState('');
  const [horarioFinalizacion, setHorarioFinalizacion] = useState('');
  const [comentariosPartido, setComentariosPartido] = useState('');
  const [informesEnviados, setInformesEnviados] = useState<number[]>([]);
  const [partidoSuspendido, setPartidoSuspendido] = useState(false);
  const [razonSuspension, setRazonSuspension] = useState('');
  const [razonSuspensionOtro, setRazonSuspensionOtro] = useState('');
  const [mostrarErrorValidacion, setMostrarErrorValidacion] = useState(false);

  const filteredTeams = teams.filter(team =>
    team.keywords.some(keyword => 
      keyword.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleTeamSelect = (team: Team) => {
    setSelectedTeam(team);
    setShowTournamentSelection(true);
  };

  const handleDontKnowTeam = () => {
    window.open('https://web2.edefi.com.ar/', '_blank');
  };

  const handleBack = () => {
    if (showProfile) {
      setShowProfile(false);
      setSelectedCompetition(null);
    } else if (showTournamentSelection) {
      setShowTournamentSelection(false);
      setSelectedTeam(null);
    } else {
      setSearchTerm('');
      setSelectedTeam(null);
    }
  };

  const handleTournamentSelect = (type: string, name: string) => {
    setSelectedCompetition({ type, name });
    setShowProfile(true);
  };

  const handleTeamClick = (teamName: string) => {
    // Buscar el equipo por nombre y actualizar el seleccionado
    const team = teams.find(t => t.name === teamName);
    if (team) {
      setSelectedTeam(team);
    }
  };

  const handleChangeCompetition = () => {
    setShowProfile(false);
  };

  const handleChangeTeam = () => {
    setShowProfile(false);
    setSelectedCompetition(null);
  };

// Componente ProgressStepper reutilizable
const ProgressStepper = ({ totalSteps, currentStep }: { totalSteps: number, currentStep: number }) => {
  if (isDelegado) {
    totalSteps -= 1;
    currentStep -= 1;
  }
  return (
  <div className="px-6 py-3 bg-white border-b border-gray-100">
    <div className="flex items-center justify-center">
      {Array.from({ length: totalSteps }, (_, index) => index + 1).map((step, index) => (
        <div key={step} className="flex items-center">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${
            step <= currentStep
              ? 'bg-green-600 border-green-600 text-white'
              : 'bg-white border-gray-300 text-gray-400'
          }`}>
            <span className="text-xs">{step}</span>
          </div>
          {index < totalSteps - 1 && (
            <div className={`w-6 h-0.5 transition-colors ${
              step < currentStep
                ? 'bg-green-600'
                : 'bg-gray-300'
            }`}></div>
          )}
        </div>
      ))}
    </div>
  </div>
)};

  const handleLogoClick = () => {
    // Resetear todo el estado a la pantalla principal
    setShowProfile(false);
    setShowTournamentSelection(false);
    setSelectedCompetition(null);
    setSelectedTeam(null);
    setSearchTerm('');
    setShowFichaje(false);
    setShowFichajeIntro(false);
    setFichajeStep(1);
    setFichajeCodigoEquipo('');
    setFichajeNombre('');
    setFichajeApellido('');
    setFichajeDni('');
    setFichajeDiaNacimiento('');
    setFichajeMesNacimiento('');
    setFichajeAnioNacimiento('');
    setFichajeFoto(null);
    setFichajeDniFrente(null);
    setFichajeDniDorso(null);
    setShowArbitrosDelegados(false);
    setIsArbitroLoggedIn(false);
    setIsDelegado(false);
    setSelectedDelegadoTeam(null);
    setArbitroUsername('');
    setArbitroPassword('');
    setSelectedJornada(null);
    setSelectedCategoria(null);
    setShowInformePartido(false);
    setCategoriasCompletadas([]);
    setGolesEquipoA([]);
    setGolesEquipoB([]);
    setAmarillasEquipoA([]);
    setAmarillasEquipoB([]);
    setRojasEquipoA([]);
    setRojasEquipoB([]);
    setJugadoresFichados([]);
    setJugadorAEliminar(null);
  };

  // Mock standings data
  const standingsData = [
    { 
      zone: 'A',
      teams: [
        { pos: 1, team: 'Villa Sahores', shield: '🟢', j: 4, g: 3, e: 0, p: 1, np: 0, pts: 10 },
        { pos: 2, team: 'Juv. de Castelar', shield: '🟠', j: 4, g: 3, e: 0, p: 1, np: 0, pts: 10 },
        { pos: 3, team: 'Haedo Junior', shield: '🔵', j: 4, g: 2, e: 1, p: 1, np: 0, pts: 9 },
        { pos: 4, team: 'F. de Belgrano', shield: '⚪', j: 4, g: 0, e: 0, p: 4, np: 0, pts: 4 },
      ],
      note: 'El club VILLA SAHORES se clasifica a semifinales de C. EDeFI.'
    },
    { 
      zone: 'B',
      teams: [
        { pos: 1, team: 'Deportivo Roca', shield: '🔴', j: 4, g: 3, e: 1, p: 0, np: 0, pts: 11 },
        { pos: 2, team: 'Haedo Sur', shield: '🔵', j: 4, g: 2, e: 2, p: 0, np: 0, pts: 10 },
        { pos: 3, team: 'San Martín', shield: '🟡', j: 4, g: 1, e: 1, p: 2, np: 0, pts: 6 },
        { pos: 4, team: 'Los Andes', shield: '⚫', j: 4, g: 0, e: 0, p: 4, np: 0, pts: 4 },
      ],
      note: 'El club DEPORTIVO ROCA se clasifica a semifinales de C. EDeFI.'
    },
    { 
      zone: 'C',
      teams: [
        { pos: 1, team: 'Racing FC', shield: '🟣', j: 4, g: 4, e: 0, p: 0, np: 0, pts: 13 },
        { pos: 2, team: 'Atlético Central', shield: '⚪', j: 4, g: 2, e: 1, p: 1, np: 0, pts: 9 },
        { pos: 3, team: 'Club Victoria', shield: '🟠', j: 4, g: 1, e: 0, p: 3, np: 0, pts: 5 },
        { pos: 4, team: 'Estudiantes', shield: '🔵', j: 4, g: 0, e: 1, p: 3, np: 0, pts: 3 },
      ],
      note: 'El club RACING FC se clasifica a semifinales de C. EDeFI.'
    },
  ];

  // Mock fixture data
  const fixtureData = [
    {
      fecha: 1,
      date: '15-2',
      matches: [
        { homeTeam: 'La Rural', homeShield: '🟢', awayTeam: 'Sagitario FC', awayShield: '🔵' },
        { homeTeam: 'A. de Castelar', homeShield: '🔵', awayTeam: 'Amigos FC', awayShield: '⚪' },
        { homeTeam: 'S. F. Soler', homeShield: '🟡', awayTeam: 'Haedo Jr', awayShield: '🟣' },
      ]
    },
    {
      fecha: 2,
      date: '23-2',
      matches: [
        { homeTeam: 'Sagitario FC', homeShield: '🔵', awayTeam: 'Haedo Jr', awayShield: '🟣' },
        { homeTeam: 'Amigos FC', homeShield: '⚪', awayTeam: 'S. F. Soler', awayShield: '🟡' },
        { homeTeam: 'La Rural', homeShield: '🟢', awayTeam: 'A. de Castelar', awayShield: '🔵' },
      ]
    },
    {
      fecha: 3,
      date: '1-3',
      matches: [
        { homeTeam: 'A. de Castelar', homeShield: '🔵', awayTeam: 'Sagitario FC', awayShield: '🔵' },
        { homeTeam: 'S. F. Soler', homeShield: '🟡', awayTeam: 'La Rural', awayShield: '🟢' },
        { homeTeam: 'Haedo Jr', homeShield: '🟣', awayTeam: 'Amigos FC', awayShield: '⚪' },
      ]
    },
    {
      fecha: 4,
      date: '8-3',
      matches: [
        { homeTeam: 'Sagitario FC', homeShield: '🔵', awayTeam: 'Amigos FC', awayShield: '⚪' },
        { homeTeam: 'La Rural', homeShield: '🟢', awayTeam: 'Haedo Jr', awayShield: '🟣' },
        { homeTeam: 'A. de Castelar', homeShield: '🔵', awayTeam: 'S. F. Soler', awayShield: '🟡' },
      ]
    },
    {
      fecha: 5,
      date: '15-3',
      matches: [
        { homeTeam: 'S. F. Soler', homeShield: '🟡', awayTeam: 'Sagitario FC', awayShield: '🔵' },
        { homeTeam: 'Haedo Jr', homeShield: '🟣', awayTeam: 'A. de Castelar', awayShield: '🔵' },
        { homeTeam: 'Amigos FC', homeShield: '⚪', awayTeam: 'La Rural', awayShield: '🟢' },
      ]
    },
  ];

  // Mock jornadas data
  const jornadasData = [
    {
      jornada: 1,
      matches: [
        { pos: 1, team: 'Social Club', shield: '🔵', date1: '1', date2: '1', date3: '2', tp: '7', pj: '3', v: 'X' },
        { pos: 1, team: 'Haedo Sur', shield: '🟡', date1: '1', date2: '1', date3: '0', tp: '5', pj: '3', v: 'X' },
        { pos: 2, team: 'Inmaculada Rojo', shield: '🔴', date1: '3', date2: '2', date3: '0', tp: '7', pj: '3', v: 'X' },
        { pos: 2, team: 'Club Abbas', shield: '🟠', date1: '1', date2: '0', date3: '2', tp: '5', pj: '3', v: 'X' },
        { pos: 3, team: '11 Corazones', shield: '🔵', date1: '3', date2: '1', date3: '4', tp: '8', pj: '3', v: 'X' },
        { pos: 3, team: 'Ateneo Verde', shield: '🟢', date1: '2', date2: '1', date3: '2', tp: '4', pj: '3', v: 'X' },
        { pos: 4, team: 'River Negro', shield: '⚫', date1: '-', date2: '1', date3: '2', tp: '4', pj: '3', v: 'X' },
        { pos: 4, team: 'Oratorio Rojo', shield: '🔴', date1: '2', date2: '3', date3: '1', tp: '7', pj: '3', v: 'X' },
        { pos: 5, team: 'INTERZONAL', shield: '🟢', date1: '-', date2: '-', date3: '-', tp: '0', pj: '3', v: 'X' },
        { pos: 5, team: 'INTERZONAL', shield: '🟢', date1: '-', date2: '-', date3: '-', tp: '0', pj: '3', v: 'X' },
      ]
    },
    {
      jornada: 2,
      matches: [
        { pos: 1, team: 'INTERZONAL', shield: '🟢', date1: '1', date2: '2', date3: '2', tp: '6', pj: '3', v: 'X' },
        { pos: 1, team: 'Social Club', shield: '🔵', date1: '1', date2: '3', date3: '0', tp: '6', pj: '3', v: 'X' },
        { pos: 2, team: 'INTERZONAL', shield: '🟢', date1: '2', date2: '0', date3: '4', tp: '8', pj: '3', v: 'X' },
        { pos: 2, team: 'River Negro', shield: '⚫', date1: '-', date2: '0', date3: '1', tp: '3', pj: '3', v: 'X' },
        { pos: 3, team: 'Oratorio Rojo', shield: '🔴', date1: '2', date2: '2', date3: '2', tp: '9', pj: '3', v: 'X' },
        { pos: 3, team: '11 Corazones', shield: '🔵', date1: '0', date2: '0', date3: '0', tp: '3', pj: '3', v: 'X' },
        { pos: 4, team: 'Ateneo Verde', shield: '🟢', date1: '3', date2: '2', date3: '2', tp: '9', pj: '3', v: 'X' },
        { pos: 4, team: 'Inmaculada Rojo', shield: '🔴', date1: '0', date2: '1', date3: '0', tp: '3', pj: '3', v: 'X' },
        { pos: 5, team: 'Club Abbas', shield: '🟠', date1: '1', date2: '3', date3: '5', tp: '7', pj: '3', v: 'X' },
        { pos: 5, team: 'Haedo Sur', shield: '🟡', date1: '3', date2: '1', date3: '1', tp: '5', pj: '3', v: 'X' },
      ]
    },
    {
      jornada: 3,
      matches: [
        { pos: 1, team: 'Social Club', shield: '🔵', date1: '9', date2: '1', date3: '1', tp: '6', pj: '3', v: 'X' },
        { pos: 1, team: 'Club Abbas', shield: '🟠', date1: '0', date2: '1', date3: '4', tp: '6', pj: '3', v: 'X' },
        { pos: 2, team: 'Haedo Sur', shield: '🟡', date1: '3', date2: '1', date3: '2', tp: '6', pj: '3', v: 'X' },
        { pos: 2, team: 'Ateneo Verde', shield: '🟢', date1: '1', date2: '1', date3: '5', tp: '6', pj: '3', v: 'X' },
        { pos: 3, team: 'Inmaculada Rojo', shield: '🔴', date1: '3', date2: '2', date3: '0', tp: '5', pj: '3', v: 'X' },
        { pos: 3, team: 'Oratorio Rojo', shield: '🔴', date1: '1', date2: '4', date3: '6', tp: '7', pj: '3', v: 'X' },
        { pos: 4, team: '11 Corazones', shield: '🔵', date1: '0', date2: '0', date3: '0', tp: '3', pj: '3', v: 'X' },
        { pos: 4, team: 'INTERZONAL', shield: '🟢', date1: '2', date2: '2', date3: '2', tp: '9', pj: '3', v: 'X' },
        { pos: 5, team: 'River Negro', shield: '⚫', date1: '-', date2: '1', date3: '0', tp: '3', pj: '3', v: 'X' },
      ]
    },
    {
      jornada: 4,
      matches: [
        { pos: 1, team: 'River Negro', shield: '⚫', date1: '-', date2: '0', date3: '1', tp: '3', pj: '3', v: 'X' },
        { pos: 1, team: 'Social Club', shield: '🔵', date1: '2', date2: '5', date3: '1', tp: '8', pj: '3', v: 'X' },
        { pos: 2, team: 'INTERZONAL', shield: '🟢', date1: '0', date2: '0', date3: '7', tp: '5', pj: '3', v: 'X' },
        { pos: 2, team: '11 Corazones', shield: '🔵', date1: '3', date2: '3', date3: '2', tp: '7', pj: '3', v: 'X' },
        { pos: 3, team: 'INTERZONAL', shield: '🟢', date1: '1', date2: '2', date3: '2', tp: '7', pj: '3', v: 'X' },
        { pos: 3, team: 'Inmaculada Rojo', shield: '🔴', date1: '2', date2: '-', date3: '-', tp: '3', pj: '3', v: 'X' },
        { pos: 4, team: 'Oratorio Rojo', shield: '🔴', date1: '4', date2: '1', date3: '2', tp: '9', pj: '3', v: 'X' },
        { pos: 4, team: 'Haedo Sur', shield: '🟡', date1: '1', date2: '0', date3: '0', tp: '3', pj: '3', v: 'X' },
        { pos: 5, team: 'Ateneo Verde', shield: '🟢', date1: '3', date2: '2', date3: '0', tp: '7', pj: '3', v: 'X' },
      ]
    },
  ];

  // Mock clubes data
  const clubesData = [
    { team: 'Abbas', shield: '🔴', localidad: 'San Justo', direccion: 'Av. Don Bosco 4654', techo: 'No' },
    { team: 'Jeju FC.', shield: '🔵', localidad: 'Hurlingham', direccion: 'Av. Pedro Díaz 2014, Hurlingham', techo: 'No' },
    { team: 'Oratorio FC.', shield: '🟡', localidad: 'Ramos Mejía', direccion: 'Formosa 1931', techo: 'No' },
    { team: 'Huracan SJ', shield: '🔴', localidad: 'San Justo', direccion: 'Florencio Varela 1606', techo: 'No' },
    { team: 'Centro Español', shield: '🟣', localidad: 'Villa Sarmiento', direccion: 'E. del Campo 929', techo: 'No' },
    { team: 'Soc. Italiana', shield: '🔵', localidad: 'El Palomar', direccion: 'Consultar', techo: 'No' },
    { team: 'Inmaculada', shield: '⚪', localidad: 'Moreno', direccion: 'Av. Néstor Kirchner 2094', techo: 'No' },
    { team: 'El Retiro', shield: '🟠', localidad: 'W.C. Morris, Hurl.', direccion: 'Cnel. Olascoaga 1799', techo: 'No' },
    { team: 'Portugues', shield: '🟢', localidad: 'Rafael Castillo', direccion: 'Bartolomé de las Casas 2548', techo: 'No' },
    { team: 'Sueños de 1ra.', shield: '⚫', localidad: 'San Justo', direccion: 'Consultar', techo: 'No' },
    { team: 'Haedo Sur', shield: '🔵', localidad: 'Haedo', direccion: 'Av. Rivadavia 15234', techo: 'Si' },
    { team: 'Racing FC', shield: '🟣', localidad: 'Morón', direccion: 'Buen Viaje 1850', techo: 'No' },
  ];

  // Mock players data
  const playersData: { [key: string]: string[] } = {
    'Haedo Sur': [
      'Martín González',
      'Lucas Fernández',
      'Santiago Rodríguez',
      'Nicolás López',
      'Franco Martínez',
      'Agustín Sánchez',
      'Maximiliano Romero',
      'Joaquín Díaz',
      'Tomás García',
      'Facundo Torres',
      'Matías Castro',
      'Sebastián Silva',
      'Diego Ruiz',
      'Pablo Morales',
      'Ignacio Benítez'
    ],
    'Racing FC': [
      'Juan Pérez',
      'Carlos Ramírez',
      'Fernando Acosta',
      'Gonzalo Medina',
      'Andrés Navarro',
      'Emanuel Suárez',
      'Cristian Vega',
      'Rodrigo Luna',
      'Adrián Rojas',
      'Mateo Campos',
      'Bruno Méndez',
      'Leandro Ortiz',
      'Damián Flores',
      'Gabriel Vargas'
    ],
    'Atlético Central': [
      'Eduardo Herrera',
      'Ramiro Guzmán',
      'Alexis Molina',
      'Kevin Bravo',
      'Oscar Ponce',
      'Milton Ramos',
      'Walter Cruz',
      'Ezequiel Delgado',
      'Ariel Cabrera',
      'Hernán Ríos',
      'Luciano Paz',
      'Claudio Vera',
      'Mariano Ibarra'
    ],
    'Villa Sahores': [
      'Ricardo Mendoza',
      'Javier Domínguez',
      'Leonardo Paredes',
      'Gastón Aguilar',
      'Emiliano Núñez',
      'Christian Figueroa',
      'Marcelo Sosa',
      'Darío Córdoba',
      'Rubén Miranda',
      'Miguel Castillo',
      'Jorge Maldonado',
      'Alberto Giménez'
    ],
    'Deportivo Roca': [
      'Daniel Guerrero',
      'Marcos Riquelme',
      'Sergio Peralta',
      'Federico Ledesma',
      'Valentín Villarreal',
      'Iván Quiroga',
      'Gustavo Palacios',
      'Brian Montoya',
      'Axel Fuentes',
      'Nahuel Arias',
      'Alan Godoy',
      'Braian Cardozo'
    ],
    'Club Victoria': [
      'Omar Salinas',
      'Julio Villalba',
      'Mauro Espinoza',
      'Esteban Reynoso',
      'Lisandro Velázquez',
      'Cristopher Moreno',
      'Jonathan Gil',
      'Facundo Ávila',
      'Denis Rivero',
      'Luis Vera',
      'Mario Bustamante'
    ]
  };

  const currentPlayers = playersData[selectedTeam?.name || ''] || [];

  // Mock jornadas asignadas data (para árbitros)
  const jornadasAsignadasData = [
    {
      id: 1,
      torneo: 'Torneo matutino',
      zona: 'Zona A',
      fecha: 'Fecha 4',
      equipoA: 'Haedo Sur',
      escudoA: '🔵',
      equipoB: 'Racing FC',
      escudoB: '🟣',
      dia: 'Sábado 07/11',
      hora: '13.00 hs',
      lugar: 'Av. Rivadavia 15234, Haedo'
    },
    {
      id: 2,
      torneo: 'Torneo matutino',
      zona: 'Zona A',
      fecha: 'Fecha 4',
      equipoA: 'Atlético Central',
      escudoA: '⚪',
      equipoB: 'Deportivo Unidos',
      escudoB: '⚪',
      dia: 'Sábado 07/11',
      hora: '15.00 hs',
      lugar: 'Calle 123, localidad'
    },
    {
      id: 3,
      torneo: 'Copa Edefi',
      zona: 'Zona B',
      fecha: 'Fecha 5',
      equipoA: 'Villa Sahores',
      escudoA: '🟢',
      equipoB: 'Club Victoria',
      escudoB: '🟠',
      dia: 'Domingo 08/11',
      hora: '10.00 hs',
      lugar: 'Av. Don Bosco 4654, San Justo'
    },
    {
      id: 4,
      torneo: 'Clausura',
      zona: 'Zona C',
      fecha: 'Fecha 3',
      equipoA: 'Haedo Norte',
      escudoA: '🟡',
      equipoB: 'Club Abbas',
      escudoB: '🔴',
      dia: 'Domingo 08/11',
      hora: '16.30 hs',
      lugar: 'Formosa 1931, Ramos Mejía'
    },
  ];

  // Mock equipos asignados al delegado
  const equiposDelegadoData = [
    {
      id: 1,
      nombre: 'GEBA',
      torneo: '1ra división futbol 11'
    },
    {
      id: 2,
      nombre: 'Racing FC',
      torneo: '1ra división futbol 11'
    },
    {
      id: 3,
      nombre: 'Deportivo Unidos',
      torneo: 'Clausura - Zona B'
    }
  ];

  // Mock jugadores fichados del equipo
  const jugadoresFichadosData = [
    {
      id: 1,
      dni: '24030368',
      nombre: 'Ariadna',
      apellido: 'Barcia',
      fechaNac: '6/7/1974',
      categoria: '1974',
      equipo: 'GEBA',
      torneo: '1ra división futbol 11',
      foto: null
    },
    {
      id: 2,
      dni: '36931350',
      nombre: 'Antonella',
      apellido: 'Fuselli',
      fechaNac: '13/7/1992',
      categoria: '1992',
      equipo: 'GEBA',
      torneo: '1ra división futbol 11',
      foto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop'
    },
    {
      id: 3,
      dni: '35421890',
      nombre: 'Martina',
      apellido: 'González',
      fechaNac: '22/3/1997',
      categoria: '1997',
      equipo: 'GEBA',
      torneo: '1ra división futbol 11',
      foto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'
    },
    {
      id: 4,
      dni: '37123456',
      nombre: 'Carolina',
      apellido: 'Rodríguez',
      fechaNac: '15/8/1999',
      categoria: '1999',
      equipo: 'GEBA',
      torneo: '1ra división futbol 11',
      foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop'
    },
    {
      id: 5,
      dni: '40567890',
      nombre: 'Sofía',
      apellido: 'Martínez',
      fechaNac: '10/4/2007',
      categoria: '2007',
      equipo: 'GEBA',
      torneo: '1ra división futbol 11',
      foto: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop'
    },
    {
      id: 6,
      dni: '28456123',
      nombre: 'Laura',
      apellido: 'Fernández',
      fechaNac: '20/11/1992',
      categoria: '1992',
      equipo: 'GEBA',
      torneo: '1ra división futbol 11',
      foto: null
    }
  ];

  // Mock jugadores encontrados por búsqueda de código de equipo
  const jugadoresBuscadosData = [
    {
      id: 1,
      dni: '28567234',
      nombre: 'María',
      apellido: 'López',
      fechaNac: '15/3/1975',
      categoria: '1975',
      equipo: 'SITAS "A"',
      torneo: '1ra división futbol 11',
      foto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop'
    },
    {
      id: 2,
      dni: '29123456',
      nombre: 'Gabriela',
      apellido: 'Sánchez',
      fechaNac: '22/5/1975',
      categoria: '1975',
      equipo: 'SITAS "A"',
      torneo: '1ra división futbol 11',
      foto: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop'
    },
    {
      id: 3,
      dni: '30234567',
      nombre: 'Andrea',
      apellido: 'Fernández',
      fechaNac: '10/8/1976',
      categoria: '1976',
      equipo: 'SITAS "A"',
      torneo: '1ra división futbol 11',
      foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop'
    },
    {
      id: 4,
      dni: '31345678',
      nombre: 'Claudia',
      apellido: 'Martínez',
      fechaNac: '5/11/1977',
      categoria: '1977',
      equipo: 'SITAS "A"',
      torneo: '1ra división futbol 11',
      foto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop'
    },
    {
      id: 5,
      dni: '32456789',
      nombre: 'Patricia',
      apellido: 'González',
      fechaNac: '18/2/1979',
      categoria: '1979',
      equipo: 'SITAS "A"',
      torneo: '1ra división futbol 11',
      foto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'
    },
    {
      id: 6,
      dni: '33567890',
      nombre: 'Silvia',
      apellido: 'Rodríguez',
      fechaNac: '30/7/1981',
      categoria: '1981',
      equipo: 'SITAS "A"',
      torneo: '1ra división futbol 11',
      foto: null
    }
  ];

  // Usar los datos actuales (del estado si existen, sino los mock data)
  const jugadoresActuales = jugadoresFichados.length > 0 ? jugadoresFichados : jugadoresFichadosData;

  // Obtener categorías únicas y ordenarlas
  const categorias = [...new Set(jugadoresActuales.map(j => j.categoria))].sort();
  
  // Filtrar jugadores según categoría seleccionada
  const jugadoresFiltrados = selectedCategoriaFiltro 
    ? jugadoresActuales.filter(j => j.categoria === selectedCategoriaFiltro)
    : jugadoresActuales;

  // Agrupar jugadores por categoría
  const jugadoresPorCategoria: { [key: string]: typeof jugadoresFichadosData } = {};
  jugadoresFiltrados.forEach(jugador => {
    if (!jugadoresPorCategoria[jugador.categoria]) {
      jugadoresPorCategoria[jugador.categoria] = [];
    }
    jugadoresPorCategoria[jugador.categoria].push(jugador);
  });

  // Para búsqueda: obtener años únicos y ordenarlos
  const anosBusqueda = [...new Set(jugadoresBuscadosData.map(j => j.categoria))].sort();
  
  // Filtrar jugadores buscados según año seleccionado
  const jugadoresBuscadosFiltrados = buscarAnoFiltro
    ? jugadoresBuscadosData.filter(j => j.categoria === buscarAnoFiltro)
    : jugadoresBuscadosData;

  // Agrupar jugadores buscados por categoría
  const jugadoresBuscadosPorCategoria: { [key: string]: typeof jugadoresBuscadosData } = {};
  jugadoresBuscadosFiltrados.forEach(jugador => {
    if (!jugadoresBuscadosPorCategoria[jugador.categoria]) {
      jugadoresBuscadosPorCategoria[jugador.categoria] = [];
    }
    jugadoresBuscadosPorCategoria[jugador.categoria].push(jugador);
  });

  const handleArbitroLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Limpiar errores previos
    setArbitroUsernameError('');
    setArbitroPasswordError('');
    
    // Validar campos vacíos
    let hasErrors = false;
    
    if (!arbitroUsername.trim()) {
      setArbitroUsernameError('Por favor, ingresá tu usuario');
      hasErrors = true;
    }
    
    if (!arbitroPassword.trim()) {
      setArbitroPasswordError('Por favor, ingresá tu contraseña');
      hasErrors = true;
    }
    
    // Si hay errores, no continuar
    if (hasErrors) {
      return;
    }
    
    // Verificar si es árbitro o delegado
    if (arbitroUsername.toLowerCase() === 'arbitro' && arbitroPassword.toLowerCase() === 'arbitro') {
      setIsArbitroLoggedIn(true);
      setIsDelegado(false);
    } else if (arbitroUsername.toLowerCase() === 'delegado' && arbitroPassword.toLowerCase() === 'delegado') {
      setIsArbitroLoggedIn(true);
      setIsDelegado(true);
    } else {
      setArbitroUsernameError('Usuario o contraseña incorrectos');
      setArbitroPasswordError('Verificá tus credenciales');
    }
  };

  const handleForgotPassword = () => {
    // Aquí iría la lógica para recuperar contraseña
    console.log('Forgot password');
  };

  const handleEliminarJugador = () => {
    if (jugadorAEliminar !== null) {
      // Si el estado está vacío, inicializar primero con los datos mock
      const jugadoresBase = jugadoresFichados.length > 0 ? jugadoresFichados : jugadoresFichadosData;
      setJugadoresFichados(jugadoresBase.filter(j => j.id !== jugadorAEliminar));
      setJugadorAEliminar(null);
    }
  };

  const handleValidarCodigoEquipo = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica de validación del código de equipo
    console.log('Validando código:', fichajeCodigoEquipo);
    // Si el código es válido, avanzar al paso 2
    if (fichajeCodigoEquipo.trim()) {
      setFichajeStep(2);
    }
  };

  const handleSubmitFichajeDatos = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar los datos del jugador
    console.log('Datos del jugador:', {
      nombre: fichajeNombre,
      apellido: fichajeApellido,
      dni: fichajeDni,
      fechaNacimiento: `${fichajeDiaNacimiento}/${fichajeMesNacimiento}/${fichajeAnioNacimiento}`
    });
    // Avanzar al paso 3
    // setShowFichajeJugadorYaFichado(true);
    setFichajeStep(3);
  };

  const handleSubmitFichajeDNIJugadorYaFichado = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar el DNI del jugador y avanzar al paso 3
    console.log('DNI del jugador:', fichajeDni);
    // Avanzar al paso 3
    setFichajeStep(3);
  };

  const handleFotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFichajeFoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitFoto = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar la foto y avanzar al paso 4
    console.log('Foto del jugador guardada');
    // Avanzar al paso 4
    setFichajeStep(4);
  };

  const handleDniUpload = (e: React.ChangeEvent<HTMLInputElement>, tipo: 'frente' | 'dorso') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (tipo === 'frente') {
          setFichajeDniFrente(reader.result as string);
        } else {
          setFichajeDniDorso(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitDni = (e: React.FormEvent) => {
    e.preventDefault();
    // Avanzar al paso 5 (declaración de consentimiento)
    setFichajeStep(5);
  };

  const handleEnviarDatos = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar todo el fichaje completo
    console.log('Fichaje completo:', {
      codigoEquipo: fichajeCodigoEquipo,
      nombre: fichajeNombre,
      apellido: fichajeApellido,
      dni: fichajeDni,
      fechaNacimiento: `${fichajeDiaNacimiento}/${fichajeMesNacimiento}/${fichajeAnioNacimiento}`,
      foto: fichajeFoto ? 'Foto cargada' : 'Sin foto',
      dniFrente: fichajeDniFrente ? 'DNI frente cargado' : 'Sin DNI frente',
      dniDorso: fichajeDniDorso ? 'DNI dorso cargado' : 'Sin DNI dorso'
    });
    // Aquí se enviaría todo al backend
    // Avanzar a la pantalla de confirmación (paso 6)
    setFichajeStep(6);
  };

  const handleVolverInicio = () => {
    // Resetear todo
    setShowFichaje(false);
    setShowFichajeJugadorYaFichado(false);
    setShowFichajeIntro(false);
    setFichajeStep(1);
    setFichajeCodigoEquipo('');
    setFichajeNombre('');
    setFichajeApellido('');
    setFichajeDni('');
    setFichajeDiaNacimiento('');
    setFichajeMesNacimiento('');
    setFichajeAnioNacimiento('');
    setFichajeFoto(null);
    setFichajeDniFrente(null);
    setFichajeDniDorso(null);
    
    // Si venimos desde delegados, volver a la sección de delegados
    if (isDelegado && selectedDelegadoTeam) {
      // Ya está en true, solo necesitamos asegurar que showFichaje es false
    }
    // Si no, se queda en la pantalla de inicio (por defecto)
  };

  // Fichaje Intro Screen - Pantalla intermedia antes del stepper
  if (showFichajeIntro) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
        {/* Header */}
        <div className="pt-12 pb-4 px-6 bg-white shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setShowFichajeIntro(false);
              }}
              className="p-2 -ml-2 rounded-lg transition-colors hover:bg-gray-100 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6 transition-colors text-gray-900" />
            </button>
            <h1 className="text-gray-900 text-xl">Fichaje de nuevo jugador</h1>
          </div>
        </div>

        <div className="px-6 pt-6">
          <div className="flex flex-col gap-3">
            <button
                              onClick={() => {
                                setShowFichajeIntro(false);
                                setShowFichaje(true);
                              }}
              className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 shadow-md hover:shadow-lg active:scale-[0.98] transition-all text-left opacity-90"
            >
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 mb-3 w-fit">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-white mb-1">{isDelegado ? 'Fichaje de nuevo jugador' : '¿Es la primera vez que te fichás en la liga?'}</h3>
              <p className="text-blue-50 text-xs leading-snug">
                {isDelegado? 'Fichalo subiendo sus datos' : 'Fichate con el código de equipo que te dio tu delegado'}
              </p>
            </button>

            <button
              onClick={() => {
                setShowFichajeIntro(false);
                setShowFichajeJugadorYaFichado(true);
              }}
              className="bg-green-600 rounded-2xl p-4 shadow-md hover:shadow-lg active:scale-[0.98] transition-all text-left opacity-90"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 mb-3 w-fit">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-white mb-1">{isDelegado ? '¿El jugador ya está fichado en otro equipo de la liga?' : '¿Ya jugás en un equipo y querés ficharte en otro?'}</h3>
              <p className="text-blue-50 text-xs leading-snug">
                {isDelegado ? 'Fichalo solo con el DNI del jugador' : 'Fichate con el código de equipo y tu DNI'}
              </p>
            </button>
          </div>
        </div>        
      </div>
    );
  }

  // Fichaje Jugador Ya Fichado Screen - Step 1: Código de equipo
  if (showFichajeJugadorYaFichado && fichajeStep === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
        {/* Header */}
        <div className="pt-12 pb-4 px-6 bg-white shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setShowFichajeJugadorYaFichado(false);
                setShowFichajeIntro(false);
              }}
              className="p-2 -ml-2 rounded-lg transition-colors hover:bg-gray-100 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6 transition-colors text-gray-900" />
            </button>
            <h1 className="text-gray-900 text-xl">Fichaje de jugador ya fichado</h1>
          </div>
        </div>

        <ProgressStepper totalSteps={3} currentStep={fichajeStep} />

        <div className="flex-1 px-6 pt-6 pb-6 overflow-y-auto">
          <div className="w-full max-w-md mx-auto">
            {/* Title */}
            <div className="mb-6">
              <h2 className="text-gray-900 mb-1">Ingresá el código de tu equipo</h2>
              <p className="text-gray-500 text-sm">
                Pedíselo a tu delegado
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleValidarCodigoEquipo} className="space-y-3">
              <input
                type="text"
                placeholder="Ingresá el código"
                value={fichajeCodigoEquipo}
                onChange={(e) => setFichajeCodigoEquipo(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition-all"
              />
              
              <button
                type="submit"
                className="w-full py-3 px-6 bg-green-600 text-white rounded-2xl hover:bg-green-700 active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                <span>Validar</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Fichaje Screen - Step 1: Código de equipo
  if (showFichaje && fichajeStep === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
        {/* Header */}
        <div className="pt-12 pb-4 px-6 bg-white shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setShowFichaje(false);
                setShowFichajeIntro(false);
              }}
              className="p-2 -ml-2 rounded-lg transition-colors hover:bg-gray-100 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6 transition-colors text-gray-900" />
            </button>
            <h1 className="text-gray-900 text-xl">Fichaje de nuevo jugador</h1>
          </div>
        </div>

        <ProgressStepper totalSteps={5} currentStep={fichajeStep} />

        <div className="flex-1 px-6 pt-6 pb-6 overflow-y-auto">
          <div className="w-full max-w-md mx-auto">
            {/* Title */}
            <div className="mb-6">
              <h2 className="text-gray-900 mb-1">Ingresá el código de tu equipo</h2>
              <p className="text-gray-500 text-sm">
                Pedíselo a tu delegado
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleValidarCodigoEquipo} className="space-y-3">
              <input
                type="text"
                placeholder="Ingresá el código"
                value={fichajeCodigoEquipo}
                onChange={(e) => setFichajeCodigoEquipo(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition-all"
              />
              
              <button
                type="submit"
                className="w-full py-3 px-6 bg-green-600 text-white rounded-2xl hover:bg-green-700 active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                <span>Validar</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Fichaje Screen - Step 2: Datos del jugador
  if (showFichaje && fichajeStep === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
        {/* Header */}
        <div className="pt-12 pb-4 px-6 bg-white shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                // Si venimos desde delegados, volver a delegados
                if (isDelegado && selectedDelegadoTeam) {
                  setShowFichaje(false);
                  setShowFichajeIntro(false);
                  setFichajeStep(1);
                } else {
                  // Si no, volver al paso 1
                  setFichajeStep(1);
                }
                setFichajeNombre('');
                setFichajeApellido('');
                setFichajeDni('');
                setFichajeDiaNacimiento('');
                setFichajeMesNacimiento('');
                setFichajeAnioNacimiento('');
              }}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-900" />
            </button>
            <h1 className="text-gray-900 text-xl">Fichaje de nuevo jugador</h1>
          </div>
        </div>

        <ProgressStepper totalSteps={5} currentStep={fichajeStep} />

        <div className="flex-1 px-6 pt-6 pb-6 overflow-y-auto">
          <div className="w-full max-w-md mx-auto">
            {/* Title */}
            <div className="mb-6">
              <h2 className="text-gray-900 mb-1">Datos generales del jugador</h2>
              <p className="text-gray-500 text-sm">
                {isDelegado ? 'Ingresá los datos del jugador' : 'Ingresá tus datos'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitFichajeDatos} className="space-y-3">
              <div>
                <label className="block text-gray-700 mb-1.5 text-sm">{isDelegado ? 'Nombre' : 'Tu nombre'}</label>
                <input
                  type="text"
                  placeholder={isDelegado ? 'Ingresá nombre del jugador' : 'Ingresá tu nombre'}
                  value={fichajeNombre}
                  onChange={(e) => setFichajeNombre(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition-all"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1.5 text-sm">{isDelegado ? 'Apellido' : 'Tu apellido'}</label>
                <input
                  type="text"
                  placeholder={isDelegado ? 'Ingresá apellido del jugador' : 'Ingresá tu apellido'}
                  value={fichajeApellido}
                  onChange={(e) => setFichajeApellido(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition-all"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1.5 text-sm">{isDelegado ? 'DNI' : 'Tu DNI'}</label>
                <input
                  type="text"
                  placeholder="Ingresá DNI"
                  value={fichajeDni}
                  onChange={(e) => setFichajeDni(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition-all"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1.5 text-sm">{isDelegado ? 'Fecha de nacimiento' : 'Tu fecha de nacimiento'}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Día"
                    value={fichajeDiaNacimiento}
                    onChange={(e) => setFichajeDiaNacimiento(e.target.value)}
                    maxLength={2}
                    className="w-1/3 px-3 py-3 rounded-2xl bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition-all text-center"
                  />
                  
                  <input
                    type="text"
                    placeholder="Mes"
                    value={fichajeMesNacimiento}
                    onChange={(e) => setFichajeMesNacimiento(e.target.value)}
                    maxLength={2}
                    className="w-1/3 px-3 py-3 rounded-2xl bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition-all text-center"
                  />
                  
                  <input
                    type="text"
                    placeholder="Año"
                    value={fichajeAnioNacimiento}
                    onChange={(e) => setFichajeAnioNacimiento(e.target.value)}
                    maxLength={4}
                    className="w-1/3 px-3 py-3 rounded-2xl bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition-all text-center"
                  />
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full py-3 px-6 bg-green-600 text-white rounded-2xl hover:bg-green-700 active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2"
              >
                <ArrowRight className="w-5 h-5" />
                <span>Continuar</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Fichaje Screen Jugador Ya Fichado - Step 2: Datos del jugador
  if (showFichajeJugadorYaFichado && fichajeStep === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
        {/* Header */}
        <div className="pt-12 pb-4 px-6 bg-white shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                // Si venimos desde delegados, volver a delegados
                if (isDelegado && selectedDelegadoTeam) {
                  setShowFichajeJugadorYaFichado(false);
                  setShowFichajeIntro(false);
                  setFichajeStep(1);
                } else {
                  // Si no, volver al paso 1
                  setFichajeStep(1);
                }
                setFichajeDni('');
              }}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-900" />
            </button>
            <h1 className="text-gray-900 text-xl">Fichaje</h1>
          </div>
        </div>

        <ProgressStepper totalSteps={3} currentStep={fichajeStep} />

        <div className="flex-1 px-6 pt-6 pb-6 overflow-y-auto">
          <div className="w-full max-w-md mx-auto">
            {/* Title */}
            <div className="mb-6">
              <h2 className="text-gray-900 mb-1">Datos generales</h2>
              <p className="text-gray-500 text-sm">
                Ingresá los datos del jugador
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitFichajeDNIJugadorYaFichado} className="space-y-3">
              
              <div>
                <label className="block text-gray-700 mb-1.5 text-sm">{isDelegado ? "DNI del jugador" : "Tu DNI"}</label>
                <input
                  type="text"
                  placeholder="Ingresá DNI"
                  value={fichajeDni}
                  onChange={(e) => setFichajeDni(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition-all"
                />
              </div>
                            
              <button
                type="submit"
                className="w-full py-3 px-6 bg-green-600 text-white rounded-2xl hover:bg-green-700 active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2"
              >
                <ArrowRight className="w-5 h-5" />
                <span>Continuar</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }


  // Fichaje Screen - Step 3: Subir foto
  if (showFichaje && fichajeStep === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
        {/* Header */}
        <div className="pt-12 pb-4 px-6 bg-white shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                setFichajeStep(2);
                setFichajeFoto(null);
              }}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-900" />
            </button>
            <h1 className="text-gray-900 text-xl">Fichaje de nuevo jugador</h1>
          </div>
        </div>

        <ProgressStepper totalSteps={5} currentStep={fichajeStep} />

        <div className="flex-1 px-6 pt-6 pb-6 overflow-y-auto">
          <div className="w-full max-w-md mx-auto">
            {/* Title */}
            <div className="mb-6">
              <h2 className="text-gray-900 mb-1">Cargar foto</h2>
              <p className="text-gray-500 text-sm">
                {isDelegado ? 'Foto del rostro del jugador con fondo liso' : 'Foto de tu rostro con fondo liso'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitFoto} className="space-y-4">
              {/* Photo Preview */}
              <div className="flex justify-center">
                <div className="w-48 h-48 bg-white rounded-2xl shadow-md overflow-hidden flex items-center justify-center border-2 border-gray-200">
                  {fichajeFoto ? (
                    <img 
                      src={fichajeFoto} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-gray-400">
                      <ScanFace className="w-16 h-16" strokeWidth={1.5} />
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Button */}
              <div className="relative">
                <input
                  type="file"
                  id="foto-upload"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFotoUpload}
                  className="hidden"
                />
                <label
                  htmlFor="foto-upload"
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-gray-800 text-white rounded-2xl hover:bg-gray-900 active:scale-[0.98] transition-all shadow-md cursor-pointer"
                >
                  <Camera className="w-5 h-5" />
                  <span>{fichajeFoto ? 'Cambiar' : 'Seleccionar'}</span>
                </label>
              </div>
              
              {/* Submit Button */}
              <button
                type="submit"
                disabled={!fichajeFoto}
                className={`w-full py-3 px-6 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 ${
                  fichajeFoto 
                    ? 'bg-green-600 text-white hover:bg-green-700 active:scale-[0.98]' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Upload className="w-5 h-5" />
                <span>Subir</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Fichaje Screen - Step 4: Subir fotos del DNI
  if (showFichaje && fichajeStep === 4) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
        {/* Header */}
        <div className="pt-12 pb-4 px-6 bg-white shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                setFichajeStep(3);
                setFichajeDniFrente(null);
                setFichajeDniDorso(null);
              }}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-900" />
            </button>
            <h1 className="text-gray-900 text-xl">Fichaje de nuevo jugador</h1>
          </div>
        </div>

        <ProgressStepper totalSteps={5} currentStep={fichajeStep} />

        <div className="flex-1 px-6 pt-6 pb-6 overflow-y-auto">
          <div className="w-full max-w-md mx-auto">
            {/* Title */}
            <div className="mb-6">
              <h2 className="text-gray-900 mb-1">Fotos del DNI</h2>
              <p className="text-gray-500 text-sm">
                {isDelegado ? 'Que se lean bien los datos del DNI del jugador' : 'Que se lean bien tus datos'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitDni} className="space-y-6">
            {/* DNI Frente */}
            <div className="space-y-3">
              <h3 className="text-gray-700 text-sm">Frente del DNI</h3>
              
              {/* Preview Frente */}
              <div className="flex justify-center">
                <div className="w-full h-40 bg-white rounded-2xl shadow-sm overflow-hidden flex items-center justify-center border-2 border-gray-200">
                  {fichajeDniFrente ? (
                    <img 
                      src={fichajeDniFrente} 
                      alt="DNI Frente Preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-gray-400">
                      <CreditCard className="w-12 h-12" strokeWidth={1.5} />
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Button Frente */}
              <div className="relative">
                <input
                  type="file"
                  id="dni-frente-upload"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => handleDniUpload(e, 'frente')}
                  className="hidden"
                />
                <label
                  htmlFor="dni-frente-upload"
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-gray-800 text-white rounded-2xl hover:bg-gray-900 active:scale-[0.98] transition-all shadow-md cursor-pointer"
                >
                  <Camera className="w-5 h-5" />
                  <span>{fichajeDniFrente ? 'Cambiar' : 'Seleccionar'}</span>
                </label>
              </div>
            </div>

            {/* DNI Dorso */}
            <div className="space-y-3">
              <h3 className="text-gray-700 text-sm">Dorso del DNI</h3>
              
              {/* Preview Dorso */}
              <div className="flex justify-center">
                <div className="w-full h-40 bg-white rounded-2xl shadow-sm overflow-hidden flex items-center justify-center border-2 border-gray-200">
                  {fichajeDniDorso ? (
                    <img 
                      src={fichajeDniDorso} 
                      alt="DNI Dorso Preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-gray-400">
                      <CreditCard className="w-12 h-12" strokeWidth={1.5} />
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Button Dorso */}
              <div className="relative">
                <input
                  type="file"
                  id="dni-dorso-upload"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => handleDniUpload(e, 'dorso')}
                  className="hidden"
                />
                <label
                  htmlFor="dni-dorso-upload"
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-gray-800 text-white rounded-2xl hover:bg-gray-900 active:scale-[0.98] transition-all shadow-md cursor-pointer"
                >
                  <Camera className="w-5 h-5" />
                  <span>{fichajeDniDorso ? 'Cambiar' : 'Seleccionar'}</span>
                </label>
              </div>
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={!fichajeDniFrente || !fichajeDniDorso}
              className={`w-full py-3 px-6 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 ${
                (fichajeDniFrente && fichajeDniDorso)
                  ? 'bg-green-600 text-white hover:bg-green-700 active:scale-[0.98]' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Upload className="w-5 h-5" />
              <span>Subir</span>
            </button>
          </form>
          </div>
        </div>
      </div>
    );
  }

  // Fichaje Screen - Step 5: Declaración y consentimiento final
  if (showFichaje && fichajeStep === 5) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
        {/* Header */}
        <div className="pt-12 pb-4 px-6 bg-white shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                setFichajeStep(4);
              }}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-900" />
            </button>
            <h1 className="text-gray-900 text-xl">Fichaje de nuevo jugador</h1>
          </div>
        </div>

        <ProgressStepper totalSteps={5} currentStep={fichajeStep} />

        <div className="flex-1 px-6 pt-6 pb-6 overflow-y-auto">
          <div className="w-full max-w-md mx-auto">
            {/* Title */}
            <div className="mb-6">
              <h2 className="text-gray-900 mb-1">Autorizar</h2>
            </div>

            {/* Form */}
            <form onSubmit={handleEnviarDatos} className="space-y-4">
              {/* Declaración Box */}
              <div className="bg-blue-500 rounded-2xl p-5 shadow-md">
                <p className="text-white text-center text-sm leading-relaxed">
                  {isDelegado ? 'Al enviar los datos, declaro que el jugador es mayor de edad o que tengo permiso del mayor de edad responsable y este autoriza a que puedan publicarse fotos y videos de su rostro en medios donde se difunda material sobre torneos organizados por EDeFI.' : 'Al enviar los datos, declaro ser mayor de edad o estar acompañado por un mayor de edad que autoriza a que puedan publicarse fotos y videos de mi rostro en medios donde se difunda material sobre torneos organizados por EDeFI.'}
                </p>
              </div>
              
              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 px-6 bg-green-600 text-white rounded-2xl hover:bg-green-700 active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                <span>Enviar</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Fichaje Screen Jugador Ya Fichado - Step 3: Pantalla de confirmación final
  if (showFichajeJugadorYaFichado && fichajeStep === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-md">
          {/* Success Message */}
          <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
            <div className="flex flex-col items-center space-y-4">
              {/* Check Icon */}
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                <svg 
                  className="w-10 h-10 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={3} 
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              {/* Title */}
              <h2 className="text-gray-900 text-center">
                ¡Fichaje completado!
              </h2>

              {/* Message */}
              <p className="text-gray-600 text-center text-sm leading-relaxed">
                {(isDelegado && selectedDelegadoTeam) 
                  ? 'El jugador ha sido registrado exitosamente y aparecerá en la sección de Pendientes hasta que la administración de la liga lo apruebe.'
                  : 'Vas a recibir la confirmación de tu fichaje por parte de tu delegado.'
                }
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          {isDelegado ? (
            <div className="flex gap-3">
              <button
                onClick={() => {
                  // Reiniciar flujo para fichar otro jugador
                  setShowFichajeIntro(false);
                  setShowFichaje(true);
                  setFichajeStep(2);
                }}
                className="flex-1 py-3 px-6 bg-green-600 text-white rounded-2xl hover:bg-green-700 active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2"
              >
                Fichar otro jugador
              </button>
              <button
                onClick={handleVolverInicio}
                className="flex-1 py-3 px-6 bg-green-600 text-white rounded-2xl hover:bg-green-700 active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleVolverInicio}
              className="w-full py-3 px-6 bg-green-600 text-white rounded-2xl hover:bg-green-700 active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Fichaje Screen - Step 6: Pantalla de confirmación final
  if (showFichaje && fichajeStep === 6) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-md">
          {/* Success Message */}
          <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
            <div className="flex flex-col items-center space-y-4">
              {/* Check Icon */}
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                <svg 
                  className="w-10 h-10 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={3} 
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              {/* Title */}
              <h2 className="text-gray-900 text-center">
                ¡Fichaje completado!
              </h2>

              {/* Message */}
              <p className="text-gray-600 text-center text-sm leading-relaxed">
                {(isDelegado && selectedDelegadoTeam) 
                  ? 'El jugador ha sido registrado exitosamente y aparecerá en la sección de Pendientes'
                  : 'Vas a recibir la confirmación de tu fichaje por parte de tu delegado'
                }
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          {isDelegado && (
            <button
              onClick={() => {
                // Reiniciar flujo para fichar otro jugador
                setShowFichajeIntro(true);
                setShowFichaje(false);
                setShowFichajeJugadorYaFichado(false);
                setFichajeStep(2);
              }}
              className="w-full mb-3 py-3 px-6 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2"
            >
              FICHAR OTRO JUGADOR
            </button>
          )}
          {/* Back to Home Button */}
          <button
            onClick={handleVolverInicio}
            className="w-full py-3 px-6 bg-green-600 text-white rounded-2xl hover:bg-green-700 active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // Arbitros/Delegados Login Screen
  if (showArbitrosDelegados && !isArbitroLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header with Back Button */}
        <div className="pt-12 pb-6 px-6">
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => setShowArbitrosDelegados(false)}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-900" />
            </button>
          </div>
          
          <div className="text-center mb-2">
            <h1 className="text-gray-900 text-2xl mb-2">Inicio sesión</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center px-6">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <img 
                src={edefiLogo} 
                alt="EDeFI Logo" 
                className="w-32 h-32 mb-6 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={handleLogoClick}
              />
              <p className="text-gray-600 text-center text-sm px-4">
                ¡Bienvenido! Si no tenés usuario, comunicate con la administración de la liga.
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleArbitroLogin} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Usuario"
                  value={arbitroUsername}
                  onChange={(e) => {
                    setArbitroUsername(e.target.value);
                    setArbitroUsernameError('');
                  }}
                  className={`w-full px-4 py-4 rounded-xl bg-gray-200 border-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    arbitroUsernameError ? 'border-red-500' : 'border-transparent'
                  }`}
                />
                {arbitroUsernameError && (
                  <p className="text-red-600 text-sm mt-2 ml-1">{arbitroUsernameError}</p>
                )}
              </div>
              
              <div>
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={arbitroPassword}
                  onChange={(e) => {
                    setArbitroPassword(e.target.value);
                    setArbitroPasswordError('');
                  }}
                  className={`w-full px-4 py-4 rounded-xl bg-gray-200 border-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    arbitroPasswordError ? 'border-red-500' : 'border-transparent'
                  }`}
                />
                {arbitroPasswordError && (
                  <p className="text-red-600 text-sm mt-2 ml-1">{arbitroPasswordError}</p>
                )}
              </div>
              
              <button
                type="submit"
                className="w-full py-4 px-6 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors shadow-md"
              >
                Ingresar
              </button>
            </form>

            {/* Forgot Password Link */}
            <div className="mt-6 text-center">
              <button
                onClick={handleForgotPassword}
                className="text-gray-600 hover:text-gray-900 text-sm transition-colors underline"
              >
                Cambiar contraseña
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Pantalla de perfil del equipo para Delegados
  if (showArbitrosDelegados && isArbitroLoggedIn && isDelegado && selectedDelegadoTeam && showDelegadoTeamProfile) {
    // Buscar el equipo del delegado en la lista de equipos
    const delegadoTeam = teams.find(t => t.name === selectedDelegadoTeam);
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
        {/* Team Info Header - Green Style like Home */}
        <div className="pt-12 pb-6 px-6 bg-gradient-to-br from-green-500 via-green-600 to-green-700 relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <button 
                onClick={() => setShowDelegadoTeamProfile(false)}
                className="p-2 -ml-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <h1 className="text-white text-xl">Información del Equipo</h1>
            </div>
            
            {/* Team Info Card */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-md">
                  {delegadoTeam?.shield || '⚽'}
                </div>
                <div className="flex-1">
                  <h2 className="text-gray-900 text-xl mb-2">{selectedDelegadoTeam}</h2>
                  <p className="text-gray-600 mb-1">{delegadoTeam?.category || 'Fútbol 11 Infantiles 2024'}</p>
                  <p className="text-gray-500 text-sm">{delegadoTeam?.zone || 'Zona A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="flex px-6">
            <button
              onClick={() => setActiveTab('posiciones')}
              className={`flex-1 py-4 text-center transition-colors relative ${
                activeTab === 'posiciones' ? 'text-green-600' : 'text-gray-500'
              }`}
            >
              Posiciones
              {activeTab === 'posiciones' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('fixture')}
              className={`flex-1 py-4 text-center transition-colors relative ${
                activeTab === 'fixture' ? 'text-green-600' : 'text-gray-500'
              }`}
            >
              Fixture
              {activeTab === 'fixture' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('jornadas')}
              className={`flex-1 py-4 text-center transition-colors relative ${
                activeTab === 'jornadas' ? 'text-green-600' : 'text-gray-500'
              }`}
            >
              Jornadas
              {activeTab === 'jornadas' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"></div>
              )}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto pb-6">
          {activeTab === 'posiciones' && (
            <div className="px-6 pt-6">
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-gray-600 text-sm">Pos</th>
                      <th className="px-4 py-3 text-left text-gray-600 text-sm">Equipo</th>
                      <th className="px-4 py-3 text-center text-gray-600 text-sm">Pts</th>
                      <th className="px-4 py-3 text-center text-gray-600 text-sm">PJ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { pos: 1, team: selectedDelegadoTeam, pts: 21, pj: 8, isOwn: true },
                      { pos: 2, team: 'Atlético Central', pts: 18, pj: 8 },
                      { pos: 3, team: 'Racing FC', pts: 15, pj: 8 },
                      { pos: 4, team: 'Club Victoria', pts: 12, pj: 8 },
                    ].map((row) => (
                      <tr key={row.pos} className={`border-t border-gray-100 ${row.isOwn ? 'bg-green-50' : ''}`}>
                        <td className="px-4 py-3 text-gray-900">{row.pos}</td>
                        <td className="px-4 py-3 text-gray-900">{row.team}</td>
                        <td className="px-4 py-3 text-center text-gray-900">{row.pts}</td>
                        <td className="px-4 py-3 text-center text-gray-500">{row.pj}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'fixture' && (
            <div className="px-6 pt-6 space-y-4">
              {[
                { date: 'Dom 15/03', team1: selectedDelegadoTeam, team2: 'Atlético Central', result: '2 - 1' },
                { date: 'Dom 22/03', team1: 'Racing FC', team2: selectedDelegadoTeam, result: '1 - 1' },
                { date: 'Dom 29/03', team1: selectedDelegadoTeam, team2: 'Club Victoria', result: '3 - 0' },
              ].map((match, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-5 shadow-sm">
                  <p className="text-gray-500 text-sm mb-3">{match.date}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex-1 text-right">
                      <p className="text-gray-900">{match.team1}</p>
                    </div>
                    <div className="px-6">
                      <p className="text-gray-900">{match.result}</p>
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-gray-900">{match.team2}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'jornadas' && (
            <div className="px-6 pt-6 space-y-4">
              {[
                { jornada: 8, date: 'Dom 15/03', opponent: 'Atlético Central', result: 'Ganado 2-1' },
                { jornada: 7, date: 'Dom 08/03', opponent: 'Racing FC', result: 'Empate 1-1' },
                { jornada: 6, date: 'Dom 01/03', opponent: 'Club Victoria', result: 'Ganado 3-0' },
              ].map((jornada) => (
                <div key={jornada.jornada} className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-gray-900">Jornada {jornada.jornada}</h3>
                    <p className="text-gray-500 text-sm">{jornada.date}</p>
                  </div>
                  <p className="text-gray-600">vs {jornada.opponent}</p>
                  <p className="text-green-600 text-sm mt-1">{jornada.result}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Pantalla de Selección de Equipo para Delegados
  if (showArbitrosDelegados && isArbitroLoggedIn && isDelegado && !selectedDelegadoTeam) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <div className="pt-12 pb-6 px-6">
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => {
                setIsArbitroLoggedIn(false);
                setShowArbitrosDelegados(false);
                setArbitroUsername('');
                setArbitroPassword('');
                setIsDelegado(false);
              }}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-900" />
            </button>
          </div>
          
          <div className="text-center mb-2">
            <h1 className="text-gray-900 text-2xl mb-2">Selecciona tu equipo</h1>
            <p className="text-gray-600 text-sm">Debes seleccionar un equipo para continuar</p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 pb-6 overflow-y-auto">
          <div className="space-y-4">
            {equiposDelegadoData.map((equipo) => (
              <button
                key={equipo.id}
                onClick={() => {
                  setSelectedDelegadoTeam(equipo.nombre);
                  setActiveDelegadoTab('jugadores');
                  setBuscarResultados(false);
                  setBuscarCodigoEquipo('');
                  setBuscarAnoFiltro(null);
                  setSelectedCategoriaFiltro(null);
                }}
                className="w-full bg-white rounded-xl shadow-sm p-6 text-left hover:shadow-md transition-shadow"
              >
                <h3 className="text-gray-900 text-lg mb-1">{equipo.nombre}</h3>
                <p className="text-gray-600 text-sm">Torneo: {equipo.torneo}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Pantalla de Jugadores Fichados (para Delegados)
  if (showArbitrosDelegados && isArbitroLoggedIn && isDelegado && selectedDelegadoTeam) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <div className="pt-12 pb-4 px-6 bg-white sticky top-0 z-10 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => {
                // Si estamos viendo resultados de búsqueda, volver al formulario
                if (activeDelegadoTab === 'buscar' && buscarResultados) {
                  setBuscarResultados(false);
                  setBuscarAnoFiltro(null);
                } else {
                  setSelectedDelegadoTeam(null);
                  setSelectedCategoriaFiltro(null);
                  setBuscarResultados(false);
                  setBuscarCodigoEquipo('');
                  setJugadoresFichados([]);
                }
              }}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-900" />
            </button>
            
            <h1 className="text-gray-900 flex-1 text-center">
              {activeDelegadoTab === 'jugadores' && selectedDelegadoTeam}
              {activeDelegadoTab === 'buscar' && 'Buscar'}
              {activeDelegadoTab === 'pendientes' && 'Pendientes'}
            </h1>
            
            <div className="relative">
              <button 
                onClick={() => setShowDelegadoMenu(!showDelegadoMenu)}
                className="p-2 -mr-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                  <circle cx="10" cy="4" r="1.5"/>
                  <circle cx="10" cy="10" r="1.5"/>
                  <circle cx="10" cy="16" r="1.5"/>
                </svg>
              </button>

              {/* Menú desplegable */}
              {showDelegadoMenu && (
                <>
                  {/* Overlay para cerrar el menú al hacer clic fuera */}
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowDelegadoMenu(false)}
                  />
                  
                  {/* Menú */}
                  <div className="absolute right-0 top-12 bg-white rounded-xl shadow-lg border border-gray-200 py-2 min-w-[200px] z-20">
                  <button
                      onClick={() => {
                        setShowDelegadoMenu(false);
                        setShowFichajeIntro(true);
                        setFichajeStep(2);
                      }}
                      className="w-full px-6 py-3 text-left text-gray-900 hover:bg-gray-50 transition-colors flex items-center gap-3"
                    >
                      <UserPlus className="w-5 h-5" />
                      Fichar jugador
                    </button>
                    <button
                      onClick={() => {
                        setShowDelegadoMenu(false);
                        setShowDelegadoTeamProfile(true);
                        setActiveTab('posiciones');
                      }}
                      className="w-full px-6 py-3 text-left text-gray-900 hover:bg-gray-50 transition-colors flex items-center gap-3"
                    >
                      <Trophy className="w-5 h-5" />
                      Ver tablas
                    </button>
                    {/* <button
                      onClick={() => {
                        setShowDelegadoMenu(false);
                        setShowDelegadoTeamProfile(true);
                        setActiveTab('fixture');
                      }}
                      className="w-full px-6 py-3 text-left text-gray-900 hover:bg-gray-50 transition-colors flex items-center gap-3"
                    >
                      <Calendar className="w-5 h-5" />
                      Ver fixture
                    </button>
                    <button
                      onClick={() => {
                        setShowDelegadoMenu(false);
                        setShowDelegadoTeamProfile(true);
                        setActiveTab('jornadas');
                      }}
                      className="w-full px-6 py-3 text-left text-gray-900 hover:bg-gray-50 transition-colors flex items-center gap-3"
                    >
                      <Clock className="w-5 h-5" />
                      Ver jornadas
                    </button> */}
                    <div className="border-t border-gray-200 my-2"></div>
                    <button
                      onClick={() => {
                        setSelectedDelegadoTeam(null);
                        setShowDelegadoMenu(false);
                        setBuscarResultados(false);
                        setBuscarCodigoEquipo('');
                        setBuscarAnoFiltro(null);
                        setSelectedCategoriaFiltro(null);
                        setActiveDelegadoTab('jugadores');
                        setJugadoresFichados([]);
                      }}
                      className="w-full px-6 py-3 text-left text-gray-900 hover:bg-gray-50 transition-colors flex items-center gap-3"
                    >
                      <Users className="w-5 h-5" />
                      Cambiar equipo
                    </button>
                    <button
                      onClick={() => {
                        setShowDelegadoMenu(false);
                        setShowArbitrosDelegados(false);
                        setIsArbitroLoggedIn(false);
                        setIsDelegado(false);
                        setSelectedDelegadoTeam(null);
                        setArbitroUsername('');
                        setArbitroPassword('');
                        setBuscarResultados(false);
                        setBuscarCodigoEquipo('');
                        setBuscarAnoFiltro(null);
                        setSelectedCategoriaFiltro(null);
                        setActiveDelegadoTab('jugadores');
                      }}
                      className="w-full px-6 py-3 text-left text-red-600 hover:bg-gray-50 transition-colors flex items-center gap-3"
                    >
                      <LogOut className="w-5 h-5" />
                      Cerrar sesión
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Filtros de categoría - Solo en tab Jugadores */}
          {activeDelegadoTab === 'jugadores' && (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedCategoriaFiltro(null)}
              className={`px-6 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                selectedCategoriaFiltro === null
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Todas
            </button>
            {categorias.map((categoria) => (
              <button
                key={categoria}
                onClick={() => setSelectedCategoriaFiltro(categoria)}
                className={`px-6 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                  selectedCategoriaFiltro === categoria
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {categoria}
              </button>
            ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 px-6 pt-6 pb-24 overflow-y-auto">
          {/* Tab: Mis Jugadores */}
          {activeDelegadoTab === 'jugadores' && (
            <>
              {Object.keys(jugadoresPorCategoria).sort().map((categoria) => (
                <div key={categoria} className="mb-6">
                  {/* Header de Categoría */}
                  <div className="bg-green-600 text-white text-center py-3 rounded-xl mb-4 shadow-sm">
                    <h2 className="text-lg">Categoría {categoria}</h2>
                  </div>

                  {/* Jugadores de esta categoría */}
                  <div className="space-y-4">
                    {jugadoresPorCategoria[categoria].map((jugador) => (
                      <div key={jugador.id} className="bg-white rounded-xl shadow-sm p-6">
                        {/* Header del jugador */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1 text-center">
                            <h3 className="text-gray-900 text-lg mb-1">{jugador.equipo}</h3>
                            <p className="text-gray-600 text-sm">{jugador.torneo}</p>
                          </div>
                          {/* Botón eliminar pequeño */}
                          <button
                            onClick={() => setJugadorAEliminar(jugador.id)}
                            className="w-8 h-8 flex items-center justify-center bg-red-100 text-red-600 rounded-lg hover:bg-red-200 active:scale-95 transition-all flex-shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                          {/* Foto del jugador */}
                          {jugador.foto && (
                            <div className="flex justify-center mb-4">
                              <img 
                                src={jugador.foto} 
                                alt={`${jugador.nombre} ${jugador.apellido}`}
                                className="w-40 h-40 rounded-lg object-cover"
                              />
                            </div>
                          )}

                          {/* Información del jugador */}
                          <div className="space-y-3">
                            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                              <span className="text-gray-600 text-sm">DNI:</span>
                              <span className="text-gray-900">{jugador.dni}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                              <span className="text-gray-600 text-sm">Nombre:</span>
                              <span className="text-gray-900">{jugador.nombre}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                              <span className="text-gray-600 text-sm">Apellido:</span>
                              <span className="text-gray-900">{jugador.apellido}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                              <span className="text-gray-600 text-sm">Fecha Nac:</span>
                              <span className="text-gray-900">{jugador.fechaNac}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600 text-sm">Categoría:</span>
                              <span className="text-gray-900">Cat {categoria.slice(-2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {jugadoresFiltrados.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No hay jugadores fichados en esta categoría
                </div>
              )}
            </>
          )}

          {/* Tab: Buscar */}
          {activeDelegadoTab === 'buscar' && !buscarResultados && (
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-2xl shadow-sm p-8 mt-8">
                <h2 className="text-gray-900 text-center mb-8">
                  Ingresá el código del equipo
                </h2>
                
                <input
                  type="text"
                  placeholder="Ej: ABC1234"
                  value={buscarCodigoEquipo}
                  onChange={(e) => setBuscarCodigoEquipo(e.target.value.toUpperCase())}
                  className="w-full px-4 py-4 rounded-xl bg-gray-100 border-0 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 mb-6 text-center"
                />
                
                <button
                  onClick={() => {
                    if (buscarCodigoEquipo.trim()) {
                      setBuscarResultados(true);
                      setBuscarAnoFiltro(null);
                    }
                  }}
                  disabled={!buscarCodigoEquipo.trim()}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-2xl transition-colors shadow-sm"
                >
                  Ver jugadores
                </button>
              </div>
            </div>
          )}

          {/* Resultados de búsqueda */}
          {activeDelegadoTab === 'buscar' && buscarResultados && (
            <>
              {/* Filtros por año */}
              <div className="flex gap-2 overflow-x-auto px-6 pb-2 pt-2 scrollbar-hide">
                <button
                  onClick={() => setBuscarAnoFiltro(null)}
                  className={`px-6 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                    buscarAnoFiltro === null
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Todas
                </button>
                {anosBusqueda.map((ano) => (
                  <button
                    key={ano}
                    onClick={() => setBuscarAnoFiltro(ano)}
                    className={`px-6 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                      buscarAnoFiltro === ano
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {ano}
                  </button>
                ))}
              </div>

              {/* Botón Generar PDF */}
              <div className="px-6 pt-4">
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl transition-colors shadow-sm flex items-center justify-center gap-2">
                  <ClipboardList className="w-5 h-5" />
                  Generar PDF
                </button>
              </div>

              {/* Listado de jugadores por categoría */}
              {Object.keys(jugadoresBuscadosPorCategoria).sort().map((categoria) => (
                <div key={categoria} className="px-6 pb-6">
                  {/* Título de categoría */}
                  <div className="bg-blue-500 text-white py-4 px-6 rounded-2xl my-6 text-center shadow-sm">
                    Categoría {categoria}
                  </div>

                  {/* Tarjetas de jugadores */}
                  <div className="space-y-4">
                    {jugadoresBuscadosPorCategoria[categoria].map((jugador) => (
                      <div key={jugador.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        <div className="p-6">
                          {/* Nombre del equipo y torneo */}
                          <div className="text-center mb-4">
                            <h3 className="text-gray-900 mb-1">{jugador.equipo}</h3>
                            <p className="text-gray-600 text-sm">{jugador.torneo}</p>
                          </div>

                          {/* Foto del jugador */}
                          <div className="flex justify-center mb-4">
                            {jugador.foto ? (
                              <img 
                                src={jugador.foto} 
                                alt={`${jugador.nombre} ${jugador.apellido}`}
                                className="w-40 h-40 rounded-xl object-cover"
                              />
                            ) : (
                              <div className="w-40 h-40 rounded-xl bg-gray-200 flex items-center justify-center">
                                <Users className="w-16 h-16 text-gray-400" />
                              </div>
                            )}
                          </div>

                          {/* Información del jugador */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                              <span className="text-gray-600 text-sm">DNI:</span>
                              <span className="text-gray-900">{jugador.dni}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                              <span className="text-gray-600 text-sm">Nombre:</span>
                              <span className="text-gray-900">{jugador.nombre}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                              <span className="text-gray-600 text-sm">Apellido:</span>
                              <span className="text-gray-900">{jugador.apellido}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                              <span className="text-gray-600 text-sm">Fecha Nac:</span>
                              <span className="text-gray-900">{jugador.fechaNac}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600 text-sm">Categoría:</span>
                              <span className="text-gray-900">Cat {categoria.slice(-2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {jugadoresBuscadosFiltrados.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No hay jugadores en esta categoría
                </div>
              )}
            </>
          )}

          {/* Tab: Pendientes */}
          {activeDelegadoTab === 'pendientes' && (
            <div className="text-center py-12 text-gray-500">
              No hay fichajes pendientes
            </div>
          )}
        </div>

        {/* Bottom Navigation Bar */}
        <div className="fixed bottom-0 mx-auto bg-white shadow-lg border-t border-gray-200 max-w-sm">
          <div className="flex items-center justify-around py-3">
            {/* Mis Jugadores */}
            <button
              onClick={() => {
                setActiveDelegadoTab('jugadores');
                setBuscarResultados(false);
                setBuscarCodigoEquipo('');
              }}
              className={`flex flex-col items-center gap-1 px-6 py-2 transition-colors ${
                activeDelegadoTab === 'jugadores' ? 'text-green-600' : 'text-gray-500'
              }`}
            >
              <Users className="w-6 h-6" />
              <span className="text-xs">Mis Jugadores</span>
            </button>

            {/* Buscar */}
            <button
              onClick={() => {
                setActiveDelegadoTab('buscar');
                setBuscarResultados(false);
              }}
              className={`flex flex-col items-center gap-1 px-6 py-2 transition-colors ${
                activeDelegadoTab === 'buscar' ? 'text-green-600' : 'text-gray-500'
              }`}
            >
              <Search className="w-6 h-6" />
              <span className="text-xs">Buscar</span>
            </button>

            {/* Pendientes */}
            <button
              onClick={() => {
                setActiveDelegadoTab('pendientes');
                setBuscarResultados(false);
                setBuscarCodigoEquipo('');
              }}
              className={`flex flex-col items-center gap-1 px-6 py-2 transition-colors ${
                activeDelegadoTab === 'pendientes' ? 'text-green-600' : 'text-gray-500'
              }`}
            >
              <Clock className="w-6 h-6" />
              <span className="text-xs">Pendientes</span>
            </button>
          </div>
        </div>

        {/* Modal de confirmación de eliminación */}
        {jugadorAEliminar !== null && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-6 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
              <div className="flex justify-center mb-4">
                <div className="bg-red-100 rounded-full p-3">
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>
              </div>
              <h3 className="text-gray-900 text-xl text-center mb-3">
                ¿Eliminar jugador?
              </h3>
              <p className="text-gray-600 text-center mb-6 text-sm">
                Esta acción no se puede deshacer. El jugador será eliminado permanentemente.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setJugadorAEliminar(null)}
                  className="flex-1 py-3 px-4 bg-gray-200 text-gray-900 rounded-xl hover:bg-gray-300 active:scale-[0.98] transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleEliminarJugador}
                  className="flex-1 py-3 px-4 bg-red-600 text-white rounded-xl hover:bg-red-700 active:scale-[0.98] transition-all"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Pantalla de Informe del Partido
  if (showArbitrosDelegados && isArbitroLoggedIn && selectedJornada !== null && showInformePartido) {
    const jornada = jornadasAsignadasData.find(j => j.id === selectedJornada);
    
    if (!jornada) return null;

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <div className="pt-12 pb-6 px-6 bg-white sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                setShowInformePartido(false);
                setGolesEquipoA([]);
                setGolesEquipoB([]);
                setAmarillasEquipoA([]);
                setAmarillasEquipoB([]);
                setRojasEquipoA([]);
                setRojasEquipoB([]);
                setHorarioInicio('');
                setHorarioFinalizacion('');
                setComentariosPartido('');
                setPartidoSuspendido(false);
                setRazonSuspension('');
                setRazonSuspensionOtro('');
              }}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-900" />
            </button>
            <div className="flex-1">
              <h1 className="text-gray-900 text-xl">Informe del partido</h1>
              <p className="text-gray-600 text-sm">Categoría {selectedCategoria}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 pt-6 pb-24 overflow-y-auto">
          {/* Match Info Summary */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="text-center">
                <span className="text-2xl block mb-1">{jornada.escudoA}</span>
                <span className="text-gray-900 text-sm">{jornada.equipoA}</span>
              </div>
              <span className="text-gray-500 mx-4">vs</span>
              <div className="text-center">
                <span className="text-2xl block mb-1">{jornada.escudoB}</span>
                <span className="text-gray-900 text-sm">{jornada.equipoB}</span>
              </div>
            </div>
            
            {/* Horario del partido */}
            <div className="border-t border-gray-200 pt-4 space-y-4">
              <div className="mb-3">
                <p className="text-xs text-gray-500 italic">
                  <span className="text-red-600">*</span> Campos obligatorios
                </p>
              </div>
              
              {/* Horario de inicio */}
              <div>
                <label className="block text-gray-700 text-sm mb-2">
                  Horario de inicio <span className="text-red-600">*</span>
                </label>
                <input
                  type="time"
                  value={horarioInicio}
                  onChange={(e) => {
                    setHorarioInicio(e.target.value);
                    setMostrarErrorValidacion(false);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                  required
                  disabled={partidoSuspendido}
                />
              </div>
              
              {/* Horario de finalización */}
              <div>
                <label className="block text-gray-700 text-sm mb-2">
                  Horario de finalización <span className="text-red-600">*</span>
                </label>
                <input
                  type="time"
                  value={horarioFinalizacion}
                  onChange={(e) => {
                    setHorarioFinalizacion(e.target.value);
                    setMostrarErrorValidacion(false);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                  required
                  disabled={partidoSuspendido}
                />
              </div>
              
              {/* Checkbox suspensión */}
              <div className="mt-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={partidoSuspendido}
                    onChange={(e) => {
                      setPartidoSuspendido(e.target.checked);
                      if (!e.target.checked) {
                        setRazonSuspension('');
                        setRazonSuspensionOtro('');
                      }
                    }}
                    className="w-5 h-5 border-2 border-gray-400 rounded cursor-pointer appearance-none checked:bg-green-600 checked:border-green-600 focus:ring-2 focus:ring-green-500 focus:outline-none transition-colors"
                    style={{
                      backgroundImage: partidoSuspendido 
                        ? 'url("data:image/svg+xml,%3csvg viewBox=\'0 0 16 16\' fill=\'white\' xmlns=\'http://www.w3.org/2000/svg\'%3e%3cpath d=\'M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z\'/%3e%3c/svg%3e")'
                        : 'none',
                      backgroundSize: '100% 100%',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    }}
                  />
                  <span className="text-sm text-gray-700">El partido se suspendi��</span>
                </label>
              </div>
              
              {/* Razón de suspensión */}
              {partidoSuspendido && (
                <div className="mt-4 space-y-3">
                  <label className="block text-gray-700 text-sm">
                    Razón de la suspensión <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={razonSuspension}
                    onChange={(e) => {
                      setRazonSuspension(e.target.value);
                      setMostrarErrorValidacion(false);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                  >
                    <option value="">Seleccionar razón</option>
                    {RAZONES_SUSPENSION.map((razon) => (
                      <option key={razon} value={razon}>{razon}</option>
                    ))}
                  </select>
                  
                  {/* Campo de texto para OTRO */}
                  {razonSuspension === 'OTRO' && (
                    <div>
                      <label className="block text-gray-700 text-sm mb-2">
                        Descripción <span className="text-red-600">*</span>
                      </label>
                      <textarea
                        placeholder="Redactá la razón de la suspensión"
                        value={razonSuspensionOtro}
                        onChange={(e) => {
                          setRazonSuspensionOtro(e.target.value);
                          setMostrarErrorValidacion(false);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 min-h-[80px] resize-y"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* GOLES Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-gray-900 text-lg mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-green-600" />
              <span>Goles</span>
            </h2>

            {/* Equipo A Goals */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-900 font-medium flex items-center gap-2">
                  <span className="text-xl">{jornada.escudoA}</span>
                  <span>{jornada.equipoA}</span>
                </h3>
                <span className="bg-green-600 text-white px-3 py-1 rounded-lg font-bold">
                  {golesEquipoA.length}
                </span>
              </div>
              
              {/* Lista de goles */}
              {golesEquipoA.map((gol, index) => (
                <div key={index} className="flex items-center gap-2 mb-2 bg-gray-50 p-3 rounded-lg">
                  <input
                    type="text"
                    placeholder="Nombre del jugador"
                    value={gol.jugador}
                    onChange={(e) => {
                      const newGoles = [...golesEquipoA];
                      newGoles[index].jugador = e.target.value;
                      setGolesEquipoA(newGoles);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <button
                    onClick={() => {
                      setGolesEquipoA(golesEquipoA.filter((_, i) => i !== index));
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              <button
                onClick={() => setGolesEquipoA([...golesEquipoA, {jugador: '', minuto: ''}])}
                className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-green-600 hover:text-green-600 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm">Agregar gol</span>
              </button>
            </div>

            {/* Equipo B Goals */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-900 font-medium flex items-center gap-2">
                  <span className="text-xl">{jornada.escudoB}</span>
                  <span>{jornada.equipoB}</span>
                </h3>
                <span className="bg-green-600 text-white px-3 py-1 rounded-lg font-bold">
                  {golesEquipoB.length}
                </span>
              </div>
              
              {/* Lista de goles */}
              {golesEquipoB.map((gol, index) => (
                <div key={index} className="flex items-center gap-2 mb-2 bg-gray-50 p-3 rounded-lg">
                  <input
                    type="text"
                    placeholder="Nombre del jugador"
                    value={gol.jugador}
                    onChange={(e) => {
                      const newGoles = [...golesEquipoB];
                      newGoles[index].jugador = e.target.value;
                      setGolesEquipoB(newGoles);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <button
                    onClick={() => {
                      setGolesEquipoB(golesEquipoB.filter((_, i) => i !== index));
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              <button
                onClick={() => setGolesEquipoB([...golesEquipoB, {jugador: '', minuto: ''}])}
                className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-green-600 hover:text-green-600 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm">Agregar gol</span>
              </button>
            </div>
          </div>

          {/* SANCIONES Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-gray-900 text-lg mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-green-600" />
              <span>Sanciones</span>
            </h2>

            {/* Tarjetas Amarillas */}
            <div className="mb-6">
              <h3 className="text-gray-900 font-medium mb-3 flex items-center gap-2">
                <div className="w-6 h-8 bg-yellow-400 rounded"></div>
                <span>Tarjetas amarillas</span>
              </h3>

              {/* Equipo A - Amarillas */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                  <span className="text-lg">{jornada.escudoA}</span>
                  <span>{jornada.equipoA}</span>
                </p>
                
                {amarillasEquipoA.map((tarjeta, index) => (
                  <div key={index} className="mb-2 bg-yellow-50 p-3 rounded-lg">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Nombre del jugador"
                          value={tarjeta.jugador}
                          onChange={(e) => {
                            const newTarjetas = [...amarillasEquipoA];
                            newTarjetas[index].jugador = e.target.value;
                            setAmarillasEquipoA(newTarjetas);
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                        <button
                          onClick={() => {
                            setAmarillasEquipoA(amarillasEquipoA.filter((_, i) => i !== index));
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <select
                        value={tarjeta.motivo}
                        onChange={(e) => {
                          const newTarjetas = [...amarillasEquipoA];
                          newTarjetas[index].motivo = e.target.value;
                          setAmarillasEquipoA(newTarjetas);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      >
                        <option value="">Seleccionar razón</option>
                        {RAZONES_AMARILLA.map((razon) => (
                          <option key={razon} value={razon}>{razon}</option>
                        ))}
                      </select>
                    </div>
                    {tarjeta.motivo === 'OTRO' && (
                      <textarea
                        placeholder="Redactá la razón de la sanción"
                        value={tarjeta.motivoOtro || ''}
                        onChange={(e) => {
                          const newTarjetas = [...amarillasEquipoA];
                          newTarjetas[index].motivoOtro = e.target.value;
                          setAmarillasEquipoA(newTarjetas);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm min-h-[60px] resize-y mt-2"
                      />
                    )}
                  </div>
                ))}
                
                <button
                  onClick={() => setAmarillasEquipoA([...amarillasEquipoA, {jugador: '', motivo: ''}])}
                  className="w-full py-2 border-2 border-dashed border-yellow-300 rounded-lg text-gray-600 hover:border-yellow-500 hover:text-yellow-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">Agregar amarilla</span>
                </button>
              </div>

              {/* Equipo B - Amarillas */}
              <div>
                <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                  <span className="text-lg">{jornada.escudoB}</span>
                  <span>{jornada.equipoB}</span>
                </p>
                
                {amarillasEquipoB.map((tarjeta, index) => (
                  <div key={index} className="mb-2 bg-yellow-50 p-3 rounded-lg">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Nombre del jugador"
                          value={tarjeta.jugador}
                          onChange={(e) => {
                            const newTarjetas = [...amarillasEquipoB];
                            newTarjetas[index].jugador = e.target.value;
                            setAmarillasEquipoB(newTarjetas);
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                        <button
                          onClick={() => {
                            setAmarillasEquipoB(amarillasEquipoB.filter((_, i) => i !== index));
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <select
                        value={tarjeta.motivo}
                        onChange={(e) => {
                          const newTarjetas = [...amarillasEquipoB];
                          newTarjetas[index].motivo = e.target.value;
                          setAmarillasEquipoB(newTarjetas);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      >
                        <option value="">Seleccionar razón</option>
                        {RAZONES_AMARILLA.map((razon) => (
                          <option key={razon} value={razon}>{razon}</option>
                        ))}
                      </select>
                    </div>
                    {tarjeta.motivo === 'OTRO' && (
                      <textarea
                        placeholder="Redactá la razón de la sanción"
                        value={tarjeta.motivoOtro || ''}
                        onChange={(e) => {
                          const newTarjetas = [...amarillasEquipoB];
                          newTarjetas[index].motivoOtro = e.target.value;
                          setAmarillasEquipoB(newTarjetas);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm min-h-[60px] resize-y mt-2"
                      />
                    )}
                  </div>
                ))}
                
                <button
                  onClick={() => setAmarillasEquipoB([...amarillasEquipoB, {jugador: '', motivo: ''}])}
                  className="w-full py-2 border-2 border-dashed border-yellow-300 rounded-lg text-gray-600 hover:border-yellow-500 hover:text-yellow-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">Agregar amarilla</span>
                </button>
              </div>
            </div>

            {/* Tarjetas Rojas */}
            <div>
              <h3 className="text-gray-900 font-medium mb-3 flex items-center gap-2">
                <div className="w-6 h-8 bg-red-600 rounded"></div>
                <span>Tarjetas rojas</span>
              </h3>

              {/* Equipo A - Rojas */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                  <span className="text-lg">{jornada.escudoA}</span>
                  <span>{jornada.equipoA}</span>
                </p>
                
                {rojasEquipoA.map((tarjeta, index) => (
                  <div key={index} className="mb-2 bg-red-50 p-3 rounded-lg">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Nombre del jugador"
                          value={tarjeta.jugador}
                          onChange={(e) => {
                            const newTarjetas = [...rojasEquipoA];
                            newTarjetas[index].jugador = e.target.value;
                            setRojasEquipoA(newTarjetas);
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                        <button
                          onClick={() => {
                            setRojasEquipoA(rojasEquipoA.filter((_, i) => i !== index));
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <select
                        value={tarjeta.motivo}
                        onChange={(e) => {
                          const newTarjetas = [...rojasEquipoA];
                          newTarjetas[index].motivo = e.target.value;
                          setRojasEquipoA(newTarjetas);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      >
                        <option value="">Seleccionar razón</option>
                        {RAZONES_ROJA.map((razon) => (
                          <option key={razon} value={razon}>{razon}</option>
                        ))}
                      </select>
                      <textarea
                        placeholder="Redactá la razón de la sanción"
                        value={tarjeta.motivoOtro || ''}
                        onChange={(e) => {
                          const newTarjetas = [...rojasEquipoA];
                          newTarjetas[index].motivoOtro = e.target.value;
                          setRojasEquipoA(newTarjetas);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm min-h-[60px] resize-y"
                      />
                    </div>
                  </div>
                ))}
                
                <button
                  onClick={() => setRojasEquipoA([...rojasEquipoA, {jugador: '', motivo: ''}])}
                  className="w-full py-2 border-2 border-dashed border-red-300 rounded-lg text-gray-600 hover:border-red-600 hover:text-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">Agregar roja</span>
                </button>
              </div>

              {/* Equipo B - Rojas */}
              <div>
                <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                  <span className="text-lg">{jornada.escudoB}</span>
                  <span>{jornada.equipoB}</span>
                </p>
                
                {rojasEquipoB.map((tarjeta, index) => (
                  <div key={index} className="mb-2 bg-red-50 p-3 rounded-lg">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Nombre del jugador"
                          value={tarjeta.jugador}
                          onChange={(e) => {
                            const newTarjetas = [...rojasEquipoB];
                            newTarjetas[index].jugador = e.target.value;
                            setRojasEquipoB(newTarjetas);
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                        <button
                          onClick={() => {
                            setRojasEquipoB(rojasEquipoB.filter((_, i) => i !== index));
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <select
                        value={tarjeta.motivo}
                        onChange={(e) => {
                          const newTarjetas = [...rojasEquipoB];
                          newTarjetas[index].motivo = e.target.value;
                          setRojasEquipoB(newTarjetas);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      >
                        <option value="">Seleccionar razón</option>
                        {RAZONES_ROJA.map((razon) => (
                          <option key={razon} value={razon}>{razon}</option>
                        ))}
                      </select>
                      <textarea
                        placeholder="Redactá la razón de la sanción"
                        value={tarjeta.motivoOtro || ''}
                        onChange={(e) => {
                          const newTarjetas = [...rojasEquipoB];
                          newTarjetas[index].motivoOtro = e.target.value;
                          setRojasEquipoB(newTarjetas);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm min-h-[60px] resize-y"
                      />
                    </div>
                  </div>
                ))}
                
                <button
                  onClick={() => setRojasEquipoB([...rojasEquipoB, {jugador: '', motivo: ''}])}
                  className="w-full py-2 border-2 border-dashed border-red-300 rounded-lg text-gray-600 hover:border-red-600 hover:text-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">Agregar roja</span>
                </button>
              </div>
            </div>
          </div>

          {/* Comentarios Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-gray-900 text-lg mb-4 flex items-center gap-2">
              <span>Comentarios</span>
            </h2>
            <textarea
              value={comentariosPartido}
              onChange={(e) => setComentariosPartido(e.target.value)}
              placeholder="Comentarios extra del partido"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 min-h-[120px] resize-y"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={() => {
              // Validación: debe tener ambos horarios O suspensión con razón
              const tieneHorarios = horarioInicio.trim() !== '' && horarioFinalizacion.trim() !== '';
              const tieneSuspensionCompleta = partidoSuspendido && razonSuspension !== '' && 
                (razonSuspension !== 'OTRO' || razonSuspensionOtro.trim() !== '');
              
              if (!tieneHorarios && !tieneSuspensionCompleta) {
                setMostrarErrorValidacion(true);
                // Scroll suave hacia el mensaje de error
                setTimeout(() => {
                  const errorElement = document.getElementById('error-validacion-informe');
                  if (errorElement) {
                    errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }, 100);
                return;
              }
              
              // Aquí iría la lógica para enviar el informe
              console.log('Informe enviado:', {
                jornada: selectedJornada,
                categoria: selectedCategoria,
                horarioInicio,
                horarioFinalizacion,
                partidoSuspendido,
                razonSuspension,
                razonSuspensionOtro,
                golesEquipoA,
                golesEquipoB,
                amarillasEquipoA,
                amarillasEquipoB,
                rojasEquipoA,
                rojasEquipoB
              });
              
              // Marcar la categoría como completada
              if (selectedCategoria && !categoriasCompletadas.includes(selectedCategoria)) {
                setCategoriasCompletadas([...categoriasCompletadas, selectedCategoria]);
              }
              
              // Resetear datos del informe primero
              setGolesEquipoA([]);
              setGolesEquipoB([]);
              setAmarillasEquipoA([]);
              setAmarillasEquipoB([]);
              setRojasEquipoA([]);
              setRojasEquipoB([]);
              setHorarioInicio('');
              setHorarioFinalizacion('');
              setComentariosPartido('');
              setPartidoSuspendido(false);
              setRazonSuspension('');
              setRazonSuspensionOtro('');
              setMostrarErrorValidacion(false);
              
              // Volver a categorías
              setShowInformePartido(false);
              setSelectedCategoria(null);
            }}
            disabled={
              // Deshabilitar hasta que se complete horarios O suspensión
              !(
                (horarioInicio.trim() !== '' && horarioFinalizacion.trim() !== '') ||
                (partidoSuspendido && razonSuspension !== '' && 
                  (razonSuspension !== 'OTRO' || razonSuspensionOtro.trim() !== ''))
              )
            }
            className={`w-full py-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg ${
              // Deshabilitar hasta que se complete horarios O suspensión
              !(
                (horarioInicio.trim() !== '' && horarioFinalizacion.trim() !== '') ||
                (partidoSuspendido && razonSuspension !== '' && 
                  (razonSuspension !== 'OTRO' || razonSuspensionOtro.trim() !== ''))
              )
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            <Send className="w-5 h-5" />
            <span>Enviar informe</span>
          </button>
          
          {/* Mensaje de campos obligatorios */}
          {mostrarErrorValidacion && (
            <div id="error-validacion-informe" className="bg-red-50 border border-red-300 rounded-lg p-4 mt-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-red-800 font-semibold mb-1">Campos obligatorios incompletos</h3>
                  <p className="text-red-700 text-sm mb-2">
                    Para enviar el informe, debés completar:
                  </p>
                  <ul className="text-red-700 text-sm space-y-1 list-disc list-inside">
                    {!partidoSuspendido && (horarioInicio.trim() === '' || horarioFinalizacion.trim() === '') && (
                      <li><strong>Horario de inicio</strong> y <strong>Horario de finalización</strong></li>
                    )}
                    {partidoSuspendido && razonSuspension === '' && (
                      <li><strong>Razón de la suspensión</strong></li>
                    )}
                    {partidoSuspendido && razonSuspension === 'OTRO' && razonSuspensionOtro.trim() === '' && (
                      <li><strong>Descripción de la razón</strong> (campo OTRO)</li>
                    )}
                  </ul>
                  {!partidoSuspendido && (horarioInicio.trim() === '' || horarioFinalizacion.trim() === '') && (
                    <p className="text-red-700 text-sm mt-2 italic">
                      O marcá el partido como suspendido con su razón correspondiente.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Detalle de Jornada con selección de categorías
  if (showArbitrosDelegados && isArbitroLoggedIn && selectedJornada !== null) {
    const jornada = jornadasAsignadasData.find(j => j.id === selectedJornada);
    const categorias = ['2015', '2016', '2017', '2018', '2019'];
    
    if (!jornada) return null;

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <div className="pt-12 pb-6 px-6 bg-white">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                setSelectedJornada(null);
                setSelectedCategoria(null);
                setShowInformePartido(false);
                setCategoriasCompletadas([]);
                setGolesEquipoA([]);
                setGolesEquipoB([]);
                setAmarillasEquipoA([]);
                setAmarillasEquipoB([]);
                setRojasEquipoA([]);
                setRojasEquipoB([]);
              }}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-900" />
            </button>
            <h1 className="text-gray-900 text-xl">Detalle de jornada</h1>
          </div>
        </div>

        {/* Jornada Details */}
        <div className="flex-1 px-6 pt-6 pb-6 overflow-y-auto">
          {/* Jornada Card */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            {/* Torneo Header */}
            <div className="bg-gray-900 text-white text-center py-3">
              <h3 className="text-lg">{jornada.torneo}</h3>
            </div>

            {/* Content */}
            <div className="p-5">
              {/* Zona and Fecha */}
              <div className="bg-gray-100 rounded-lg px-3 py-2 mb-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-900">{jornada.zona}</span>
                  <span className="text-gray-900">{jornada.fecha}</span>
                </div>
              </div>

              {/* Teams */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{jornada.escudoA}</span>
                  <span className="text-gray-900 text-center">{jornada.equipoA}</span>
                </div>
                <span className="text-gray-500">vs</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-900 text-center">{jornada.equipoB}</span>
                  <span className="text-2xl">{jornada.escudoB}</span>
                </div>
              </div>

              {/* Date and Time */}
              <div className="flex items-center justify-center gap-4 mb-4 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-green-600" />
                  <span>{jornada.dia}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-green-600" />
                  <span>{jornada.hora}</span>
                </div>
              </div>

              {/* Location */}
              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-gray-500">Lugar:</span>
                  <span className="flex-1">{jornada.lugar}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Categorías Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-gray-900 text-lg mb-4 text-center">Seleccionar categoría</h2>
            <div className="space-y-3">
              {categorias.map((categoria) => {
                const isCompleted = categoriasCompletadas.includes(categoria);
                return (
                  <button
                    key={categoria}
                    onClick={() => {
                      setSelectedCategoria(categoria);
                      setShowInformePartido(true);
                      // Resetear todos los datos del informe
                      setGolesEquipoA([]);
                      setGolesEquipoB([]);
                      setAmarillasEquipoA([]);
                      setAmarillasEquipoB([]);
                      setRojasEquipoA([]);
                      setRojasEquipoB([]);
                      setHorarioInicio('');
                      setHorarioFinalizacion('');
                      setComentariosPartido('');
                      setPartidoSuspendido(false);
                      setRazonSuspension('');
                      setRazonSuspensionOtro('');
                    }}
                    className={`w-full py-4 px-6 rounded-lg transition-all flex items-center justify-between ${
                      isCompleted
                        ? 'bg-green-100 text-gray-900 border-2 border-green-600'
                        : 'bg-gray-100 text-gray-900 hover:bg-green-600 hover:text-white hover:shadow-md'
                    }`}
                  >
                    <span className="font-semibold text-lg">{categoria}</span>
                    {isCompleted && (
                      <div className="flex items-center gap-2 text-green-600">
                        <Check className="w-6 h-6" />
                        <span className="text-sm">OK</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Mensaje de aviso y Botón Enviar Informe de la Jornada */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              {/* Mensaje de aviso */}
              {categoriasCompletadas.length < categorias.length && (
                <p className="text-xs text-gray-600 text-center mb-4 px-2">
                  Se podrá enviar el informe completo de la jornada una vez que se completen todos los informes de cada categoría
                </p>
              )}
              
              {/* Botón - siempre visible */}
              <button
                onClick={() => {
                  console.log('Informe de jornada completo enviado:', {
                    jornada: selectedJornada,
                    categoriasCompletadas
                  });
                  
                  // Marcar como enviado
                  if (selectedJornada !== null) {
                    setInformesEnviados([...informesEnviados, selectedJornada]);
                  }
                  
                  // Resetear y volver a jornadas asignadas
                  setSelectedJornada(null);
                  setCategoriasCompletadas([]);
                  console.log('Informe de jornada enviado');
                }}
                disabled={categoriasCompletadas.length < categorias.length}
                className={`w-full py-5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg ${
                  categoriasCompletadas.length === categorias.length
                    ? 'bg-green-600 text-white hover:bg-green-700 cursor-pointer'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Send className="w-6 h-6" />
                <span className="text-lg">Enviar informe de la jornada</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Jornadas Asignadas Screen (after login)
  if (showArbitrosDelegados && isArbitroLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <div className="pt-12 pb-6 px-6 bg-white">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                setIsArbitroLoggedIn(false);
                setShowArbitrosDelegados(false);
                setArbitroUsername('');
                setArbitroPassword('');
                setSelectedJornada(null);
                setSelectedCategoria(null);
                setCategoriasCompletadas([]);
              }}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-900" />
            </button>
            <h1 className="text-gray-900 text-xl flex-1">Jornadas asignadas</h1>
            
            <div className="relative">
              <button 
                onClick={() => setShowArbitroMenu(!showArbitroMenu)}
                className="p-2 -mr-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                  <circle cx="10" cy="4" r="1.5"/>
                  <circle cx="10" cy="10" r="1.5"/>
                  <circle cx="10" cy="16" r="1.5"/>
                </svg>
              </button>

              {/* Menú desplegable */}
              {showArbitroMenu && (
                <>
                  {/* Overlay para cerrar el menú al hacer clic fuera */}
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowArbitroMenu(false)}
                  />
                  
                  {/* Menú */}
                  <div className="absolute right-0 top-12 bg-white rounded-xl shadow-lg border border-gray-200 py-2 min-w-[200px] z-20">
                    <button
                      onClick={() => {
                        setShowArbitroMenu(false);
                        setShowArbitrosDelegados(false);
                        setIsArbitroLoggedIn(false);
                        setArbitroUsername('');
                        setArbitroPassword('');
                        setSelectedJornada(null);
                        setSelectedCategoria(null);
                        setCategoriasCompletadas([]);
                      }}
                      className="w-full px-6 py-3 text-left text-gray-900 hover:bg-gray-50 transition-colors flex items-center gap-3"
                    >
                      <LogOut className="w-5 h-5" />
                      Cerrar sesión
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Jornadas List */}
        <div className="flex-1 px-6 pt-6 pb-6 overflow-y-auto">
          <div className="space-y-4">
            {jornadasAsignadasData.map((jornada) => (
              <div
                key={jornada.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedJornada(jornada.id)}
              >
                {/* Torneo Header with color */}
                <div className="bg-gray-900 text-white text-center py-3">
                  <h3 className="text-lg">{jornada.torneo}</h3>
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Zona and Fecha with gray background */}
                  <div className="bg-gray-100 rounded-lg px-3 py-2 mb-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-900">{jornada.zona}</span>
                      <span className="text-gray-900">{jornada.fecha}</span>
                    </div>
                  </div>

                  {/* Teams with shields */}
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{jornada.escudoA}</span>
                      <span className="text-gray-900 text-center">{jornada.equipoA}</span>
                    </div>
                    <span className="text-gray-500">vs</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900 text-center">{jornada.equipoB}</span>
                      <span className="text-2xl">{jornada.escudoB}</span>
                    </div>
                  </div>

                  {/* Date and Time */}
                  <div className="flex items-center justify-center gap-4 mb-4 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-green-600" />
                      <span>{jornada.dia}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-green-600" />
                      <span>{jornada.hora}</span>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex items-start gap-2 text-sm text-gray-700 mb-3">
                      <span className="text-gray-500">Lugar:</span>
                      <span className="flex-1">{jornada.lugar}</span>
                    </div>
                    
                    {/* Informe Enviado Badge */}
                    {informesEnviados.includes(jornada.id) && (
                      <div className="flex items-center justify-center gap-2 bg-green-100 text-green-700 py-2 px-3 rounded-lg">
                        <Check className="w-5 h-5" />
                        <span className="font-medium">INFORME ENVIADO</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Team Profile Screen
  if (showProfile && selectedTeam && selectedCompetition) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
        {/* Team Info Header - Green Style like Home */}
        <div className="pt-12 pb-6 px-6 bg-gradient-to-br from-green-500 via-green-600 to-green-700 relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10">
            {/* Back Button */}
            <button 
              onClick={handleChangeCompetition}
              className="flex items-center gap-2 text-white/90 hover:text-white transition-colors mb-4"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Team Info */}
            <button 
              onClick={handleChangeTeam}
              className="flex items-center gap-4 mb-4 w-full text-left hover:bg-white/10 p-3 -m-3 rounded-lg transition-all group"
            >
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl group-hover:bg-white/30 transition-colors">
                {selectedTeam.shield}
              </div>
              <div className="flex-1">
                <h2 className="text-white text-xl mb-1 drop-shadow-lg">{selectedTeam.name}</h2>
                <p className="text-white/90 text-sm">{selectedTeam.category}</p>
              </div>
              <ChevronDown className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
            </button>
            
            <div className="space-y-2">
              <div>
                <button 
                  onClick={handleChangeCompetition}
                  className="flex items-center gap-2 text-white hover:text-white/90 transition-colors"
                >
                  <span className="uppercase drop-shadow-md">{selectedCompetition.name}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              <div>
                <p className="text-white/90 text-sm drop-shadow-sm">Av. Rivadavia 15234, Haedo, Buenos Aires</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content based on active tab */}
        <div className="flex-1 px-4 py-6 pb-24 overflow-y-auto">
          {activeTab === 'posiciones' && (
            <div className="space-y-6">
              {standingsData.map((zoneData) => (
                <div key={zoneData.zone} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  {/* Zone Header */}
                  <div className="bg-gray-900 text-white text-center py-2">
                    <h3 className="text-xl">Zona {zoneData.zone}</h3>
                  </div>

                  {/* Table Header */}
                  <div className="bg-gray-800 text-white overflow-x-auto">
                    <div className="grid grid-cols-[32px_1fr_28px_28px_28px_28px_28px_36px] gap-1 px-2 py-2 text-xs min-w-full">
                      <div>Pos</div>
                      <div>Equipo</div>
                      <div className="text-center">J</div>
                      <div className="text-center">G</div>
                      <div className="text-center">E</div>
                      <div className="text-center">P</div>
                      <div className="text-center">Np</div>
                      <div className="text-center">Pts</div>
                    </div>
                  </div>

                  {/* Table Rows */}
                  <div>
                    {zoneData.teams.map((row, index) => (
                      <button
                        key={row.pos}
                        onClick={() => handleTeamClick(row.team)}
                        className={`w-full grid grid-cols-[32px_1fr_28px_28px_28px_28px_28px_36px] gap-1 px-2 py-2 text-xs text-left cursor-pointer hover:bg-gray-100 transition-colors ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        } ${row.team === selectedTeam.name ? 'bg-green-50 border-l-4 border-green-500' : ''}`}
                      >
                        <div className="text-gray-900">{row.pos}</div>
                        <div className="text-gray-900 break-words flex items-center gap-1">
                          <span className="text-lg">{row.shield}</span>
                          <span>{row.team}</span>
                        </div>
                        <div className="text-center text-gray-900">{row.j}</div>
                        <div className="text-center text-gray-900">{row.g}</div>
                        <div className="text-center text-gray-900">{row.e}</div>
                        <div className="text-center text-gray-900">{row.p}</div>
                        <div className="text-center text-gray-900">{row.np}</div>
                        <div className="text-center text-gray-900">{row.pts}</div>
                      </button>
                    ))}
                  </div>

                  {/* Footer Note */}
                  <div className="bg-gray-100 px-2 py-2 text-xs text-gray-700">
                    1) {zoneData.note}
                  </div>
                </div>
              ))}

              {/* Players Section */}
              {currentPlayers.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  {/* Players Header */}
                  <div className="bg-green-600 text-white text-center py-3">
                    <h3 className="text-lg">Jugadores de {selectedTeam.name}</h3>
                  </div>

                  {/* Players List */}
                  <div className="px-4 py-3">
                    <div className="grid grid-cols-2 gap-3">
                      {currentPlayers.map((player, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 shrink-0 text-xs">
                            {index + 1}
                          </div>
                          <div className="text-gray-900 text-xs break-words leading-tight">
                            {player}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'fixture' && (
            <div className="space-y-6">
              {fixtureData.map((fixture) => (
                <div key={fixture.fecha} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  {/* Fixture Header */}
                  <div className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
                    <h3 className="text-lg uppercase tracking-wide">Fecha {fixture.fecha}</h3>
                    <span className="text-lg">{fixture.date}</span>
                  </div>

                  {/* Matches */}
                  <div>
                    {fixture.matches.map((match, index) => (
                      <div
                        key={index}
                        className={`grid grid-cols-[2.5rem_1fr_auto_1fr_2.5rem] gap-3 px-4 py-3 items-center ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }`}
                      >
                        {/* Home Shield */}
                        <div className="text-2xl text-center">{match.homeShield}</div>
                        
                        {/* Home Team */}
                        <button 
                          onClick={() => handleTeamClick(match.homeTeam)}
                          className="text-gray-900 text-center hover:text-green-600 transition-colors cursor-pointer"
                        >
                          {match.homeTeam}
                        </button>
                        
                        {/* VS */}
                        <div className="text-gray-500 text-sm px-2">vs.</div>
                        
                        {/* Away Team */}
                        <button 
                          onClick={() => handleTeamClick(match.awayTeam)}
                          className="text-gray-900 text-center hover:text-green-600 transition-colors cursor-pointer"
                        >
                          {match.awayTeam}
                        </button>
                        
                        {/* Away Shield */}
                        <div className="text-2xl text-center">{match.awayShield}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'jornadas' && (
            <div className="space-y-6">
              {jornadasData.map((jornada) => (
                <div key={jornada.jornada} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  {/* Jornada Header */}
                  <div className="bg-gray-900 text-white text-center py-3">
                    <h3 className="text-2xl">{jornada.jornada}</h3>
                  </div>

                  {/* Table Header */}
                  <div className="bg-black text-white">
                    <div className="grid grid-cols-[1.5rem_1fr_1.8rem_1.8rem_1.8rem_2rem_1.5rem_1.5rem] gap-1 px-2 py-2 text-[10px]">
                      <div></div>
                      <div>Equipo</div>
                      <div className="text-center">6 7 8</div>
                      <div className="text-center">9 10</div>
                      <div className="text-center">11 12</div>
                      <div className="text-center">T.P.</div>
                      <div className="text-center">PJ</div>
                      <div className="text-center">V</div>
                    </div>
                  </div>

                  {/* Table Rows */}
                  <div>
                    {jornada.matches.map((match, index) => (
                      <button
                        key={index}
                        onClick={() => handleTeamClick(match.team)}
                        className={`w-full grid grid-cols-[1.5rem_1fr_1.8rem_1.8rem_1.8rem_2rem_1.5rem_1.5rem] gap-1 px-2 py-2 text-[10px] text-left cursor-pointer hover:bg-gray-100 transition-colors ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        } ${match.team === selectedTeam.name ? 'bg-green-50 border-l-4 border-green-500' : ''}`}
                      >
                        <div className="text-gray-900 text-center">{match.pos}</div>
                        <div className="text-gray-900 text-[9px] truncate flex items-center gap-1">
                          <span className="text-base">{match.shield}</span>
                          <span>{match.team}</span>
                        </div>
                        <div className="text-center text-gray-900">{match.date1}</div>
                        <div className="text-center text-gray-900">{match.date2}</div>
                        <div className="text-center text-gray-900">{match.date3}</div>
                        <div className="text-center text-gray-900">{match.tp}</div>
                        <div className="text-center text-gray-900">{match.pj}</div>
                        <div className="text-center text-gray-900">{match.v}</div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'clubes' && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Table Header */}
              <div className="bg-black text-white">
                <div className="grid grid-cols-[5.5rem_4.5rem_1fr_2.5rem] gap-1 px-2 py-2 text-[10px]">
                  <div>Equipo</div>
                  <div>Localidad</div>
                  <div>Dirección</div>
                  <div>Techo</div>
                </div>
              </div>

              {/* Table Rows */}
              <div>
                {clubesData.map((club, index) => (
                  <button
                    key={index}
                    onClick={() => handleTeamClick(club.team)}
                    className={`w-full grid grid-cols-[5.5rem_4.5rem_1fr_2.5rem] gap-1 px-2 py-2 text-[10px] text-left cursor-pointer hover:bg-gray-100 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    } ${club.team === selectedTeam.name ? 'bg-green-50 border-l-4 border-green-500' : ''}`}
                  >
                    <div className="text-gray-900 text-[9px] truncate flex items-center gap-1">
                      <span className="text-base">{club.shield}</span>
                      <span>{club.team}</span>
                    </div>
                    <div className="text-gray-900 text-[9px] truncate">{club.localidad}</div>
                    <div className="text-gray-900 text-[9px] truncate">{club.direccion}</div>
                    <div className="text-center text-gray-900">{club.techo}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation Menu */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg max-w-sm mx-auto">
          <div className="grid grid-cols-4">
            <button
              onClick={() => setActiveTab('posiciones')}
              className={`flex flex-col items-center py-3 transition-colors ${
                activeTab === 'posiciones' 
                  ? 'text-green-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Trophy className="w-5 h-5 mb-1" />
              <span className="text-xs">Posiciones</span>
            </button>
            
            <button
              onClick={() => setActiveTab('fixture')}
              className={`flex flex-col items-center py-3 transition-colors ${
                activeTab === 'fixture' 
                  ? 'text-green-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calendar className="w-5 h-5 mb-1" />
              <span className="text-xs">Fixture</span>
            </button>
            
            <button
              onClick={() => setActiveTab('jornadas')}
              className={`flex flex-col items-center py-3 transition-colors ${
                activeTab === 'jornadas' 
                  ? 'text-green-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Clock className="w-5 h-5 mb-1" />
              <span className="text-xs">Jornadas</span>
            </button>
            
            <button
              onClick={() => setActiveTab('clubes')}
              className={`flex flex-col items-center py-3 transition-colors ${
                activeTab === 'clubes' 
                  ? 'text-green-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Building2 className="w-5 h-5 mb-1" />
              <span className="text-xs">Clubes</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Tournament Selection Screen
  if (showTournamentSelection && selectedTeam) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <div className="pt-12 pb-6 px-6 bg-white">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleBack}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-900" />
            </button>
            <h1 className="text-gray-900 text-xl">Seleccioná tu competencia</h1>
          </div>
        </div>

        {/* Selected Team Info */}
        <div className="px-6 py-4 bg-white border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
              {selectedTeam.shield}
            </div>
            <div>
              <h3 className="text-gray-900">{selectedTeam.name}</h3>
              <p className="text-gray-600 text-sm">{selectedTeam.category}</p>
            </div>
          </div>
        </div>

        {/* Tournaments and Cups */}
        <div className="flex-1 px-6 pt-6 pb-6 overflow-y-auto">
          {/* Torneos */}
          <div className="mb-6">
            <h2 className="text-gray-700 mb-3">Torneos</h2>
            <div className="space-y-3">
              <button
                onClick={() => handleTournamentSelect('torneo', 'Apertura')}
                className="w-full flex items-center justify-between p-4 bg-white border-2 border-gray-300 rounded-xl hover:border-gray-400 transition-all shadow-sm"
              >
                <span className="text-gray-900">Apertura</span>
              </button>
              <button
                onClick={() => handleTournamentSelect('torneo', 'Clausura')}
                className="w-full flex items-center justify-between p-4 bg-white border-2 border-gray-300 rounded-xl hover:border-gray-400 transition-all shadow-sm"
              >
                <span className="text-gray-900">Clausura</span>
              </button>
              <button
                onClick={() => handleTournamentSelect('torneo', 'Anual')}
                className="w-full flex items-center justify-between p-4 bg-white border-2 border-gray-300 rounded-xl hover:border-gray-400 transition-all shadow-sm"
              >
                <span className="text-gray-900">Anual</span>
              </button>
            </div>
          </div>

          {/* Copas */}
          <div>
            <h2 className="text-gray-700 mb-3">Copas</h2>
            <div className="space-y-3">
              <button
                onClick={() => handleTournamentSelect('copa', 'Copa Edefi')}
                className="w-full flex items-center justify-between p-4 bg-white border-2 border-gray-300 rounded-xl hover:border-gray-400 transition-all shadow-sm"
              >
                <span className="text-gray-900">Copa Edefi</span>
              </button>
              <button
                onClick={() => handleTournamentSelect('copa', 'Torneo de Verano')}
                className="w-full flex items-center justify-between p-4 bg-white border-2 border-gray-300 rounded-xl hover:border-gray-400 transition-all shadow-sm"
              >
                <span className="text-gray-900">Torneo de Verano</span>
              </button>
              <button
                onClick={() => handleTournamentSelect('copa', 'Copa de La Liga')}
                className="w-full flex items-center justify-between p-4 bg-white border-2 border-gray-300 rounded-xl hover:border-gray-400 transition-all shadow-sm"
              >
                <span className="text-gray-900">Copa de La Liga</span>
              </button>
              <button
                onClick={() => handleTournamentSelect('copa', 'Copa de Primera')}
                className="w-full flex items-center justify-between p-4 bg-white border-2 border-gray-300 rounded-xl hover:border-gray-400 transition-all shadow-sm"
              >
                <span className="text-gray-900">Copa de Primera</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      {/* Header with integrated search - Changes based on search state */}
      {!searchTerm ? (
        <div className="pt-12 pb-8 px-6 bg-gradient-to-br from-green-500 via-green-600 to-green-700 relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10">
            {/* Logo and Title */}
            <div className="flex flex-col items-center mb-8">
              <img 
                src={edefiLogo} 
                alt="EDeFI Logo" 
                className="w-24 h-24 mb-4 cursor-pointer hover:scale-105 transition-transform drop-shadow-lg"
                onClick={handleLogoClick}
              />
              <h1 className="text-white text-4xl tracking-tight">EDeFI</h1>
            </div>

            {/* Search Bar inside green header */}
            <div>
              <div className="relative mb-5">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar equipo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border-2 border-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white shadow-lg transition-all"
                />
              </div>
              
              {/* Don't Know Team Link */}
              {/* <button
                onClick={handleDontKnowTeam}
                className="w-full text-center py-1 text-white/90 hover:text-white text-sm transition-colors"
              >
                ¿No sabés tu equipo?
              </button> */}
            </div>
          </div>
        </div>
      ) : (
        <div className="pt-12 pb-8 px-6 bg-gradient-to-br from-green-500 via-green-600 to-green-700 relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10">
            {/* Back button and search */}
            <div className="flex items-center gap-3 mb-4">
              <button 
                onClick={handleBack}
                className="p-2 -ml-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <h1 className="text-white text-xl">Seleccioná tu equipo</h1>
            </div>

            {/* Search Bar */}
            <div>
              <div className="relative mb-5">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar equipo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border-2 border-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white shadow-lg transition-all"
                />
              </div>
              
              {/* Don't Know Team Link */}
              {/* <button
                onClick={handleDontKnowTeam}
                className="w-full text-center py-1 text-white/90 hover:text-white text-sm transition-colors"
              >
                ¿No sabés tu equipo?
              </button> */}
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions Section - Below header when NOT searching */}
      {!searchTerm && (
        <div className="px-6 pt-6">
          <div className="grid grid-cols-2 gap-3">
            {/* Fichaje Card */}
            <button
              onClick={() => setShowFichajeIntro(true)}
              className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 shadow-md hover:shadow-lg active:scale-[0.98] transition-all text-left opacity-90"
            >
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 mb-3 w-fit">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-white mb-1">Fichaje</h3>
              <p className="text-blue-50 text-xs leading-snug">
                Fichaje de nuevo jugador
              </p>
            </button>

            {/* Arbitros/Delegados Card */}
            <button
              onClick={() => setShowArbitrosDelegados(true)}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 shadow-md hover:shadow-lg active:scale-[0.98] transition-all text-left opacity-90"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 mb-3 w-fit">
                <ClipboardList className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-white mb-1">Árbitros/Delegados</h3>
              <p className="text-gray-300 text-xs leading-snug">
                Accedé a tu panel de gestión
              </p>
            </button>
          </div>
        </div>
      )}

      {/* Teams List - Only shown when searching */}
      {searchTerm && (
        <div className="flex-1 px-6 pt-2 pb-32 overflow-y-auto">
          <div className="space-y-3">
            {filteredTeams.length > 0 ? (
              filteredTeams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => handleTeamSelect(team)}
                  className="w-full flex items-start gap-4 p-5 bg-white rounded-2xl transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-sm">
                    {team.shield}
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-gray-900 mb-1.5">{team.name}</h3>
                    <p className="text-gray-500 text-sm mb-0.5">{team.category}</p>
                    <p className="text-gray-400 text-sm">{team.zone}</p>
                  </div>
                  <ChevronLeft className="w-5 h-5 text-gray-300 rotate-180 self-center" />
                </button>
              ))
            ) : (
              <div className="text-center py-16 text-gray-400">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No se encontraron equipos</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}