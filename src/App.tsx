import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Compass,
  ArrowDownRight,
  ArrowUpRight,
  ArrowRight,
  ArrowUp,
  ArrowLeft,
  Menu,
  X,
  Check,
  Sparkles,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  Key,
  Terminal,
  Search,
  FileText,
  Database,
  Server,
  Cpu,
  Layers,
  Activity,
  RotateCcw,
  Sliders,
  AlertTriangle,
  Eye,
  EyeOff,
  Play,
  Pause,
  Fingerprint,
  Box,
  Binary,
  HardDrive,
  Folder,
  FolderLock,
  FileCode,
  FileSpreadsheet,
  RefreshCw,
  Upload,
  CloudOff,
  Zap,
  UserCheck,
  Radio,
  BarChart3,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

// Visual Assets
const AVARAN_LOGO = '/assets/avaran_logo.webp';
const CARD_ORBITAL = '/assets/card_orbital.webp';
const CARD_GRID = '/assets/card_grid.webp';
const CARD_WAVE = '/assets/card_wave.webp';

interface DriveItem {
  id: string;
  logicalName: string;
  serverUuid: string;
  extension: 'pdf' | 'xlsx' | 'env' | 'pptx' | 'bin' | 'docx';
  logicalSize: string;
  wireSize: string;
  chunkCount: number;
  keyHierarchy: string;
  streamIntegrity: string;
  modified: string;
  cosineScore?: number;
  sensitivity?: 'safe' | 'high_entropy' | 'masked';
  dlpDetails?: string;
  previewSnippet: string;
  encryptedSnippet: string;
}

const INITIAL_DRIVE_ITEMS: DriveItem[] = [
  {
    id: 'doc-1',
    logicalName: 'New Internet - Zero-Vault Patent.pdf',
    serverUuid: 'd8e25b19-4a02-47f1-893c-91bb02f61e88.bin',
    extension: 'pdf',
    logicalSize: '14.2 MB',
    wireSize: '4 × 4.00 MB (16.0 MB PADMÉ)',
    chunkCount: 4,
    keyHierarchy: 'Argon2id → HKDF Key_KEK',
    streamIntegrity: 'STREAM AEAD · Nonce #004 · EOS Tag',
    modified: '2 hours ago',
    cosineScore: 0.982,
    sensitivity: 'safe',
    previewSnippet: 'Claims 1-14: A system for client-side semantic vector indexing of encrypted octet streams in isolated Web Workers without cloud key revelation...',
    encryptedSnippet: '0x7e4a92bc5118d09f7a22bc44e1903fa8921a9c8034b10e9f8812ab00c5...'
  },
  {
    id: 'doc-2',
    logicalName: 'Cloud Infrastructure - Azure Costs.xlsx',
    serverUuid: 'e71a4f02-99bd-4e3a-8812-32cc9011af54.bin',
    extension: 'xlsx',
    logicalSize: '1.4 MB',
    wireSize: '1 × 4.00 MB (4.0 MB PADMÉ)',
    chunkCount: 1,
    keyHierarchy: 'Argon2id → HKDF Key_Vault',
    streamIntegrity: 'STREAM AEAD · Nonce #001 · EOS Tag',
    modified: 'Yesterday',
    cosineScore: 0.954,
    sensitivity: 'masked',
    previewSnippet: 'Q1-Q4 Enterprise egress costs: $0.00 (Self-hosted blind S3 sink with zero proprietary data extraction fees)...',
    encryptedSnippet: '0x3c81f51a0098df71a334e90812bb80cf098124ae87a0129bc441098de2...'
  },
  {
    id: 'doc-3',
    logicalName: 'Production_Cluster_Keys.env',
    serverUuid: 'a219bc88-341e-4209-b68a-77c8e90091aa.bin',
    extension: 'env',
    logicalSize: '3.2 KB',
    wireSize: '1 × 4.00 MB (4.0 MB PADMÉ)',
    chunkCount: 1,
    keyHierarchy: 'Hardware WebAuthn + Passkey',
    streamIntegrity: 'STREAM AEAD · Nonce #001 · EOS Tag',
    modified: 'Oct 28, 2026',
    cosineScore: 0.991,
    sensitivity: 'high_entropy',
    dlpDetails: '⚠️ HIGH-ENTROPY AWS & SSH KEYS DETECTED PRE-UPLOAD',
    previewSnippet: 'AWS_SECRET_ACCESS_KEY="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"\nSSH_RSA_KEY="-----BEGIN OPENSSH PRIVATE KEY-----..."',
    encryptedSnippet: '0x91d4a60e819b023f71c48821ad501239aa8021c4b77192aa00df214981...'
  },
  {
    id: 'doc-4',
    logicalName: 'Zero-Knowledge Threat Audit.pptx',
    serverUuid: 'f99014ad-88b1-4190-87a2-bb123899f1c0.bin',
    extension: 'pptx',
    logicalSize: '6.8 MB',
    wireSize: '2 × 4.00 MB (8.0 MB PADMÉ)',
    chunkCount: 2,
    keyHierarchy: 'Argon2id → Ed25519 Share',
    streamIntegrity: 'STREAM AEAD · Nonce #002 · EOS Tag',
    modified: 'Oct 24, 2026',
    cosineScore: 0.973,
    sensitivity: 'safe',
    previewSnippet: 'Slide 4: Demonstrating mathematical impossibility of key recovery via authenticated key wrapping and Ed25519 challenge-response...',
    encryptedSnippet: '0x0f22bd774810ac99201f84b1238049ad7e114092bba40129bc8821ad50...'
  },
  {
    id: 'doc-5',
    logicalName: 'Vector_Embeddings_MiniLM_v2.bin',
    serverUuid: 'c1192837-55ae-4100-9883-fa490012ba11.bin',
    extension: 'bin',
    logicalSize: '31.5 MB',
    wireSize: '8 × 4.00 MB (32.0 MB PADMÉ)',
    chunkCount: 8,
    keyHierarchy: 'Local WebGPU Wasm Enclave',
    streamIntegrity: 'STREAM AEAD · Nonce #008 · EOS Tag',
    modified: 'Oct 19, 2026',
    cosineScore: 0.965,
    sensitivity: 'safe',
    previewSnippet: '384-dimensional dense floating-point tensor matrices for client-side semantic retrieval evaluated via WebGPU...',
    encryptedSnippet: '0x88490a12cf99a81e3304b77192aa00df214981a80091ca28bb440129bc...'
  },
  {
    id: 'doc-6',
    logicalName: 'Institutional_Grant_Charter.docx',
    serverUuid: '88912aa1-4012-4ee1-b709-1129aa8891c2.bin',
    extension: 'docx',
    logicalSize: '2.1 MB',
    wireSize: '1 × 4.00 MB (4.0 MB PADMÉ)',
    chunkCount: 1,
    keyHierarchy: 'Argon2id → HKDF Key_Vault',
    streamIntegrity: 'STREAM AEAD · Nonce #001 · EOS Tag',
    modified: 'Oct 12, 2026',
    cosineScore: 0.941,
    sensitivity: 'safe',
    previewSnippet: 'National Cyber Defense Grant: Autonomous client-side encryption and zero-knowledge storage protocols for sovereign labs...',
    encryptedSnippet: '0x2918bb44001923fa811c7209e84012bba71092cc8812ab00c571a334e9...'
  }
];

