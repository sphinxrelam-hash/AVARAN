import React, { useEffect, useRef, useState, useTransition } from 'react';
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
  BarChart2,
  GitMerge,
  ShieldCheck,
  Users,
  Cpu,
  Layers,
  Activity,
  RotateCcw,
  Sliders,
  Radio,
  ExternalLink
} from 'lucide-react';

// Assets
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
}

const MODAL_SPECS: Record<string, ModalSpec> = {
  'orbital-synthesis': {
    tag: 'SYS // 01.A SPECIFICATION',
    title: 'Cognitive Orbital Synthesis',
    desc: 'Provision an autonomous multi-agent orbital mesh with 1.4 PB/s internal bandwidth and zero-entropy consensus routing.',
    tier: 'Cognitive Orbital Synthesis',
    throughput: '1.4 PB/S',
    latency: '0.04 ms'
  },
  'quantum-telemetry': {
    tag: 'SYS // 02.B SPECIFICATION',
    title: 'Astrolabe Spatial Telemetry',
    desc: 'Deploy multi-planar spatial observability across distributed clusters with sub-millimeter anomaly isolation.',
    tier: 'Astrolabe Spatial Telemetry',
    throughput: '980 TB/S',
    latency: '0.08 ms'
  },
  'kinetic-morphogenesis': {
    tag: 'SYS // 03.C SPECIFICATION',
    title: 'Kinetic Continuum Engine',
    desc: 'Activate fluid-mercury execution pipelines that dynamically balance high-density workloads across global regions.',
    tier: 'Kinetic Continuum Engine',
    throughput: '2.1 PB/S',
    latency: '0.02 ms'
  },
  default: {
    tag: 'ORBITAL INITIALIZATION',
    title: 'Begin Your AVARAN Journey',
    desc: 'Enter your institutional coordinates below to provision an isolated AVARAN node or schedule a private architectural briefing.',
    tier: 'Full Sovereign Enterprise Cluster',
    throughput: 'Unlimited',
    latency: '< 0.05 ms'
  }
};

