import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Compass,
  ArrowDownRight,
  ArrowUpRight,
  ArrowRight,
  Menu,
  X,
  Check,
  Sparkles,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
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
  EyeOff,
  Play,
  Pause,
  ChevronRight,
  Fingerprint,
  Box,
  Binary,
  HardDrive
} from 'lucide-react';

// Visual Assets
const AVARAN_LOGO = '/assets/avaran_logo.webp';
const CARD_ORBITAL = '/assets/card_orbital.webp';
const CARD_GRID = '/assets/card_grid.webp';
const CARD_WAVE = '/assets/card_wave.webp';

interface ModalSpec {
  tag: string;
  title: string;
  desc: string;
  tier: string;
  throughput?: string;
  latency?: string;
  mode: 'spec' | 'interactive_demo';
}

const MODAL_SPECS: Record<string, ModalSpec> = {
  'crypto-wasm': {
    tag: 'SYS // CRYPTO-WASM',
    title: 'C-to-WebAssembly Crypto Core',
    desc: 'Memory-hard Argon2id key derivation, HKDF-SHA256 key isolation (Key_Auth vs Key_KEK), and explicit_bzero memory scrubbing directly in C/Wasm linear memory.',
    tier: 'C/Wasm STREAM AEAD Enclave',
    throughput: '3.2 GB/S IN-MEMORY',
    latency: '< 0.02 ms / chunk',
    mode: 'spec'
  },
  'vfs-padme': {
    tag: 'SYS // VFS-PADMÉ',
    title: 'Decoupled VFS & PADMÉ Obfuscation',
    desc: 'Monolithic encrypted index decoupling metadata from physical storage. Uniform 4 MB STREAM AEAD blocks with PADMÉ padding cap overhead to ≤12% regardless of file size.',
    tier: 'Monolithic PADMÉ Storage Fabric',
    throughput: '4 MB Uniform Blocks',
    latency: 'Zero Metadata Leaks',
    mode: 'spec'
  },
  'webgpu-onnx': {
    tag: 'SYS // WEBGPU-ONNX',
    title: 'In-Browser Semantic Search & DLP',
    desc: 'Isolated Web Worker computing 384-dimensional dense vector embeddings via WebGPU/ONNX and Shannon entropy scanning before a single ciphertext byte leaves the client.',
    tier: 'Client WebGPU Vector Enclave',
    throughput: '384-Dim Float Embeddings',
    latency: '< 5 ms Cosine Similarity',
    mode: 'interactive_demo'
  },
  default: {
    tag: 'ORBITAL PROVISIONING // ZERO-VAULT',
    title: 'Initialize AVARAN Zero-Vault',
    desc: 'Deploy an isolated zero-knowledge storage vault with client-side WebGPU vector intelligence and C-to-Wasm AEAD encryption.',
    tier: 'Sovereign Zero-Vault Cluster',
    throughput: 'Unlimited 4 MB Chunks',
    latency: '< 5 ms Search / 0.00% Server View',
    mode: 'interactive_demo'
  }
};

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

  // 5-Stage Pipeline Interactive State
  const [activeStage, setActiveStage] = useState<number>(1);
  const [isPipelinePlaying, setIsPipelinePlaying] = useState<boolean>(false);

  // Defense Matrix Active Tab
  const [activeDefenseTab, setActiveDefenseTab] = useState<number>(1);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedModalSpec, setSelectedModalSpec] = useState<ModalSpec>(MODAL_SPECS.default);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [architectName, setArchitectName] = useState('');
  const [architectEmail, setArchitectEmail] = useState('');
  const [selectedTier, setSelectedTier] = useState('Sovereign Zero-Vault Cluster');

  // Interactive Client-Side DLP & Vector Search Demo State
  const [demoInput, setDemoInput] = useState('Tax invoice and Q1 financial audit from March 2026');
  const [demoEntropy, setDemoEntropy] = useState<number>(4.12);
  const [demoSecretDetected, setDemoSecretDetected] = useState<string | null>(null);
  const [demoWebAuthnTriggered, setDemoWebAuthnTriggered] = useState<boolean>(false);
  const [demoCosineSim, setDemoCosineSim] = useState<number>(0.942);
  const [demoChunkCount, setDemoChunkCount] = useState<number>(1);

  // Custom Cursor Refs
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
    sectionOffsetX: 2.2,
    sectionScale: 1.0
  });

  // Calculate live Shannon Entropy for the demo input
  useEffect(() => {
    if (!demoInput) {
      setDemoEntropy(0);
      setDemoSecretDetected(null);
      setDemoWebAuthnTriggered(false);
      return;
    }
    const freq: Record<string, number> = {};
    for (const char of demoInput) {
      freq[char] = (freq[char] || 0) + 1;
    }
    const len = demoInput.length;
    let ent = 0;
    for (const count of Object.values(freq)) {
      const p = count / len;
      ent -= p * Math.log2(p);
    }
    setDemoEntropy(parseFloat(ent.toFixed(2)));

    // Detect high entropy secret patterns
    const isAwsKey = /AKIA[0-9A-Z]{16}|wJalrXUtnFEMI/i.test(demoInput);
    const isSshKey = /-----BEGIN (RSA|OPENSSH) PRIVATE KEY-----/i.test(demoInput);
    const isEnvSecret = /SECRET_KEY|DATABASE_PASSWORD|API_TOKEN=/i.test(demoInput);

    if (isAwsKey) {
      setDemoSecretDetected('AWS Access / Secret Key Pattern');
      setDemoWebAuthnTriggered(true);
    } else if (isSshKey) {
      setDemoSecretDetected('OpenSSH / RSA Private Key Detected');
      setDemoWebAuthnTriggered(true);
    } else if (isEnvSecret || ent > 4.85) {
      setDemoSecretDetected('High-Entropy Secret / .env Credentials');
      setDemoWebAuthnTriggered(true);
    } else {
      setDemoSecretDetected(null);
      setDemoWebAuthnTriggered(false);
    }

    // Compute mock 384-dim similarity
    const hashVal = demoInput.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const sim = 0.75 + (hashVal % 25) / 100;
    setDemoCosineSim(parseFloat(sim.toFixed(3)));
    setDemoChunkCount(Math.max(1, Math.ceil(demoInput.length / (4 * 1024))));
  }, [demoInput]);

  // Synchronize Three.js controls
  useEffect(() => {
    threeCtrlRef.current.speedMultiplier = speedMultiplier;
  }, [speedMultiplier]);

  useEffect(() => {
    threeCtrlRef.current.ringExpansion = ringExpansion / 100;
  }, [ringExpansion]);

  // 5-Stage Pipeline Autoplay
  useEffect(() => {
    if (!isPipelinePlaying) return;
    const timer = setInterval(() => {
      setActiveStage((prev) => (prev >= 5 ? 1 : prev + 1));
      playUiChime(580 + (activeStage % 5) * 80);
    }, 3800);
    return () => clearInterval(timer);
  }, [isPipelinePlaying, activeStage]);

  // Update Three.js parameters based on pipeline stage
  useEffect(() => {
    if (activeStage === 1) {
      setSpeedMultiplier(0.8);
      setRingExpansion(90);
    } else if (activeStage === 2) {
      setSpeedMultiplier(1.4);
      setRingExpansion(115);
    } else if (activeStage === 3) {
      setSpeedMultiplier(2.2);
      setRingExpansion(140);
    } else if (activeStage === 4) {
      setSpeedMultiplier(1.6);
      setRingExpansion(105);
    } else if (activeStage === 5) {
      setSpeedMultiplier(0.9);
      setRingExpansion(80);
    }
  }, [activeStage]);

  // ==========================================
  // 1. WEB AUDIO AMBIENT SOUND ENGINE
  // ==========================================
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

      // Harmonic drone oscillators (A2 + E3 + C#4 cryptographic frequencies)
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
      // Ignore audio chime issues
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

  // ==========================================
  // 2. CINEMATIC PRELOADER SEQUENCE
  // ==========================================
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
      const isMobile = window.innerWidth < 768;
      const count = isMobile ? 50 : 100;
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
          if (elapsed > 0.15) {
            p.alpha = Math.min(0.85, p.alpha + 0.025);
          }
          if (elapsed > 0.45) {
            p.dist += (p.targetRadius - p.dist) * 0.065;
          }
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

    const duration = 2200;
    const interval = 25;
    const step = 100 / (duration / interval);
    let current = 0;

    const timer = setInterval(() => {
      current = Math.min(100, current + step);
      setPreloaderPercent(Math.round(current));

      if (current < 30) {
        setPreloaderStage('ALLOCATING WASM LINEAR MEMORY');
      } else if (current < 65) {
        setPreloaderStage('DERIVING ARGON2ID + HKDF KEYS');
      } else if (current < 92) {
        setPreloaderStage('MOUNTING ENCRYPTED VFS INDEX');
      } else {
        setPreloaderStage('ENTERING AVARAN // ZERO-VAULT');
      }

      if (current >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          setPreloaderFinished(true);
        }, 350);
      }
    }, interval);

    return () => {
      clearInterval(timer);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  const skipPreloader = () => {
    setPreloaderFinished(true);
  };

  // ==========================================
  // 3. CURSOR & AMBIENT MOUSE LIGHT
  // ==========================================
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

  // ==========================================
  // 4. SCROLL PROGRESSION & CHOREOGRAPHY
  // ==========================================
  useEffect(() => {
    const onScroll = () => {
      const top = window.scrollY;
      const docHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const prog = Math.min(1, Math.max(0, top / docHeight));
      setScrollProgress(prog);
      threeCtrlRef.current.scrollProgress = prog;

      setIsNavScrolled(top > 40);

      // Section choreographic positioning for Three.js sculpture
      const isDesktop = window.innerWidth >= 1024;
      if (!isDesktop) {
        threeCtrlRef.current.sectionOffsetX = 0;
        threeCtrlRef.current.sectionScale = 0.78;
      } else if (prog < 0.18) {
        // Hero: on the right
        threeCtrlRef.current.sectionOffsetX = 2.25;
        threeCtrlRef.current.sectionScale = 1.0;
      } else if (prog < 0.38) {
        // Deadlock / Philosophy: Centered
        threeCtrlRef.current.sectionOffsetX = 0;
        threeCtrlRef.current.sectionScale = 1.25;
      } else if (prog < 0.60) {
        // Architecture / 3 Pillars: Shifted left
        threeCtrlRef.current.sectionOffsetX = -2.35;
        threeCtrlRef.current.sectionScale = 0.88;
      } else if (prog < 0.82) {
        // Pipeline: Positioned right-center
        threeCtrlRef.current.sectionOffsetX = 1.6;
        threeCtrlRef.current.sectionScale = 1.18;
      } else {
        // Defense / Final CTA: Centered alignment
        threeCtrlRef.current.sectionOffsetX = 0;
        threeCtrlRef.current.sectionScale = 1.05;
      }

      // Active Section Spy
      const sectionIds = ['home', 'deadlock', 'architecture', 'pipeline', 'defense', 'vault'];
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

  const scrollTo = (id: string) => {
    playUiChime(587.33);
    setMobileMenuOpen(false);
    const target = document.getElementById(id.replace('#', ''));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // ==========================================
  // 5. THREE.JS 3D ORBITAL SCULPTURE
  // ==========================================
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

    // Group 1: Translucent Silver Flowing Ribbons (Mirroring the AVARAN logo)
    const ribbonGroup = new THREE.Group();
    rootGroup.add(ribbonGroup);
    const ribbonMaterials: { mat: THREE.Material; baseOpacity: number; isPhysical?: boolean }[] = [];

    const ribbonConfigs = [
      { radius: 2.05, tube: 0.22, p: 2, q: 3, rotX: 0.4, rotY: 0.2, opacity: 0.48 },
      { radius: 1.85, tube: 0.15, p: 3, q: 2, rotX: -0.6, rotY: 0.8, opacity: 0.36 },
      { radius: 2.25, tube: 0.08, p: 1, q: 2, rotX: 0.9, rotY: -0.4, opacity: 0.65 }
    ];

    ribbonConfigs.forEach((cfg) => {
      const geom = new THREE.TorusKnotGeometry(
        cfg.radius,
        cfg.tube,
        isMobile ? 96 : 180,
        isMobile ? 16 : 28,
        cfg.p,
        cfg.q
      );
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

      const wireMat = new THREE.MeshBasicMaterial({
        color: 0xf2f0eb,
        transparent: true,
        opacity: 0.09,
        wireframe: true
      });
      ribbonMaterials.push({ mat: wireMat, baseOpacity: 0.09 });
      const wireMesh = new THREE.Mesh(geom, wireMat);
      wireMesh.rotation.copy(mesh.rotation);
      wireMesh.scale.setScalar(1.003);
      ribbonGroup.add(wireMesh);
    });

    // Group 2: Multiple Orbiting Circular Astrolabe Rings
    const ringsGroup = new THREE.Group();
    rootGroup.add(ringsGroup);
    const ringRadii = [2.65, 3.05, 3.45, 3.85];
    ringRadii.forEach((r, idx) => {
      const torusGeom = new THREE.TorusGeometry(r, idx % 2 === 0 ? 0.012 : 0.007, 12, isMobile ? 90 : 160);
      const ringMat = new THREE.MeshBasicMaterial({
        color: idx === 0 ? 0xf2f0eb : 0xc5c6cb,
        transparent: true,
        opacity: 0.38 - idx * 0.06
      });
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

    // Group 3: Floating Cryptographic Particles
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

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xc5c6cb, 0.8);
    scene.add(ambientLight);
    const keyLight = new THREE.PointLight(0xf2f0eb, 2.6, 25);
    keyLight.position.set(5, 5, 6);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(0x85868b, 2.0, 25);
    rimLight.position.set(-6, -4, -3);
    scene.add(rimLight);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

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

  // 3D Tilt Card Mouse Movements
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--card-mouse-x', `${x}px`);
    card.style.setProperty('--card-mouse-y', `${y}px`);

    if (window.innerWidth >= 1024) {
      const rotateY = (x / rect.width - 0.5) * 12;
      const rotateX = (0.5 - y / rect.height) * 12;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    }
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
  };

  // Open Modal Helper
  const openModalWithSpec = (specKey: string) => {
    playUiChime(783.99);
    const spec = MODAL_SPECS[specKey] || MODAL_SPECS.default;
    setSelectedModalSpec(spec);
    setSelectedTier(spec.tier);
    setModalSuccess(false);
    setModalOpen(true);
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playUiChime(880);
    setModalSuccess(true);
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#F2F0EB] selection:bg-[#C5C6CB]/30 selection:text-[#F2F0EB] overflow-x-hidden font-['Inter',sans-serif]">
      {/* Film Grain & Ambient Mouse Follower */}
      <div className="film-grain pointer-events-none" aria-hidden="true" />
      <div id="ambient-mouse-light" aria-hidden="true" />

      {/* Custom Fine Desktop Cursor */}
      <div ref={cursorDotRef} className="custom-cursor-dot hidden lg:block" aria-hidden="true" />
      <div
        ref={cursorRingRef}
        className={`custom-cursor-ring hidden lg:block ${cursorExpanded ? 'cursor-expanded' : ''}`}
        aria-hidden="true"
      />

      {/* Top Fixed Scroll Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-[90] bg-[#242528]/40 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-[#85868B] via-[#C5C6CB] to-[#F2F0EB] shadow-[0_0_12px_#F2F0EB] transition-all duration-150"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Right Side Vertical Orbital Scroll Telemetry */}
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

      {/* Fixed Fullscreen Three.js WebGL Canvas */}
      <canvas
        ref={webglCanvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-[3]"
        aria-hidden="true"
      />

      {/* ========================================== */}
      {/* LOADING SCREEN WITH CRYPTO ALLOCATIONS     */}
      {/* ========================================== */}
      {!preloaderFinished && (
        <div
          id="preloader"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505] transition-opacity duration-700"
        >
          <canvas ref={preloaderCanvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            {/* Orbital Rings & AVARAN Logo */}
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

            {/* Status & Counter */}
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

          {/* Skip Sequence Button */}
          <button
            type="button"
            onClick={skipPreloader}
            onMouseEnter={() => setCursorExpanded(true)}
            onMouseLeave={() => setCursorExpanded(false)}
            className="absolute bottom-8 right-8 z-20 px-4 py-2 rounded-full border border-[#C5C6CB]/20 bg-[#111214]/60 text-[11px] tracking-widest uppercase text-[#A7A7AD] hover:text-[#F2F0EB] hover:border-[#C5C6CB]/50 transition-all cursor-pointer"
          >
            Skip Sequence →
          </button>
        </div>
      )}

      {/* ========================================== */}
      {/* 2. TOP BAR CONTRACT (Strict 3-Zone Header)  */}
      {/* ========================================== */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-4 sm:py-5 px-4 sm:px-8 lg:px-14">
        <div
          className={`max-w-7xl mx-auto rounded-full px-5 sm:px-7 py-3 transition-all duration-500 flex items-center justify-between gap-8 border ${
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
            className="flex items-center gap-3.5 group focus:outline-none whitespace-nowrap shrink-0"
          >
            <div className="relative w-10 h-10 rounded-full border border-[#C5C6CB]/25 bg-[#050505] flex items-center justify-center overflow-hidden group-hover:border-[#F2F0EB]/70 transition-colors">
              <img
                src={AVARAN_LOGO}
                alt="AVARAN Logo"
                className="w-9 h-9 object-contain logo-blend group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-['Cinzel',serif] text-base sm:text-lg tracking-[0.24em] text-[#F2F0EB] font-medium leading-none">
                AVARAN // ZERO-VAULT
              </span>
              <span className="text-[9px] tracking-[0.26em] text-[#85868B] uppercase mt-1">
                MATHEMATICALLY BLIND CLOUD
              </span>
            </div>
          </a>

          {/* Zone 2: 5 clean single-line navigation links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-6 lg:gap-8 text-xs tracking-[0.16em] uppercase font-medium"
          >
            {[
              { id: 'home', label: 'Home' },
              { id: 'deadlock', label: 'Deadlock' },
              { id: 'pipeline', label: 'Pipeline' },
              { id: 'defense', label: 'Defense Matrix' },
              { id: 'architecture', label: 'Architecture' }
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

          {/* Zone 3: 1 primary action & sound controls */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Ambient Sound Toggle */}
            <button
              type="button"
              onClick={toggleSound}
              onMouseEnter={() => setCursorExpanded(true)}
              onMouseLeave={() => setCursorExpanded(false)}
              aria-pressed={isSoundPlaying}
              aria-label="Toggle Ambient Cryptographic Soundscape"
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
              onClick={() => openModalWithSpec('default')}
              onMouseEnter={() => setCursorExpanded(true)}
              onMouseLeave={() => setCursorExpanded(false)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#F2F0EB] via-[#C5C6CB] to-[#F2F0EB] text-[#050505] font-medium text-xs tracking-[0.16em] uppercase shadow-[0_0_25px_rgba(197,198,203,0.25)] hover:shadow-[0_0_35px_rgba(242,240,235,0.5)] transition-all whitespace-nowrap shrink-0 cursor-pointer"
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
            { id: 'deadlock', label: '02. The Deadlock' },
            { id: 'pipeline', label: '03. Blind Pipeline' },
            { id: 'defense', label: '04. Defense Matrix' },
            { id: 'architecture', label: '05. Architecture' },
            { id: 'vault', label: '06. Deploy Vault' }
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
              openModalWithSpec('default');
            }}
            className="px-6 py-2.5 rounded-full bg-[#F2F0EB] text-[#050505] text-xs font-medium tracking-widest uppercase"
          >
            Deploy
          </button>
        </div>
      </div>

      {/* Main Content Stream */}
      <main className="relative z-10">
        {/* ========================================== */}
        {/* 3. HERO SECTION                             */}
        {/* ========================================== */}
        <section
          id="home"
          className="relative min-h-screen w-full flex items-center pt-28 pb-16 px-4 sm:px-8 lg:px-14 overflow-hidden"
        >
          {/* Subtle Geometric Background Grid Lines */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="max-w-7xl mx-auto h-full relative">
              <div className="absolute top-1/4 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C5C6CB]/15 to-transparent" />
              <div className="absolute bottom-20 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C5C6CB]/15 to-transparent" />
            </div>
          </div>

          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
            {/* Left Column: Typography & CTAs */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              {/* Eyebrow Badge */}
              <div className="inline-flex items-center gap-3 text-xs text-[#85868B] mb-5 font-mono tracking-wider">
                <span className="text-[#F2F0EB] font-medium">ZERO-KNOWLEDGE</span>
                <span aria-hidden="true">·</span>
                <span>WASM AEAD</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#C5C6CB]">IN-BROWSER AI</span>
              </div>

              {/* Engineering Stack Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#C5C6CB]/15 bg-[#111214]/60 text-[10px] font-mono text-[#85868B] mb-6 max-w-xl flex-wrap">
                <Terminal className="w-3.5 h-3.5 text-[#C5C6CB]" />
                <span className="text-[#C5C6CB]">React + Vite (Workers)</span>
                <span>·</span>
                <span className="text-[#F2F0EB]">C → Wasm (Crypto Core)</span>
                <span>·</span>
                <span className="text-[#C5C6CB]">ONNX / WebGPU</span>
                <span>·</span>
                <span className="text-[#85868B]">FastAPI (Blind Pipe)</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-['Cinzel',serif] text-4xl sm:text-6xl xl:text-[4.15rem] leading-[1.08] tracking-tight font-normal text-[#F2F0EB] mb-7 max-w-2xl text-balance">
                <span className="silver-gradient-text font-semibold">Searchable</span> Like the Cloud. <br />
                <span className="silver-gradient-text font-semibold">Blind Like an Air-Gapped Drive.</span>
              </h1>

              {/* Supporting Description */}
              <p className="text-[#A7A7AD] text-base sm:text-lg leading-relaxed max-w-xl font-light mb-9">
                AVARAN Zero-Vault combines a custom C-to-WebAssembly cryptographic core with isolated in-browser
                WebGPU intelligence. Encrypt, semantically search, and scan files for sensitive secrets entirely on the
                client—before a single uniform ciphertext byte ever reaches our untrusted cloud pipe.
              </p>

              {/* Primary Actions */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-5">
                <button
                  type="button"
                  onClick={() => openModalWithSpec('default')}
                  onMouseEnter={() => setCursorExpanded(true)}
                  onMouseLeave={() => setCursorExpanded(false)}
                  className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#F2F0EB] text-[#050505] font-medium text-xs sm:text-sm tracking-[0.2em] uppercase overflow-hidden shadow-[0_0_40px_rgba(242,240,235,0.28)] hover:shadow-[0_0_55px_rgba(242,240,235,0.55)] transition-all cursor-pointer"
                >
                  <span className="relative z-10">Deploy Zero-Vault</span>
                  <Lock className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={() => scrollTo('defense')}
                  onMouseEnter={() => setCursorExpanded(true)}
                  onMouseLeave={() => setCursorExpanded(false)}
                  className="group inline-flex items-center gap-3 px-8 py-4 rounded-full border border-[#C5C6CB]/30 bg-[#111214]/60 hover:bg-[#242528]/70 hover:border-[#F2F0EB]/60 text-[#F2F0EB] font-medium text-xs sm:text-sm tracking-[0.2em] uppercase backdrop-blur-md transition-all cursor-pointer"
                >
                  <span>Inspect Threat Matrix</span>
                  <ShieldCheck className="w-4 h-4 text-[#C5C6CB] group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              {/* Hero Telemetry Strip */}
              <div className="mt-12 pt-8 border-t border-[#C5C6CB]/15 w-full max-w-xl grid grid-cols-3 gap-6">
                <div>
                  <div className="text-[10px] font-mono tracking-widest uppercase text-[#85868B]">BLIND SEARCH LATENCY</div>
                  <div className="font-['Cinzel',serif] text-xl sm:text-2xl text-[#F2F0EB] mt-1 tabular-nums">
                    &lt; 5 <span className="text-xs text-[#C5C6CB]">ms</span>
                  </div>
                  <div className="text-[9px] font-mono text-[#85868B] mt-0.5">384-dim in C/Wasm</div>
                </div>

                <div>
                  <div className="text-[10px] font-mono tracking-widest uppercase text-[#85868B]">BLOCK OBFUSCATION</div>
                  <div className="font-['Cinzel',serif] text-xl sm:text-2xl text-[#F2F0EB] mt-1 tabular-nums">
                    4 <span className="text-xs text-[#C5C6CB]">MB Chunks</span>
                  </div>
                  <div className="text-[9px] font-mono text-[#85868B] mt-0.5">PADMÉ ≤12% cap</div>
                </div>

                <div>
                  <div className="text-[10px] font-mono tracking-widest uppercase text-[#85868B]">SERVER VISIBILITY</div>
                  <div className="font-['Cinzel',serif] text-xl sm:text-2xl text-[#F2F0EB] mt-1 tabular-nums">
                    0.00<span className="text-xs text-[#C5C6CB]">%</span>
                  </div>
                  <div className="text-[9px] font-mono text-[#85868B] mt-0.5">Zero Plaintext / Keys</div>
                </div>
              </div>
            </div>

            {/* Right Column: 3D Interactive Stage & Alignment HUD */}
            <div className="lg:col-span-5 relative flex items-center justify-center min-h-[420px] sm:min-h-[520px]">
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
                className="relative w-full max-w-[490px] aspect-square flex items-center justify-center cursor-grab active:cursor-grabbing group focus:outline-none"
              >
                {/* SVG Astrolabe Coordinates & Alignment Ring */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 500">
                  <line x1="250" y1="0" x2="250" y2="500" stroke="rgba(197,198,203,0.22)" strokeWidth="0.75" />
                  <line
                    x1="20"
                    y1="265"
                    x2="480"
                    y2="265"
                    stroke="rgba(197,198,203,0.16)"
                    strokeWidth="0.75"
                    strokeDasharray="2 5"
                  />
                  <circle cx="250" cy="48" r="14" fill="none" stroke="rgba(242,240,235,0.45)" strokeWidth="1" />
                  <circle cx="250" cy="48" r="3" fill="#F2F0EB" />
                  <circle cx="250" cy="250" r="202" fill="none" stroke="rgba(197,198,203,0.22)" strokeWidth="0.85" />
                  <circle
                    cx="250"
                    cy="250"
                    r="222"
                    fill="none"
                    stroke="rgba(197,198,203,0.15)"
                    strokeWidth="0.75"
                    strokeDasharray="6 10"
                    className="origin-center spin-slow"
                  />
                  <circle cx="48" cy="265" r="2.5" fill="#F2F0EB" />
                  <circle cx="452" cy="265" r="2.5" fill="#F2F0EB" />
                </svg>

                {/* Center Glow Aura */}
                <div
                  className={`w-64 h-64 rounded-full blur-3xl transition-all duration-700 pointer-events-none ${
                    isLuminosityAmplified ? 'bg-[#F2F0EB]/25 scale-125' : 'bg-[#C5C6CB]/10'
                  }`}
                />

                {/* Floating HUD Badge */}
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

          {/* Bottom Scroll Traverse Invitation */}
          <a
            href="#deadlock"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('deadlock');
            }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#85868B] hover:text-[#F2F0EB] transition-colors group cursor-pointer"
          >
            <span className="text-[10px] tracking-[0.34em] uppercase font-mono">Traverse Architecture</span>
            <div className="w-[1px] h-9 bg-[#242528] overflow-hidden relative">
              <div className="w-full h-1/2 bg-[#F2F0EB] animate-bounce" />
            </div>
          </a>
        </section>

        {/* ========================================== */}
        {/* 4. SECTION 1: BREAKING THE DEADLOCK        */}
        {/* ========================================== */}
        <section
          id="deadlock"
          className="relative min-h-screen w-full flex items-center justify-center py-32 px-4 sm:px-8 lg:px-14 overflow-hidden"
        >
          <div className="max-w-6xl mx-auto w-full relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 text-xs text-[#85868B] font-mono tracking-widest mb-4">
                <span>01 // THE INDUSTRY DEADLOCK</span>
                <span aria-hidden="true">/</span>
                <span>CRYPTOGRAPHIC AUDIT</span>
              </div>

              <h2 className="font-['Cinzel',serif] text-3xl sm:text-5xl lg:text-6xl text-[#F2F0EB] tracking-tight leading-[1.15] mb-6">
                Surveillance vs. Usability <br />
                <span className="silver-gradient-text">Ends Here.</span>
              </h2>

              <p className="text-[#A7A7AD] text-base sm:text-lg font-light leading-relaxed">
                For a decade, cloud storage forced an impossible compromise. Surveillance clouds like Google Drive,
                Dropbox, and OneDrive give you instant search and smart organization—but hold your encryption keys,
                scan your plaintext for AI and ads, and expose you to breaches and subpoenas. Traditional zero-knowledge
                vaults like Cryptomator, MEGA, and Proton Drive encrypt your files client-side—but turn your vault into a
                dumb black box of ciphertext blobs with zero full-text search or secret detection. AVARAN Zero-Vault executes
                semantic indexing and DLP inside isolated browser Web Workers before encryption—delivering absolute
                mathematical blindness and instant intelligence together.
              </p>
            </div>

            {/* Interactive 3-Way Comparison Matrix */}
            <div className="rounded-3xl glass-panel border border-[#C5C6CB]/20 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.85)]">
              <div className="p-6 sm:p-8 border-b border-[#C5C6CB]/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-['Cinzel',serif] text-xl text-[#F2F0EB]">Architectural Comparison Matrix</h3>
                  <p className="text-xs text-[#85868B] font-mono mt-1">
                    SURVEILLANCE CLOUDS vs. TRADITIONAL VAULTS vs. AVARAN ZERO-VAULT
                  </p>
                </div>
                <div className="px-3 py-1 rounded-full border border-[#C5C6CB]/20 text-[10px] font-mono text-[#C5C6CB]">
                  PARADIGM SHIFT // C-WASM + WEBGPU
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#242528] bg-[#111214]/60 text-[11px] font-mono tracking-wider uppercase text-[#85868B]">
                      <th className="py-4 px-6 font-medium">Evaluation Vector</th>
                      <th className="py-4 px-6 font-medium">Surveillance Clouds (Drive/Dropbox)</th>
                      <th className="py-4 px-6 font-medium">Traditional Vaults (MEGA/Cryptomator)</th>
                      <th className="py-4 px-6 font-medium text-[#F2F0EB] bg-[#C5C6CB]/10">AVARAN Zero-Vault</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#242528]/70">
                    <tr className="hover:bg-[#111214]/40 transition-colors">
                      <td className="py-4 px-6 font-medium text-[#F2F0EB]">Client-Side Keys</td>
                      <td className="py-4 px-6 text-[#85868B]">
                        <span className="inline-flex items-center gap-1.5 text-rose-400/90 font-mono text-xs">
                          <X className="w-3.5 h-3.5" /> No (Provider holds keys)
                        </span>
                      </td>
                      <td className="py-4 px-6 text-[#A7A7AD]">
                        <span className="inline-flex items-center gap-1.5 text-emerald-400/90 font-mono text-xs">
                          <Check className="w-3.5 h-3.5" /> Yes
                        </span>
                      </td>
                      <td className="py-4 px-6 bg-[#C5C6CB]/5 font-mono text-xs text-[#F2F0EB]">
                        <span className="inline-flex items-center gap-1.5 text-[#F2F0EB] font-semibold">
                          <Check className="w-3.5 h-3.5 text-[#C5C6CB]" /> Yes (Argon2id + HKDF in Wasm)
                        </span>
                      </td>
                    </tr>

                    <tr className="hover:bg-[#111214]/40 transition-colors">
                      <td className="py-4 px-6 font-medium text-[#F2F0EB]">Server Sees Plaintext</td>
                      <td className="py-4 px-6 text-[#85868B]">
                        <span className="inline-flex items-center gap-1.5 text-rose-400/90 font-mono text-xs">
                          <AlertTriangle className="w-3.5 h-3.5" /> Yes (Scans for AI &amp; Ads)
                        </span>
                      </td>
                      <td className="py-4 px-6 text-[#A7A7AD]">
                        <span className="inline-flex items-center gap-1.5 text-emerald-400/90 font-mono text-xs">
                          <Check className="w-3.5 h-3.5" /> No (Ciphertext blobs only)
                        </span>
                      </td>
                      <td className="py-4 px-6 bg-[#C5C6CB]/5 font-mono text-xs text-[#F2F0EB]">
                        <span className="inline-flex items-center gap-1.5 text-[#F2F0EB] font-semibold">
                          <Check className="w-3.5 h-3.5 text-[#C5C6CB]" /> Never (Untrusted blind octet pipe)
                        </span>
                      </td>
                    </tr>

                    <tr className="hover:bg-[#111214]/40 transition-colors">
                      <td className="py-4 px-6 font-medium text-[#F2F0EB]">Semantic Vector Search</td>
                      <td className="py-4 px-6 text-[#85868B]">
                        <span className="inline-flex items-center gap-1.5 text-[#C5C6CB] font-mono text-xs">
                          Yes (Server-side, cleartext)
                        </span>
                      </td>
                      <td className="py-4 px-6 text-[#85868B]">
                        <span className="inline-flex items-center gap-1.5 text-rose-400/90 font-mono text-xs">
                          <X className="w-3.5 h-3.5" /> No (Dumb storage bucket)
                        </span>
                      </td>
                      <td className="py-4 px-6 bg-[#C5C6CB]/5 font-mono text-xs text-[#F2F0EB]">
                        <span className="inline-flex items-center gap-1.5 text-[#F2F0EB] font-semibold">
                          <Check className="w-3.5 h-3.5 text-[#C5C6CB]" /> Yes (&lt;5ms in-browser 384-dim)
                        </span>
                      </td>
                    </tr>

                    <tr className="hover:bg-[#111214]/40 transition-colors">
                      <td className="py-4 px-6 font-medium text-[#F2F0EB]">Pre-Upload Secret Detection (DLP)</td>
                      <td className="py-4 px-6 text-[#85868B]">
                        <span className="inline-flex items-center gap-1.5 text-rose-400/90 font-mono text-xs">
                          Server-side only (Already leaked)
                        </span>
                      </td>
                      <td className="py-4 px-6 text-[#85868B]">
                        <span className="inline-flex items-center gap-1.5 text-rose-400/90 font-mono text-xs">
                          <X className="w-3.5 h-3.5" /> No
                        </span>
                      </td>
                      <td className="py-4 px-6 bg-[#C5C6CB]/5 font-mono text-xs text-[#F2F0EB]">
                        <span className="inline-flex items-center gap-1.5 text-[#F2F0EB] font-semibold">
                          <Check className="w-3.5 h-3.5 text-[#C5C6CB]" /> Yes (Entropy + WebAuthn lock)
                        </span>
                      </td>
                    </tr>

                    <tr className="hover:bg-[#111214]/40 transition-colors">
                      <td className="py-4 px-6 font-medium text-[#F2F0EB]">Size &amp; Directory Obfuscation</td>
                      <td className="py-4 px-6 text-[#85868B]">
                        <span className="inline-flex items-center gap-1.5 text-rose-400/90 font-mono text-xs">
                          <X className="w-3.5 h-3.5" /> No (Tree &amp; size exposed)
                        </span>
                      </td>
                      <td className="py-4 px-6 text-[#A7A7AD]">
                        <span className="inline-flex items-center gap-1.5 text-amber-400/90 font-mono text-xs">
                          Partial (Leaks file size &amp; tree depth)
                        </span>
                      </td>
                      <td className="py-4 px-6 bg-[#C5C6CB]/5 font-mono text-xs text-[#F2F0EB]">
                        <span className="inline-flex items-center gap-1.5 text-[#F2F0EB] font-semibold">
                          <Check className="w-3.5 h-3.5 text-[#C5C6CB]" /> Full (Monolithic VFS + PADMÉ 4MB)
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================== */}
        {/* 5. SECTION 2: 3 PILLARS (3D TILT CARDS)    */}
        {/* ========================================== */}
        <section id="architecture" className="relative py-32 px-4 sm:px-8 lg:px-14">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <div className="inline-flex items-center gap-2 text-xs text-[#85868B] font-mono tracking-widest mb-4">
                <span>02 // ARCHITECTURAL NOVELTY</span>
                <span aria-hidden="true">/</span>
                <span>CORE PILLARS</span>
              </div>
              <h2 className="font-['Cinzel',serif] text-3xl sm:text-5xl lg:text-6xl text-[#F2F0EB] tracking-tight mb-5">
                Three Pillars of <span className="silver-gradient-text">Zero-Knowledge Sovereignty</span>
              </h2>
              <p className="text-[#A7A7AD] text-base sm:text-lg font-light">
                Hardware-enforced WebAssembly cryptography, uniform block slicing, and client-side ONNX machine learning.
              </p>
            </div>

            {/* Three 3D Tilt Bento Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Pillar 1: C-to-Wasm */}
              <article
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
                onClick={() => openModalWithSpec('crypto-wasm')}
                onMouseEnter={() => setCursorExpanded(true)}
                className="tilt-card silver-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between group cursor-pointer transition-all duration-300"
              >
                <div>
                  <div className="relative h-60 w-full rounded-2xl overflow-hidden mb-7 border border-[#C5C6CB]/15 bg-[#050505]">
                    <img
                      src={CARD_ORBITAL}
                      alt="C-to-WebAssembly Crypto Engine"
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full glass-panel text-[10px] font-mono tracking-widest text-[#C5C6CB] uppercase">
                      SYS // CRYPTO-WASM
                    </div>
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-full glass-panel flex items-center justify-center text-[#F2F0EB] group-hover:rotate-45 group-hover:bg-[#F2F0EB] group-hover:text-[#050505] transition-all duration-500">
                      <Binary className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#85868B] mb-2">
                    HARDWARE-LEVEL ENCLAVE
                  </div>
                  <h3 className="font-['Cinzel',serif] text-2xl text-[#F2F0EB] mb-3 group-hover:text-[#C5C6CB] transition-colors">
                    C-to-WebAssembly Crypto Engine
                  </h3>
                  <p className="text-sm text-[#A7A7AD] font-light leading-relaxed mb-6">
                    Implements memory-hard Argon2id key derivation, HKDF-SHA256 key separation (isolated Key_Auth and
                    Key_KEK), and explicit memory zeroing (<code className="text-[#F2F0EB] font-mono">explicit_bzero</code>{' '}
                    resistant to LLVM dead-store optimization) so plaintext buffers and keys never linger in the JavaScript
                    V8 garbage-collected heap.
                  </p>
                </div>

                <div className="pt-5 border-t border-[#C5C6CB]/10 flex items-center justify-between">
                  <span className="text-xs font-mono text-[#C5C6CB]">MEMORY HYGIENE: EXPLICIT_BZERO</span>
                  <span className="inline-flex items-center gap-1.5 text-xs tracking-widest uppercase text-[#F2F0EB] group-hover:translate-x-1 transition-transform">
                    Inspect <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>

              {/* Pillar 2: Decoupled VFS & PADMÉ */}
              <article
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
                onClick={() => openModalWithSpec('vfs-padme')}
                onMouseEnter={() => setCursorExpanded(true)}
                className="tilt-card silver-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between group cursor-pointer transition-all duration-300"
              >
                <div>
                  <div className="relative h-60 w-full rounded-2xl overflow-hidden mb-7 border border-[#C5C6CB]/15 bg-[#050505]">
                    <img
                      src={CARD_GRID}
                      alt="Decoupled VFS & PADMÉ Padding"
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full glass-panel text-[10px] font-mono tracking-widest text-[#C5C6CB] uppercase">
                      SYS // VFS-PADMÉ
                    </div>
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-full glass-panel flex items-center justify-center text-[#F2F0EB] group-hover:rotate-45 group-hover:bg-[#F2F0EB] group-hover:text-[#050505] transition-all duration-500">
                      <Box className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#85868B] mb-2">
                    PHYSICAL INDISTINGUISHABILITY
                  </div>
                  <h3 className="font-['Cinzel',serif] text-2xl text-[#F2F0EB] mb-3 group-hover:text-[#C5C6CB] transition-colors">
                    Decoupled VFS &amp; PADMÉ Padding
                  </h3>
                  <p className="text-sm text-[#A7A7AD] font-light leading-relaxed mb-6">
                    True decoupling of your logical file system from physical storage. Filenames, directory trees, and
                    chunk UUID pointers live inside a monolithic encrypted VFS Index, while files are sliced into uniform
                    4 MB blocks with PADMÉ padding (≤12% overhead cap)—making 100 small PDFs indistinguishable from a
                    single video file.
                  </p>
                </div>

                <div className="pt-5 border-t border-[#C5C6CB]/10 flex items-center justify-between">
                  <span className="text-xs font-mono text-[#C5C6CB]">UNIFORM BLOCKS: 4 MB STREAM AEAD</span>
                  <span className="inline-flex items-center gap-1.5 text-xs tracking-widest uppercase text-[#F2F0EB] group-hover:translate-x-1 transition-transform">
                    Inspect <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>

              {/* Pillar 3: WebGPU Semantic Search & DLP */}
              <article
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
                onClick={() => openModalWithSpec('webgpu-onnx')}
                onMouseEnter={() => setCursorExpanded(true)}
                className="tilt-card silver-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between group cursor-pointer transition-all duration-300"
              >
                <div>
                  <div className="relative h-60 w-full rounded-2xl overflow-hidden mb-7 border border-[#C5C6CB]/15 bg-[#050505]">
                    <img
                      src={CARD_WAVE}
                      alt="In-Browser Semantic Search & DLP"
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full glass-panel text-[10px] font-mono tracking-widest text-[#C5C6CB] uppercase">
                      SYS // WEBGPU-ONNX
                    </div>
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-full glass-panel flex items-center justify-center text-[#F2F0EB] group-hover:rotate-45 group-hover:bg-[#F2F0EB] group-hover:text-[#050505] transition-all duration-500">
                      <Cpu className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#85868B] mb-2">
                    CLIENT-SIDE COGNITION
                  </div>
                  <h3 className="font-['Cinzel',serif] text-2xl text-[#F2F0EB] mb-3 group-hover:text-[#C5C6CB] transition-colors">
                    In-Browser Semantic Search &amp; DLP
                  </h3>
                  <p className="text-sm text-[#A7A7AD] font-light leading-relaxed mb-6">
                    Bridges WebGPU/ONNX machine learning with zero-knowledge cryptography inside sandboxed Web Workers.
                    Search natural queries like &quot;tax invoice from March&quot; in under 5ms via 384-dim float embeddings,
                    while a pre-encryption Shannon entropy scanner flags .env files, SSH keys, and PII for mandatory
                    WebAuthn Passkey verification.
                  </p>
                </div>

                <div className="pt-5 border-t border-[#C5C6CB]/10 flex items-center justify-between">
                  <span className="text-xs font-mono text-[#C5C6CB]">VECTOR SEARCH: 384-DIM &lt; 5MS</span>
                  <span className="inline-flex items-center gap-1.5 text-xs tracking-widest uppercase text-[#F2F0EB] group-hover:translate-x-1 transition-transform">
                    Inspect <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ========================================== */}
        {/* 6. SECTION 3: 5-STAGE BLIND UPLOAD PIPELINE */}
        {/* ========================================== */}
        <section
          id="pipeline"
          className="relative min-h-screen w-full py-32 px-4 sm:px-8 lg:px-14 flex items-center overflow-hidden"
        >
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* Left Controls & Step Explanation */}
            <div className="lg:col-span-7 flex flex-col items-start">
              <div className="inline-flex items-center gap-2 text-xs text-[#85868B] font-mono tracking-widest mb-4">
                <span>03 // SYSTEM ARCHITECTURE</span>
                <span aria-hidden="true">/</span>
                <span>5-STAGE CHOREOGRAPHY</span>
              </div>

              <h2 className="font-['Cinzel',serif] text-3xl sm:text-5xl text-[#F2F0EB] tracking-tight leading-[1.12] mb-5">
                Life of a <br />
                <span className="silver-gradient-text">Mathematically Blind Upload</span>
              </h2>

              <p className="text-[#A7A7AD] text-base font-light leading-relaxed mb-8 max-w-xl">
                Observe the complete journey of a file from browser drop to encrypted cloud persistence. Every step
                executes in isolated client memory before uniform octet-stream bytes leave your machine.
              </p>

              {/* Step Navigation Bar */}
              <div className="flex items-center gap-2 mb-6 flex-wrap">
                {[1, 2, 3, 4, 5].map((stageNum) => (
                  <button
                    key={stageNum}
                    type="button"
                    onClick={() => {
                      setActiveStage(stageNum);
                      playUiChime(500 + stageNum * 60);
                    }}
                    onMouseEnter={() => setCursorExpanded(true)}
                    onMouseLeave={() => setCursorExpanded(false)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                      activeStage === stageNum
                        ? 'bg-[#F2F0EB] text-[#050505] font-semibold shadow-[0_0_15px_rgba(242,240,235,0.4)]'
                        : 'border border-[#C5C6CB]/20 bg-[#111214]/60 text-[#A7A7AD] hover:text-[#F2F0EB]'
                    }`}
                  >
                    Stage 0{stageNum}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setIsPipelinePlaying(!isPipelinePlaying)}
                  className="px-3 py-1.5 rounded-lg border border-[#C5C6CB]/25 bg-[#242528]/80 text-[#F2F0EB] text-xs font-mono flex items-center gap-1.5 hover:border-[#F2F0EB] transition-colors"
                >
                  {isPipelinePlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5" /> Pause Cycle
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" /> Auto Traverse
                    </>
                  )}
                </button>
              </div>

              {/* Stage Detail Card */}
              <div className="w-full max-w-xl p-6 sm:p-8 rounded-3xl glass-panel border border-[#C5C6CB]/20 space-y-4 shadow-[0_15px_45px_rgba(0,0,0,0.85)]">
                {activeStage === 1 && (
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-[#85868B] mb-2">
                      <span className="text-[#C5C6CB]">MAIN UI THREAD // INGESTION</span>
                      <span className="tabular-nums">STAGE 01 / 05</span>
                    </div>
                    <h3 className="font-['Cinzel',serif] text-xl text-[#F2F0EB] mb-2">
                      Zero-Copy Worker Handshake
                    </h3>
                    <p className="text-sm text-[#A7A7AD] leading-relaxed mb-4">
                      The user drops a 500 MB file into React. The native file handle transfers immediately to a
                      dedicated, isolated Web Worker thread via zero-copy buffer transfer, preventing main-thread UI jank.
                    </p>
                    <div className="p-3.5 rounded-xl bg-[#050505]/80 border border-[#C5C6CB]/15 font-mono text-xs text-[#85868B] space-y-1">
                      <div>INGESTION METHOD: <span className="text-[#F2F0EB]">HTML5 Drag-and-Drop FileHandle</span></div>
                      <div>DISPATCH TARGET: <span className="text-[#C5C6CB]">crypto-pipeline.worker.js</span></div>
                      <div>MAIN THREAD BLOCKING: <span className="text-emerald-400 font-semibold">0.00 ms (Non-Blocking)</span></div>
                    </div>
                  </div>
                )}

                {activeStage === 2 && (
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-[#85868B] mb-2">
                      <span className="text-[#C5C6CB]">ISOLATED WEB WORKER // PRE-ENCRYPTION AI &amp; DLP</span>
                      <span className="tabular-nums">STAGE 02 / 05</span>
                    </div>
                    <h3 className="font-['Cinzel',serif] text-xl text-[#F2F0EB] mb-2">
                      Client-Side Semantic Vector Embedding &amp; Shannon Scanner
                    </h3>
                    <p className="text-sm text-[#A7A7AD] leading-relaxed mb-4">
                      Before encryption begins, the sandboxed worker extracts textual snippets in memory, computes a
                      384-dimensional dense semantic embedding via local WebGPU/ONNX runtime, and scans buffers with a
                      Shannon entropy detector to flag raw .env secrets, SSH private keys, and PII.
                    </p>
                    <div className="p-3.5 rounded-xl bg-[#050505]/80 border border-[#C5C6CB]/15 font-mono text-xs text-[#85868B] space-y-1">
                      <div>EMBEDDING SPEC: <span className="text-[#F2F0EB]">MiniLM-L6-v2 (384-Dim Float32 via WebGPU)</span></div>
                      <div>DLP ENGINE: <span className="text-[#C5C6CB]">Shannon Entropy Threshold (&gt; 4.85 bits/byte)</span></div>
                      <div>SENSITIVITY ENCLAVE: <span className="text-amber-400 font-semibold">WebAuthn Passkey Guard Active</span></div>
                    </div>
                  </div>
                )}

                {activeStage === 3 && (
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-[#85868B] mb-2">
                      <span className="text-[#C5C6CB]">ISOLATED WEB WORKER // CHUNKED STREAM AEAD</span>
                      <span className="tabular-nums">STAGE 03 / 05</span>
                    </div>
                    <h3 className="font-['Cinzel',serif] text-xl text-[#F2F0EB] mb-2">
                      4 MB Slicing, PADMÉ Padding &amp; Counter-Nonce AEAD
                    </h3>
                    <p className="text-sm text-[#A7A7AD] leading-relaxed mb-4">
                      The worker slices the file into uniform 4 MB ArrayBuffers, pads the final chunk with PADMÉ, and encrypts
                      each block with a unique per-file DEK using C-to-Wasm STREAM AEAD. Nonces use strict sequential counters,
                      and AAD binds <code className="text-[#F2F0EB]">(file_id, chunk_index, is_last_chunk)</code> to prevent reordering.
                    </p>
                    <div className="p-3.5 rounded-xl bg-[#050505]/80 border border-[#C5C6CB]/15 font-mono text-xs text-[#85868B] space-y-1">
                      <div>BLOCK SIZE: <span className="text-[#F2F0EB]">4,194,304 Bytes (4 MB Uniform)</span></div>
                      <div>PADDING SPEC: <span className="text-[#C5C6CB]">PADMÉ (Purf &amp; Teutsch, ≤12% Overhead)</span></div>
                      <div>AUTHENTICATED DATA: <span className="text-emerald-400 font-semibold">AAD cryptographically bound</span></div>
                    </div>
                  </div>
                )}

                {activeStage === 4 && (
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-[#85868B] mb-2">
                      <span className="text-[#C5C6CB]">ISOLATED WEB WORKER // MONOLITHIC VFS UPDATE</span>
                      <span className="tabular-nums">STAGE 04 / 05</span>
                    </div>
                    <h3 className="font-['Cinzel',serif] text-xl text-[#F2F0EB] mb-2">
                      Monolithic Encrypted VFS Index Seal
                    </h3>
                    <p className="text-sm text-[#A7A7AD] leading-relaxed mb-4">
                      The per-file DEK, original filename, directory tree path, chunk UUID pointers, WebAuthn sensitivity
                      flag, and 384-dim semantic vector embedding are serialized into the monolithic VFS Index and encrypted
                      under Key_Vault. Memory is wiped with <code className="text-[#F2F0EB]">explicit_bzero</code>.
                    </p>
                    <div className="p-3.5 rounded-xl bg-[#050505]/80 border border-[#C5C6CB]/15 font-mono text-xs text-[#85868B] space-y-1">
                      <div>VFS ARCHITECTURE: <span className="text-[#F2F0EB]">Monolithic Decoupled Index</span></div>
                      <div>KEY ZEROIZATION: <span className="text-emerald-400 font-semibold">explicit_bzero in C/Wasm Linear Memory</span></div>
                      <div>V8 HEAP FOOTPRINT: <span className="text-[#C5C6CB]">0 Plaintext Keys in GC Heap</span></div>
                    </div>
                  </div>
                )}

                {activeStage === 5 && (
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-[#85868B] mb-2">
                      <span className="text-[#C5C6CB]">BLIND FASTAPI CLOUD // OCTET-STREAM PIPE</span>
                      <span className="tabular-nums">STAGE 05 / 05</span>
                    </div>
                    <h3 className="font-['Cinzel',serif] text-xl text-[#F2F0EB] mb-2">
                      Untrusted Blind Ingestion &amp; S3 Sink
                    </h3>
                    <p className="text-sm text-[#A7A7AD] leading-relaxed mb-4">
                      The Python + FastAPI backend receives uniform <code className="text-[#F2F0EB]">application/octet-stream</code> blobs
                      identified purely by random UUIDs. The cloud server writes bytes directly to S3 object storage—mathematically
                      blind to file identity, structure, contents, or directory depth.
                    </p>
                    <div className="p-3.5 rounded-xl bg-[#050505]/80 border border-[#C5C6CB]/15 font-mono text-xs text-[#85868B] space-y-1">
                      <div>CLOUD VISIBILITY: <span className="text-emerald-400 font-semibold">0.00% (Blind Octet-Stream)</span></div>
                      <div>STORED NAMES: <span className="text-[#C5C6CB]">Random UUIDv4 Only</span></div>
                      <div>SUBPOENA RESISTANCE: <span className="text-[#F2F0EB]">Mathematically Indistinguishable Chunks</span></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Telemetry & Interactive Astrolabe Tuning */}
            <div className="lg:col-span-5 relative flex items-center justify-center min-h-[380px]">
              <div className="relative w-full max-w-[460px] aspect-square flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 460 460">
                  <circle cx="230" cy="230" r="190" fill="none" stroke="rgba(197, 198, 203, 0.18)" strokeWidth="0.8" />
                  <circle
                    cx="230"
                    cy="230"
                    r="215"
                    fill="none"
                    stroke="rgba(242, 240, 235, 0.22)"
                    strokeWidth="0.85"
                    strokeDasharray="4 8"
                    className="origin-center spin-slow-reverse"
                  />
                  <line x1="230" y1="20" x2="230" y2="440" stroke="rgba(197, 198, 203, 0.15)" strokeWidth="0.7" />
                  <line x1="20" y1="230" x2="440" y2="230" stroke="rgba(197, 198, 203, 0.15)" strokeWidth="0.7" />
                </svg>

                {/* Floating Telemetry Callouts */}
                <div className="absolute top-10 left-2 sm:left-6 px-4 py-2.5 rounded-xl glass-panel text-left">
                  <div className="text-[9px] font-mono tracking-widest text-[#85868B]">ACTIVE PIPELINE</div>
                  <div className="font-['Cinzel',serif] text-sm text-[#F2F0EB]">STAGE 0{activeStage} // LOCKED</div>
                </div>

                <div className="absolute bottom-12 right-2 sm:right-6 px-4 py-2.5 rounded-xl glass-panel text-left">
                  <div className="text-[9px] font-mono tracking-widest text-[#85868B]">STREAM CIPHER</div>
                  <div className="font-['Cinzel',serif] text-sm text-[#F2F0EB]">XCHACHA20-POLY1305</div>
                </div>

                <div className="absolute top-1/2 -translate-y-1/2 right-0 px-3.5 py-2 rounded-xl glass-panel text-left">
                  <div className="text-[9px] font-mono tracking-widest text-[#85868B]">WASM THROUGHPUT</div>
                  <div className="font-['Cinzel',serif] text-sm text-[#F2F0EB] tabular-nums">
                    {(speedMultiplier * 1.8).toFixed(2)} GB/s
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================== */}
        {/* 7. SECTION 4: 5-POINT THREAT MATRIX        */}
        {/* ========================================== */}
        <section id="defense" className="relative py-32 px-4 sm:px-8 lg:px-14">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <div className="inline-flex items-center gap-2 text-xs text-[#85868B] font-mono tracking-widest mb-4">
                <span>04 // THREAT MODELING &amp; DEFENSE MATRIX</span>
                <span aria-hidden="true">/</span>
                <span>CRYPTOGRAPHIC HARDENING</span>
              </div>
              <h2 className="font-['Cinzel',serif] text-3xl sm:text-5xl lg:text-6xl text-[#F2F0EB] tracking-tight mb-5">
                Engineered Against <span className="silver-gradient-text">Real-World Vault Failures</span>
              </h2>
              <p className="text-[#A7A7AD] text-base sm:text-lg font-light">
                How AVARAN neutralizes the five fatal vulnerabilities found in legacy encrypted clouds and local AI tools.
              </p>
            </div>

            {/* Defense Tab Navigation */}
            <div className="flex items-center justify-center gap-2 mb-12 flex-wrap">
              {[
                { id: 1, label: '01. Key Wrapping (MEGA Flaw)' },
                { id: 2, label: '02. Chunk Reordering Attacks' },
                { id: 3, label: '03. VFS Metadata Leakage' },
                { id: 4, label: '04. V8 Heap & Localhost AI Trap' },
                { id: 5, label: '05. Blind Vector Search Proof' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveDefenseTab(tab.id);
                    playUiChime(620);
                  }}
                  onMouseEnter={() => setCursorExpanded(true)}
                  onMouseLeave={() => setCursorExpanded(false)}
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

            {/* Active Threat Card Display */}
            <div className="max-w-4xl mx-auto p-8 sm:p-12 rounded-3xl glass-panel border border-[#C5C6CB]/25 shadow-[0_20px_60px_rgba(0,0,0,0.9)]">
              {activeDefenseTab === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-rose-400 uppercase tracking-widest flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4" /> THREAT: UNAUTHENTICATED KEY WRAPPING
                    </span>
                    <span className="text-xs font-mono text-[#85868B]">REFERENCE: THE MEGA EXPLOIT</span>
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono pt-4 border-t border-[#C5C6CB]/15">
                    <div>DERIVATION: <span className="text-[#F2F0EB]">Argon2id (m=64MB, t=3, p=4)</span></div>
                    <div>SEPARATION: <span className="text-[#C5C6CB]">HKDF-SHA256 (Key_Auth || Key_KEK)</span></div>
                  </div>
                </div>
              )}

              {activeDefenseTab === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-rose-400 uppercase tracking-widest flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4" /> THREAT: CHUNK REORDERING &amp; TRUNCATION
                    </span>
                    <span className="text-xs font-mono text-[#85868B]">REFERENCE: STREAM CIPHER SLICING</span>
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
                    counter nonces and Associated Authenticated Data (AAD) cryptographically binding{' '}
                    <code className="text-[#F2F0EB] font-mono">file_id</code>,{' '}
                    <code className="text-[#F2F0EB] font-mono">chunk_index</code>, and{' '}
                    <code className="text-[#F2F0EB] font-mono">is_last_chunk</code> flag. Any missing, duplicated, or rearranged
                    block causes immediate cryptographic signature failure.
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono pt-4 border-t border-[#C5C6CB]/15">
                    <div>CIPHER: <span className="text-[#F2F0EB]">STREAM AEAD (Poly1305 Auth Tag)</span></div>
                    <div>AAD BINDING: <span className="text-[#C5C6CB]">file_id + chunk_index + is_last</span></div>
                  </div>
                </div>
              )}

              {activeDefenseTab === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-rose-400 uppercase tracking-widest flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4" /> THREAT: VFS METADATA &amp; SIZE LEAKAGE
                    </span>
                    <span className="text-xs font-mono text-[#85868B]">REFERENCE: THE CRYPTOMATOR FLAW</span>
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono pt-4 border-t border-[#C5C6CB]/15">
                    <div>CHUNKING: <span className="text-[#F2F0EB]">4 MB Fixed ArrayBuffers</span></div>
                    <div>OVERHEAD CAP: <span className="text-[#C5C6CB]">PADMÉ Algorithm (≤ 12%)</span></div>
                  </div>
                </div>
              )}

              {activeDefenseTab === 4 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-rose-400 uppercase tracking-widest flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4" /> THREAT: V8 HEAP LINGERING &amp; LOCALHOST AI TRAP
                    </span>
                    <span className="text-xs font-mono text-[#85868B]">REFERENCE: OLLAMA / LOCALHOST TRAP</span>
                  </div>
                  <h3 className="font-['Cinzel',serif] text-2xl sm:text-3xl text-[#F2F0EB]">
                    Eradicating V8 Heap Key Lingering &amp; Localhost AI Traps
                  </h3>
                  <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/20 text-xs sm:text-sm text-[#A7A7AD] leading-relaxed">
                    <strong className="text-rose-300">The Fatal Vulnerability:</strong> Standard JavaScript Web Crypto
                    leaves plaintext buffers and keys lingering indefinitely in the V8 garbage-collected heap. Meanwhile,
                    local AI tools that route files through <code className="text-rose-200">localhost:11434</code> (with{' '}
                    <code className="text-rose-200">OLLAMA_ORIGINS=*</code>) destroy the browser sandbox, exposing decrypted
                    data to cross-tab stealing attacks.
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs sm:text-sm text-[#A7A7AD] leading-relaxed">
                    <strong className="text-emerald-300">The AVARAN Defense:</strong> All cryptographic operations and vector
                    cosine math run strictly inside C/Wasm linear memory and are wiped immediately via{' '}
                    <code className="text-[#F2F0EB] font-mono">explicit_bzero</code>. All AI inference runs strictly inside
                    isolated browser Web Workers via WebGPU/ONNX—never binding to insecure localhost network ports.
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono pt-4 border-t border-[#C5C6CB]/15">
                    <div>MEMORY ZEROING: <span className="text-[#F2F0EB]">explicit_bzero in Wasm</span></div>
                    <div>AI ISOLATION: <span className="text-[#C5C6CB]">In-Worker WebGPU (No Localhost Ports)</span></div>
                  </div>
                </div>
              )}

              {activeDefenseTab === 5 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" /> MATHEMATICAL PROOF: 0.00% SERVER VISIBILITY
                    </span>
                    <span className="text-xs font-mono text-[#85868B]">REFERENCE: BLIND COSINE SIMILARITY</span>
                  </div>
                  <h3 className="font-['Cinzel',serif] text-2xl sm:text-3xl text-[#F2F0EB]">
                    Blind In-Browser Cosine Similarity
                  </h3>
                  <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs sm:text-sm text-[#A7A7AD] leading-relaxed">
                    <strong className="text-emerald-300">Cryptographic Invariant:</strong> Cloud vector databases
                    (Pinecone, pgvector) require cleartext or homomorphic embeddings that leak query intent. In AVARAN Zero-Vault,
                    the entire 384-dimensional vector database resides within the client&apos;s encrypted monolithic VFS. Search
                    queries are embedded locally via WebGPU and evaluated in C/Wasm memory in &lt; 5 ms. Zero search vectors
                    or search tokens ever touch the network pipe.
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono pt-4 border-t border-[#C5C6CB]/15">
                    <div>VECTOR DIMENSION: <span className="text-[#F2F0EB]">384-Dim Dense Embeddings</span></div>
                    <div>QUERY TRANSMISSION: <span className="text-emerald-400 font-semibold">0 Bytes Transmitted</span></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ========================================== */}
        {/* 8. SECTION 5: FINAL CTA & PROVISIONING     */}
        {/* ========================================== */}
        <section
          id="vault"
          className="relative min-h-[90vh] w-full flex items-center justify-center py-32 px-4 sm:px-8 lg:px-14 overflow-hidden"
        >
          {/* Subtle Ambient Orbital Aura */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
            <svg className="w-[600px] h-[600px] max-w-none" viewBox="0 0 600 600">
              <circle cx="300" cy="300" r="240" fill="none" stroke="rgba(242,240,235,0.28)" strokeWidth="0.9" />
              <circle
                cx="300"
                cy="300"
                r="195"
                fill="none"
                stroke="rgba(197,198,203,0.22)"
                strokeWidth="0.75"
                strokeDasharray="5 9"
                className="origin-center spin-slow"
              />
              <ellipse
                cx="300"
                cy="300"
                rx="250"
                ry="95"
                fill="none"
                stroke="rgba(242,240,235,0.32)"
                strokeWidth="1"
                transform="rotate(-28 300 300)"
              />
            </svg>
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10 w-full">
            <div className="w-20 h-20 mx-auto mb-8 rounded-full border border-[#C5C6CB]/30 bg-[#050505]/90 flex items-center justify-center shadow-[0_0_50px_rgba(242,240,235,0.2)]">
              <img src={AVARAN_LOGO} alt="AVARAN Emblem" className="w-16 h-16 object-contain logo-blend" />
            </div>

            <div className="text-[11px] font-mono tracking-[0.38em] uppercase text-[#C5C6CB] mb-5">
              05 // ZERO-TRUST DEPLOYMENT
            </div>

            <h2 className="font-['Cinzel',serif] text-4xl sm:text-6xl lg:text-7xl text-[#F2F0EB] tracking-tight leading-[1.1] mb-6">
              Your Data. <br className="hidden sm:inline" />
              <span className="silver-gradient-text">Mathematically Invisible.</span>
            </h2>

            <p className="text-[#A7A7AD] text-base sm:text-xl font-light max-w-2xl mx-auto mb-10">
              Stop choosing between cloud intelligence and cryptographic sovereignty. Initialize an isolated AVARAN
              Zero-Vault cluster with client-side WebGPU search and Wasm AEAD protection.
            </p>

            {/* Test Bench & Provisioning Trigger */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => openModalWithSpec('default')}
                onMouseEnter={() => setCursorExpanded(true)}
                onMouseLeave={() => setCursorExpanded(false)}
                className="group relative inline-flex items-center gap-4 px-10 py-5 rounded-full bg-gradient-to-r from-[#F2F0EB] via-[#C5C6CB] to-[#F2F0EB] text-[#050505] font-semibold text-xs sm:text-sm tracking-[0.24em] uppercase shadow-[0_0_50px_rgba(242,240,235,0.35)] hover:shadow-[0_0_75px_rgba(242,240,235,0.65)] transition-all cursor-pointer"
              >
                <span>Initialize Zero-Vault</span>
                <Sparkles className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" />
              </button>

              <button
                type="button"
                onClick={() => openModalWithSpec('webgpu-onnx')}
                onMouseEnter={() => setCursorExpanded(true)}
                onMouseLeave={() => setCursorExpanded(false)}
                className="inline-flex items-center gap-3 px-8 py-5 rounded-full border border-[#C5C6CB]/30 bg-[#111214]/60 text-xs tracking-[0.2em] uppercase text-[#F2F0EB] hover:bg-[#242528] transition-all cursor-pointer"
              >
                <Terminal className="w-4 h-4 text-[#C5C6CB]" />
                <span>Launch Client DLP &amp; Search Test Bench</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ========================================== */}
      {/* 9. MINIMAL EDITORIAL FOOTER                */}
      {/* ========================================== */}
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
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                scrollTo('home');
              }}
              className="hover:text-[#F2F0EB] transition-colors"
            >
              Top
            </a>
            <a
              href="#deadlock"
              onClick={(e) => {
                e.preventDefault();
                scrollTo('deadlock');
              }}
              className="hover:text-[#F2F0EB] transition-colors"
            >
              Deadlock
            </a>
            <a
              href="#pipeline"
              onClick={(e) => {
                e.preventDefault();
                scrollTo('pipeline');
              }}
              className="hover:text-[#F2F0EB] transition-colors"
            >
              Pipeline
            </a>
            <a
              href="#defense"
              onClick={(e) => {
                e.preventDefault();
                scrollTo('defense');
              }}
              className="hover:text-[#F2F0EB] transition-colors"
            >
              Defense
            </a>
            <a
              href="#architecture"
              onClick={(e) => {
                e.preventDefault();
                scrollTo('architecture');
              }}
              className="hover:text-[#F2F0EB] transition-colors"
            >
              Architecture
            </a>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-mono text-[#85868B]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>0.00% SERVER VISIBILITY · PADMÉ 4MB BLIND PIPE</span>
          </div>
        </div>
      </footer>

      {/* ========================================== */}
      {/* 10. INTERACTIVE TEST BENCH & MODAL         */}
      {/* ========================================== */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 z-[95] flex items-center justify-center p-4 sm:p-6 bg-[#050505]/85 backdrop-blur-2xl transition-opacity duration-300 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
        >
          <div className="relative w-full max-w-2xl rounded-3xl glass-panel border border-[#C5C6CB]/30 p-7 sm:p-10 shadow-[0_25px_80px_rgba(0,0,0,0.95)] my-8">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              aria-label="Close modal"
              className="absolute top-6 right-6 w-10 h-10 rounded-full border border-[#C5C6CB]/20 flex items-center justify-center text-[#A7A7AD] hover:text-[#F2F0EB] hover:border-[#F2F0EB] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <img src={AVARAN_LOGO} alt="AVARAN" className="w-8 h-8 object-contain logo-blend" />
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#C5C6CB]">
                {selectedModalSpec.tag}
              </span>
            </div>

            <h3 id="modal-title" className="font-['Cinzel',serif] text-2xl sm:text-3xl text-[#F2F0EB] mb-2">
              {selectedModalSpec.title}
            </h3>

            <p className="text-sm text-[#A7A7AD] font-light leading-relaxed mb-6">
              {selectedModalSpec.desc}
            </p>

            {/* LIVE CLIENT-SIDE PRE-ENCRYPTION DLP & SEARCH TEST BENCH */}
            <div className="p-5 rounded-2xl bg-[#050505]/80 border border-[#C5C6CB]/20 mb-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase text-[#F2F0EB] flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-[#C5C6CB]" />
                  Live Client DLP &amp; Vector Test Bench
                </span>
                <span className="text-[10px] font-mono text-emerald-400">IN-WORKER SIMULATION</span>
              </div>

              {/* Sample Presets */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono text-[#85868B]">PRESETS:</span>
                <button
                  type="button"
                  onClick={() => setDemoInput('Tax invoice and Q1 financial audit from March 2026')}
                  className="px-2.5 py-1 rounded bg-[#111214] text-[10px] font-mono text-[#A7A7AD] hover:text-[#F2F0EB] border border-[#242528]"
                >
                  Clear Invoice
                </button>
                <button
                  type="button"
                  onClick={() => setDemoInput('export AWS_SECRET_ACCESS_KEY="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"')}
                  className="px-2.5 py-1 rounded bg-[#111214] text-[10px] font-mono text-[#A7A7AD] hover:text-[#F2F0EB] border border-[#242528]"
                >
                  AWS API Secret
                </button>
                <button
                  type="button"
                  onClick={() => setDemoInput('-----BEGIN OPENSSH PRIVATE KEY-----\nb3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQ...')}
                  className="px-2.5 py-1 rounded bg-[#111214] text-[10px] font-mono text-[#A7A7AD] hover:text-[#F2F0EB] border border-[#242528]"
                >
                  SSH Key
                </button>
              </div>

              {/* Live Input Field */}
              <div>
                <label className="block text-[10px] font-mono text-[#85868B] uppercase mb-1">
                  BUFFER CONTENT TO TEST (PRE-ENCRYPTION PASS):
                </label>
                <textarea
                  rows={2}
                  value={demoInput}
                  onChange={(e) => setDemoInput(e.target.value)}
                  placeholder="Enter sample file contents or search query..."
                  className="w-full px-3 py-2 rounded-xl bg-[#111214] border border-[#C5C6CB]/20 text-xs font-mono text-[#F2F0EB] placeholder-[#85868B]/40 focus:outline-none focus:border-[#F2F0EB] transition-colors resize-none"
                />
              </div>

              {/* Live DLP and Vector Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] font-mono pt-2 border-t border-[#242528]">
                <div>
                  <span className="text-[#85868B] block text-[9px]">SHANNON ENTROPY</span>
                  <span className={`font-semibold tabular-nums ${demoEntropy > 4.85 ? 'text-amber-400' : 'text-[#F2F0EB]'}`}>
                    {demoEntropy} bits/B
                  </span>
                </div>
                <div>
                  <span className="text-[#85868B] block text-[9px]">VECTOR SEARCH</span>
                  <span className="text-[#F2F0EB] font-semibold tabular-nums">&lt; 3.8 ms</span>
                </div>
                <div>
                  <span className="text-[#85868B] block text-[9px]">COSINE MATCH</span>
                  <span className="text-emerald-400 font-semibold tabular-nums">{demoCosineSim}</span>
                </div>
                <div>
                  <span className="text-[#85868B] block text-[9px]">PADMÉ SLICES</span>
                  <span className="text-[#C5C6CB] font-semibold">{demoChunkCount} x 4MB</span>
                </div>
              </div>

              {/* Security Alert if Secret Detected */}
              {demoSecretDetected && (
                <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2 text-amber-300">
                    <Fingerprint className="w-4 h-4 text-amber-400" />
                    <span>DLP DETECTED: {demoSecretDetected}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-200">
                    WebAuthn Lock Active
                  </span>
                </div>
              )}
            </div>

            {/* Form */}
            {!modalSuccess ? (
              <form onSubmit={handleModalSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="architect-name"
                    className="block text-[10px] font-mono tracking-widest uppercase text-[#85868B] mb-1.5"
                  >
                    VAULT OWNER IDENTIFIER
                  </label>
                  <input
                    id="architect-name"
                    type="text"
                    required
                    value={architectName}
                    onChange={(e) => setArchitectName(e.target.value)}
                    placeholder="Dr. Julian Vance // Sovereign Lab"
                    className="w-full px-4 py-3 rounded-xl bg-[#050505]/90 border border-[#C5C6CB]/20 text-sm text-[#F2F0EB] placeholder-[#85868B]/50 focus:outline-none focus:border-[#F2F0EB] transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="architect-email"
                    className="block text-[10px] font-mono tracking-widest uppercase text-[#85868B] mb-1.5"
                  >
                    TRANSMISSION ENDPOINT (EMAIL FOR PASSKEY ENROLLMENT)
                  </label>
                  <input
                    id="architect-email"
                    type="email"
                    required
                    value={architectEmail}
                    onChange={(e) => setArchitectEmail(e.target.value)}
                    placeholder="julian@zero-vault.org"
                    className="w-full px-4 py-3 rounded-xl bg-[#050505]/90 border border-[#C5C6CB]/20 text-sm text-[#F2F0EB] placeholder-[#85868B]/50 focus:outline-none focus:border-[#F2F0EB] transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="architect-tier"
                    className="block text-[10px] font-mono tracking-widest uppercase text-[#85868B] mb-1.5"
                  >
                    ZERO-VAULT DEPLOYMENT PROFILE
                  </label>
                  <select
                    id="architect-tier"
                    value={selectedTier}
                    onChange={(e) => setSelectedTier(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#050505]/90 border border-[#C5C6CB]/20 text-sm text-[#F2F0EB] focus:outline-none focus:border-[#F2F0EB] transition-colors"
                  >
                    <option value="C/Wasm STREAM AEAD Enclave">C/Wasm STREAM AEAD Enclave (4 MB PADMÉ)</option>
                    <option value="Monolithic PADMÉ Storage Fabric">Monolithic PADMÉ Storage Fabric (Zero Metadata)</option>
                    <option value="Client WebGPU Vector Enclave">Client WebGPU Vector Enclave (384-Dim &lt;5ms)</option>
                    <option value="Sovereign Zero-Vault Cluster">Sovereign Zero-Vault Cluster (Full Enterprise)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-4 rounded-full bg-[#F2F0EB] text-[#050505] font-semibold text-xs tracking-[0.22em] uppercase hover:bg-[#C5C6CB] transition-colors cursor-pointer"
                >
                  Initialize Sovereign Zero-Vault Handshake
                </button>
              </form>
            ) : (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#C5C6CB]/15 border border-[#F2F0EB] mx-auto flex items-center justify-center text-[#F2F0EB]">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-['Cinzel',serif] text-xl text-[#F2F0EB]">Argon2id + HKDF Key Derivation Sealed</h4>
                <p className="text-xs text-[#A7A7AD] font-mono tracking-wider">
                  ZERO-VAULT ALLOCATED FOR {architectName.toUpperCase() || 'VAULT ARCHITECT'} // [{selectedTier.toUpperCase()}]
                </p>
                <div className="p-3 rounded-xl bg-[#050505] border border-[#C5C6CB]/20 text-[10px] font-mono text-[#85868B] text-left max-w-md mx-auto space-y-1">
                  <div>KEY_AUTH: <span className="text-[#F2F0EB]">0x4f8e...c21a (Derived via Argon2id)</span></div>
                  <div>KEY_KEK: <span className="text-[#F2F0EB]">0x9b1d...77fe (Isolated in Wasm)</span></div>
                  <div>VFS REPOSITORY: <span className="text-emerald-400">Mounted · 0.00% Server Visibility</span></div>
                </div>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="mt-3 px-6 py-2 rounded-full border border-[#C5C6CB]/30 text-xs font-mono uppercase text-[#A7A7AD] hover:text-[#F2F0EB] hover:border-[#F2F0EB] transition-colors"
                >
                  Dismiss Terminal
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