export default function App() {
  // Preloader State
  const [preloaderFinished, setPreloaderFinished] = useState(false);
  const [preloaderPercent, setPreloaderPercent] = useState(0);
  const [preloaderStage, setPreloaderStage] = useState('ALLOCATING WASM LINEAR MEMORY');

  // Sound Engine State
  const [isSoundPlaying, setIsSoundPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  // 3D Sculpture Interactive State
  const [speedMultiplier, setSpeedMultiplier] = useState(1.0);
  const [ringExpansion, setRingExpansion] = useState(100);
  const [hudState, setHudState] = useState('VFS INDEX // SEALED IN WASM MEMORY');
  const [isLuminosityAmplified, setIsLuminosityAmplified] = useState(false);

  // Scroll & Nav State
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('home');
  const [isNavScrolled, setIsNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // =========================================================
  // DUAL-REALITY DRIVE UX STATE
  // =========================================================
  // 'client' (Sovereign Decrypted) vs 'server' (Untrusted Blind Pipe)
  const [veilMode, setVeilMode] = useState<'client' | 'server'>('client');
  const [veilSliderPct, setVeilSliderPct] = useState<number>(0); // 0 = client, 100 = server
  const [driveNavTab, setDriveNavTab] = useState<'vfs' | 'shared' | 'recent' | 'passkey' | 'audit'>('vfs');

  // Semantic Search Bar in Drive
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLatency, setSearchLatency] = useState(3.8);
  const [vectorSparkline, setVectorSparkline] = useState<number[]>([
    0.42, -0.19, 0.77, 0.31, -0.65, 0.88, 0.12, -0.45, 0.92, -0.08, 0.54, 0.38, -0.29, 0.71, 0.16, -0.84
  ]);

  // Drive Items
  const [driveItems, setDriveItems] = useState<DriveItem[]>(INITIAL_DRIVE_ITEMS);
  const [hoveredFileId, setHoveredFileId] = useState<string | null>(null);

  // Memory Zeroize Trigger State
  const [zeroizePulse, setZeroizePulse] = useState(false);
  const [zeroizeToast, setZeroizeToast] = useState(false);

  // Passkey Modal State (for high-entropy items like .env)
  const [passkeyModalOpen, setPasskeyModalOpen] = useState(false);
  const [passkeyItem, setPasskeyItem] = useState<DriveItem | null>(null);
  const [passkeyUnlocked, setPasskeyUnlocked] = useState(false);
  const [passkeyScanning, setPasskeyScanning] = useState(false);

  // 5-Stage Ingest X-Ray Modal State
  const [ingestModalOpen, setIngestModalOpen] = useState(false);
  const [ingestStage, setIngestStage] = useState(1);
  const [ingestFileName, setIngestFileName] = useState('Confidential_Q4_Model_Weights.bin');
  const [ingestFileSize, setIngestFileSize] = useState('48.6 MB');
  const [ingestPlaying, setIngestPlaying] = useState(false);

  // Provisioning Modal State
  const [vaultModalOpen, setVaultModalOpen] = useState(false);
  const [vaultSubmitted, setVaultSubmitted] = useState(false);
  const [vaultOwner, setVaultOwner] = useState('');
  const [vaultEmail, setVaultEmail] = useState('');
  const [vaultProfile, setVaultProfile] = useState('Full Sovereign Enterprise Fabric');

  // Defense Matrix Active Tab
  const [activeDefenseTab, setActiveDefenseTab] = useState(1);

  // Deadlock Quadrant Active Service Inspector
  const [selectedService, setSelectedService] = useState<'google_drive' | 'cryptomator' | 'avaran'>('avaran');

  // Custom Cursor
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const [cursorExpanded, setCursorExpanded] = useState(false);

  // Canvas Refs
  const webglCanvasRef = useRef<HTMLCanvasElement>(null);
  const preloaderCanvasRef = useRef<HTMLCanvasElement>(null);

  // Three.js Shared Controller Object
  const threeCtrlRef = useRef({
    mouseX: 0,
    mouseY: 0,
    targetRotX: 0,
    targetRotY: 0,
    hoverIntensity: 0,
    targetHoverIntensity: 0,
    speedMultiplier: 1.0,
    ringExpansion: 1.0,
    scrollProgress: 0,
    sectionOffsetX: 2.25,
    sectionScale: 1.0
  });

  // Sound Engine
  const initAmbientAudio = () => {
    if (audioCtxRef.current) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.connect(ctx.destination);

      audioCtxRef.current = ctx;
      masterGainRef.current = gain;

      const freqs = [110, 164.81, 220, 277.18];
      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(f, ctx.currentTime);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, ctx.currentTime);

        oscGain.gain.setValueAtTime(0.035 / (idx + 1), ctx.currentTime);
        osc.connect(filter);
        filter.connect(oscGain);
        oscGain.connect(gain);
        osc.start();
      });
    } catch {
      // Audio not supported
    }
  };

  const playUiChime = (freq = 528) => {
    if (!isSoundPlaying || !audioCtxRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.25, ctx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.025, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.24);
    } catch {
      // Silent error handling
    }
  };

  const toggleSound = () => {
    initAmbientAudio();
    const ctx = audioCtxRef.current;
    const gain = masterGainRef.current;
    if (!ctx || !gain) return;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const next = !isSoundPlaying;
    setIsSoundPlaying(next);
    if (next) {
      gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.8);
      playUiChime(660);
    } else {
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
    }
  };

  // Preloader Sequence
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setPreloaderFinished(true);
      return;
    }

    const canvas = preloaderCanvasRef.current;
    let animId: number;
    const startTime = performance.now();

    if (canvas) {
      const ctx = canvas.getContext('2d');
      const w = (canvas.width = window.innerWidth);
      const h = (canvas.height = window.innerHeight);
      const count = window.innerWidth < 768 ? 45 : 95;
      const particles = Array.from({ length: count }, () => {
        const angle = Math.random() * Math.PI * 2;
        const dist = 180 + Math.random() * Math.max(w, h) * 0.45;
        return {
          angle,
          dist,
          targetRadius: 72 + Math.random() * 42,
          speed: 0.012 + Math.random() * 0.022,
          size: 0.8 + Math.random() * 1.8,
          alpha: 0
        };
      });

      const render = (now: number) => {
        if (!ctx) return;
        const elapsed = (now - startTime) / 1000;
        ctx.clearRect(0, 0, w, h);

        particles.forEach((p) => {
          if (elapsed > 0.15) p.alpha = Math.min(0.85, p.alpha + 0.025);
          if (elapsed > 0.45) p.dist += (p.targetRadius - p.dist) * 0.065;
          p.angle += p.speed;
          const x = w / 2 + Math.cos(p.angle) * p.dist;
          const y = h / 2 + Math.sin(p.angle) * p.dist;

          ctx.beginPath();
          ctx.arc(x, y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(242, 240, 235, ${p.alpha})`;
          ctx.fill();
        });

        animId = requestAnimationFrame(render);
      };

      animId = requestAnimationFrame(render);
    }

    const duration = 2100;
    const interval = 25;
    const step = 100 / (duration / interval);
    let current = 0;

    const timer = setInterval(() => {
      current = Math.min(100, current + step);
      setPreloaderPercent(Math.round(current));

      if (current < 30) setPreloaderStage('ALLOCATING WASM LINEAR MEMORY');
      else if (current < 65) setPreloaderStage('DERIVING ARGON2ID + HKDF KEYS');
      else if (current < 92) setPreloaderStage('MOUNTING ENCRYPTED VFS INDEX');
      else setPreloaderStage('ENTERING AVARAN // ZERO-VAULT');

      if (current >= 100) {
        clearInterval(timer);
        setTimeout(() => setPreloaderFinished(true), 350);
      }
    }, interval);

    return () => {
      clearInterval(timer);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  // Cursor & Mouse Light
  useEffect(() => {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let animId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);

      threeCtrlRef.current.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      threeCtrlRef.current.mouseY = -((e.clientY / window.innerHeight) * 2 - 1);

      if (cursorDotRef.current) {
        cursorDotRef.current.style.left = `${e.clientX}px`;
        cursorDotRef.current.style.top = `${e.clientY}px`;
      }
    };

    const updateRing = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      if (cursorRingRef.current) {
        cursorRingRef.current.style.left = `${ringX}px`;
        cursorRingRef.current.style.top = `${ringY}px`;
      }
      animId = requestAnimationFrame(updateRing);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    animId = requestAnimationFrame(updateRing);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Scroll Progression
  useEffect(() => {
    const onScroll = () => {
      const top = window.scrollY;
      const docHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const prog = Math.min(1, Math.max(0, top / docHeight));
      setScrollProgress(prog);
      threeCtrlRef.current.scrollProgress = prog;

      setIsNavScrolled(top > 40);

      const isDesktop = window.innerWidth >= 1024;
      if (!isDesktop) {
        threeCtrlRef.current.sectionOffsetX = 0;
        threeCtrlRef.current.sectionScale = 0.78;
      } else if (prog < 0.22) {
        threeCtrlRef.current.sectionOffsetX = 2.25;
        threeCtrlRef.current.sectionScale = 1.0;
      } else if (prog < 0.45) {
        threeCtrlRef.current.sectionOffsetX = 0;
        threeCtrlRef.current.sectionScale = 1.25;
      } else if (prog < 0.72) {
        threeCtrlRef.current.sectionOffsetX = -2.35;
        threeCtrlRef.current.sectionScale = 0.88;
      } else {
        threeCtrlRef.current.sectionOffsetX = 0;
        threeCtrlRef.current.sectionScale = 1.05;
      }

      const sectionIds = ['home', 'drive', 'deadlock', 'defense', 'vault'];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.45) {
            setActiveSection(id);
          }
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // History & Escape Handler
  const scrollTo = (id: string, updateHistory = true) => {
    playUiChime(587.33);
    setMobileMenuOpen(false);
    const cleanId = id.replace('#', '');
    const target = document.getElementById(cleanId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      if (updateHistory && window.location.hash !== `#${cleanId}`) {
        window.history.pushState({ section: cleanId }, '', `#${cleanId}`);
      }
    }
  };

  const closeModals = (syncHistory = true) => {
    setPasskeyModalOpen(false);
    setIngestModalOpen(false);
    setVaultModalOpen(false);
    if (syncHistory && window.location.hash.includes('modal-')) {
      window.history.back();
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      if (passkeyModalOpen || ingestModalOpen || vaultModalOpen) {
        setPasskeyModalOpen(false);
        setIngestModalOpen(false);
        setVaultModalOpen(false);
        return;
      }
      if (mobileMenuOpen) {
        setMobileMenuOpen(false);
        return;
      }
      const hash = window.location.hash.replace('#', '');
      if (hash && !hash.startsWith('modal-')) {
        const target = document.getElementById(hash);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (passkeyModalOpen || ingestModalOpen || vaultModalOpen) closeModals();
        if (mobileMenuOpen) setMobileMenuOpen(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [passkeyModalOpen, ingestModalOpen, vaultModalOpen, mobileMenuOpen]);

  // Three.js Orbital Scene
  useEffect(() => {
    const canvas = webglCanvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: window.innerWidth >= 768,
        powerPreference: 'high-performance'
      });
    } catch {
      return;
    }

    const isMobile = window.innerWidth < 768;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 10.5);

    const rootGroup = new THREE.Group();
    threeCtrlRef.current.sectionOffsetX = window.innerWidth >= 1024 ? 2.25 : 0;
    rootGroup.position.x = threeCtrlRef.current.sectionOffsetX;
    scene.add(rootGroup);

    // Ribbons
    const ribbonGroup = new THREE.Group();
    rootGroup.add(ribbonGroup);
    const ribbonMaterials: { mat: THREE.Material; baseOpacity: number; isPhysical?: boolean }[] = [];

    const ribbonConfigs = [
      { radius: 2.05, tube: 0.22, p: 2, q: 3, rotX: 0.4, rotY: 0.2, opacity: 0.48 },
      { radius: 1.85, tube: 0.15, p: 3, q: 2, rotX: -0.6, rotY: 0.8, opacity: 0.36 },
      { radius: 2.25, tube: 0.08, p: 1, q: 2, rotX: 0.9, rotY: -0.4, opacity: 0.65 }
    ];

    ribbonConfigs.forEach((cfg) => {
      const geom = new THREE.TorusKnotGeometry(cfg.radius, cfg.tube, isMobile ? 96 : 180, isMobile ? 16 : 28, cfg.p, cfg.q);
      geom.scale(1.0, 1.08, 0.55);

      const mat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#C5C6CB'),
        emissive: new THREE.Color('#242528'),
        emissiveIntensity: 0.35,
        metalness: 0.88,
        roughness: 0.2,
        transparent: true,
        opacity: cfg.opacity,
        side: THREE.DoubleSide
      });
      ribbonMaterials.push({ mat, baseOpacity: cfg.opacity, isPhysical: true });

      const mesh = new THREE.Mesh(geom, mat);
      mesh.rotation.set(cfg.rotX, cfg.rotY, 0);
      ribbonGroup.add(mesh);

      const wireMat = new THREE.MeshBasicMaterial({ color: 0xf2f0eb, transparent: true, opacity: 0.09, wireframe: true });
      ribbonMaterials.push({ mat: wireMat, baseOpacity: 0.09 });
      const wireMesh = new THREE.Mesh(geom, wireMat);
      wireMesh.rotation.copy(mesh.rotation);
      wireMesh.scale.setScalar(1.003);
      ribbonGroup.add(wireMesh);
    });

    // Astrolabe Rings
    const ringsGroup = new THREE.Group();
    rootGroup.add(ringsGroup);
    const ringRadii = [2.65, 3.05, 3.45, 3.85];
    ringRadii.forEach((r, idx) => {
      const torusGeom = new THREE.TorusGeometry(r, idx % 2 === 0 ? 0.012 : 0.007, 12, isMobile ? 90 : 160);
      const ringMat = new THREE.MeshBasicMaterial({ color: idx === 0 ? 0xf2f0eb : 0xc5c6cb, transparent: true, opacity: 0.38 - idx * 0.06 });
      ribbonMaterials.push({ mat: ringMat, baseOpacity: 0.38 - idx * 0.06 });
      const ringMesh = new THREE.Mesh(torusGeom, ringMat);
      ringMesh.rotation.set((idx * Math.PI) / 5 + 0.3, (idx * Math.PI) / 4, idx * 0.2);

      const nodeGeom = new THREE.SphereGeometry(0.042, 12, 12);
      const nodeMat = new THREE.MeshBasicMaterial({ color: 0xf2f0eb });
      const nodeMesh = new THREE.Mesh(nodeGeom, nodeMat);
      nodeMesh.position.set(r, 0, 0);
      ringMesh.add(nodeMesh);

      ringsGroup.add(ringMesh);
    });

    // Particles
    const particleCount = isMobile ? 220 : 520;
    const particleGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = 1.8 + Math.random() * 5.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xf2f0eb,
      size: isMobile ? 0.035 : 0.028,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending
    });
    const particleCloud = new THREE.Points(particleGeom, particleMat);
    rootGroup.add(particleCloud);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xc5c6cb, 0.8);
    scene.add(ambientLight);
    const keyLight = new THREE.PointLight(0xf2f0eb, 2.6, 25);
    keyLight.position.set(5, 5, 6);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(0x85868b, 2.0, 25);
    rimLight.position.set(-6, -4, -3);
    scene.add(rimLight);

    const onResize = () => {
      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
      const isLandscape = window.innerWidth > window.innerHeight;
      const isShortLandscape = isLandscape && window.innerHeight < 550;

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
      renderer.setSize(window.innerWidth, window.innerHeight);

      if (window.innerWidth < 1024) {
        threeCtrlRef.current.sectionOffsetX = 0;
        threeCtrlRef.current.sectionScale = isShortLandscape ? 0.55 : isTablet ? 0.75 : 0.7;
      } else {
        threeCtrlRef.current.sectionOffsetX = 2.25;
        threeCtrlRef.current.sectionScale = 1.0;
      }
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', () => {
      setTimeout(onResize, 150);
    });

    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      const ctrl = threeCtrlRef.current;

      ctrl.hoverIntensity += (ctrl.targetHoverIntensity - ctrl.hoverIntensity) * 0.06;
      keyLight.intensity = 2.6 + ctrl.hoverIntensity * 2.2;

      ribbonMaterials.forEach((item) => {
        if (item.isPhysical && 'emissiveIntensity' in item.mat) {
          (item.mat as THREE.MeshPhysicalMaterial).emissiveIntensity = 0.35 + ctrl.hoverIntensity * 0.55;
        }
        item.mat.opacity = Math.min(0.95, item.baseOpacity + ctrl.hoverIntensity * 0.18);
      });

      const speed = ctrl.speedMultiplier * (1 + ctrl.hoverIntensity * 0.45);

      ribbonGroup.rotation.y += delta * 0.24 * speed;
      ribbonGroup.rotation.x = Math.sin(elapsed * 0.35) * 0.25 + ctrl.scrollProgress * Math.PI * 1.4;
      ribbonGroup.rotation.z += delta * 0.1 * speed;

      ringsGroup.children.forEach((ring, i) => {
        const dir = i % 2 === 0 ? 1 : -1;
        ring.rotation.z += delta * (0.14 + i * 0.04) * dir * speed;
        ring.rotation.x += delta * 0.08 * dir * speed;
      });

      const ringScale = ctrl.ringExpansion * (1 + Math.sin(ctrl.scrollProgress * Math.PI * 2) * 0.12);
      ringsGroup.scale.setScalar(ringScale);

      particleCloud.rotation.y -= delta * 0.05 * speed;
      particleCloud.rotation.x = ctrl.scrollProgress * 0.8;

      ctrl.targetRotY = ctrl.mouseX * 0.45;
      ctrl.targetRotX = ctrl.mouseY * 0.35;
      rootGroup.rotation.y += (ctrl.targetRotY - rootGroup.rotation.y) * 0.05;
      rootGroup.rotation.x += (ctrl.targetRotX - rootGroup.rotation.x) * 0.05;

      rootGroup.position.x += (ctrl.sectionOffsetX - rootGroup.position.x) * 0.06;
      const currentScale = rootGroup.scale.x;
      const nextScale = currentScale + (ctrl.sectionScale - currentScale) * 0.06;
      rootGroup.scale.setScalar(nextScale);

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);

  // Semantic Search in Drive Table
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    playUiChime(620);

    // Compute live 384-dim mock vector sparkline
    const hash = query.split('').reduce((acc, c, i) => acc + c.charCodeAt(0) * (i + 1), 0);
    const newSparkline = Array.from({ length: 16 }, (_, i) => {
      const v = Math.sin((hash + i * 23) * 0.15) * 0.9;
      return parseFloat(v.toFixed(2));
    });
    setVectorSparkline(newSparkline);
    setSearchLatency(parseFloat((3.2 + (hash % 15) / 10).toFixed(1)));

    if (!query.trim()) {
      setDriveItems(INITIAL_DRIVE_ITEMS);
      return;
    }

    const q = query.toLowerCase();
    const filtered = INITIAL_DRIVE_ITEMS.filter((item) => {
      return (
        item.logicalName.toLowerCase().includes(q) ||
        item.previewSnippet.toLowerCase().includes(q) ||
        (q.includes('tax') && item.id === 'doc-2') ||
        (q.includes('patent') && item.id === 'doc-1') ||
        (q.includes('api') && item.id === 'doc-3') ||
        (q.includes('audit') && item.id === 'doc-4')
      );
    });
    setDriveItems(filtered.length > 0 ? filtered : INITIAL_DRIVE_ITEMS);
  };

  // Zeroize Memory Action
  const triggerZeroizeMemory = () => {
    playUiChime(880);
    setZeroizePulse(true);
    setZeroizeToast(true);
    setTimeout(() => setZeroizePulse(false), 900);
    setTimeout(() => setZeroizeToast(false), 4200);
  };

  // Toggle Veil Mode Helper
  const setVeil = (mode: 'client' | 'server') => {
    setVeilMode(mode);
    setVeilSliderPct(mode === 'client' ? 0 : 100);
    playUiChime(mode === 'client' ? 528 : 740);
  };

  const handleVeilSliderChange = (pct: number) => {
    setVeilSliderPct(pct);
    if (pct >= 50 && veilMode !== 'server') {
      setVeilMode('server');
      playUiChime(740);
    } else if (pct < 50 && veilMode !== 'client') {
      setVeilMode('client');
      playUiChime(528);
    }
  };

  // Handle Passkey Trigger
  const triggerPasskeyAuth = (item: DriveItem) => {
    setPasskeyItem(item);
    setPasskeyScanning(false);
    setPasskeyUnlocked(false);
    setPasskeyModalOpen(true);
    if (!window.location.hash.includes('modal-passkey')) {
      window.history.pushState({ modal: 'passkey' }, '', '#modal-passkey');
    }
    playUiChime(740);
  };

  const executePasskeyScan = () => {
    setPasskeyScanning(true);
    playUiChime(640);
    setTimeout(() => {
      setPasskeyScanning(false);
      setPasskeyUnlocked(true);
      playUiChime(880);
    }, 1400);
  };

  // Handle Ingest File X-Ray Trigger
  const triggerIngestModal = () => {
    setIngestStage(1);
    setIngestPlaying(false);
    setIngestModalOpen(true);
    if (!window.location.hash.includes('modal-ingest')) {
      window.history.pushState({ modal: 'ingest' }, '', '#modal-ingest');
    }
    playUiChime(660);
  };

  // Ingest X-Ray autoplay
  useEffect(() => {
    if (!ingestPlaying) return;
    const timer = setInterval(() => {
      setIngestStage((prev) => (prev >= 5 ? 1 : prev + 1));
      playUiChime(500 + ingestStage * 70);
    }, 2800);
    return () => clearInterval(timer);
  }, [ingestPlaying, ingestStage]);

  // Open Vault Provisioning Modal
  const openVaultModal = () => {
    setVaultSubmitted(false);
    setVaultModalOpen(true);
    if (!window.location.hash.includes('modal-vault')) {
      window.history.pushState({ modal: 'vault' }, '', '#modal-vault');
    }
    playUiChime(784);
  };

  const handleVaultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playUiChime(880);
    setVaultSubmitted(true);
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#F2F0EB] selection:bg-[#C5C6CB]/30 selection:text-[#F2F0EB] overflow-x-hidden font-['Inter',sans-serif]">
      {/* Film Grain & Ambient Mouse Follower */}
      <div className="film-grain pointer-events-none" aria-hidden="true" />
      <div id="ambient-mouse-light" aria-hidden="true" />

      {/* Custom Desktop Cursor */}
      <div ref={cursorDotRef} className="custom-cursor-dot hidden lg:block" aria-hidden="true" />
      <div
        ref={cursorRingRef}
        className={`custom-cursor-ring hidden lg:block ${cursorExpanded ? 'cursor-expanded' : ''}`}
        aria-hidden="true"
      />

      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-[90] bg-[#242528]/40 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-[#85868B] via-[#C5C6CB] to-[#F2F0EB] shadow-[0_0_12px_#F2F0EB] transition-all duration-150"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Vertical Telemetry Strip */}
      <div className="fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-3 pointer-events-none">
        <span className="text-[10px] font-mono tracking-widest text-[#85868B] tabular-nums">
          {String(Math.round(scrollProgress * 100)).padStart(2, '0')}%
        </span>
        <div className="w-[1px] h-28 bg-[#242528]/70 relative overflow-hidden">
          <div
            className="w-full h-7 bg-[#C5C6CB] absolute left-0 shadow-[0_0_8px_#F2F0EB] transition-all duration-150"
            style={{ top: `${scrollProgress * 84}px` }}
          />
        </div>
        <span className="text-[9px] tracking-[0.32em] text-[#85868B]/60 uppercase [writing-mode:vertical-rl] rotate-180">
          ZERO-VAULT SYNC
        </span>
      </div>

      {/* Floating Back to Top Button */}
      {scrollProgress > 0.08 && (
        <div className="fixed bottom-6 left-6 sm:bottom-8 sm:left-8 z-40">
          <button
            type="button"
            onClick={() => scrollTo('home')}
            onMouseEnter={() => setCursorExpanded(true)}
            onMouseLeave={() => setCursorExpanded(false)}
            aria-label="Back to Top of Page"
            className="flex items-center gap-2 px-4 py-2.5 rounded-full glass-panel border border-[#C5C6CB]/30 text-xs font-mono tracking-wider uppercase text-[#F2F0EB] hover:border-[#F2F0EB] hover:bg-[#111214] shadow-[0_10px_30px_rgba(0,0,0,0.85)] transition-all cursor-pointer group"
          >
            <ArrowUp className="w-3.5 h-3.5 text-[#C5C6CB] group-hover:-translate-y-0.5 transition-transform" />
            <span className="hidden sm:inline">Back to Top</span>
            <span className="sm:hidden">Top</span>
          </button>
        </div>
      )}

      {/* Background Three.js WebGL Canvas */}
      <canvas
        ref={webglCanvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-[3]"
        aria-hidden="true"
      />

      {/* ========================================================= */}
      {/* 0. CINEMATIC PRELOADER SCREEN                             */}
      {/* ========================================================= */}
      {!preloaderFinished && (
        <div
          id="preloader"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505] transition-opacity duration-700"
        >
          <canvas ref={preloaderCanvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            <div className="relative w-64 h-64 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 260 260">
                <circle cx="130" cy="130" r="120" fill="none" stroke="rgba(197, 198, 203, 0.12)" strokeWidth="1" />
                <circle
                  cx="130"
                  cy="130"
                  r="120"
                  fill="none"
                  stroke="#F2F0EB"
                  strokeWidth="1.5"
                  strokeDasharray="754"
                  strokeDashoffset={754 - (754 * preloaderPercent) / 100}
                  className="transition-all duration-150"
                  transform="rotate(-90 130 130)"
                />
              </svg>

              <div className="relative w-40 h-40 rounded-full flex items-center justify-center animate-pulse">
                <div className="absolute inset-0 rounded-full bg-[#C5C6CB]/10 blur-2xl" />
                <img
                  src={AVARAN_LOGO}
                  alt="AVARAN Zero-Vault"
                  className="w-36 h-36 object-contain logo-blend relative z-10"
                />
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="font-['Cinzel',serif] text-xs sm:text-sm tracking-[0.38em] text-[#F2F0EB]">
                INITIALIZING AVARAN // ZERO-VAULT
              </p>
              <div className="mt-3 flex items-center justify-center gap-3 text-[10px] font-mono tracking-widest text-[#85868B]">
                <span>{preloaderStage}</span>
                <span className="text-[#C5C6CB] tabular-nums font-semibold">{preloaderPercent}%</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setPreloaderFinished(true)}
            onMouseEnter={() => setCursorExpanded(true)}
            onMouseLeave={() => setCursorExpanded(false)}
            className="absolute bottom-8 right-8 z-20 px-4 py-2 rounded-full border border-[#C5C6CB]/20 bg-[#111214]/60 text-[11px] tracking-widest uppercase text-[#A7A7AD] hover:text-[#F2F0EB] hover:border-[#C5C6CB]/50 transition-all cursor-pointer"
          >
            Skip Sequence →
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. TOP BAR CONTRACT (Strict 3-Zone Header)                */}
      {/* ========================================================= */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-3 sm:py-5 px-3 sm:px-8 lg:px-14">
        <div
          className={`max-w-7xl mx-auto rounded-full px-4 sm:px-7 py-2.5 sm:py-3 transition-all duration-500 flex items-center justify-between gap-3 sm:gap-8 border ${
            isNavScrolled ? 'glass-panel shadow-[0_10px_40px_rgba(0,0,0,0.85)]' : 'border-transparent'
          }`}
        >
          {/* Zone 1: Single element brand wordmark */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('home');
            }}
            onMouseEnter={() => setCursorExpanded(true)}
            onMouseLeave={() => setCursorExpanded(false)}
            className="flex items-center gap-2.5 sm:gap-3.5 group focus:outline-none whitespace-nowrap shrink-0"
          >
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#C5C6CB]/25 bg-[#050505] flex items-center justify-center overflow-hidden group-hover:border-[#F2F0EB]/70 transition-colors">
              <img
                src={AVARAN_LOGO}
                alt="AVARAN Logo"
                className="w-7 h-7 sm:w-9 sm:h-9 object-contain logo-blend group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-['Cinzel',serif] text-sm sm:text-lg tracking-[0.2em] sm:tracking-[0.24em] text-[#F2F0EB] font-medium leading-none">
                <span className="hidden sm:inline">AVARAN // ZERO-VAULT</span>
                <span className="sm:hidden">AVARAN</span>
              </span>
              <span className="text-[8px] sm:text-[9px] tracking-[0.2em] sm:tracking-[0.26em] text-[#85868B] uppercase mt-1">
                MATHEMATICALLY BLIND
              </span>
            </div>
          </a>

          {/* Zone 2: 5 clean navigation links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-6 lg:gap-8 text-xs tracking-[0.16em] uppercase font-medium"
          >
            {[
              { id: 'home', label: 'Home' },
              { id: 'drive', label: 'Dual-Drive UX' },
              { id: 'deadlock', label: 'The Deadlock' },
              { id: 'defense', label: 'Threat Matrix' },
              { id: 'vault', label: 'Deploy' }
            ].map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(link.id);
                }}
                onMouseEnter={() => setCursorExpanded(true)}
                onMouseLeave={() => setCursorExpanded(false)}
                className={`nav-link whitespace-nowrap shrink-0 ${activeSection === link.id ? 'active' : ''}`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: 1 primary action & controls */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Audio Toggle */}
            <button
              type="button"
              onClick={toggleSound}
              onMouseEnter={() => setCursorExpanded(true)}
              onMouseLeave={() => setCursorExpanded(false)}
              aria-pressed={isSoundPlaying}
              aria-label="Toggle Ambient Soundscape"
              className={`flex items-center gap-2.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full border text-[10px] tracking-widest uppercase transition-all cursor-pointer ${
                isSoundPlaying
                  ? 'border-[#F2F0EB] bg-[#111214] text-[#F2F0EB] sound-active'
                  : 'border-[#C5C6CB]/20 bg-[#111214]/70 text-[#A7A7AD] hover:border-[#C5C6CB]/50 hover:text-[#F2F0EB]'
              }`}
            >
              <div className="flex items-end gap-[2px] h-3">
                <span className="sound-bar sound-bar-1 h-1" />
                <span className="sound-bar sound-bar-2 h-1.5" />
                <span className="sound-bar sound-bar-3 h-1" />
                <span className="sound-bar sound-bar-4 h-1" />
              </div>
              <span className="hidden sm:inline whitespace-nowrap">
                {isSoundPlaying ? 'Audio On' : 'Audio Off'}
              </span>
            </button>

            {/* Initialize Vault CTA */}
            <button
              type="button"
              onClick={openVaultModal}
              onMouseEnter={() => setCursorExpanded(true)}
              onMouseLeave={() => setCursorExpanded(false)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#F2F0EB] via-[#C5C6CB] to-[#F2F0EB] text-[#050505] font-semibold text-xs tracking-[0.16em] uppercase shadow-[0_0_25px_rgba(197,198,203,0.25)] hover:shadow-[0_0_35px_rgba(242,240,235,0.5)] transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Initialize Vault</span>
              <Lock className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="md:hidden w-9 h-9 rounded-full border border-[#C5C6CB]/25 bg-[#111214]/80 flex items-center justify-center text-[#F2F0EB]"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-[80] bg-[#050505]/95 backdrop-blur-2xl transition-opacity duration-500 flex flex-col justify-between p-8 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={AVARAN_LOGO} alt="AVARAN" className="w-8 h-8 object-contain logo-blend" />
            <span className="font-['Cinzel',serif] text-base tracking-[0.24em] text-[#F2F0EB]">
              AVARAN // ZERO-VAULT
            </span>
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close navigation menu"
            className="w-10 h-10 rounded-full border border-[#C5C6CB]/25 flex items-center justify-center text-[#F2F0EB]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-6 my-auto">
          {[
            { id: 'home', label: '01. Home' },
            { id: 'drive', label: '02. Dual-Drive UX' },
            { id: 'deadlock', label: '03. The Deadlock' },
            { id: 'defense', label: '04. Threat Matrix' },
            { id: 'vault', label: '05. Deploy Vault' }
          ].map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                scrollTo(item.id);
              }}
              className="font-['Cinzel',serif] text-2xl tracking-[0.16em] text-[#F2F0EB] hover:text-[#C5C6CB]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="pt-6 border-t border-[#242528] flex items-center justify-between">
          <span className="text-xs font-mono text-[#85868B]">C-WASM · WEBGPU · STREAM AEAD</span>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              openVaultModal();
            }}
            className="px-6 py-2.5 rounded-full bg-[#F2F0EB] text-[#050505] text-xs font-medium tracking-widest uppercase"
          >
            Deploy
          </button>
        </div>
      </div>

      {/* Main Content Stream */}
      <main className="relative z-10">
        {/* ========================================================= */}
        {/* 2. HERO SECTION — THE VEIL PROMISE                        */}
        {/* ========================================================= */}
        <section
          id="home"
          className="relative min-h-[100dvh] min-h-screen w-full flex items-center pt-24 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-8 lg:px-14 overflow-hidden"
        >
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center relative z-10">
            {/* Left Column */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-[#85868B] mb-4 sm:mb-5 font-mono tracking-wider flex-wrap">
                <span className="text-[#F2F0EB] font-medium">ZERO-KNOWLEDGE</span>
                <span aria-hidden="true">·</span>
                <span>WASM AEAD</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#C5C6CB]">IN-BROWSER AI</span>
              </div>

              {/* Engineering Stack Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#C5C6CB]/15 bg-[#111214]/60 text-[9px] sm:text-[10px] font-mono text-[#85868B] mb-5 sm:mb-6 max-w-xl flex-wrap">
                <Terminal className="w-3.5 h-3.5 text-[#C5C6CB] shrink-0" />
                <span className="text-[#C5C6CB]">React + Vite</span>
                <span>·</span>
                <span className="text-[#F2F0EB]">C → Wasm</span>
                <span>·</span>
                <span className="text-[#C5C6CB]">ONNX / WebGPU</span>
                <span>·</span>
                <span className="text-[#85868B]">FastAPI (Blind Pipe)</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-['Cinzel',serif] text-3xl sm:text-5xl lg:text-6xl xl:text-[4.15rem] leading-[1.1] tracking-tight font-normal text-[#F2F0EB] mb-6 max-w-2xl text-balance break-words">
                <span className="silver-gradient-text font-semibold">Searchable</span> Like the Cloud. <br />
                <span className="silver-gradient-text font-semibold">Blind Like an Air-Gapped Drive.</span>
              </h1>

              {/* Narrative */}
              <p className="text-[#A7A7AD] text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl font-light mb-7 sm:mb-8">
                AVARAN Zero-Vault combines a custom C-to-WebAssembly cryptographic core with isolated in-browser
                WebGPU intelligence. Encrypt, semantically search, and scan files for sensitive secrets entirely on the
                client—before a single uniform ciphertext byte ever reaches our untrusted cloud pipe.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-5 mb-8 sm:mb-10 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => scrollTo('drive')}
                  onMouseEnter={() => setCursorExpanded(true)}
                  onMouseLeave={() => setCursorExpanded(false)}
                  className="group relative inline-flex items-center justify-center gap-3 px-7 py-3.5 sm:px-8 sm:py-4 rounded-full bg-[#F2F0EB] text-[#050505] font-semibold text-xs sm:text-sm tracking-[0.18em] uppercase overflow-hidden shadow-[0_0_40px_rgba(242,240,235,0.28)] hover:shadow-[0_0_55px_rgba(242,240,235,0.55)] transition-all cursor-pointer"
                >
                  <span className="relative z-10">Experience Dual-Drive UX</span>
                  <HardDrive className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={() => scrollTo('defense')}
                  onMouseEnter={() => setCursorExpanded(true)}
                  onMouseLeave={() => setCursorExpanded(false)}
                  className="group inline-flex items-center justify-center gap-3 px-7 py-3.5 sm:px-8 sm:py-4 rounded-full border border-[#C5C6CB]/30 bg-[#111214]/60 hover:bg-[#242528]/70 hover:border-[#F2F0EB]/60 text-[#F2F0EB] font-medium text-xs sm:text-sm tracking-[0.18em] uppercase backdrop-blur-md transition-all cursor-pointer"
                >
                  <span>Inspect Threat Matrix</span>
                  <ShieldCheck className="w-4 h-4 text-[#C5C6CB] group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              {/* Hero Telemetry */}
              <div className="pt-6 border-t border-[#C5C6CB]/15 w-full max-w-xl grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <div className="text-[10px] font-mono tracking-widest uppercase text-[#85868B]">BLIND SEARCH LATENCY</div>
                  <div className="font-['Cinzel',serif] text-lg sm:text-xl lg:text-2xl text-[#F2F0EB] mt-1 tabular-nums">
                    &lt; 5 <span className="text-xs text-[#C5C6CB]">ms</span>
                  </div>
                  <div className="text-[9px] font-mono text-[#85868B] mt-0.5">384-dim in C/Wasm</div>
                </div>

                <div>
                  <div className="text-[10px] font-mono tracking-widest uppercase text-[#85868B]">BLOCK OBFUSCATION</div>
                  <div className="font-['Cinzel',serif] text-lg sm:text-xl lg:text-2xl text-[#F2F0EB] mt-1 tabular-nums">
                    4 <span className="text-xs text-[#C5C6CB]">MB Chunks</span>
                  </div>
                  <div className="text-[9px] font-mono text-[#85868B] mt-0.5">PADMÉ ≤12% cap</div>
                </div>

                <div>
                  <div className="text-[10px] font-mono tracking-widest uppercase text-[#85868B]">SERVER VISIBILITY</div>
                  <div className="font-['Cinzel',serif] text-lg sm:text-xl lg:text-2xl text-[#F2F0EB] mt-1 tabular-nums">
                    0.00<span className="text-xs text-[#C5C6CB]">%</span>
                  </div>
                  <div className="text-[9px] font-mono text-[#85868B] mt-0.5">Zero Plaintext / Keys</div>
                </div>
              </div>
            </div>

            {/* Right Column: 3D Orbital Sculpture & Hitbox */}
            <div className="lg:col-span-5 relative flex items-center justify-center min-h-[280px] sm:min-h-[420px] lg:min-h-[500px] w-full">
              <div
                role="region"
                aria-label="Interactive 3D AVARAN Zero-Vault Orbital Sculpture"
                tabIndex={0}
                onMouseEnter={() => {
                  threeCtrlRef.current.targetHoverIntensity = 1;
                  setIsLuminosityAmplified(true);
                  setHudState('WASM LINEAR MEMORY // ACTIVE ENCLAVE');
                  playUiChime(740);
                  setCursorExpanded(true);
                }}
                onMouseLeave={() => {
                  threeCtrlRef.current.targetHoverIntensity = 0;
                  setIsLuminosityAmplified(false);
                  setHudState('VFS INDEX // SEALED IN WASM MEMORY');
                  setCursorExpanded(false);
                }}
                className="relative w-full max-w-[300px] sm:max-w-[420px] lg:max-w-[480px] aspect-square flex items-center justify-center cursor-grab active:cursor-grabbing group focus:outline-none"
              >
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 500">
                  <line x1="250" y1="0" x2="250" y2="500" stroke="rgba(197,198,203,0.22)" strokeWidth="0.75" />
                  <line x1="20" y1="265" x2="480" y2="265" stroke="rgba(197,198,203,0.16)" strokeWidth="0.75" strokeDasharray="2 5" />
                  <circle cx="250" cy="48" r="14" fill="none" stroke="rgba(242,240,235,0.45)" strokeWidth="1" />
                  <circle cx="250" cy="48" r="3" fill="#F2F0EB" />
                  <circle cx="250" cy="250" r="202" fill="none" stroke="rgba(197,198,203,0.22)" strokeWidth="0.85" />
                  <circle cx="250" cy="250" r="222" fill="none" stroke="rgba(197,198,203,0.15)" strokeWidth="0.75" strokeDasharray="6 10" className="origin-center spin-slow" />
                  <circle cx="48" cy="265" r="2.5" fill="#F2F0EB" />
                  <circle cx="452" cy="265" r="2.5" fill="#F2F0EB" />
                </svg>

                <div
                  className={`w-64 h-64 rounded-full blur-3xl transition-all duration-700 pointer-events-none ${
                    isLuminosityAmplified ? 'bg-[#F2F0EB]/25 scale-125' : 'bg-[#C5C6CB]/10'
                  }`}
                />

                <div className="absolute bottom-3 right-3 px-3.5 py-2 rounded-xl glass-panel flex items-center gap-2.5 text-[10px] font-mono tracking-widest text-[#C5C6CB]">
                  <span
                    className={`w-2 h-2 rounded-full transition-colors ${
                      isLuminosityAmplified ? 'bg-[#F2F0EB]' : 'bg-[#C5C6CB]'
                    }`}
                  />
                  <span>{hudState}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 3. CENTERPIECE: DUAL-REALITY DRIVE WORKSPACE              */}
        {/* ========================================================= */}
        <section id="drive" className="relative py-28 px-4 sm:px-8 lg:px-14">
          <div className="max-w-7xl mx-auto">
            {/* Header & Veil Switcher */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
              <div>
                <div className="inline-flex items-center gap-2 text-xs text-[#85868B] font-mono tracking-widest mb-3">
                  <span>LIVE SPATIAL WORKSPACE</span>
                  <span aria-hidden="true">/</span>
                  <span>THE PROTECTIVE VEIL (आवरण)</span>
                </div>
                <h2 className="font-['Cinzel',serif] text-3xl sm:text-5xl text-[#F2F0EB] tracking-tight">
                  Dual-Reality <span className="silver-gradient-text">Drive Workspace</span>
                </h2>
                <p className="text-sm sm:text-base text-[#A7A7AD] font-light mt-2 max-w-xl">
                  Toggle the Avaran Veil to inspect the fundamental contrast between what you decrypt in-browser
                  and the completely blind octet stream visible to the cloud pipe.
                </p>
              </div>

              {/* The Signature "Dual-Reality Veil Switch" */}
              <div className="p-3 sm:p-4 rounded-2xl glass-panel border border-[#C5C6CB]/30 shadow-[0_10px_35px_rgba(0,0,0,0.8)] flex flex-col gap-2.5 w-full lg:w-auto max-w-xl">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#85868B] uppercase">
                  <span>THE AVARAN VEIL CURTAIN</span>
                  <span className="text-[#F2F0EB]">
                    {veilSliderPct < 50 ? `DECRYPTED (${100 - veilSliderPct}%)` : `BLIND S3 (${veilSliderPct}%)`}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 p-1 bg-[#050505] rounded-xl border border-[#242528]">
                  <button
                    type="button"
                    onClick={() => setVeil('client')}
                    onMouseEnter={() => setCursorExpanded(true)}
                    onMouseLeave={() => setCursorExpanded(false)}
                    className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-mono tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap ${
                      veilMode === 'client'
                        ? 'bg-[#F2F0EB] text-[#050505] font-semibold shadow-[0_0_20px_rgba(242,240,235,0.4)]'
                        : 'text-[#85868B] hover:text-[#F2F0EB]'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Client View (Decrypted)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVeil('server')}
                    onMouseEnter={() => setCursorExpanded(true)}
                    onMouseLeave={() => setCursorExpanded(false)}
                    className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-mono tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap ${
                      veilMode === 'server'
                        ? 'bg-gradient-to-r from-red-950 via-[#242528] to-red-950 text-[#F2F0EB] border border-red-500/40 font-semibold shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                        : 'text-[#85868B] hover:text-[#F2F0EB]'
                    }`}
                  >
                    <EyeOff className="w-3.5 h-3.5 text-red-400" />
                    <span>Server View (Blind Pipe)</span>
                  </button>
                </div>

                {/* Draggable Curtain Slider */}
                <div className="pt-1 flex items-center gap-2.5">
                  <span className="text-[10px] font-mono text-[#85868B] shrink-0">Client 0%</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={veilSliderPct}
                    onChange={(e) => handleVeilSliderChange(parseInt(e.target.value, 10))}
                    aria-label="Avaran Veil Curtain Slider"
                    className="w-full accent-[#F2F0EB] bg-[#242528] h-1.5 rounded-lg cursor-pointer"
                  />
                  <span className="text-[10px] font-mono text-red-400 shrink-0">Server 100%</span>
                </div>
              </div>
            </div>

            {/* Zeroize Memory Toast Banner */}
            {zeroizeToast && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-400/40 text-xs font-mono text-emerald-200 flex items-center justify-between animate-fade-in shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>
                    <strong>EXPLICIT_BZERO EXECUTED:</strong> 128 MB WebAssembly linear memory scrubbed with zero LLVM dead-store optimization. 0 keys remain in V8 heap.
                  </span>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold">MEMORY HYGIENE VERIFIED</span>
              </div>
            )}

            {/* Telemetry Status Banner Above Workspace */}
            <div
              className={`p-3.5 px-4 sm:px-6 rounded-2xl mb-6 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-3 border transition-colors duration-500 ${
                veilMode === 'client'
                  ? 'bg-[#111214]/80 border-[#C5C6CB]/20 text-[#C5C6CB]'
                  : 'bg-red-950/30 border-red-500/30 text-red-200 shadow-[0_0_35px_rgba(239,68,68,0.15)]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    veilMode === 'client' ? 'bg-emerald-400 animate-pulse' : 'bg-red-500 animate-ping'
                  }`}
                />
                <span className="break-words">
                  {veilMode === 'client' ? (
                    <>
                      <strong className="text-[#F2F0EB]">CLIENT PERSPECTIVE:</strong> Sovereign VFS Mounted · 384-Dim ONNX Vector Index Cached in Web Worker Memory
                    </>
                  ) : (
                    <>
                      <strong className="text-red-300">ADVERSARY S3 / CLOUD VIEW:</strong> SERVER VISIBILITY: 0.00% // 100 PDFs INDISTINGUISHABLE FROM 1 VIDEO FILE
                    </>
                  )}
                </span>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-[11px] text-[#85868B] shrink-0">
                <span>CIPHER: XCHACHA20</span>
                <span>BLOCK: 4 MB</span>
              </div>
            </div>

            {/* ========================================================= */}
            {/* THE AVARAN ORBITAL DRIVE SHELL CONTAINER                  */}
            {/* ========================================================= */}
            <div
              className={`relative rounded-3xl glass-panel border overflow-hidden transition-all duration-700 shadow-[0_25px_80px_rgba(0,0,0,0.95)] ${
                zeroizePulse ? 'zeroize-active' : ''
              } ${veilMode === 'client' ? 'border-[#C5C6CB]/25' : 'border-red-500/30'}`}
            >
              {veilMode === 'server' && <div className="server-scanline" />}

              {/* A. Top Command Bar: In-Browser Semantic Vector Bar */}
              <div className="p-3.5 sm:p-5 border-b border-[#242528] bg-[#050505]/90 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                <div className="flex-1 flex flex-col gap-2">
                  <div className="relative flex items-center">
                    <Search className="w-4 h-4 text-[#85868B] absolute left-4 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      disabled={veilMode === 'server'}
                      placeholder={
                        veilMode === 'client'
                          ? 'Search Vault Semantically (384-dim ONNX / WebGPU — 0 bytes sent to server)...'
                          : 'SEARCH BLOCKED: SERVER CANNOT INDEX OPAQUE CIPHERTEXT BLOBS'
                      }
                      className={`w-full pl-11 pr-3 sm:pr-32 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-mono transition-all focus:outline-none ${
                        veilMode === 'client'
                          ? 'bg-[#111214] border border-[#C5C6CB]/20 text-[#F2F0EB] placeholder-[#85868B]/50 focus:border-[#F2F0EB]'
                          : 'bg-[#111214]/40 border border-red-500/20 text-red-300 placeholder-red-400/40 cursor-not-allowed'
                      }`}
                    />
                    <div className="absolute right-3 hidden sm:flex items-center gap-2 text-[10px] font-mono text-[#85868B] bg-[#050505] px-2.5 py-1 rounded-md border border-[#242528]">
                      <span>{searchLatency} ms in C/Wasm</span>
                    </div>
                  </div>

                  {/* Sparkline & Quick Query Chips (Client View Only) */}
                  {veilMode === 'client' && (
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[9px] sm:text-[10px] text-[#85868B]">QUERIES:</span>
                        {[
                          'tax invoice from March',
                          'architecture patent',
                          'production API keys',
                          'azure costs'
                        ].map((chip) => (
                          <button
                            key={chip}
                            type="button"
                            onClick={() => handleSearchChange(chip)}
                            className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-[#111214] hover:bg-[#242528] text-[9px] sm:text-[10px] text-[#A7A7AD] hover:text-[#F2F0EB] border border-[#242528] transition-colors cursor-pointer"
                          >
                            &quot;{chip}&quot;
                          </button>
                        ))}
                      </div>

                      {/* Sparkline Graphic */}
                      <div className="hidden lg:flex items-center gap-2 text-[10px] text-[#85868B]">
                        <span>384-DIM FLOAT VECTOR:</span>
                        <svg className="w-28 h-4 overflow-visible" viewBox="0 0 112 16">
                          <polyline
                            fill="none"
                            stroke="#C5C6CB"
                            strokeWidth="1.2"
                            points={vectorSparkline
                              .map((val, idx) => `${idx * 7},${8 - val * 6}`)
                              .join(' ')}
                          />
                        </svg>
                        <span className="text-emerald-400 font-semibold">PAYLOAD: 0 BYTES (BLIND)</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* B. Primary Action: + INGEST TO VAULT Button */}
                <div className="shrink-0 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={triggerIngestModal}
                    onMouseEnter={() => setCursorExpanded(true)}
                    onMouseLeave={() => setCursorExpanded(false)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-gradient-to-r from-[#F2F0EB] via-[#C5C6CB] to-[#F2F0EB] text-[#050505] font-semibold text-xs tracking-wider uppercase shadow-[0_0_30px_rgba(242,240,235,0.3)] hover:shadow-[0_0_45px_rgba(242,240,235,0.55)] transition-all cursor-pointer whitespace-nowrap"
                  >
                    <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>+ Ingest to Vault</span>
                  </button>
                </div>
              </div>

              {/* Mobile / Tablet Horizontal Hierarchy Rail */}
              <div className="lg:hidden p-3 border-b border-[#242528] bg-[#050505]/90 flex items-center gap-2 overflow-x-auto">
                {[
                  { key: 'vfs', label: 'My Vault', icon: Folder, count: '6' },
                  { key: 'shared', label: 'Shares', icon: UserCheck, count: '1' },
                  { key: 'recent', label: 'Recent', icon: Activity, count: '<5ms' },
                  { key: 'passkey', label: 'Passkey Gated', icon: Fingerprint, count: 'Lock' },
                  { key: 'audit', label: 'Audit Log', icon: ShieldCheck, count: 'OK' }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const active = driveNavTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => {
                        setDriveNavTab(tab.key as any);
                        playUiChime(550);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap shrink-0 transition-all ${
                        active
                          ? 'bg-[#F2F0EB] text-[#050505] font-semibold'
                          : 'bg-[#111214] text-[#85868B] hover:text-[#F2F0EB] border border-[#242528]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                      <span className="text-[9px] opacity-75">({tab.count})</span>
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={triggerZeroizeMemory}
                  className="ml-auto flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#C5C6CB]/20 bg-[#111214] text-[10px] font-mono text-[#C5C6CB] whitespace-nowrap shrink-0"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Zeroize</span>
                </button>
              </div>

              {/* Main Workspace Layout (Left Rail + Content) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[520px]">
                {/* C. Left Navigation Rail & Wasm Memory Hygiene Meter (Desktop) */}
                <aside className="hidden lg:flex lg:col-span-3 border-r border-[#242528] bg-[#050505]/70 p-5 flex-col justify-between gap-8">
                  {/* Sidebar Nodes */}
                  <div className="space-y-6">
                    <div className="text-[10px] font-mono tracking-widest text-[#85868B] uppercase">
                      VAULT HIERARCHY
                    </div>
                    <nav className="space-y-1.5 text-xs font-mono">
                      {[
                        { key: 'vfs', label: 'Monolithic VFS', icon: Folder, badge: '6 FILES' },
                        { key: 'shared', label: 'Ed25519 Verified Shares', icon: UserCheck, badge: '1 SHARE' },
                        { key: 'recent', label: 'Local Vector History', icon: Activity, badge: '<5MS' },
                        { key: 'passkey', label: 'WebAuthn Passkey-Gated', icon: Fingerprint, badge: 'LOCKED' },
                        { key: 'audit', label: 'Cryptographic Audit Log', icon: ShieldCheck, badge: 'VERIFIED' }
                      ].map((tab) => {
                        const Icon = tab.icon;
                        const active = driveNavTab === tab.key;
                        return (
                          <button
                            key={tab.key}
                            type="button"
                            onClick={() => {
                              setDriveNavTab(tab.key as any);
                              playUiChime(550);
                            }}
                            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer text-left ${
                              active
                                ? 'bg-[#111214] text-[#F2F0EB] border border-[#C5C6CB]/30 font-semibold'
                                : 'text-[#85868B] hover:text-[#F2F0EB] hover:bg-[#111214]/50'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 truncate">
                              <Icon className="w-4 h-4 shrink-0 text-[#C5C6CB]" />
                              <span className="truncate">{tab.label}</span>
                            </div>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#242528] text-[#A7A7AD]">
                              {tab.badge}
                            </span>
                          </button>
                        );
                      })}
                    </nav>

                    {/* Quick Folder Chips in Client View */}
                    {veilMode === 'client' ? (
                      <div className="pt-4 border-t border-[#242528] space-y-2">
                        <span className="text-[10px] font-mono text-[#85868B] uppercase block">
                          ENCRYPTED FOLDERS:
                        </span>
                        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-[#A7A7AD]">
                          <div className="p-2 rounded-lg bg-[#111214] border border-[#242528] flex items-center gap-1.5 truncate">
                            <Folder className="w-3.5 h-3.5 text-[#C5C6CB] shrink-0" />
                            <span className="truncate">Patent Docs</span>
                          </div>
                          <div className="p-2 rounded-lg bg-[#111214] border border-[#242528] flex items-center gap-1.5 truncate">
                            <Folder className="w-3.5 h-3.5 text-[#C5C6CB] shrink-0" />
                            <span className="truncate">Finances</span>
                          </div>
                          <div className="p-2 rounded-lg bg-[#111214] border border-[#242528] flex items-center gap-1.5 truncate">
                            <Folder className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span className="truncate">Cluster Keys</span>
                          </div>
                          <div className="p-2 rounded-lg bg-[#111214] border border-[#242528] flex items-center gap-1.5 truncate">
                            <Folder className="w-3.5 h-3.5 text-[#C5C6CB] shrink-0" />
                            <span className="truncate">AI Tensors</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="pt-4 border-t border-red-500/20 space-y-2 text-xs font-mono text-red-300">
                        <span className="text-[10px] text-red-400 uppercase block font-semibold">
                          FLAT S3 BUCKET CONTAINER:
                        </span>
                        <p className="text-[11px] text-red-200/80 leading-relaxed">
                          Zero directory trees exist on disk. S3 contains exclusively raw UUID chunk keys with identical MIME type.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Storage Obfuscation & Wasm Memory Hygiene Meter (Bottom Left) */}
                  <div className="p-4 rounded-2xl bg-[#111214] border border-[#242528] space-y-3 font-mono">
                    <div className="text-[10px] text-[#85868B] uppercase flex items-center justify-between">
                      <span>STORAGE OBFUSCATION</span>
                      <span className="text-[#C5C6CB]">PADMÉ ≤12%</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-[#85868B]">Logical Size:</span>
                        <span className="text-[#F2F0EB]">142.4 GB</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-[#85868B]">Uniform 4MB Wire:</span>
                        <span className="text-[#C5C6CB] font-semibold">156.0 GB (9.5%)</span>
                      </div>
                      <div className="w-full bg-[#242528] h-1.5 rounded-full overflow-hidden mt-1">
                        <div className="bg-gradient-to-r from-[#C5C6CB] to-[#F2F0EB] h-full w-[68%]" />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#242528]">
                      <div className="text-[9px] text-[#85868B] uppercase mb-2">
                        WASM LINEAR HEAP: <span className="text-emerald-400">SCRUBBED (0 KEYS)</span>
                      </div>
                      <button
                        type="button"
                        onClick={triggerZeroizeMemory}
                        className="w-full py-2 px-3 rounded-lg border border-[#C5C6CB]/20 bg-[#050505] hover:bg-[#242528] hover:border-[#F2F0EB] text-[10px] tracking-wider uppercase text-[#F2F0EB] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <RefreshCw className="w-3 h-3 text-[#C5C6CB]" />
                        <span>Zeroize Wasm Memory</span>
                      </button>
                    </div>
                  </div>
                </aside>

                {/* Right Area: D. Quick Access Row & E. Custody Table */}
                <div className="lg:col-span-9 p-5 sm:p-7 flex flex-col justify-between gap-8">
                  {/* D. "Quick Access" Row: 4 Cryptographic Cards */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-[10px] font-mono tracking-widest text-[#85868B] uppercase">
                        {veilMode === 'client' ? 'PRE-ENCRYPTION QUICK ACCESS' : 'UNTRUSTED S3 CHUNK REPOSITORY'}
                      </div>
                      <span className="text-[10px] font-mono text-[#85868B]">
                        {veilMode === 'client' ? '4 HIGH-INDEXED FILES' : 'OPAQUE BLIND OBJECTS'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                      {/* Card 1 */}
                      <div
                        onMouseEnter={() => setHoveredFileId('doc-1')}
                        onMouseLeave={() => setHoveredFileId(null)}
                        className={`p-4 rounded-2xl glass-panel border transition-all duration-300 flex flex-col justify-between ${
                          hoveredFileId === 'doc-1' ? 'border-[#F2F0EB] shadow-[0_0_25px_rgba(242,240,235,0.2)]' : 'border-[#242528]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <FileText className="w-5 h-5 text-[#C5C6CB]" />
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#111214] text-[#C5C6CB] border border-[#242528]">
                              {veilMode === 'client' ? '384-DIM INDEXED' : 'UUID CHUNK'}
                            </span>
                          </div>
                          <h4 className="font-['Cinzel',serif] text-sm text-[#F2F0EB] truncate mb-1">
                            {veilMode === 'client' ? 'Zero-Vault Patent.pdf' : '0x7e4a...92bc.bin'}
                          </h4>
                          <p className="text-[11px] font-mono text-[#85868B] line-clamp-2 mb-3">
                            {veilMode === 'client'
                              ? '4 × 4.0 MB STREAM AEAD · Cosine Match 0.98'
                              : 'application/octet-stream · 16.00 MB Blind Wire'}
                          </p>
                        </div>
                        <div className="pt-2 border-t border-[#242528] text-[10px] font-mono text-[#A7A7AD] flex justify-between">
                          <span>14.2 MB Logical</span>
                          <span>Verified</span>
                        </div>
                      </div>

                      {/* Card 2 */}
                      <div
                        onMouseEnter={() => setHoveredFileId('doc-2')}
                        onMouseLeave={() => setHoveredFileId(null)}
                        className={`p-4 rounded-2xl glass-panel border transition-all duration-300 flex flex-col justify-between ${
                          hoveredFileId === 'doc-2' ? 'border-[#F2F0EB] shadow-[0_0_25px_rgba(242,240,235,0.2)]' : 'border-[#242528]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <FileSpreadsheet className="w-5 h-5 text-[#C5C6CB]" />
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#111214] text-[#C5C6CB] border border-[#242528]">
                              {veilMode === 'client' ? 'PADMÉ MASKED' : 'UUID CHUNK'}
                            </span>
                          </div>
                          <h4 className="font-['Cinzel',serif] text-sm text-[#F2F0EB] truncate mb-1">
                            {veilMode === 'client' ? 'Azure Costs.xlsx' : '0x3c81...f51a.bin'}
                          </h4>
                          <p className="text-[11px] font-mono text-[#85868B] line-clamp-2 mb-3">
                            {veilMode === 'client'
                              ? 'True Size Hidden (1.4 MB → Uniform 4.0 MB Block)'
                              : 'application/octet-stream · 4.00 MB Blind Wire'}
                          </p>
                        </div>
                        <div className="pt-2 border-t border-[#242528] text-[10px] font-mono text-[#A7A7AD] flex justify-between">
                          <span>1.4 MB Logical</span>
                          <span>≤12% Cap</span>
                        </div>
                      </div>

                      {/* Card 3 (High-Entropy Secret Key) */}
                      <div
                        onClick={() => triggerPasskeyAuth(driveItems[2])}
                        onMouseEnter={() => setHoveredFileId('doc-3')}
                        onMouseLeave={() => setHoveredFileId(null)}
                        className={`p-4 rounded-2xl glass-panel border transition-all duration-300 flex flex-col justify-between cursor-pointer group ${
                          hoveredFileId === 'doc-3' ? 'border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.2)]' : 'border-[#242528]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <FileCode className="w-5 h-5 text-amber-400" />
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-950/40 text-amber-300 border border-amber-500/30">
                              {veilMode === 'client' ? '⚠️ DLP LOCKED' : 'UUID CHUNK'}
                            </span>
                          </div>
                          <h4 className="font-['Cinzel',serif] text-sm text-[#F2F0EB] truncate mb-1 flex items-center gap-1.5">
                            <span>{veilMode === 'client' ? 'Cluster_Keys.env' : '0x91d4...a60e.bin'}</span>
                            <Lock className="w-3 h-3 text-amber-400" />
                          </h4>
                          <p className="text-[11px] font-mono text-amber-300/80 line-clamp-2 mb-3">
                            {veilMode === 'client'
                              ? 'SSH & AWS Keys Detected Pre-Upload — Touch for Passkey'
                              : 'application/octet-stream · 4.00 MB Blind Wire'}
                          </p>
                        </div>
                        <div className="pt-2 border-t border-[#242528] text-[10px] font-mono text-amber-400 flex justify-between items-center">
                          <span>WebAuthn Gated</span>
                          <span className="group-hover:translate-x-0.5 transition-transform">Unlock →</span>
                        </div>
                      </div>

                      {/* Card 4 */}
                      <div
                        onMouseEnter={() => setHoveredFileId('doc-4')}
                        onMouseLeave={() => setHoveredFileId(null)}
                        className={`p-4 rounded-2xl glass-panel border transition-all duration-300 flex flex-col justify-between ${
                          hoveredFileId === 'doc-4' ? 'border-[#F2F0EB] shadow-[0_0_25px_rgba(242,240,235,0.2)]' : 'border-[#242528]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <Layers className="w-5 h-5 text-[#C5C6CB]" />
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#111214] text-[#C5C6CB] border border-[#242528]">
                              {veilMode === 'client' ? 'ED25519 VERIFIED' : 'UUID CHUNK'}
                            </span>
                          </div>
                          <h4 className="font-['Cinzel',serif] text-sm text-[#F2F0EB] truncate mb-1">
                            {veilMode === 'client' ? 'Threat Audit.pptx' : '0x0f22...bd77.bin'}
                          </h4>
                          <p className="text-[11px] font-mono text-[#85868B] line-clamp-2 mb-3">
                            {veilMode === 'client'
                              ? 'Authenticated Key Wrapping Active · Ed25519 Nonce'
                              : 'application/octet-stream · 8.00 MB Blind Wire'}
                          </p>
                        </div>
                        <div className="pt-2 border-t border-[#242528] text-[10px] font-mono text-[#A7A7AD] flex justify-between">
                          <span>6.8 MB Logical</span>
                          <span>2 Chunks</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* E. Main File & Folder List: Cryptographic Custody Table */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="text-[10px] font-mono tracking-widest text-[#85868B] uppercase">
                        {veilMode === 'client' ? 'CRYPTOGRAPHIC CUSTODY TABLE' : 'RAW UNTRUSTED S3 BUCKET VIEW'}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="sm:hidden text-[9px] font-mono text-[#85868B]">Swipe horizontally →</span>
                        <span className="text-[10px] font-mono text-[#C5C6CB]">
                          {driveItems.length} OBJECTS
                        </span>
                      </div>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-[#242528] bg-[#050505]/60">
                      <table className="w-full min-w-[620px] text-left text-xs font-mono">
                        <thead>
                          <tr className="border-b border-[#242528] bg-[#111214]/80 text-[10px] text-[#85868B] uppercase tracking-wider">
                            <th className="py-3 px-4 font-medium">
                              {veilMode === 'client' ? 'Logical Name (VFS Encrypted)' : 'Random UUID v4 S3 Key'}
                            </th>
                            <th className="py-3 px-4 font-medium">
                              {veilMode === 'client' ? 'Key Hierarchy' : 'Cloud Access Control'}
                            </th>
                            <th className="py-3 px-4 font-medium">
                              {veilMode === 'client' ? 'Stream Integrity' : 'Object Signature'}
                            </th>
                            <th className="py-3 px-4 font-medium">
                              {veilMode === 'client' ? 'Logical Size → Wire Block' : 'Uniform Block Overhead'}
                            </th>
                            <th className="py-3 px-4 text-right font-medium">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#242528]/60">
                          {driveItems.map((item) => {
                            const isHovered = hoveredFileId === item.id;
                            return (
                              <tr
                                key={item.id}
                                onMouseEnter={() => {
                                  setHoveredFileId(item.id);
                                  threeCtrlRef.current.targetHoverIntensity = 0.8;
                                }}
                                onMouseLeave={() => {
                                  setHoveredFileId(null);
                                  threeCtrlRef.current.targetHoverIntensity = 0;
                                }}
                                className={`transition-colors ${
                                  isHovered ? 'bg-[#111214] text-[#F2F0EB]' : 'hover:bg-[#111214]/40 text-[#A7A7AD]'
                                }`}
                              >
                                <td className="py-3.5 px-4 font-medium text-[#F2F0EB] flex items-center gap-2.5 truncate max-w-[280px]">
                                  {veilMode === 'client' ? (
                                    <>
                                      <FileText className="w-4 h-4 text-[#C5C6CB] shrink-0" />
                                      <span className="truncate">{item.logicalName}</span>
                                    </>
                                  ) : (
                                    <>
                                      <Box className="w-4 h-4 text-red-400 shrink-0" />
                                      <span className="truncate text-red-300 font-mono">{item.serverUuid}</span>
                                    </>
                                  )}
                                </td>

                                <td className="py-3.5 px-4 text-[11px]">
                                  {veilMode === 'client' ? (
                                    <span className="text-[#C5C6CB]">{item.keyHierarchy}</span>
                                  ) : (
                                    <span className="text-red-400/80">OPAQUE OCTET // ZERO KEYS</span>
                                  )}
                                </td>

                                <td className="py-3.5 px-4 text-[11px]">
                                  {veilMode === 'client' ? (
                                    <span className="text-emerald-400">{item.streamIntegrity}</span>
                                  ) : (
                                    <span className="text-[#85868B]">SHA256 (UNTRUSTED S3)</span>
                                  )}
                                </td>

                                <td className="py-3.5 px-4 text-[11px]">
                                  {veilMode === 'client' ? (
                                    <span className="text-[#F2F0EB]">{item.wireSize}</span>
                                  ) : (
                                    <span className="text-red-300">4.00 MB UNIFORM BLOB</span>
                                  )}
                                </td>

                                <td className="py-3.5 px-4 text-right">
                                  {item.sensitivity === 'high_entropy' && veilMode === 'client' ? (
                                    <button
                                      type="button"
                                      onClick={() => triggerPasskeyAuth(item)}
                                      className="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition-colors text-[10px]"
                                    >
                                      Passkey Unlock
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => triggerIngestModal()}
                                      className="px-2.5 py-1 rounded-md bg-[#242528] text-[#C5C6CB] hover:text-[#F2F0EB] hover:bg-[#111214] transition-colors text-[10px]"
                                    >
                                      X-Ray Slices
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 4. SECTION 1: THE INDUSTRY DEADLOCK QUADRANT              */}
        {/* ========================================================= */}
        <section id="deadlock" className="relative py-28 px-4 sm:px-8 lg:px-14">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 text-xs text-[#85868B] font-mono tracking-widest mb-3">
                <span>01 // THE INDUSTRY DEADLOCK</span>
                <span aria-hidden="true">/</span>
                <span>SEARCHABILITY VS. PRIVACY</span>
              </div>
              <h2 className="font-['Cinzel',serif] text-3xl sm:text-5xl text-[#F2F0EB] tracking-tight mb-4">
                Surveillance vs. Usability <span className="silver-gradient-text">Ends Here</span>
              </h2>
              <p className="text-sm sm:text-base text-[#A7A7AD] font-light leading-relaxed">
                For a decade, cloud storage forced an impossible compromise. Surveillance clouds give you search
                while holding your keys. Traditional vaults encrypt client-side but leave you with dumb black boxes.
                AVARAN executes semantic indexing inside browser Web Workers before encryption.
              </p>
            </div>

            {/* Interactive 2D Coordinate Quadrant */}
            <div className="p-4 sm:p-8 lg:p-12 rounded-3xl glass-panel border border-[#C5C6CB]/20 shadow-[0_20px_60px_rgba(0,0,0,0.85)]">
              {/* Mobile Quick Selector */}
              <div className="flex sm:hidden items-center gap-1.5 p-1 bg-[#111214] rounded-xl border border-[#242528] mb-5 overflow-x-auto">
                {[
                  { id: 'avaran', label: 'AVARAN (Apex)' },
                  { id: 'cryptomator', label: 'Traditional' },
                  { id: 'google_drive', label: 'Surveillance' }
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setSelectedService(s.id as any);
                      playUiChime(550);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-mono whitespace-nowrap shrink-0 transition-all ${
                      selectedService === s.id ? 'bg-[#F2F0EB] text-[#050505] font-semibold' : 'text-[#85868B]'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                {/* 2D Plot Graphic */}
                <div className="lg:col-span-7 relative aspect-square max-w-[500px] mx-auto w-full p-3 sm:p-6 border border-[#242528] rounded-2xl bg-[#050505]/80 overflow-hidden">
                  {/* Grid Lines */}
                  <div className="absolute inset-3 sm:inset-6 border border-[#242528] flex flex-col justify-between pointer-events-none">
                    <div className="h-[1px] w-full bg-[#242528]" />
                    <div className="h-[1px] w-full bg-[#242528]" />
                    <div className="h-[1px] w-full bg-[#242528]" />
                  </div>
                  <div className="absolute inset-3 sm:inset-6 flex justify-between pointer-events-none">
                    <div className="w-[1px] h-full bg-[#242528]" />
                    <div className="w-[1px] h-full bg-[#242528]" />
                    <div className="w-[1px] h-full bg-[#242528]" />
                  </div>

                  {/* Axis Labels */}
                  <div className="absolute top-2 left-4 sm:left-6 text-[8px] sm:text-[10px] font-mono text-[#85868B] uppercase">
                    ↑ 100% ZERO-KNOWLEDGE
                  </div>
                  <div className="absolute bottom-2 right-4 sm:right-6 text-[8px] sm:text-[10px] font-mono text-[#85868B] uppercase">
                    SEARCHABILITY →
                  </div>

                  {/* Golden Apex Zone: Top Right */}
                  <div className="absolute top-3 right-3 sm:top-6 sm:right-6 w-[54%] sm:w-1/2 h-[54%] sm:h-1/2 rounded-xl sm:rounded-2xl bg-gradient-to-bl from-[#C5C6CB]/15 via-[#F2F0EB]/5 to-transparent border border-[#F2F0EB]/30 flex flex-col justify-between p-2.5 sm:p-4 shadow-[0_0_40px_rgba(242,240,235,0.15)]">
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] sm:text-[10px] font-mono text-[#F2F0EB] font-bold">SOVEREIGN GOLDEN APEX</span>
                      <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F2F0EB]" />
                    </div>

                    {/* AVARAN Target Node */}
                    <button
                      type="button"
                      onClick={() => setSelectedService('avaran')}
                      className={`p-2 sm:p-3 rounded-lg sm:rounded-xl border text-left transition-all cursor-pointer ${
                        selectedService === 'avaran'
                          ? 'bg-[#F2F0EB] text-[#050505] border-[#F2F0EB] shadow-[0_0_25px_rgba(242,240,235,0.5)]'
                          : 'bg-[#111214] text-[#F2F0EB] border-[#C5C6CB]/40'
                      }`}
                    >
                      <div className="font-['Cinzel',serif] text-xs sm:text-sm font-semibold">AVARAN Zero-Vault</div>
                      <div className="text-[8px] sm:text-[10px] font-mono mt-0.5 opacity-90">100% Blind · &lt; 5ms Search</div>
                    </button>
                  </div>

                  {/* Traditional Vaults Node: Top Left */}
                  <div className="absolute top-4 left-3 sm:top-12 sm:left-10 max-w-[40%] sm:max-w-none">
                    <button
                      type="button"
                      onClick={() => setSelectedService('cryptomator')}
                      className={`p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl border text-left transition-all cursor-pointer ${
                        selectedService === 'cryptomator'
                          ? 'bg-[#242528] text-[#F2F0EB] border-[#C5C6CB]'
                          : 'bg-[#111214]/80 text-[#85868B] border-[#242528]'
                      }`}
                    >
                      <div className="text-[10px] sm:text-xs font-mono font-semibold truncate">Traditional Vaults</div>
                      <div className="text-[8px] sm:text-[9px] font-mono truncate">Cryptomator / MEGA</div>
                      <div className="text-[8px] sm:text-[9px] text-amber-400 font-mono mt-0.5 truncate">0 Search</div>
                    </button>
                  </div>

                  {/* Surveillance Clouds Node: Bottom Right */}
                  <div className="absolute bottom-4 right-3 sm:bottom-12 sm:right-12 max-w-[40%] sm:max-w-none">
                    <button
                      type="button"
                      onClick={() => setSelectedService('google_drive')}
                      className={`p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl border text-left transition-all cursor-pointer ${
                        selectedService === 'google_drive'
                          ? 'bg-rose-950/40 text-rose-200 border-rose-500/40'
                          : 'bg-[#111214]/80 text-[#85868B] border-[#242528]'
                      }`}
                    >
                      <div className="text-[10px] sm:text-xs font-mono font-semibold truncate">Surveillance Clouds</div>
                      <div className="text-[8px] sm:text-[9px] font-mono truncate">Drive / Dropbox</div>
                      <div className="text-[8px] sm:text-[9px] text-rose-400 font-mono mt-0.5 truncate">0 Privacy</div>
                    </button>
                  </div>
                </div>

                {/* Quadrant Detail Inspector */}
                <div className="lg:col-span-5 space-y-5">
                  <div className="text-[10px] font-mono tracking-widest text-[#85868B] uppercase">
                    PARADIGM INSPECTOR
                  </div>

                  {selectedService === 'avaran' && (
                    <div className="p-6 rounded-2xl bg-[#111214] border border-[#F2F0EB]/40 space-y-4">
                      <div className="flex items-center gap-2.5 text-[#F2F0EB]">
                        <ShieldCheck className="w-5 h-5 text-emerald-400" />
                        <h4 className="font-['Cinzel',serif] text-xl">AVARAN // ZERO-VAULT</h4>
                      </div>
                      <p className="text-xs text-[#A7A7AD] leading-relaxed font-light">
                        Executes dense 384-dimensional ONNX embeddings inside browser Web Workers before chunking into
                        uniform 4 MB STREAM AEAD blocks with PADMÉ padding. You get the instant natural search of Google
                        Drive with the mathematical blindness of an air-gapped cold drive.
                      </p>
                      <div className="space-y-1.5 font-mono text-[11px]">
                        <div className="flex justify-between text-[#85868B]">
                          <span>Client-Side Keys:</span>
                          <span className="text-emerald-400 font-semibold">Yes (Argon2id + HKDF in Wasm)</span>
                        </div>
                        <div className="flex justify-between text-[#85868B]">
                          <span>Server Plaintext Access:</span>
                          <span className="text-emerald-400 font-semibold">0.00% (Blind Octet Pipe)</span>
                        </div>
                        <div className="flex justify-between text-[#85868B]">
                          <span>Semantic Search Speed:</span>
                          <span className="text-emerald-400 font-semibold">&lt; 5 ms (Cosine in Wasm)</span>
                        </div>
                        <div className="flex justify-between text-[#85868B]">
                          <span>Pre-Upload Secret Scan:</span>
                          <span className="text-emerald-400 font-semibold">Shannon Entropy + WebAuthn</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedService === 'google_drive' && (
                    <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-4">
                      <div className="flex items-center gap-2.5 text-rose-300">
                        <AlertTriangle className="w-5 h-5 text-rose-400" />
                        <h4 className="font-['Cinzel',serif] text-xl">Surveillance Clouds (Google Drive / OneDrive)</h4>
                      </div>
                      <p className="text-xs text-[#A7A7AD] leading-relaxed font-light">
                        Excellent natural search and team features, but the provider holds encryption keys on the server.
                        All files and vector queries are scanned in cleartext for AI training and advertising, exposing you
                        to cloud vendor data breaches and subpoenas.
                      </p>
                      <div className="space-y-1.5 font-mono text-[11px]">
                        <div className="flex justify-between text-[#85868B]">
                          <span>Client-Side Keys:</span>
                          <span className="text-rose-400">No (Provider holds keys)</span>
                        </div>
                        <div className="flex justify-between text-[#85868B]">
                          <span>Server Plaintext Access:</span>
                          <span className="text-rose-400">100% (Scanned for AI / Ads)</span>
                        </div>
                        <div className="flex justify-between text-[#85868B]">
                          <span>Search Location:</span>
                          <span className="text-rose-400">Server Cleartext Database</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedService === 'cryptomator' && (
                    <div className="p-6 rounded-2xl bg-[#111214] border border-amber-500/30 space-y-4">
                      <div className="flex items-center gap-2.5 text-amber-300">
                        <Lock className="w-5 h-5 text-amber-400" />
                        <h4 className="font-['Cinzel',serif] text-xl">Traditional Vaults (Cryptomator / MEGA)</h4>
                      </div>
                      <p className="text-xs text-[#A7A7AD] leading-relaxed font-light">
                        Encrypts files client-side, but transforms your storage into a dumb black box. Zero full-text or
                        semantic search capabilities, no pre-encryption DLP, and leaks file sizes and directory structures
                        via non-padded blocks.
                      </p>
                      <div className="space-y-1.5 font-mono text-[11px]">
                        <div className="flex justify-between text-[#85868B]">
                          <span>Client-Side Keys:</span>
                          <span className="text-emerald-400">Yes</span>
                        </div>
                        <div className="flex justify-between text-[#85868B]">
                          <span>Semantic Vector Search:</span>
                          <span className="text-rose-400">No (Dumb Storage Blob)</span>
                        </div>
                        <div className="flex justify-between text-[#85868B]">
                          <span>Size Obfuscation:</span>
                          <span className="text-amber-400">Partial (Leaks File Sizes)</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 5. SECTION 2: 5-POINT THREAT & DEFENSE MATRIX             */}
        {/* ========================================================= */}
        <section id="defense" className="relative py-28 px-4 sm:px-8 lg:px-14">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 text-xs text-[#85868B] font-mono tracking-widest mb-3">
                <span>02 // THREAT MODELING &amp; DEFENSE MATRIX</span>
                <span aria-hidden="true">/</span>
                <span>CRYPTOGRAPHIC AUDIT</span>
              </div>
              <h2 className="font-['Cinzel',serif] text-3xl sm:text-5xl text-[#F2F0EB] tracking-tight mb-4">
                Engineered Against <span className="silver-gradient-text">Real-World Vault Failures</span>
              </h2>
              <p className="text-sm sm:text-base text-[#A7A7AD] font-light">
                How AVARAN neutralizes the five fatal vulnerabilities found in legacy encrypted clouds and local AI tools.
              </p>
            </div>

            {/* Defense Tab Navigation */}
            <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
              {[
                { id: 1, label: '01. Key Wrapping (MEGA Flaw)' },
                { id: 2, label: '02. Chunk Reordering Attacks' },
                { id: 3, label: '03. VFS Metadata Leakage' },
                { id: 4, label: '04. V8 Heap Key Lingering' },
                { id: 5, label: '05. The Localhost AI Trap' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveDefenseTab(tab.id);
                    playUiChime(620);
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    activeDefenseTab === tab.id
                      ? 'bg-[#F2F0EB] text-[#050505] font-semibold shadow-[0_0_20px_rgba(242,240,235,0.3)]'
                      : 'border border-[#C5C6CB]/20 bg-[#111214]/60 text-[#A7A7AD] hover:text-[#F2F0EB]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Threat Card Detail */}
            <div className="max-w-4xl mx-auto p-8 sm:p-12 rounded-3xl glass-panel border border-[#C5C6CB]/25 shadow-[0_20px_60px_rgba(0,0,0,0.9)]">
              {activeDefenseTab === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-rose-400 uppercase tracking-widest flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4" /> THREAT: UNAUTHENTICATED KEY WRAPPING
                    </span>
                    <span className="text-[#85868B]">REFERENCE: THE MEGA EXPLOIT</span>
                  </div>
                  <h3 className="font-['Cinzel',serif] text-2xl sm:text-3xl text-[#F2F0EB]">
                    Defeating Unauthenticated Key Wrapping
                  </h3>
                  <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/20 text-xs sm:text-sm text-[#A7A7AD] leading-relaxed">
                    <strong className="text-rose-300">The Fatal Vulnerability:</strong> Encrypting master keys without
                    AEAD allows a compromised or malicious server to tamper with ciphertext bits and trick the client into
                    acting as a decryption oracle, eventually recovering the user&apos;s Master Key in full.
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs sm:text-sm text-[#A7A7AD] leading-relaxed">
                    <strong className="text-emerald-300">The AVARAN Defense:</strong> Memory-hard Argon2id key derivation in
                    Wasm followed by HKDF-SHA256 into isolated Key_Auth and Key_KEK. Authentication utilizes Ed25519
                    challenge-response on one-time server nonces and strict authenticated key wrapping—rendering oracle
                    manipulation mathematically impossible.
                  </div>
                </div>
              )}

              {activeDefenseTab === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-rose-400 uppercase tracking-widest flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4" /> THREAT: CHUNK REORDERING &amp; TRUNCATION
                    </span>
                    <span className="text-[#85868B]">REFERENCE: STREAM CIPHER SLICING</span>
                  </div>
                  <h3 className="font-['Cinzel',serif] text-2xl sm:text-3xl text-[#F2F0EB]">
                    Preventing Chunk Reordering &amp; Truncation Attacks
                  </h3>
                  <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/20 text-xs sm:text-sm text-[#A7A7AD] leading-relaxed">
                    <strong className="text-rose-300">The Fatal Vulnerability:</strong> Slicing large files into encrypted
                    chunks without sequential nonces or end-of-stream tags allows an adversary on the server to silently drop
                    the final chunk or swap blocks between different files undetected.
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs sm:text-sm text-[#A7A7AD] leading-relaxed">
                    <strong className="text-emerald-300">The AVARAN Defense:</strong> STREAM AEAD encryption enforcing strict
                    counter nonces and Associated Authenticated Data (AAD) cryptographically binding file_id, chunk_index,
                    and is_last_chunk flag. Any missing, duplicated, or rearranged block causes immediate cryptographic signature failure.
                  </div>
                </div>
              )}

              {activeDefenseTab === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-rose-400 uppercase tracking-widest flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4" /> THREAT: VFS METADATA &amp; SIZE LEAKAGE
                    </span>
                    <span className="text-[#85868B]">REFERENCE: THE CRYPTOMATOR FLAW</span>
                  </div>
                  <h3 className="font-['Cinzel',serif] text-2xl sm:text-3xl text-[#F2F0EB]">
                    Eliminating VFS Metadata &amp; Size Leakage
                  </h3>
                  <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/20 text-xs sm:text-sm text-[#A7A7AD] leading-relaxed">
                    <strong className="text-rose-300">The Fatal Vulnerability:</strong> Encrypting filenames alone fails
                    when a 14.2 MB file uploads as a 14.2 MB blob. An adversary analyzing chunk sizes, directory depths,
                    and modification timestamps can correlate files with known document templates or media releases.
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs sm:text-sm text-[#A7A7AD] leading-relaxed">
                    <strong className="text-emerald-300">The AVARAN Defense:</strong> Complete decoupling of the VFS index
                    from storage plus PADMÉ padding into uniform 4 MB blocks (capped at ≤12% overhead). An adversary on the
                    cloud pipe sees only uniform 4 MB chunks with random UUIDs—making 100 small PDFs completely indistinguishable
                    from a single video stream.
                  </div>
                </div>
              )}

              {activeDefenseTab === 4 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-rose-400 uppercase tracking-widest flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4" /> THREAT: V8 HEAP KEY LINGERING
                    </span>
                    <span className="text-[#85868B]">REFERENCE: JAVASCRIPT GARBAGE COLLECTION</span>
                  </div>
                  <h3 className="font-['Cinzel',serif] text-2xl sm:text-3xl text-[#F2F0EB]">
                    Eradicating V8 Heap Key Lingering
                  </h3>
                  <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/20 text-xs sm:text-sm text-[#A7A7AD] leading-relaxed">
                    <strong className="text-rose-300">The Fatal Vulnerability:</strong> Standard JavaScript Web Crypto
                    leaves plaintext buffers and keys lingering indefinitely in the V8 garbage-collected heap, where memory
                    dumps, extensions, or browser heap exploits can recover sensitive master keys.
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs sm:text-sm text-[#A7A7AD] leading-relaxed">
                    <strong className="text-emerald-300">The AVARAN Defense:</strong> All cryptographic operations and vector
                    cosine math run strictly inside C/Wasm linear memory and are wiped immediately via{' '}
                    <code className="text-[#F2F0EB] font-mono">explicit_bzero</code>. No cryptographic keys ever enter the V8 GC heap.
                  </div>
                </div>
              )}

              {activeDefenseTab === 5 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-rose-400 uppercase tracking-widest flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4" /> THREAT: THE LOCALHOST AI TRAP (WHY OLLAMA FAILS)
                    </span>
                    <span className="text-[#85868B]">REFERENCE: LOCALHOST:11434 BROWSER ESCAPES</span>
                  </div>
                  <h3 className="font-['Cinzel',serif] text-2xl sm:text-3xl text-[#F2F0EB]">
                    Neutralizing Local AI Cross-Tab Hijacking
                  </h3>
                  <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/20 text-xs sm:text-sm text-[#A7A7AD] leading-relaxed">
                    <strong className="text-rose-300">The Fatal Vulnerability:</strong> Local AI storage tools that route
                    files through <code className="text-rose-200">localhost:11434</code> (with{' '}
                    <code className="text-rose-200">OLLAMA_ORIGINS=*</code>) completely destroy browser sandbox isolation.
                    Any malicious background webpage can send unauthorized fetch requests to localhost and exfiltrate decrypted data.
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs sm:text-sm text-[#A7A7AD] leading-relaxed">
                    <strong className="text-emerald-300">The AVARAN Defense:</strong> Zero open localhost ports. All AI inference
                    and vector embeddings execute strictly inside isolated browser Web Workers via WebGPU/ONNX runtimes,
                    maintaining full browser process sandbox guarantees.
                  </div>
                </div>
              )}

              {/* Traversal Controls */}
              <div className="pt-6 border-t border-[#C5C6CB]/15 flex items-center justify-between text-xs font-mono">
                <button
                  type="button"
                  onClick={() => {
                    const prev = activeDefenseTab <= 1 ? 5 : activeDefenseTab - 1;
                    setActiveDefenseTab(prev);
                    playUiChime(550 + prev * 40);
                  }}
                  className="inline-flex items-center gap-1.5 uppercase text-[#A7A7AD] hover:text-[#F2F0EB] transition-colors cursor-pointer group"
                >
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                  <span>Previous Threat</span>
                </button>
                <span className="text-[10px] text-[#85868B]">
                  DEFENSE 0{activeDefenseTab} / 05
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const next = activeDefenseTab >= 5 ? 1 : activeDefenseTab + 1;
                    setActiveDefenseTab(next);
                    playUiChime(550 + next * 40);
                  }}
                  className="inline-flex items-center gap-1.5 uppercase text-[#A7A7AD] hover:text-[#F2F0EB] transition-colors cursor-pointer group"
                >
                  <span>Next Threat</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 6. SECTION 3: STEP BEHIND THE VEIL (FINAL CTA)            */}
        {/* ========================================================= */}
        <section
          id="vault"
          className="relative min-h-[90vh] w-full flex items-center justify-center py-28 px-4 sm:px-8 lg:px-14 overflow-hidden"
        >
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
            <svg className="w-[600px] h-[600px] max-w-none" viewBox="0 0 600 600">
              <circle cx="300" cy="300" r="240" fill="none" stroke="rgba(242,240,235,0.28)" strokeWidth="0.9" />
              <circle cx="300" cy="300" r="195" fill="none" stroke="rgba(197,198,203,0.22)" strokeWidth="0.75" strokeDasharray="5 9" className="origin-center spin-slow" />
              <ellipse cx="300" cy="300" rx="250" ry="95" fill="none" stroke="rgba(242,240,235,0.32)" strokeWidth="1" transform="rotate(-28 300 300)" />
            </svg>
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10 w-full">
            <div className="w-20 h-20 mx-auto mb-8 rounded-full border border-[#C5C6CB]/30 bg-[#050505]/90 flex items-center justify-center shadow-[0_0_50px_rgba(242,240,235,0.2)]">
              <img src={AVARAN_LOGO} alt="AVARAN Emblem" className="w-16 h-16 object-contain logo-blend" />
            </div>

            <div className="text-[11px] font-mono tracking-[0.38em] uppercase text-[#C5C6CB] mb-5">
              STEP BEHIND THE VEIL
            </div>

            <h2 className="font-['Cinzel',serif] text-4xl sm:text-6xl lg:text-7xl text-[#F2F0EB] tracking-tight leading-[1.1] mb-6">
              Your Data. <br className="hidden sm:inline" />
              <span className="silver-gradient-text">Mathematically Invisible.</span>
            </h2>

            <p className="text-[#A7A7AD] text-base sm:text-xl font-light max-w-2xl mx-auto mb-10">
              Stop choosing between cloud intelligence and cryptographic sovereignty. Initialize an isolated AVARAN
              Zero-Vault cluster with client-side WebGPU search and Wasm AEAD protection.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={openVaultModal}
                onMouseEnter={() => setCursorExpanded(true)}
                onMouseLeave={() => setCursorExpanded(false)}
                className="group relative inline-flex items-center gap-4 px-10 py-5 rounded-full bg-gradient-to-r from-[#F2F0EB] via-[#C5C6CB] to-[#F2F0EB] text-[#050505] font-semibold text-xs sm:text-sm tracking-[0.24em] uppercase shadow-[0_0_50px_rgba(242,240,235,0.35)] hover:shadow-[0_0_75px_rgba(242,240,235,0.65)] transition-all cursor-pointer"
              >
                <span>Initialize Sovereign Vault</span>
                <Sparkles className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" />
              </button>

              <button
                type="button"
                onClick={triggerIngestModal}
                onMouseEnter={() => setCursorExpanded(true)}
                onMouseLeave={() => setCursorExpanded(false)}
                className="inline-flex items-center gap-3 px-8 py-5 rounded-full border border-[#C5C6CB]/30 bg-[#111214]/60 text-xs tracking-[0.2em] uppercase text-[#F2F0EB] hover:bg-[#242528] transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4 text-[#C5C6CB]" />
                <span>Launch 5-Stage Ingest X-Ray</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ========================================================= */}
      {/* FOOTER                                                    */}
      {/* ========================================================= */}
      <footer className="relative z-10 border-t border-[#242528] bg-[#050505]/90 backdrop-blur-xl py-12 px-4 sm:px-8 lg:px-14">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src={AVARAN_LOGO} alt="AVARAN" className="w-8 h-8 object-contain logo-blend" />
            <span className="font-['Cinzel',serif] text-sm tracking-[0.28em] text-[#F2F0EB]">
              AVARAN // ZERO-VAULT
            </span>
            <span className="text-xs text-[#85868B] font-mono ml-2">© 2026 SOVEREIGN CRYPTO SYSTEMS</span>
          </div>

          <div className="flex items-center gap-6 text-xs tracking-widest uppercase text-[#85868B]">
            <a href="#home" onClick={(e) => { e.preventDefault(); scrollTo('home'); }} className="hover:text-[#F2F0EB] transition-colors">Top</a>
            <a href="#drive" onClick={(e) => { e.preventDefault(); scrollTo('drive'); }} className="hover:text-[#F2F0EB] transition-colors">Drive UX</a>
            <a href="#deadlock" onClick={(e) => { e.preventDefault(); scrollTo('deadlock'); }} className="hover:text-[#F2F0EB] transition-colors">Deadlock</a>
            <a href="#defense" onClick={(e) => { e.preventDefault(); scrollTo('defense'); }} className="hover:text-[#F2F0EB] transition-colors">Defense</a>
            <a href="#vault" onClick={(e) => { e.preventDefault(); scrollTo('vault'); }} className="hover:text-[#F2F0EB] transition-colors">Deploy</a>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-mono text-[#85868B]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>0.00% SERVER VISIBILITY · PADMÉ 4MB BLIND PIPE</span>
          </div>
        </div>
      </footer>

      {/* ========================================================= */}
      {/* MODAL 1: 5-STAGE INGEST X-RAY DRAWER                      */}
      {/* ========================================================= */}
      {ingestModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="ingest-modal-title"
          className="fixed inset-0 z-[95] flex items-center justify-center p-4 sm:p-6 bg-[#050505]/90 backdrop-blur-2xl transition-opacity duration-300 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModals();
          }}
        >
          <div className="relative w-full max-w-2xl max-h-[90dvh] overflow-y-auto rounded-3xl glass-panel border border-[#C5C6CB]/30 p-5 sm:p-9 shadow-[0_25px_80px_rgba(0,0,0,0.95)] my-auto">
            <div className="flex items-center justify-between gap-4 mb-6">
              <button
                type="button"
                onClick={() => closeModals()}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#C5C6CB]/25 bg-[#111214]/80 text-xs font-mono text-[#C5C6CB] hover:text-[#F2F0EB] hover:border-[#F2F0EB] transition-colors cursor-pointer group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Drive</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-[10px] font-mono tracking-[0.2em] uppercase text-[#85868B]">
                  ESC / BACK
                </span>
                <button
                  type="button"
                  onClick={() => closeModals()}
                  aria-label="Close modal"
                  className="w-9 h-9 rounded-full border border-[#C5C6CB]/20 flex items-center justify-center text-[#A7A7AD] hover:text-[#F2F0EB] hover:border-[#F2F0EB] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <img src={AVARAN_LOGO} alt="AVARAN" className="w-8 h-8 object-contain logo-blend" />
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#C5C6CB]">
                5-STAGE UPLOAD X-RAY
              </span>
            </div>

            <h3 id="ingest-modal-title" className="font-['Cinzel',serif] text-2xl sm:text-3xl text-[#F2F0EB] mb-2">
              Life of an Ingested File
            </h3>

            <p className="text-sm text-[#A7A7AD] font-light leading-relaxed mb-6">
              Simulate dropping <strong className="text-[#F2F0EB] font-mono">{ingestFileName} ({ingestFileSize})</strong> into
              the AVARAN client pipeline and inspect the byte transformations before cloud persistence.
            </p>

            {/* Stage Selector */}
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setIngestStage(s);
                    playUiChime(500 + s * 60);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    ingestStage === s
                      ? 'bg-[#F2F0EB] text-[#050505] font-semibold'
                      : 'border border-[#C5C6CB]/20 bg-[#111214] text-[#A7A7AD] hover:text-[#F2F0EB]'
                  }`}
                >
                  Stage 0{s}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setIngestPlaying(!ingestPlaying)}
                className="px-3 py-1.5 rounded-lg border border-[#C5C6CB]/25 bg-[#242528] text-xs font-mono flex items-center gap-1.5"
              >
                {ingestPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{ingestPlaying ? 'Pause' : 'Autoplay'}</span>
              </button>
            </div>

            {/* Active Stage Box */}
            <div className="p-5 rounded-2xl bg-[#050505] border border-[#C5C6CB]/20 font-mono text-xs space-y-3 mb-6">
              {ingestStage === 1 && (
                <div>
                  <div className="text-[10px] text-[#85868B] uppercase">01 // MAIN UI THREAD</div>
                  <h4 className="font-['Cinzel',serif] text-base text-[#F2F0EB] mt-1 mb-2">
                    Zero-Copy FileHandle Dispatch
                  </h4>
                  <p className="text-xs text-[#A7A7AD] leading-relaxed mb-3">
                    User drops file into React. Native FileHandle transfers to isolated Web Worker without UI thread blocking.
                  </p>
                  <div className="p-3 rounded-lg bg-[#111214] border border-[#242528] text-[10px] space-y-1">
                    <div>ACTION: <span className="text-[#F2F0EB]">worker.postMessage(&#123; fileHandle &#125;, [buffer])</span></div>
                    <div>UI JANK: <span className="text-emerald-400">0.00 ms (Zero Blocking)</span></div>
                  </div>
                </div>
              )}

              {ingestStage === 2 && (
                <div>
                  <div className="text-[10px] text-[#85868B] uppercase">02 // ISOLATED WEB WORKER</div>
                  <h4 className="font-['Cinzel',serif] text-base text-[#F2F0EB] mt-1 mb-2">
                    Pre-Encryption ONNX Embedding &amp; Shannon Scan
                  </h4>
                  <p className="text-xs text-[#A7A7AD] leading-relaxed mb-3">
                    Extracts raw text, computes 384-dimensional dense vector embeddings via in-worker WebGPU, and scans for .env/SSH private keys.
                  </p>
                  <div className="p-3 rounded-lg bg-[#111214] border border-[#242528] text-[10px] space-y-1">
                    <div>VECTOR RUNTIME: <span className="text-[#F2F0EB]">MiniLM-L6-v2 via WebGPU</span></div>
                    <div>SHANNON ENTROPY: <span className="text-emerald-400">4.12 bits/byte (Safe)</span></div>
                  </div>
                </div>
              )}

              {ingestStage === 3 && (
                <div>
                  <div className="text-[10px] text-[#85868B] uppercase">03 // C/WASM STREAM AEAD</div>
                  <h4 className="font-['Cinzel',serif] text-base text-[#F2F0EB] mt-1 mb-2">
                    4 MB Uniform Slicing &amp; PADMÉ Tail Padding
                  </h4>
                  <p className="text-xs text-[#A7A7AD] leading-relaxed mb-3">
                    Splits file into 4 MB blocks, applies PADMÉ padding to the final chunk (≤12% cap), and encrypts each with per-file DEK + sequential counter nonces and AAD binding.
                  </p>
                  <div className="p-3 rounded-lg bg-[#111214] border border-[#242528] text-[10px] space-y-1">
                    <div>CHUNKS CREATED: <span className="text-[#F2F0EB]">13 × 4.00 MB Uniform ArrayBuffers</span></div>
                    <div>AAD BINDING: <span className="text-[#C5C6CB]">(file_id, chunk_index, is_last_chunk)</span></div>
                  </div>
                </div>
              )}

              {ingestStage === 4 && (
                <div>
                  <div className="text-[10px] text-[#85868B] uppercase">04 // MONOLITHIC VFS SEAL</div>
                  <h4 className="font-['Cinzel',serif] text-base text-[#F2F0EB] mt-1 mb-2">
                    Index Update &amp; explicit_bzero Scrubbing
                  </h4>
                  <p className="text-xs text-[#A7A7AD] leading-relaxed mb-3">
                    DEK, original filename, and chunk UUID pointers are written to the VFS Index and encrypted under Key_Vault. Memory is wiped via explicit_bzero.
                  </p>
                  <div className="p-3 rounded-lg bg-[#111214] border border-[#242528] text-[10px] space-y-1">
                    <div>MEMORY HYGIENE: <span className="text-emerald-400">explicit_bzero in Wasm</span></div>
                    <div>V8 HEAP KEYS: <span className="text-emerald-400">0 Keys in Garbage Collector</span></div>
                  </div>
                </div>
              )}

              {ingestStage === 5 && (
                <div>
                  <div className="text-[10px] text-[#85868B] uppercase">05 // BLIND FASTAPI CLOUD</div>
                  <h4 className="font-['Cinzel',serif] text-base text-[#F2F0EB] mt-1 mb-2">
                    Untrusted Blind Octet-Stream Sink
                  </h4>
                  <p className="text-xs text-[#A7A7AD] leading-relaxed mb-3">
                    Cloud receives uniform application/octet-stream blobs named only by random UUIDs and writes them to S3. Cloud is 100% blind to content and hierarchy.
                  </p>
                  <div className="p-3 rounded-lg bg-[#111214] border border-[#242528] text-[10px] space-y-1">
                    <div>SERVER VISIBILITY: <span className="text-emerald-400">0.00% Blind Octet Pipe</span></div>
                    <div>STORED ON S3: <span className="text-[#C5C6CB]">13 × 4.00 MB Random UUIDs</span></div>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => closeModals()}
              className="w-full py-3.5 rounded-full bg-[#F2F0EB] text-[#050505] font-semibold text-xs tracking-[0.2em] uppercase hover:bg-[#C5C6CB] transition-colors cursor-pointer"
            >
              Done &amp; Return to Workspace
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: WEBAUTHN HARDWARE PASSKEY ENCLAVE PROMPT         */}
      {/* ========================================================= */}
      {passkeyModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="passkey-modal-title"
          className="fixed inset-0 z-[95] flex items-center justify-center p-4 sm:p-6 bg-[#050505]/90 backdrop-blur-2xl transition-opacity duration-300"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModals();
          }}
        >
          <div className="relative w-full max-w-lg max-h-[90dvh] overflow-y-auto rounded-3xl glass-panel border border-amber-500/40 p-5 sm:p-8 shadow-[0_25px_80px_rgba(251,191,36,0.15)] my-auto">
            <div className="flex items-center justify-between gap-4 mb-6">
              <button
                type="button"
                onClick={() => closeModals()}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-[#85868B] hover:text-[#F2F0EB] transition-colors cursor-pointer group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                <span>Cancel Authentication</span>
              </button>

              <button
                type="button"
                onClick={() => closeModals()}
                aria-label="Close modal"
                className="w-9 h-9 rounded-full border border-[#C5C6CB]/20 flex items-center justify-center text-[#A7A7AD] hover:text-[#F2F0EB]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-950/40 border border-amber-400 mx-auto flex items-center justify-center text-amber-300 shadow-[0_0_35px_rgba(251,191,36,0.3)]">
                <Fingerprint className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-amber-400 tracking-widest">
                  HARDWARE PASKEY REQUIRED
                </span>
                <h3 id="passkey-modal-title" className="font-['Cinzel',serif] text-2xl text-[#F2F0EB] mt-1">
                  Biometric Enclave Challenge
                </h3>
              </div>

              <p className="text-xs text-[#A7A7AD] leading-relaxed max-w-sm mx-auto font-light">
                <strong className="text-[#F2F0EB] font-mono">{passkeyItem?.logicalName}</strong> contains high-entropy
                AWS credentials and private keys. Client DLP policies require WebAuthn biometric verification to unlock plaintext memory.
              </p>

              {!passkeyUnlocked ? (
                <div className="space-y-4 pt-2">
                  <div className="p-4 rounded-xl bg-[#050505] border border-amber-500/30 font-mono text-[11px] text-[#A7A7AD] space-y-1 text-left">
                    <div>CHALLENGE: <span className="text-[#F2F0EB]">0x4f88...b912 (Ed25519)</span></div>
                    <div>POLICY: <span className="text-amber-300">SHANNON_ENTROPY &gt; 4.85</span></div>
                    <div>DEVICE: <span className="text-[#C5C6CB]">FIDO2 / TouchID / YubiKey</span></div>
                  </div>

                  <button
                    type="button"
                    onClick={executePasskeyScan}
                    disabled={passkeyScanning}
                    className="w-full py-4 rounded-full bg-amber-400 hover:bg-amber-300 text-[#050505] font-semibold text-xs font-mono uppercase tracking-widest shadow-[0_0_30px_rgba(251,191,36,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {passkeyScanning ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Verifying TouchID / Security Key...</span>
                      </>
                    ) : (
                      <>
                        <Fingerprint className="w-4 h-4" />
                        <span>Touch Security Key to Decrypt</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-4 pt-2">
                  <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-left font-mono text-xs text-emerald-200 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-300 font-bold">
                      <Check className="w-4 h-4" />
                      <span>BIOMETRIC ATTESTATION CONFIRMED</span>
                    </div>
                    <pre className="text-[10px] text-[#F2F0EB] bg-[#050505] p-3 rounded-lg overflow-x-auto border border-[#242528]">
                      {passkeyItem?.previewSnippet}
                    </pre>
                  </div>

                  <button
                    type="button"
                    onClick={() => closeModals()}
                    className="w-full py-3.5 rounded-full bg-[#F2F0EB] text-[#050505] text-xs font-mono uppercase font-semibold"
                  >
                    Close Enclave View
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: INITIALIZE ZERO-VAULT CLUSTER                    */}
      {/* ========================================================= */}
      {vaultModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="vault-modal-title"
          className="fixed inset-0 z-[95] flex items-center justify-center p-4 sm:p-6 bg-[#050505]/90 backdrop-blur-2xl transition-opacity duration-300 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModals();
          }}
        >
          <div className="relative w-full max-w-xl max-h-[90dvh] overflow-y-auto rounded-3xl glass-panel border border-[#C5C6CB]/30 p-5 sm:p-9 shadow-[0_25px_80px_rgba(0,0,0,0.95)] my-auto">
            <div className="flex items-center justify-between gap-4 mb-6">
              <button
                type="button"
                onClick={() => closeModals()}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-[#85868B] hover:text-[#F2F0EB] transition-colors cursor-pointer group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                <span>Return to Overview</span>
              </button>

              <button
                type="button"
                onClick={() => closeModals()}
                aria-label="Close modal"
                className="w-9 h-9 rounded-full border border-[#C5C6CB]/20 flex items-center justify-center text-[#A7A7AD] hover:text-[#F2F0EB]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <img src={AVARAN_LOGO} alt="AVARAN" className="w-8 h-8 object-contain logo-blend" />
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#C5C6CB]">
                SOVEREIGN VAULT PROVISIONING
              </span>
            </div>

            <h3 id="vault-modal-title" className="font-['Cinzel',serif] text-2xl sm:text-3xl text-[#F2F0EB] mb-2">
              Deploy Your Zero-Vault
            </h3>

            <p className="text-sm text-[#A7A7AD] font-light leading-relaxed mb-6">
              Initialize an air-gapped cryptographic enclave in your browser paired with an untrusted blind S3 octet sink.
            </p>

            {!vaultSubmitted ? (
              <form onSubmit={handleVaultSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono tracking-widest uppercase text-[#85868B] mb-1.5">
                    VAULT OWNER IDENTIFIER
                  </label>
                  <input
                    type="text"
                    required
                    value={vaultOwner}
                    onChange={(e) => setVaultOwner(e.target.value)}
                    placeholder="Dr. Elena Vance // Sovereign Labs"
                    className="w-full px-4 py-3 rounded-xl bg-[#050505] border border-[#C5C6CB]/20 text-sm text-[#F2F0EB] placeholder-[#85868B]/50 focus:outline-none focus:border-[#F2F0EB]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono tracking-widest uppercase text-[#85868B] mb-1.5">
                    TRANSMISSION ENDPOINT (EMAIL FOR PASSKEY ENROLLMENT)
                  </label>
                  <input
                    type="email"
                    required
                    value={vaultEmail}
                    onChange={(e) => setVaultEmail(e.target.value)}
                    placeholder="elena@sovereign-lab.org"
                    className="w-full px-4 py-3 rounded-xl bg-[#050505] border border-[#C5C6CB]/20 text-sm text-[#F2F0EB] placeholder-[#85868B]/50 focus:outline-none focus:border-[#F2F0EB]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono tracking-widest uppercase text-[#85868B] mb-1.5">
                    ZERO-VAULT DEPLOYMENT PROFILE
                  </label>
                  <select
                    value={vaultProfile}
                    onChange={(e) => setVaultProfile(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#050505] border border-[#C5C6CB]/20 text-sm text-[#F2F0EB] focus:outline-none focus:border-[#F2F0EB]"
                  >
                    <option value="C/Wasm STREAM AEAD Enclave">C/Wasm STREAM AEAD Enclave (4 MB PADMÉ Blocks)</option>
                    <option value="Client WebGPU Vector Enclave">Client WebGPU Vector Enclave (384-Dim &lt;5ms)</option>
                    <option value="Full Sovereign Enterprise Fabric">Full Sovereign Enterprise Fabric</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-4 rounded-full bg-[#F2F0EB] text-[#050505] font-semibold text-xs tracking-[0.22em] uppercase hover:bg-[#C5C6CB] transition-colors cursor-pointer"
                >
                  Generate Argon2id Keys &amp; Mount VFS
                </button>
              </form>
            ) : (
              <div className="py-6 text-center space-y-4 font-mono">
                <div className="w-12 h-12 rounded-full bg-[#C5C6CB]/15 border border-[#F2F0EB] mx-auto flex items-center justify-center text-[#F2F0EB]">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-['Cinzel',serif] text-xl text-[#F2F0EB]">Argon2id + HKDF Key Derivation Sealed</h4>
                <p className="text-xs text-[#A7A7AD]">
                  VAULT INITIALIZED FOR {vaultOwner.toUpperCase()} // [{vaultProfile.toUpperCase()}]
                </p>
                <div className="p-3 rounded-xl bg-[#050505] border border-[#C5C6CB]/20 text-[10px] text-left space-y-1">
                  <div>KEY_AUTH: <span className="text-[#F2F0EB]">0x4f8e...c21a (Argon2id Derived)</span></div>
                  <div>KEY_KEK: <span className="text-[#F2F0EB]">0x9b1d...77fe (Wasm Linear Memory)</span></div>
                  <div>VFS REPOSITORY: <span className="text-emerald-400">Mounted · 0.00% Server Visibility</span></div>
                </div>
                <button
                  type="button"
                  onClick={() => closeModals()}
                  className="px-6 py-2 rounded-full bg-[#F2F0EB] text-[#050505] text-xs font-semibold uppercase"
                >
                  Enter Your Vault
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