export default function App() {
  // Preloader State
  const [preloaderFinished, setPreloaderFinished] = useState(false);
  const [preloaderPercent, setPreloaderPercent] = useState(0);
  const [preloaderStage, setPreloaderStage] = useState('CONVERGING SILVER PARTICLES');

  // Sound Engine State
  const [isSoundPlaying, setIsSoundPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  // 3D Sculpture Interactive State
  const [speedMultiplier, setSpeedMultiplier] = useState(1.0);
  const [ringExpansion, setRingExpansion] = useState(100);
  const [hudState, setHudState] = useState('ORBITAL FIELD // INTERACTIVE');
  const [isLuminosityAmplified, setIsLuminosityAmplified] = useState(false);

  // Scroll & Nav State
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('home');
  const [isNavScrolled, setIsNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Domain Filter State in Explore Section
  const [activeDomainFilter, setActiveDomainFilter] = useState<'all' | 'neural' | 'spatial' | 'kinetic'>('all');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedModalSpec, setSelectedModalSpec] = useState<ModalSpec>(MODAL_SPECS.default);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [architectName, setArchitectName] = useState('');
  const [architectEmail, setArchitectEmail] = useState('');
  const [selectedTier, setSelectedTier] = useState('Cognitive Orbital Synthesis');

  // Contact Form State
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    tier: 'Cognitive Orbital Synthesis',
    region: 'Orbital Low-Earth (LEO-Mesh)',
    notes: ''
  });

  // Custom Cursor Refs
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const [cursorExpanded, setCursorExpanded] = useState(false);

  // Canvas Refs
  const webglCanvasRef = useRef<HTMLCanvasElement>(null);
  const preloaderCanvasRef = useRef<HTMLCanvasElement>(null);
  const philosophyCanvasRef = useRef<HTMLCanvasElement>(null);

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
    sectionOffsetX: 2.1,
    sectionScale: 1.0
  });

  // Keep Three.js controller in sync with state
  useEffect(() => {
    threeCtrlRef.current.speedMultiplier = speedMultiplier;
  }, [speedMultiplier]);

  useEffect(() => {
    threeCtrlRef.current.ringExpansion = ringExpansion / 100;
  }, [ringExpansion]);

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

      // Deep harmonic drone oscillators (A2 + E3 + C#4 cosmic chords)
      const freqs = [110, 164.81, 220, 277.18];
      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(f, ctx.currentTime);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(340, ctx.currentTime);

        oscGain.gain.setValueAtTime(0.035 / (idx + 1), ctx.currentTime);
        osc.connect(filter);
        filter.connect(oscGain);
        oscGain.connect(gain);
        osc.start();
      });
    } catch {
      // Audio context not supported or user blocked
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
      gain.gain.exponentialRampToValueAtTime(0.28, ctx.currentTime + 0.8);
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
    let startTime = performance.now();

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

    const duration = 2400; // 2.4s
    const interval = 25;
    const step = 100 / (duration / interval);
    let current = 0;

    const timer = setInterval(() => {
      current = Math.min(100, current + step);
      setPreloaderPercent(Math.round(current));

      if (current < 35) {
        setPreloaderStage('CONVERGING SILVER PARTICLES');
      } else if (current < 70) {
        setPreloaderStage('FORMING ORBITAL STRUCTURE');
      } else {
        setPreloaderStage('MATERIALIZING AVARAN CORE');
      }

      if (current >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          setPreloaderFinished(true);
        }, 400);
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
      } else if (prog < 0.42) {
        // Philosophy: Centered
        threeCtrlRef.current.sectionOffsetX = 0;
        threeCtrlRef.current.sectionScale = 1.22;
      } else if (prog < 0.62) {
        // Explore: Shifted left
        threeCtrlRef.current.sectionOffsetX = -2.4;
        threeCtrlRef.current.sectionScale = 0.85;
      } else if (prog < 0.82) {
        // Experience: Positioned right-center
        threeCtrlRef.current.sectionOffsetX = 1.45;
        threeCtrlRef.current.sectionScale = 1.15;
      } else {
        // Contact: Centered grand alignment
        threeCtrlRef.current.sectionOffsetX = 0;
        threeCtrlRef.current.sectionScale = 1.08;
      }

      // Active Section Spy
      const sectionIds = ['home', 'about', 'explore', 'experience', 'features', 'contact'];
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

  // Smooth scroll handler
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

      // Subtle wireframe edge highlight
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

      // Node sphere along ring
      const nodeGeom = new THREE.SphereGeometry(0.042, 12, 12);
      const nodeMat = new THREE.MeshBasicMaterial({ color: 0xf2f0eb });
      const nodeMesh = new THREE.Mesh(nodeGeom, nodeMat);
      nodeMesh.position.set(r, 0, 0);
      ringMesh.add(nodeMesh);

      ringsGroup.add(ringMesh);
    });

    // Group 3: Floating Cosmic Dust
    const particleCount = isMobile ? 200 : 500;
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

    // Atmospheric Studio Lighting
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

      // Smooth hover interpolation
      ctrl.hoverIntensity += (ctrl.targetHoverIntensity - ctrl.hoverIntensity) * 0.06;
      keyLight.intensity = 2.6 + ctrl.hoverIntensity * 2.2;

      ribbonMaterials.forEach((item) => {
        if (item.isPhysical && 'emissiveIntensity' in item.mat) {
          (item.mat as THREE.MeshPhysicalMaterial).emissiveIntensity = 0.35 + ctrl.hoverIntensity * 0.55;
        }
        item.mat.opacity = Math.min(0.95, item.baseOpacity + ctrl.hoverIntensity * 0.18);
      });

      const speed = ctrl.speedMultiplier * (1 + ctrl.hoverIntensity * 0.45);

      // Rotate ribbons
      ribbonGroup.rotation.y += delta * 0.24 * speed;
      ribbonGroup.rotation.x = Math.sin(elapsed * 0.35) * 0.25 + ctrl.scrollProgress * Math.PI * 1.4;
      ribbonGroup.rotation.z += delta * 0.1 * speed;

      // Rotate rings
      ringsGroup.children.forEach((ring, i) => {
        const dir = i % 2 === 0 ? 1 : -1;
        ring.rotation.z += delta * (0.14 + i * 0.04) * dir * speed;
        ring.rotation.x += delta * 0.08 * dir * speed;
      });

      // Scale rings from state & scroll
      const ringScale = ctrl.ringExpansion * (1 + Math.sin(ctrl.scrollProgress * Math.PI * 2) * 0.12);
      ringsGroup.scale.setScalar(ringScale);

      // Particle rotation
      particleCloud.rotation.y -= delta * 0.05 * speed;
      particleCloud.rotation.x = ctrl.scrollProgress * 0.8;

      // Mouse Parallax Influence
      ctrl.targetRotY = ctrl.mouseX * 0.45;
      ctrl.targetRotX = ctrl.mouseY * 0.35;
      rootGroup.rotation.y += (ctrl.targetRotY - rootGroup.rotation.y) * 0.05;
      rootGroup.rotation.x += (ctrl.targetRotX - rootGroup.rotation.x) * 0.05;

      // Position & scale smooth lerp
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

  // ==========================================
  // 6. PHILOSOPHY MOVING GEOMETRIC CANVAS
  // ==========================================
  useEffect(() => {
    const canvas = philosophyCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let pw = (canvas.width = window.innerWidth);
    let ph = (canvas.height = window.innerHeight);
    const isMobile = window.innerWidth < 768;
    const nodes = Array.from({ length: isMobile ? 18 : 34 }, () => ({
      x: Math.random() * pw,
      y: Math.random() * ph,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35
    }));

    const onResize = () => {
      pw = canvas.width = window.innerWidth;
      ph = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    let animId: number;
    const render = () => {
      ctx.clearRect(0, 0, pw, ph);
      nodes.forEach((n, idx) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > pw) n.vx *= -1;
        if (n.y < 0 || n.y > ph) n.vy *= -1;

        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(197, 198, 203, 0.35)';
        ctx.fill();

        for (let j = idx + 1; j < nodes.length; j++) {
          const m = nodes[j];
          const dx = n.x - m.x;
          const dy = n.y - m.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 190) {
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.strokeStyle = `rgba(197, 198, 203, ${(1 - dist / 190) * 0.14})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      });
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
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

  // Modal Submit
  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playUiChime(880);
    setModalSuccess(true);
  };

  // Contact Form Submit
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitting(true);
    playUiChime(783.99);
    setTimeout(() => {
      setContactSubmitting(false);
      setContactSuccess(true);
      playUiChime(880);
    }, 600);
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
          ORBITAL SYNC
        </span>
      </div>

      {/* Fixed Fullscreen Three.js WebGL Canvas */}
      <canvas
        ref={webglCanvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-[3]"
        aria-hidden="true"
      />

      {/* ========================================== */}
      {/* 1. CINEMATIC PRELOADER                      */}
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
                  alt="AVARAN Emblem"
                  className="w-36 h-36 object-contain logo-blend relative z-10"
                />
              </div>
            </div>

            {/* Status & Counter */}
            <div className="mt-8 text-center">
              <p className="font-['Cinzel',serif] text-xs sm:text-sm tracking-[0.38em] text-[#F2F0EB]">
                ENTERING AVARAN
              </p>
              <div className="mt-3 flex items-center justify-center gap-3 text-[10px] font-mono tracking-widest text-[#85868B]">
                <span>{preloaderStage}</span>
                <span className="text-[#C5C6CB] tabular-nums font-semibold">{preloaderPercent}%</span>
              </div>
            </div>
          </div>

          {/* Skip Intro Button */}
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
          {/* Zone 1: Single element brand wordmark with logo */}
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
              <span className="font-['Cinzel',serif] text-lg sm:text-xl tracking-[0.26em] text-[#F2F0EB] font-medium leading-none">
                AVARAN
              </span>
              <span className="text-[9px] tracking-[0.28em] text-[#85868B] uppercase mt-1">
                ORBITAL NEXUS
              </span>
            </div>
          </a>

          {/* Zone 2: 5 clean single-line navigation links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-7 lg:gap-9 text-xs tracking-[0.18em] uppercase font-medium"
          >
            {[
              { id: 'home', label: 'Home' },
              { id: 'about', label: 'Philosophy' },
              { id: 'explore', label: 'Explore' },
              { id: 'experience', label: 'Experience' },
              { id: 'features', label: 'Features' },
              { id: 'contact', label: 'Contact' }
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
            {/* Ambient Sound Synthesizer Toggle */}
            <button
              type="button"
              onClick={toggleSound}
              onMouseEnter={() => setCursorExpanded(true)}
              onMouseLeave={() => setCursorExpanded(false)}
              aria-pressed={isSoundPlaying}
              aria-label="Toggle Ambient Soundscape"
              className={`flex items-center gap-2.5 px-3.5 py-2 rounded-full border text-[11px] tracking-widest uppercase transition-all cursor-pointer ${
                isSoundPlaying
                  ? 'border-[#F2F0EB] bg-[#111214] text-[#F2F0EB] sound-active'
                  : 'border-[#C5C6CB]/20 bg-[#111214]/70 text-[#A7A7AD] hover:border-[#C5C6CB]/50 hover:text-[#F2F0EB]'
              }`}
            >
              <div className="flex items-end gap-[2px] h-3.5">
                <span className="sound-bar sound-bar-1 h-1" />
                <span className="sound-bar sound-bar-2 h-1.5" />
                <span className="sound-bar sound-bar-3 h-1" />
                <span className="sound-bar sound-bar-4 h-1" />
              </div>
              <span className="hidden sm:inline text-[10px] whitespace-nowrap">
                {isSoundPlaying ? 'Audio On' : 'Audio Off'}
              </span>
            </button>

            {/* Get Started CTA */}
            <button
              type="button"
              onClick={() => openModalWithSpec('default')}
              onMouseEnter={() => setCursorExpanded(true)}
              onMouseLeave={() => setCursorExpanded(false)}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#F2F0EB] via-[#C5C6CB] to-[#F2F0EB] text-[#050505] font-medium text-xs tracking-[0.16em] uppercase shadow-[0_0_25px_rgba(197,198,203,0.25)] hover:shadow-[0_0_35px_rgba(242,240,235,0.5)] transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Begin Journey</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="md:hidden w-10 h-10 rounded-full border border-[#C5C6CB]/25 bg-[#111214]/80 flex items-center justify-center text-[#F2F0EB] hover:border-[#F2F0EB] transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Animated Fullscreen Drawer */}
      <div
        className={`fixed inset-0 z-[80] bg-[#050505]/95 backdrop-blur-2xl transition-opacity duration-500 flex flex-col justify-between p-8 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={AVARAN_LOGO} alt="AVARAN" className="w-9 h-9 object-contain logo-blend" />
            <span className="font-['Cinzel',serif] text-lg tracking-[0.26em] text-[#F2F0EB]">AVARAN</span>
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close navigation menu"
            className="w-10 h-10 rounded-full border border-[#C5C6CB]/25 flex items-center justify-center text-[#F2F0EB] hover:border-[#F2F0EB]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-6 my-auto">
          {[
            { id: 'home', label: '01. Home' },
            { id: 'about', label: '02. Philosophy' },
            { id: 'explore', label: '03. Explore' },
            { id: 'experience', label: '04. Experience' },
            { id: 'features', label: '05. Features' },
            { id: 'contact', label: '06. Contact' }
          ].map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                scrollTo(item.id);
              }}
              className="font-['Cinzel',serif] text-2xl sm:text-3xl tracking-[0.18em] text-[#F2F0EB] hover:text-[#C5C6CB] transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="pt-6 border-t border-[#242528] flex items-center justify-between">
          <span className="text-xs tracking-widest uppercase text-[#85868B]">SYS // AVARAN 4.2</span>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              openModalWithSpec('default');
            }}
            className="px-6 py-2.5 rounded-full bg-[#F2F0EB] text-[#050505] text-xs font-medium tracking-widest uppercase"
          >
            Begin Journey
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
          {/* Subtle Geometric Background Overlay Lines */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="max-w-7xl mx-auto h-full relative">
              <div className="absolute top-1/4 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C5C6CB]/15 to-transparent" />
              <div className="absolute bottom-20 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C5C6CB]/15 to-transparent" />
            </div>
          </div>

          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
            {/* Left Column: Typography & CTAs */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              {/* Unboxed Metadata Tag */}
              <div className="inline-flex items-center gap-3 text-xs text-[#85868B] mb-7 font-mono tracking-wider">
                <span className="text-[#F2F0EB] font-medium">SOVEREIGN COMPUTING</span>
                <span aria-hidden="true">·</span>
                <span>LATITUDE 00° ORBIT</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#C5C6CB]">MULTI-AGENT FABRIC</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-['Cinzel',serif] text-4xl sm:text-6xl xl:text-[4.25rem] leading-[1.08] tracking-tight font-normal text-[#F2F0EB] mb-7 max-w-2xl text-balance">
                Orbital Intelligence &amp; <span className="silver-gradient-text font-semibold">Architectural</span> Synthesis
              </h1>

              {/* Supporting Prose */}
              <p className="text-[#A7A7AD] text-base sm:text-lg leading-relaxed max-w-xl font-light mb-10">
                Enter a living architectural intelligence where sovereign data streams, predictive computation,
                and autonomous spatial design converge into a singular orbital ecosystem.
              </p>

              {/* Primary Actions */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-5">
                <button
                  type="button"
                  onClick={() => scrollTo('explore')}
                  onMouseEnter={() => setCursorExpanded(true)}
                  onMouseLeave={() => setCursorExpanded(false)}
                  className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#F2F0EB] text-[#050505] font-medium text-xs sm:text-sm tracking-[0.2em] uppercase overflow-hidden shadow-[0_0_40px_rgba(242,240,235,0.28)] hover:shadow-[0_0_55px_rgba(242,240,235,0.55)] transition-all cursor-pointer"
                >
                  <span className="relative z-10">Explore AVARAN</span>
                  <Compass className="w-4 h-4 relative z-10 group-hover:rotate-45 transition-transform duration-500" />
                </button>

                <button
                  type="button"
                  onClick={() => scrollTo('about')}
                  onMouseEnter={() => setCursorExpanded(true)}
                  onMouseLeave={() => setCursorExpanded(false)}
                  className="group inline-flex items-center gap-3 px-8 py-4 rounded-full border border-[#C5C6CB]/30 bg-[#111214]/60 hover:bg-[#242528]/70 hover:border-[#F2F0EB]/60 text-[#F2F0EB] font-medium text-xs sm:text-sm tracking-[0.2em] uppercase backdrop-blur-md transition-all cursor-pointer"
                >
                  <span>Discover Philosophy</span>
                  <ArrowDownRight className="w-4 h-4 text-[#C5C6CB] group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
                </button>
              </div>

              {/* Geometric Telemetry Strip */}
              <div className="mt-14 pt-8 border-t border-[#C5C6CB]/15 w-full max-w-xl grid grid-cols-3 gap-6">
                <div>
                  <div className="text-[10px] font-mono tracking-widest uppercase text-[#85868B]">LATENCY CORE</div>
                  <div className="font-['Cinzel',serif] text-xl sm:text-2xl text-[#F2F0EB] mt-1 tabular-nums">
                    0.04 <span className="text-xs text-[#C5C6CB]">ms</span>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-mono tracking-widest uppercase text-[#85868B]">ORBITAL NODES</div>
                  <div className="font-['Cinzel',serif] text-xl sm:text-2xl text-[#F2F0EB] mt-1 tabular-nums">
                    12,840
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-mono tracking-widest uppercase text-[#85868B]">INTEGRITY</div>
                  <div className="font-['Cinzel',serif] text-xl sm:text-2xl text-[#F2F0EB] mt-1 tabular-nums">
                    99.998<span className="text-xs text-[#C5C6CB]">%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive 3D Orbital Hitbox Stage */}
            <div className="lg:col-span-5 relative flex items-center justify-center min-h-[420px] sm:min-h-[520px]">
              <div
                role="region"
                aria-label="Interactive 3D AVARAN Orbital Sculpture"
                tabIndex={0}
                onMouseEnter={() => {
                  threeCtrlRef.current.targetHoverIntensity = 1;
                  setIsLuminosityAmplified(true);
                  setHudState('LUMINOSITY // AMPLIFIED');
                  playUiChime(740);
                  setCursorExpanded(true);
                }}
                onMouseLeave={() => {
                  threeCtrlRef.current.targetHoverIntensity = 0;
                  setIsLuminosityAmplified(false);
                  setHudState('ORBITAL FIELD // INTERACTIVE');
                  setCursorExpanded(false);
                }}
                className="relative w-full max-w-[490px] aspect-square flex items-center justify-center cursor-grab active:cursor-grabbing group focus:outline-none"
              >
                {/* SVG Alignment Lines & Astrolabe Rings matching AVARAN logo */}
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
                  <circle cx="250" cy="82" r="2" fill="#C5C6CB" />
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
                  <line x1="185" y1="420" x2="185" y2="495" stroke="rgba(197,198,203,0.25)" strokeWidth="0.75" />
                  <circle cx="185" cy="420" r="2" fill="#C5C6CB" />
                  <line x1="355" y1="395" x2="355" y2="490" stroke="rgba(197,198,203,0.25)" strokeWidth="0.75" />
                  <circle cx="355" cy="395" r="2" fill="#C5C6CB" />
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

          {/* Bottom Scroll Invitation */}
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('about');
            }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#85868B] hover:text-[#F2F0EB] transition-colors group cursor-pointer"
          >
            <span className="text-[10px] tracking-[0.34em] uppercase">Scroll to Traverse</span>
            <div className="w-[1px] h-9 bg-[#242528] overflow-hidden relative">
              <div className="w-full h-1/2 bg-[#F2F0EB] animate-bounce" />
            </div>
          </a>
        </section>

        {/* ========================================== */}
        {/* 4. PHILOSOPHY SECTION (Section 01)         */}
        {/* ========================================== */}
        <section
          id="about"
          className="relative min-h-screen w-full flex items-center justify-center py-32 px-4 sm:px-8 lg:px-14 overflow-hidden"
        >
          {/* Dynamic 2D Geometric Network Background */}
          <canvas ref={philosophyCanvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-45" />

          <div className="max-w-4xl mx-auto text-center relative z-10">
            {/* Editorial Heading */}
            <div className="inline-flex items-center gap-2 text-xs text-[#85868B] font-mono tracking-widest mb-6">
              <span>01. MANIFESTO</span>
              <span aria-hidden="true">/</span>
              <span>SYNTHESIS OF FORM &amp; THOUGHT</span>
            </div>

            <h2 className="font-['Cinzel',serif] text-3xl sm:text-5xl lg:text-6xl text-[#F2F0EB] tracking-tight leading-[1.15] mb-10 text-balance">
              Where Autonomous Intelligence <br className="hidden sm:inline" />
              Meets <span className="silver-gradient-text">Architectural Form</span>
            </h2>

            <div className="space-y-6 text-[#A7A7AD] text-base sm:text-xl font-light leading-relaxed max-w-3xl mx-auto mb-16">
              <p>
                We do not view computation as inert mathematical abstraction. In the AVARAN paradigm,
                every neural pathway is an architectural beam, every inference request an orbital transit,
                and every sovereign cluster a fortified sanctuary for human cognition.
              </p>
              <p className="text-sm sm:text-base text-[#85868B]">
                By harmonizing multi-agent consensus algorithms with sculpted geometric topology, AVARAN creates
                infrastructures that self-heal, self-steer, and expand without thermodynamic compromise.
              </p>
            </div>

            {/* Three Structural Pillar Cards with Hairline Borders */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="p-7 rounded-2xl bg-[#111214]/60 border border-[#C5C6CB]/15 backdrop-blur-md">
                <div className="text-[10px] font-mono text-[#85868B] tracking-widest uppercase mb-3">PILLAR 01</div>
                <h4 className="font-['Cinzel',serif] text-lg text-[#F2F0EB] mb-2">Translucent Cohesion</h4>
                <p className="text-xs text-[#A7A7AD] leading-relaxed">
                  Real-time visibility across multi-planar clusters. Zero black boxes, 100% auditable neural logic.
                </p>
              </div>

              <div className="p-7 rounded-2xl bg-[#111214]/60 border border-[#C5C6CB]/15 backdrop-blur-md">
                <div className="text-[10px] font-mono text-[#85868B] tracking-widest uppercase mb-3">PILLAR 02</div>
                <h4 className="font-['Cinzel',serif] text-lg text-[#F2F0EB] mb-2">Thermodynamic Parity</h4>
                <p className="text-xs text-[#A7A7AD] leading-relaxed">
                  Ultra-low energy consumption yielding 0.04W per synthetic inference with liquid cooling matrices.
                </p>
              </div>

              <div className="p-7 rounded-2xl bg-[#111214]/60 border border-[#C5C6CB]/15 backdrop-blur-md">
                <div className="text-[10px] font-mono text-[#85868B] tracking-widest uppercase mb-3">PILLAR 03</div>
                <h4 className="font-['Cinzel',serif] text-lg text-[#F2F0EB] mb-2">Lattice Sovereignty</h4>
                <p className="text-xs text-[#A7A7AD] leading-relaxed">
                  Hardware-enforced zero-knowledge enclaves with post-quantum Kyber-1024 cryptographic guarantees.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================== */}
        {/* 5. EXPLORE POSSIBILITIES (Section 02)      */}
        {/* ========================================== */}
        <section id="explore" className="relative py-32 px-4 sm:px-8 lg:px-14">
          <div className="max-w-7xl mx-auto">
            {/* Header & Filter Controls */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
              <div>
                <div className="text-[10px] font-mono tracking-widest uppercase text-[#85868B] mb-3">
                  02. EXPLORATION DECK
                </div>
                <h2 className="font-['Cinzel',serif] text-3xl sm:text-5xl lg:text-6xl text-[#F2F0EB] tracking-tight">
                  Explore <span className="silver-gradient-text">Possibilities</span>
                </h2>
              </div>

              {/* Interactive Domain Filter Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-[#111214] rounded-full border border-[#C5C6CB]/20">
                {[
                  { key: 'all', label: 'All Systems' },
                  { key: 'neural', label: 'Neural Core' },
                  { key: 'spatial', label: 'Spatial Grid' },
                  { key: 'kinetic', label: 'Kinetic Flow' }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => {
                      playUiChime(620);
                      setActiveDomainFilter(tab.key as 'all' | 'neural' | 'spatial' | 'kinetic');
                    }}
                    onMouseEnter={() => setCursorExpanded(true)}
                    onMouseLeave={() => setCursorExpanded(false)}
                    className={`px-4 py-2 rounded-full text-xs font-medium tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      activeDomainFilter === tab.key
                        ? 'bg-[#F2F0EB] text-[#050505] shadow-sm'
                        : 'text-[#A7A7AD] hover:text-[#F2F0EB]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Three 3D Tilt Bento Interactive Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Card 1: Cognitive Orbital Synthesis */}
              {(activeDomainFilter === 'all' || activeDomainFilter === 'neural') && (
                <article
                  onMouseMove={handleCardMouseMove}
                  onMouseLeave={handleCardMouseLeave}
                  onClick={() => openModalWithSpec('orbital-synthesis')}
                  onMouseEnter={() => setCursorExpanded(true)}
                  className="tilt-card silver-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between group cursor-pointer transition-all duration-300"
                >
                  <div>
                    {/* Media Container */}
                    <div className="relative h-60 w-full rounded-2xl overflow-hidden mb-7 border border-[#C5C6CB]/15 bg-[#050505]">
                      <img
                        src={CARD_ORBITAL}
                        alt="Cognitive Orbital Synthesis"
                        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />
                      <div className="absolute top-4 left-4 px-3 py-1 rounded-full glass-panel text-[10px] font-mono tracking-widest text-[#C5C6CB] uppercase">
                        SYS // 01.A
                      </div>
                      <div className="absolute top-4 right-4 w-10 h-10 rounded-full glass-panel flex items-center justify-center text-[#F2F0EB] group-hover:rotate-45 group-hover:bg-[#F2F0EB] group-hover:text-[#050505] transition-all duration-500">
                        <Cpu className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#85868B] mb-2">
                      NEURAL TOPOLOGY
                    </div>
                    <h3 className="font-['Cinzel',serif] text-2xl text-[#F2F0EB] mb-3 group-hover:text-[#C5C6CB] transition-colors">
                      Cognitive Orbital Synthesis
                    </h3>
                    <p className="text-sm text-[#A7A7AD] font-light leading-relaxed mb-6">
                      Bind disparate enterprise models into a self-balancing orbital mesh capable of real-time reasoning
                      across billions of live vectors.
                    </p>
                  </div>

                  <div className="pt-5 border-t border-[#C5C6CB]/10 flex items-center justify-between">
                    <span className="text-xs font-mono text-[#C5C6CB] tabular-nums">THROUGHPUT: 1.4 PB/S</span>
                    <span className="inline-flex items-center gap-1.5 text-xs tracking-widest uppercase text-[#F2F0EB] group-hover:translate-x-1 transition-transform">
                      Inspect Spec <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </article>
              )}

              {/* Card 2: Astrolabe Spatial Telemetry */}
              {(activeDomainFilter === 'all' || activeDomainFilter === 'spatial') && (
                <article
                  onMouseMove={handleCardMouseMove}
                  onMouseLeave={handleCardMouseLeave}
                  onClick={() => openModalWithSpec('quantum-telemetry')}
                  onMouseEnter={() => setCursorExpanded(true)}
                  className="tilt-card silver-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between group cursor-pointer transition-all duration-300"
                >
                  <div>
                    <div className="relative h-60 w-full rounded-2xl overflow-hidden mb-7 border border-[#C5C6CB]/15 bg-[#050505]">
                      <img
                        src={CARD_GRID}
                        alt="Astrolabe Spatial Telemetry"
                        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />
                      <div className="absolute top-4 left-4 px-3 py-1 rounded-full glass-panel text-[10px] font-mono tracking-widest text-[#C5C6CB] uppercase">
                        SYS // 02.B
                      </div>
                      <div className="absolute top-4 right-4 w-10 h-10 rounded-full glass-panel flex items-center justify-center text-[#F2F0EB] group-hover:rotate-45 group-hover:bg-[#F2F0EB] group-hover:text-[#050505] transition-all duration-500">
                        <Layers className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#85868B] mb-2">
                      DIMENSIONAL MATRIX
                    </div>
                    <h3 className="font-['Cinzel',serif] text-2xl text-[#F2F0EB] mb-3 group-hover:text-[#C5C6CB] transition-colors">
                      Astrolabe Spatial Telemetry
                    </h3>
                    <p className="text-sm text-[#A7A7AD] font-light leading-relaxed mb-6">
                      Navigate high-density infrastructure through translucent glass planes that isolate anomalies with
                      sub-millimeter precision.
                    </p>
                  </div>

                  <div className="pt-5 border-t border-[#C5C6CB]/10 flex items-center justify-between">
                    <span className="text-xs font-mono text-[#C5C6CB] tabular-nums">PRECISION: 99.999%</span>
                    <span className="inline-flex items-center gap-1.5 text-xs tracking-widest uppercase text-[#F2F0EB] group-hover:translate-x-1 transition-transform">
                      Inspect Spec <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </article>
              )}

              {/* Card 3: Kinetic Continuum Engine */}
              {(activeDomainFilter === 'all' || activeDomainFilter === 'kinetic') && (
                <article
                  onMouseMove={handleCardMouseMove}
                  onMouseLeave={handleCardMouseLeave}
                  onClick={() => openModalWithSpec('kinetic-morphogenesis')}
                  onMouseEnter={() => setCursorExpanded(true)}
                  className="tilt-card silver-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between group cursor-pointer transition-all duration-300"
                >
                  <div>
                    <div className="relative h-60 w-full rounded-2xl overflow-hidden mb-7 border border-[#C5C6CB]/15 bg-[#050505]">
                      <img
                        src={CARD_WAVE}
                        alt="Kinetic Continuum Engine"
                        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />
                      <div className="absolute top-4 left-4 px-3 py-1 rounded-full glass-panel text-[10px] font-mono tracking-widest text-[#C5C6CB] uppercase">
                        SYS // 03.C
                      </div>
                      <div className="absolute top-4 right-4 w-10 h-10 rounded-full glass-panel flex items-center justify-center text-[#F2F0EB] group-hover:rotate-45 group-hover:bg-[#F2F0EB] group-hover:text-[#050505] transition-all duration-500">
                        <Activity className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#85868B] mb-2">
                      FLUID COMPUTATION
                    </div>
                    <h3 className="font-['Cinzel',serif] text-2xl text-[#F2F0EB] mb-3 group-hover:text-[#C5C6CB] transition-colors">
                      Kinetic Continuum Engine
                    </h3>
                    <p className="text-sm text-[#A7A7AD] font-light leading-relaxed mb-6">
                      Deploy liquid-mercury execution pipelines that dynamically re-route compute bandwidth across global
                      nodes in zero-downtime waves.
                    </p>
                  </div>

                  <div className="pt-5 border-t border-[#C5C6CB]/10 flex items-center justify-between">
                    <span className="text-xs font-mono text-[#C5C6CB] tabular-nums">SCALE: ELASTIC ∞</span>
                    <span className="inline-flex items-center gap-1.5 text-xs tracking-widest uppercase text-[#F2F0EB] group-hover:translate-x-1 transition-transform">
                      Inspect Spec <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </article>
              )}
            </div>
          </div>
        </section>

        {/* ========================================== */}
        {/* 6. THE AVARAN EXPERIENCE (Section 03)      */}
        {/* ========================================== */}
        <section
          id="experience"
          className="relative min-h-screen w-full py-32 px-4 sm:px-8 lg:px-14 flex items-center overflow-hidden"
        >
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* Left Controls Deck */}
            <div className="lg:col-span-6 flex flex-col items-start">
              <div className="inline-flex items-center gap-2 text-xs text-[#85868B] font-mono tracking-widest mb-4">
                <span>03. INTERACTIVE 3D LAB</span>
                <span aria-hidden="true">/</span>
                <span>REAL-TIME ASTROLABE CONTROL</span>
              </div>

              <h2 className="font-['Cinzel',serif] text-3xl sm:text-5xl text-[#F2F0EB] tracking-tight leading-[1.12] mb-6">
                Direct the <br />
                <span className="silver-gradient-text">Orbital Dynamics</span>
              </h2>

              <p className="text-[#A7A7AD] text-base font-light leading-relaxed mb-10 max-w-lg">
                Tune the velocity and geometry of the background 3D celestial engine in real-time.
                Observe how the ribbon knots and concentric astrolabe rings respond to your tactile adjustments.
              </p>

              {/* Sliders Deck */}
              <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl glass-panel border border-[#C5C6CB]/20 space-y-6">
                {/* Velocity Slider */}
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-[#85868B] mb-2.5">
                    <span className="uppercase tracking-wider">Angular Velocity</span>
                    <span className="text-[#F2F0EB] tabular-nums font-semibold">{speedMultiplier.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="3.0"
                    step="0.1"
                    value={speedMultiplier}
                    onChange={(e) => setSpeedMultiplier(parseFloat(e.target.value))}
                    className="w-full accent-[#F2F0EB] bg-[#242528] h-1.5 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-[#85868B] mt-1">
                    <span>0.2x (Glacial)</span>
                    <span>1.0x (Standard)</span>
                    <span>3.0x (Warp)</span>
                  </div>
                </div>

                {/* Astrolabe Scale Slider */}
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-[#85868B] mb-2.5">
                    <span className="uppercase tracking-wider">Astrolabe Ring Expansion</span>
                    <span className="text-[#F2F0EB] tabular-nums font-semibold">{ringExpansion}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="180"
                    step="5"
                    value={ringExpansion}
                    onChange={(e) => setRingExpansion(parseInt(e.target.value, 10))}
                    className="w-full accent-[#F2F0EB] bg-[#242528] h-1.5 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-[#85868B] mt-1">
                    <span>50% (Condensed)</span>
                    <span>100% (Balanced)</span>
                    <span>180% (Hyper-Expanded)</span>
                  </div>
                </div>

                {/* Presets and Reset */}
                <div className="pt-4 border-t border-[#C5C6CB]/15 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSpeedMultiplier(0.4);
                        setRingExpansion(70);
                        playUiChime(500);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#242528]/80 text-[10px] font-mono uppercase text-[#A7A7AD] hover:text-[#F2F0EB] hover:bg-[#242528] transition-colors"
                    >
                      Subtle
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSpeedMultiplier(1.0);
                        setRingExpansion(100);
                        playUiChime(600);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#242528]/80 text-[10px] font-mono uppercase text-[#A7A7AD] hover:text-[#F2F0EB] hover:bg-[#242528] transition-colors"
                    >
                      Default
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSpeedMultiplier(2.5);
                        setRingExpansion(150);
                        playUiChime(800);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#242528]/80 text-[10px] font-mono uppercase text-[#A7A7AD] hover:text-[#F2F0EB] hover:bg-[#242528] transition-colors"
                    >
                      Superluminal
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSpeedMultiplier(1.0);
                      setRingExpansion(100);
                      playUiChime(528);
                    }}
                    className="flex items-center gap-1.5 text-xs font-mono text-[#85868B] hover:text-[#F2F0EB] transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Telemetry Stage */}
            <div className="lg:col-span-6 relative flex items-center justify-center min-h-[380px]">
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
                  <div className="text-[9px] font-mono tracking-widest text-[#85868B]">INCLINATION</div>
                  <div className="font-['Cinzel',serif] text-sm text-[#F2F0EB]">23.44° N // LOCKED</div>
                </div>

                <div className="absolute bottom-12 right-2 sm:right-6 px-4 py-2.5 rounded-xl glass-panel text-left">
                  <div className="text-[9px] font-mono tracking-widest text-[#85868B]">LUMINOSITY FLUX</div>
                  <div className="font-['Cinzel',serif] text-sm text-[#F2F0EB]">98.4 LUM // NOMINAL</div>
                </div>

                <div className="absolute top-1/2 -translate-y-1/2 right-0 px-3.5 py-2 rounded-xl glass-panel text-left">
                  <div className="text-[9px] font-mono tracking-widest text-[#85868B]">ACTIVE SPEED</div>
                  <div className="font-['Cinzel',serif] text-sm text-[#F2F0EB] tabular-nums">
                    {(speedMultiplier * 24.8).toFixed(1)} km/s
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================== */}
        {/* 7. ARCHITECTURAL CAPABILITIES (Section 04)  */}
        {/* ========================================== */}
        <section id="features" className="relative py-32 px-4 sm:px-8 lg:px-14">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <div className="inline-flex items-center gap-2 text-xs text-[#85868B] font-mono tracking-widest mb-4">
                <span>04. CORE ARCHITECTURE</span>
                <span aria-hidden="true">/</span>
                <span>SOVEREIGN CLUSTER PILLARS</span>
              </div>
              <h2 className="font-['Cinzel',serif] text-3xl sm:text-5xl lg:text-6xl text-[#F2F0EB] tracking-tight mb-5">
                Engineered for <span className="silver-gradient-text">Sovereign Scale</span>
              </h2>
              <p className="text-[#A7A7AD] text-base sm:text-lg font-light">
                Four foundational pillars designed to sustain mission-critical intelligence across global teams.
              </p>
            </div>

            {/* Four Modular Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
              {/* Feature 1 */}
              <div
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
                className="silver-card rounded-3xl p-8 sm:p-10 group"
              >
                <div className="flex items-start justify-between mb-8">
                  <div className="w-14 h-14 rounded-2xl border border-[#C5C6CB]/25 bg-[#050505]/90 flex items-center justify-center text-[#F2F0EB] group-hover:border-[#F2F0EB] group-hover:scale-105 transition-all">
                    <BarChart2 className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <span className="text-[11px] font-mono tracking-widest text-[#85868B]">01 // ANALYTICS</span>
                </div>
                <h3 className="font-['Cinzel',serif] text-2xl sm:text-3xl text-[#F2F0EB] mb-4">
                  Powerful Predictive Analytics
                </h3>
                <p className="text-[#A7A7AD] font-light leading-relaxed mb-8">
                  Real-time multi-dimensional telemetry distills petabytes of operational noise into crystalline
                  predictive trajectories and sub-second anomaly isolation.
                </p>
                <div className="p-4 rounded-2xl bg-[#050505]/70 border border-[#C5C6CB]/10 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono text-[#85868B] uppercase">PREDICTIVE CONFIDENCE</div>
                    <div className="font-['Cinzel',serif] text-lg text-[#F2F0EB] mt-0.5 tabular-nums">99.42%</div>
                  </div>
                  <svg className="w-36 h-10 overflow-visible" viewBox="0 0 140 36">
                    <path d="M0 30 Q 25 26, 40 16 T 85 18 T 140 4" fill="none" stroke="#F2F0EB" strokeWidth="1.5" />
                    <circle cx="140" cy="4" r="3" fill="#F2F0EB" />
                  </svg>
                </div>
              </div>

              {/* Feature 2 */}
              <div
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
                className="silver-card rounded-3xl p-8 sm:p-10 group"
              >
                <div className="flex items-start justify-between mb-8">
                  <div className="w-14 h-14 rounded-2xl border border-[#C5C6CB]/25 bg-[#050505]/90 flex items-center justify-center text-[#F2F0EB] group-hover:border-[#F2F0EB] group-hover:scale-105 transition-all">
                    <GitMerge className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <span className="text-[11px] font-mono tracking-widest text-[#85868B]">02 // INTEGRATION</span>
                </div>
                <h3 className="font-['Cinzel',serif] text-2xl sm:text-3xl text-[#F2F0EB] mb-4">
                  Seamless Orbital Adapters
                </h3>
                <p className="text-[#A7A7AD] font-light leading-relaxed mb-8">
                  Universal orbital adapters connect effortlessly with your existing cloud clusters, data warehouses,
                  and proprietary neural pipelines in minutes with zero disruption.
                </p>
                <div className="p-4 rounded-2xl bg-[#050505]/70 border border-[#C5C6CB]/10 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono text-[#85868B] uppercase">ACTIVE PROTOCOLS</div>
                    <div className="font-['Cinzel',serif] text-lg text-[#F2F0EB] mt-0.5">gRPC · GraphQL · REST</div>
                  </div>
                  <span className="text-xs font-mono text-[#C5C6CB]">ZERO-CONFIG</span>
                </div>
              </div>

              {/* Feature 3 */}
              <div
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
                className="silver-card rounded-3xl p-8 sm:p-10 group"
              >
                <div className="flex items-start justify-between mb-8">
                  <div className="w-14 h-14 rounded-2xl border border-[#C5C6CB]/25 bg-[#050505]/90 flex items-center justify-center text-[#F2F0EB] group-hover:border-[#F2F0EB] group-hover:scale-105 transition-all">
                    <ShieldCheck className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <span className="text-[11px] font-mono tracking-widest text-[#85868B]">03 // SECURITY</span>
                </div>
                <h3 className="font-['Cinzel',serif] text-2xl sm:text-3xl text-[#F2F0EB] mb-4">
                  Advanced Post-Quantum Security
                </h3>
                <p className="text-[#A7A7AD] font-light leading-relaxed mb-8">
                  Post-quantum lattice encryption, zero-knowledge cryptographic proofs, and hardware-enforced enclaves
                  safeguard every orbital transaction and vector query.
                </p>
                <div className="p-4 rounded-2xl bg-[#050505]/70 border border-[#C5C6CB]/10 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono text-[#85868B] uppercase">ENCRYPTION STANDARD</div>
                    <div className="font-['Cinzel',serif] text-lg text-[#F2F0EB] mt-0.5">KYBER-1024 // ZK-SNARK</div>
                  </div>
                  <span className="text-xs font-mono text-[#C5C6CB]">VERIFIED</span>
                </div>
              </div>

              {/* Feature 4 */}
              <div
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
                className="silver-card rounded-3xl p-8 sm:p-10 group"
              >
                <div className="flex items-start justify-between mb-8">
                  <div className="w-14 h-14 rounded-2xl border border-[#C5C6CB]/25 bg-[#050505]/90 flex items-center justify-center text-[#F2F0EB] group-hover:border-[#F2F0EB] group-hover:scale-105 transition-all">
                    <Users className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <span className="text-[11px] font-mono tracking-widest text-[#85868B]">04 // COLLABORATION</span>
                </div>
                <h3 className="font-['Cinzel',serif] text-2xl sm:text-3xl text-[#F2F0EB] mb-4">
                  Synchronized Multiplayer Topology
                </h3>
                <p className="text-[#A7A7AD] font-light leading-relaxed mb-8">
                  Multiplayer spatial workspaces, granular role-based governance, and real-time version histories
                  empower distributed architects to build in unison.
                </p>
                <div className="p-4 rounded-2xl bg-[#050505]/70 border border-[#C5C6CB]/10 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono text-[#85868B] uppercase">CONCURRENT ARCHITECTS</div>
                    <div className="font-['Cinzel',serif] text-lg text-[#F2F0EB] mt-0.5">UNLIMITED NODES</div>
                  </div>
                  <span className="text-xs font-mono text-[#C5C6CB]">REAL-TIME SYNC</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================== */}
        {/* 8. CONTACT & ACCESS SECTION (Section 05)    */}
        {/* ========================================== */}
        <section
          id="contact"
          className="relative min-h-[90vh] w-full flex items-center justify-center py-32 px-4 sm:px-8 lg:px-14 overflow-hidden"
        >
          {/* Subtle Ambient Ring Background */}
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
            {/* Emblem */}
            <div className="w-20 h-20 mx-auto mb-8 rounded-full border border-[#C5C6CB]/30 bg-[#050505]/90 flex items-center justify-center shadow-[0_0_50px_rgba(242,240,235,0.2)]">
              <img src={AVARAN_LOGO} alt="AVARAN Emblem" className="w-16 h-16 object-contain logo-blend" />
            </div>

            <div className="text-[11px] font-mono tracking-[0.38em] uppercase text-[#C5C6CB] mb-5">
              INITIATE CONVERGENCE
            </div>

            <h2 className="font-['Cinzel',serif] text-4xl sm:text-6xl lg:text-7xl text-[#F2F0EB] tracking-tight leading-[1.1] mb-6">
              The Future Is Yours <br className="hidden sm:inline" />
              <span className="silver-gradient-text">to Create.</span>
            </h2>

            <p className="text-[#A7A7AD] text-base sm:text-xl font-light max-w-2xl mx-auto mb-12">
              Step inside the AVARAN dimension. Provision your first autonomous orbital cluster or schedule a private
              architectural briefing with our engineering leadership.
            </p>

            {/* Interactive Provisioning Form Container */}
            <div className="max-w-2xl mx-auto p-8 sm:p-10 rounded-3xl glass-panel border border-[#C5C6CB]/25 text-left mb-10 shadow-[0_20px_60px_rgba(0,0,0,0.9)]">
              {!contactSuccess ? (
                <form onSubmit={handleContactSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[10px] font-mono tracking-widest uppercase text-[#85868B] mb-2">
                        ARCHITECT / INSTITUTION
                      </label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="Dr. Julian Cross"
                        className="w-full px-4 py-3 rounded-xl bg-[#050505]/80 border border-[#C5C6CB]/20 text-sm text-[#F2F0EB] placeholder-[#85868B]/50 focus:outline-none focus:border-[#F2F0EB] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono tracking-widest uppercase text-[#85868B] mb-2">
                        TRANSMISSION ENDPOINT
                      </label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="julian@orbital-synthesis.org"
                        className="w-full px-4 py-3 rounded-xl bg-[#050505]/80 border border-[#C5C6CB]/20 text-sm text-[#F2F0EB] placeholder-[#85868B]/50 focus:outline-none focus:border-[#F2F0EB] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[10px] font-mono tracking-widest uppercase text-[#85868B] mb-2">
                        DESIRED INFRASTRUCTURE TIER
                      </label>
                      <select
                        value={contactForm.tier}
                        onChange={(e) => setContactForm({ ...contactForm, tier: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#050505]/80 border border-[#C5C6CB]/20 text-sm text-[#F2F0EB] focus:outline-none focus:border-[#F2F0EB] transition-colors"
                      >
                        <option value="Cognitive Orbital Synthesis">Cognitive Orbital Synthesis (1.4 PB/s)</option>
                        <option value="Astrolabe Spatial Telemetry">Astrolabe Spatial Telemetry (Sub-mm Grid)</option>
                        <option value="Kinetic Continuum Engine">Kinetic Continuum Engine (Fluid Mesh)</option>
                        <option value="Full Sovereign Enterprise Fabric">Full Sovereign Enterprise Fabric</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono tracking-widest uppercase text-[#85868B] mb-2">
                        REGIONAL ANCHOR
                      </label>
                      <select
                        value={contactForm.region}
                        onChange={(e) => setContactForm({ ...contactForm, region: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#050505]/80 border border-[#C5C6CB]/20 text-sm text-[#F2F0EB] focus:outline-none focus:border-[#F2F0EB] transition-colors"
                      >
                        <option value="Orbital Low-Earth (LEO-Mesh)">Orbital Low-Earth (LEO-Mesh)</option>
                        <option value="Lunar Gateway Sovereign Zone">Lunar Gateway Sovereign Zone</option>
                        <option value="Terrestrial European Cluster">Terrestrial European Cluster</option>
                        <option value="North America Sovereign Backbone">North America Sovereign Backbone</option>
                        <option value="Asia-Pacific Quantum Mesh">Asia-Pacific Quantum Mesh</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono tracking-widest uppercase text-[#85868B] mb-2">
                      SPECIFICATION NOTES (OPTIONAL)
                    </label>
                    <textarea
                      rows={3}
                      value={contactForm.notes}
                      onChange={(e) => setContactForm({ ...contactForm, notes: e.target.value })}
                      placeholder="Outline targeted vector bandwidth, model scale, or enclave constraints..."
                      className="w-full px-4 py-3 rounded-xl bg-[#050505]/80 border border-[#C5C6CB]/20 text-sm text-[#F2F0EB] placeholder-[#85868B]/50 focus:outline-none focus:border-[#F2F0EB] transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={contactSubmitting}
                    onMouseEnter={() => setCursorExpanded(true)}
                    onMouseLeave={() => setCursorExpanded(false)}
                    className="w-full py-4 rounded-full bg-gradient-to-r from-[#F2F0EB] via-[#C5C6CB] to-[#F2F0EB] text-[#050505] font-semibold text-xs tracking-[0.24em] uppercase shadow-[0_0_40px_rgba(242,240,235,0.3)] hover:shadow-[0_0_60px_rgba(242,240,235,0.6)] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {contactSubmitting ? (
                      <span>LOCKING ORBITAL COORDINATES...</span>
                    ) : (
                      <>
                        <span>Provision Sovereign Cluster</span>
                        <Sparkles className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="py-8 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-[#C5C6CB]/15 border border-[#F2F0EB] mx-auto flex items-center justify-center text-[#F2F0EB]">
                    <Check className="w-7 h-7" />
                  </div>
                  <h3 className="font-['Cinzel',serif] text-2xl text-[#F2F0EB]">Orbital Handshake Confirmed</h3>
                  <p className="text-sm text-[#A7A7AD] max-w-md mx-auto">
                    Node cluster provisioned for <strong className="text-[#F2F0EB]">{contactForm.name}</strong>.
                    Credentials dispatched to <span className="font-mono text-[#C5C6CB]">{contactForm.email}</span>.
                  </p>
                  <div className="pt-4 border-t border-[#C5C6CB]/15 font-mono text-xs text-[#85868B] space-y-1">
                    <div>CLUSTER ID: <span className="text-[#F2F0EB]">AVR-NODE-{(Math.random() * 8999 + 1000).toFixed(0)}</span></div>
                    <div>TOPOLOGY: <span className="text-[#F2F0EB]">{contactForm.tier}</span></div>
                    <div>REGION: <span className="text-[#F2F0EB]">{contactForm.region}</span></div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setContactSuccess(false)}
                    className="mt-4 px-6 py-2 rounded-full border border-[#C5C6CB]/30 text-xs font-mono uppercase text-[#A7A7AD] hover:text-[#F2F0EB] hover:border-[#F2F0EB] transition-colors"
                  >
                    Submit Another Provisioning Request
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => openModalWithSpec('default')}
                onMouseEnter={() => setCursorExpanded(true)}
                onMouseLeave={() => setCursorExpanded(false)}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-[#C5C6CB]/30 text-xs tracking-[0.2em] uppercase text-[#F2F0EB] hover:bg-[#111214] transition-all cursor-pointer"
              >
                <span>Open Quick Access Portal</span>
                <ExternalLink className="w-4 h-4 text-[#C5C6CB]" />
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
          {/* Brand Info */}
          <div className="flex items-center gap-3">
            <img src={AVARAN_LOGO} alt="AVARAN" className="w-8 h-8 object-contain logo-blend" />
            <span className="font-['Cinzel',serif] text-sm tracking-[0.28em] text-[#F2F0EB]">AVARAN</span>
            <span className="text-xs text-[#85868B] font-mono ml-2">© 2026 ORBITAL SYSTEMS INC.</span>
          </div>

          {/* Navigation Links */}
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
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                scrollTo('about');
              }}
              className="hover:text-[#F2F0EB] transition-colors"
            >
              Philosophy
            </a>
            <a
              href="#explore"
              onClick={(e) => {
                e.preventDefault();
                scrollTo('explore');
              }}
              className="hover:text-[#F2F0EB] transition-colors"
            >
              Explore
            </a>
            <a
              href="#experience"
              onClick={(e) => {
                e.preventDefault();
                scrollTo('experience');
              }}
              className="hover:text-[#F2F0EB] transition-colors"
            >
              Lab
            </a>
            <a
              href="#features"
              onClick={(e) => {
                e.preventDefault();
                scrollTo('features');
              }}
              className="hover:text-[#F2F0EB] transition-colors"
            >
              Capabilities
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollTo('contact');
              }}
              className="hover:text-[#F2F0EB] transition-colors"
            >
              Provision
            </a>
          </div>

          {/* Live System Status Indicator */}
          <div className="flex items-center gap-2 text-[10px] font-mono text-[#85868B]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5C6CB] animate-ping" />
            <span>14,280 NODES ONLINE · 0.04ms LATENCY</span>
          </div>
        </div>
      </footer>

      {/* ========================================== */}
      {/* 10. INTERACTIVE DETAIL & PROVISIONING MODAL */}
      {/* ========================================== */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 z-[95] flex items-center justify-center p-4 sm:p-6 bg-[#050505]/85 backdrop-blur-2xl transition-opacity duration-300"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
        >
          <div className="relative w-full max-w-xl rounded-3xl glass-panel border border-[#C5C6CB]/30 p-7 sm:p-10 shadow-[0_25px_80px_rgba(0,0,0,0.95)]">
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

            <h3 id="modal-title" className="font-['Cinzel',serif] text-2xl sm:text-3xl text-[#F2F0EB] mb-3">
              {selectedModalSpec.title}
            </h3>

            <p className="text-sm text-[#A7A7AD] font-light leading-relaxed mb-6">
              {selectedModalSpec.desc}
            </p>

            {/* Spec Highlights */}
            {selectedModalSpec.throughput && (
              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-[#050505]/60 border border-[#C5C6CB]/15 mb-6 text-xs font-mono">
                <div>
                  <span className="text-[#85868B] block mb-1">ALLOCATED BANDWIDTH</span>
                  <span className="text-[#F2F0EB] font-semibold">{selectedModalSpec.throughput}</span>
                </div>
                <div>
                  <span className="text-[#85868B] block mb-1">MEASURED P99 LATENCY</span>
                  <span className="text-[#F2F0EB] font-semibold">{selectedModalSpec.latency}</span>
                </div>
              </div>
            )}

            {!modalSuccess ? (
              <form onSubmit={handleModalSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="architect-name"
                    className="block text-[10px] font-mono tracking-widest uppercase text-[#85868B] mb-1.5"
                  >
                    ARCHITECT IDENTIFIER
                  </label>
                  <input
                    id="architect-name"
                    type="text"
                    required
                    value={architectName}
                    onChange={(e) => setArchitectName(e.target.value)}
                    placeholder="Dr. Elena Vance"
                    className="w-full px-4 py-3 rounded-xl bg-[#050505]/90 border border-[#C5C6CB]/20 text-sm text-[#F2F0EB] placeholder-[#85868B]/50 focus:outline-none focus:border-[#F2F0EB] transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="architect-email"
                    className="block text-[10px] font-mono tracking-widest uppercase text-[#85868B] mb-1.5"
                  >
                    TRANSMISSION ENDPOINT (EMAIL)
                  </label>
                  <input
                    id="architect-email"
                    type="email"
                    required
                    value={architectEmail}
                    onChange={(e) => setArchitectEmail(e.target.value)}
                    placeholder="vance@orbital-institute.org"
                    className="w-full px-4 py-3 rounded-xl bg-[#050505]/90 border border-[#C5C6CB]/20 text-sm text-[#F2F0EB] placeholder-[#85868B]/50 focus:outline-none focus:border-[#F2F0EB] transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="architect-tier"
                    className="block text-[10px] font-mono tracking-widest uppercase text-[#85868B] mb-1.5"
                  >
                    COMPUTATIONAL TOPOLOGY
                  </label>
                  <select
                    id="architect-tier"
                    value={selectedTier}
                    onChange={(e) => setSelectedTier(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#050505]/90 border border-[#C5C6CB]/20 text-sm text-[#F2F0EB] focus:outline-none focus:border-[#F2F0EB] transition-colors"
                  >
                    <option value="Cognitive Orbital Synthesis">Cognitive Orbital Synthesis (1.4 PB/s)</option>
                    <option value="Astrolabe Spatial Telemetry">Astrolabe Spatial Telemetry (Sub-mm Grid)</option>
                    <option value="Kinetic Continuum Engine">Kinetic Continuum Engine (Fluid Mesh)</option>
                    <option value="Full Sovereign Enterprise Cluster">Full Sovereign Enterprise Cluster</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-4 rounded-full bg-[#F2F0EB] text-[#050505] font-medium text-xs tracking-[0.22em] uppercase hover:bg-[#C5C6CB] transition-colors cursor-pointer"
                >
                  Initialize Orbital Handshake
                </button>
              </form>
            ) : (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#C5C6CB]/15 border border-[#F2F0EB] mx-auto flex items-center justify-center text-[#F2F0EB]">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-['Cinzel',serif] text-xl text-[#F2F0EB]">Orbital Coordinates Locked</h4>
                <p className="text-xs text-[#A7A7AD] font-mono tracking-wider">
                  NODE ASSIGNED FOR {architectName.toUpperCase() || 'ARCHITECT'} // [{selectedTier.toUpperCase()}]
                </p>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="mt-3 px-6 py-2 rounded-full border border-[#C5C6CB]/30 text-xs font-mono uppercase text-[#A7A7AD] hover:text-[#F2F0EB] hover:border-[#F2F0EB] transition-colors"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
