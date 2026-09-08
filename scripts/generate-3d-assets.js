import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

async function renderScene(name, options, renderFn) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: options.width, height: options.height, deviceScaleFactor: options.scale || 2 }
  });

  page.on('pageerror', err => console.error(`[${name}] PAGE ERROR:`, err.message));
  page.on('console', msg => console.log(`[${name}] LOG:`, msg.text()));

  await page.setContent(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { margin: 0; padding: 0; overflow: hidden; background: ${options.bg || '#060B18'}; }
    canvas { display: block; width: 100vw; height: 100vh; }
  </style>
</head>
<body>
  <div id="container"></div>
</body>
</html>`);

  await page.addScriptTag({ path: 'scripts/three.min.js' });
  await page.evaluate(renderFn);
  await page.waitForTimeout(options.wait || 500);
  
  const outputPath = path.join(process.cwd(), 'assets', name);
  await page.screenshot({ path: outputPath, omitBackground: options.transparent || false });
  await browser.close();
  console.log(`✓ Successfully rendered high-tech asset: assets/${name}`);
}

async function main() {
  console.log('=== STARTING ADVANCED 3D CYBER-INDUSTRIAL ASSET GENERATION ===');

  // =========================================================================
  // 1. ISOMETRIC FACTORY DIGITAL TWIN & CEMS DUAL STACKS (Front Cover Hero)
  // =========================================================================
  await renderScene('digital-twin-3d-monolith.png', { width: 1024, height: 700, scale: 2, bg: '#060B18' }, function renderFn() {
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060B18, 0.010);

    const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(28, 22, 34);
    camera.lookAt(0, 5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    document.getElementById('container').appendChild(renderer.domElement);

    // Cyber CAD Grid Floor
    const grid = new THREE.GridHelper(70, 50, 0x00F0FF, 0x111E38);
    grid.position.y = -6;
    scene.add(grid);

    // Radar concentric rings on ground
    for (let r = 8; r <= 36; r += 6) {
      const ringGeo = new THREE.RingGeometry(r - 0.08, r + 0.08, 64);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x00A389, opacity: 0.35, transparent: true, side: THREE.DoubleSide });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = -5.92;
      scene.add(ring);
    }
    // Helper: Create Text Canvas Texture for 3D Holographic HUD (Ultra-sharp 1024x320)
    function makeTextTexture(title, val, status, colorHex) {
      const c = document.createElement('canvas');
      c.width = 1024;
      c.height = 320;
      const ctx = c.getContext('2d');

      // Semi-transparent deep navy background
      ctx.fillStyle = 'rgba(7, 16, 38, 0.94)';
      ctx.fillRect(0, 0, 1024, 320);

      // Cybernetic frame & corner brackets
      ctx.strokeStyle = colorHex;
      ctx.lineWidth = 10;
      ctx.strokeRect(6, 6, 1012, 308);

      ctx.fillStyle = colorHex;
      ctx.fillRect(0, 0, 60, 16);
      ctx.fillRect(0, 0, 16, 60);
      ctx.fillRect(1024 - 60, 320 - 16, 60, 16);
      ctx.fillRect(1024 - 16, 320 - 60, 16, 60);
      // Line 1: Top Category Title (y=60)
      ctx.textAlign = 'left';
      ctx.fillStyle = '#94A3B8';
      ctx.font = 'bold 38px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.fillText(title, 40, 62);

      // Line 2: Status Indicator Badge (y=112 - Completely separated from title)
      ctx.fillStyle = colorHex;
      ctx.font = '900 36px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.fillText(status, 40, 115);

      // Line 3: Big Measurement Value (y=245)
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 96px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.fillText(val, 40, 245);

      const tex = new THREE.CanvasTexture(c);
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.needsUpdate = true;
      return tex;
    }

    // Helper: Create Hazard Striped Material
    function makeHazardTexture() {
      const c = document.createElement('canvas');
      c.width = 256;
      c.height = 64;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(0, 0, 256, 64);
      ctx.fillStyle = '#0F172A';
      for (let x = -64; x < 320; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + 20, 0);
        ctx.lineTo(x - 10, 64);
        ctx.lineTo(x - 30, 64);
        ctx.closePath();
        ctx.fill();
      }
      const tex = new THREE.CanvasTexture(c);
      tex.wrapS = THREE.RepeatWrapping;
      tex.repeat.set(4, 1);
      return tex;
    }
    const hazardMat = new THREE.MeshBasicMaterial({ map: makeHazardTexture() });

    const factoryGroup = new THREE.Group();
    // Factory Complex: Main Boiler House
    const bld1Geo = new THREE.BoxGeometry(11, 8.5, 13);
    const bld1Mat = new THREE.MeshStandardMaterial({ color: 0x152238, roughness: 0.45, metalness: 0.75 });
    const bld1 = new THREE.Mesh(bld1Geo, bld1Mat);
    bld1.position.set(-8.5, -1.75, -2);
    factoryGroup.add(bld1);

    // Hazard stripe base trim
    const bldTrim = new THREE.Mesh(new THREE.BoxGeometry(11.1, 0.8, 13.1), hazardMat);
    bldTrim.position.set(-8.5, -5.6, -2);
    factoryGroup.add(bldTrim);

    // Glowing architectural strip windows
    for (let w = 0; w < 3; w++) {
      const winGeo = new THREE.BoxGeometry(10.8, 0.45, 0.1);
      const winMat = new THREE.MeshBasicMaterial({ color: 0x00F0FF });
      const win = new THREE.Mesh(winGeo, winMat);
      win.position.set(-8.5, -3.2 + w * 2.3, 4.56);
      factoryGroup.add(win);
    }

    // Secondary Filtration Facility (Foreground Left)
    const bld2 = new THREE.Mesh(
      new THREE.BoxGeometry(8, 6.5, 8),
      new THREE.MeshStandardMaterial({ color: 0x1A2942, roughness: 0.5, metalness: 0.65 })
    );
    bld2.position.set(7, -2.75, -5.5);
    factoryGroup.add(bld2);

    // Industrial Elevated Pipeline System
    const pipeMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9, roughness: 0.2 });
    const pipeGlowMat = new THREE.MeshBasicMaterial({ color: 0x00FFA3 });

    // Main horizontal conduit connecting buildings to stacks
    const pipe1 = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 17, 16), pipeMat);
    pipe1.rotation.z = Math.PI / 2;
    pipe1.position.set(-0.5, 0.5, -2);
    factoryGroup.add(pipe1);

    // Glowing core fluid ring around pipeline
    for (let k = -7; k <= 5; k += 2.5) {
      const pRing = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.09, 12, 24), pipeGlowMat);
      pRing.rotation.y = Math.PI / 2;
      pRing.position.set(k, 0.5, -2);
      factoryGroup.add(pRing);
    }

    // Helper: Build an Industrial CEMS Stack Tower
    function createCemsStack(x, z, scaleH = 1.0, isMain = true) {
      const stack = new THREE.Group();
      stack.position.set(x, 0, z);

      // Concrete Plinth with hazard stripes
      const plinth = new THREE.Mesh(
        new THREE.CylinderGeometry(3.6, 4.2, 2.5, 32),
        new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.7, metalness: 0.3 })
      );
      plinth.position.y = -4.75;
      stack.add(plinth);

      // Multi-section Chimney Tower
      const secHeights = [5, 6, 6, 5];
      const radii = [2.8, 2.5, 2.2, 1.9, 1.7];
      let cy = -3.5;

      for (let s = 0; s < 4; s++) {
        const h = secHeights[s] * scaleH;
        const col = (s % 2 === 0) ? 0x22334A : 0x19273C;
        const sec = new THREE.Mesh(
          new THREE.CylinderGeometry(radii[s + 1], radii[s], h, 32),
          new THREE.MeshStandardMaterial({ color: col, roughness: 0.35, metalness: 0.8 })
        );
        sec.position.y = cy + h / 2;
        stack.add(sec);

        // Circumferential Flange & Maintenance Ring
        const flange = new THREE.Mesh(
          new THREE.TorusGeometry(radii[s + 1] + 0.3, 0.16, 16, 32),
          new THREE.MeshStandardMaterial({ color: 0xC8102E, metalness: 0.85, roughness: 0.25 })
        );
        flange.rotation.x = Math.PI / 2;
        flange.position.y = cy + h;
        stack.add(flange);

        // Circular Catwalk Platform with safety railing on middle tier
        if (s === 2) {
          const walk = new THREE.Mesh(
            new THREE.CylinderGeometry(radii[s + 1] + 1.2, radii[s + 1] + 1.2, 0.15, 32),
            new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9, roughness: 0.3 })
          );
          walk.position.y = cy + h;
          stack.add(walk);
        }

        cy += h;
      }

      // External Vertical Ladder & Cage
      const ladderH = (cy - (-3.5));
      const ladder = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, ladderH, 0.2),
        new THREE.MeshStandardMaterial({ color: 0xF59E0B, metalness: 0.8, roughness: 0.3 })
      );
      ladder.position.set(radii[0] + 0.3, -3.5 + ladderH / 2, 0);
      stack.add(ladder);

      // Primary Laser Telemetry Scanner Slices (Clean Cyan & Crimson only)
      const lasers = [
        { y: 3.0 * scaleH, col: 0x00F0FF },
        { y: 11.5 * scaleH, col: 0xFF2A4D }
      ];

      lasers.forEach((l, idx) => {
        const ringMesh = new THREE.Mesh(
          new THREE.TorusGeometry(2.85 - idx * 0.3, 0.14, 16, 64),
          new THREE.MeshBasicMaterial({ color: l.col })
        );
        ringMesh.rotation.x = Math.PI / 2;
        ringMesh.position.y = l.y;
        stack.add(ringMesh);

        // Clean orthogonal laser scanner beams (no diagonal clutter)
        const beam = new THREE.Mesh(
          new THREE.CylinderGeometry(0.04, 0.04, 9, 8),
          new THREE.MeshBasicMaterial({ color: l.col, transparent: true, opacity: 0.85 })
        );
        beam.rotation.z = Math.PI / 2;
        beam.position.set(0, l.y, 0);
        stack.add(beam);
      });

      // Emission Particles Plume
      const pCount = isMain ? 500 : 300;
      const pGeo = new THREE.BufferGeometry();
      const pPos = new Float32Array(pCount * 3);
      const pCol = new Float32Array(pCount * 3);
      const topY = cy;

      for (let p = 0; p < pCount; p++) {
        const py = topY + Math.random() * 13;
        const spread = (py - topY) * 0.35 + 0.8;
        const th = Math.random() * Math.PI * 2;
        const r = Math.sqrt(Math.random()) * spread;

        pPos[p * 3] = Math.cos(th) * r;
        pPos[p * 3 + 1] = py;
        pPos[p * 3 + 2] = Math.sin(th) * r;

        const t = (py - topY) / 13;
        pCol[p * 3] = 0.0;
        pCol[p * 3 + 1] = 0.85 * (1 - t * 0.3);
        pCol[p * 3 + 2] = 0.95 * (1 - t);
      }

      pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
      pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));
      const pMat = new THREE.PointsMaterial({ size: 0.55, vertexColors: true, transparent: true, opacity: 0.75 });
      stack.add(new THREE.Points(pGeo, pMat));

      return stack;
    }

    // Main CEMS Stack Tower (Central)
    const mainStack = createCemsStack(2, 2, 1.15, true);
    factoryGroup.add(mainStack);

    // Secondary CEMS Auxiliary Stack Tower (Mid Left)
    const subStack = createCemsStack(-3.5, -4, 0.9, false);
    factoryGroup.add(subStack);

    // Floating Holographic Telemetry HUD Panels with DYNAMIC HIGH-RES TEXT
    const hudCards = [
      { title: 'CEMS // BỤI TỔNG (PM2.5)', val: '4.22 mg/Nm³', status: '● ĐẠT CHUẨN', color: '#00FFA3', pos: [12.5, 12, 3], scale: 1.0 },
      { title: 'CEMS // CO (KHÍ THẢI)', val: '0.21 mg/Nm³', status: '● TỐI ƯU', color: '#00F0FF', pos: [-8.5, 9, 8], scale: 1.0 },
      { title: 'CEMS // NITƠ OXIT (NOx)', val: '1.31 mg/Nm³', status: '● AN TOÀN', color: '#FF2A4D', pos: [11.5, 6, -3], scale: 1.0 },
      { title: 'TRUYỀN DẪN // 63 SỞ TN&MT', val: 'SLA 99.9%', status: '● 24/7 ONLINE', color: '#FFB800', pos: [-7.5, 16.0, 2], scale: 1.0 }
    ];
    hudCards.forEach(c => {
      const tex = makeTextTexture(c.title, c.val, c.status, c.color);
      const cardGeo = new THREE.PlaneGeometry(6.4, 2.0);
      const cardMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide });
      const cardMesh = new THREE.Mesh(cardGeo, cardMat);
      cardMesh.position.set(...c.pos);
      cardMesh.lookAt(camera.position);
      factoryGroup.add(cardMesh);

      // Neon frame line
      const edgeGeo = new THREE.EdgesGeometry(cardGeo);
      const edgeMat = new THREE.LineBasicMaterial({ color: c.color, linewidth: 2 });
      const edgeMesh = new THREE.LineSegments(edgeGeo, edgeMat);
      edgeMesh.position.set(...c.pos);
      edgeMesh.lookAt(camera.position);
      factoryGroup.add(edgeMesh);

      // Holographic leader line to stack
      const pts = [
        new THREE.Vector3(...c.pos),
        new THREE.Vector3(c.pos[0] * 0.35 + 1.5, c.pos[1] * 0.75, c.pos[2] * 0.35 + 1.5)
      ];
      const lGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const lMat = new THREE.LineDashedMaterial({ color: c.color, dashSize: 0.4, gapSize: 0.25 });
      const line = new THREE.Line(lGeo, lMat);
      line.computeLineDistances();
      factoryGroup.add(line);
    });

    scene.add(factoryGroup);

    // High-Tech Cinematic 3-Point Lighting
    scene.add(new THREE.AmbientLight(0x0C182E, 2.2));

    const keyLight = new THREE.DirectionalLight(0x00F0FF, 3.5);
    keyLight.position.set(30, 40, 25);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xFF2A4D, 2.8);
    rimLight.position.set(-25, 20, -15);
    scene.add(rimLight);

    const emeraldFill = new THREE.PointLight(0x00FFA3, 4.0, 50);
    emeraldFill.position.set(2, 12, 8);
    scene.add(emeraldFill);

    renderer.render(scene, camera);
  });

  // =========================================================================
  // 2. DATALOGGER & ATEX OPTICAL SENSOR EXPLODED VIEW (Hardware Section)
  // =========================================================================
  await renderScene('datalogger-exploded-3d.png', { width: 1024, height: 700, scale: 2, bg: '#070D1D' }, function renderFn() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(18, 14, 20);
    camera.lookAt(0, 1, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('container').appendChild(renderer.domElement);

    const grid = new THREE.GridHelper(32, 32, 0x0066CC, 0x111E38);
    grid.position.y = -5.5;
    scene.add(grid);

    const group = new THREE.Group();

    // 1. DIN Rail Sub-chassis (y = -3.5)
    const din = new THREE.Mesh(
      new THREE.BoxGeometry(11, 0.7, 6.5),
      new THREE.MeshStandardMaterial({ color: 0x1E293B, metalness: 0.9, roughness: 0.25 })
    );
    din.position.y = -3.5;
    group.add(din);

    // DIN Rail mounting brackets
    const bracket1 = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.2, 7), new THREE.MeshStandardMaterial({ color: 0xC8102E, metalness: 0.85 }));
    bracket1.position.set(-4, -3.5, 0);
    group.add(bracket1);
    const bracket2 = bracket1.clone();
    bracket2.position.x = 4;
    group.add(bracket2);

    // 2. Industrial Lithium UPS Battery Pack (y = -1.5)
    const bat = new THREE.Mesh(
      new THREE.BoxGeometry(8, 1.1, 4.8),
      new THREE.MeshStandardMaterial({ color: 0x0F172A, metalness: 0.5, roughness: 0.5 })
    );
    bat.position.y = -1.5;
    group.add(bat);

    for (let c = -2.8; c <= 2.8; c += 1.4) {
      const cell = new THREE.Mesh(
        new THREE.CylinderGeometry(0.55, 0.55, 4.6, 16),
        new THREE.MeshStandardMaterial({ color: 0x00A389, metalness: 0.8, roughness: 0.2 })
      );
      cell.rotation.x = Math.PI / 2;
      cell.position.set(c, -1.5, 0);
      group.add(cell);
    }

    // 3. Motherboard PCB with Gold Traces & CPU (y = 0.8)
    const pcb = new THREE.Mesh(
      new THREE.BoxGeometry(10.2, 0.25, 5.8),
      new THREE.MeshStandardMaterial({ color: 0x064E3B, metalness: 0.4, roughness: 0.35 })
    );
    pcb.position.y = 0.8;
    group.add(pcb);

    // ARM Cortex-A53 CPU SoC
    const cpu = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 0.45, 2.6),
      new THREE.MeshStandardMaterial({ color: 0x0A0F1E, metalness: 0.95, roughness: 0.15 })
    );
    cpu.position.set(0, 1.1, 0);
    group.add(cpu);

    // CPU Hologram Ring
    const cpuGlow = new THREE.Mesh(
      new THREE.RingGeometry(0.8, 1.05, 32),
      new THREE.MeshBasicMaterial({ color: 0x00F0FF, side: THREE.DoubleSide })
    );
    cpuGlow.rotation.x = -Math.PI / 2;
    cpuGlow.position.set(0, 1.35, 0);
    group.add(cpuGlow);

    // Modbus RS485 Industrial Terminal Blocks (Green rows)
    for (let t = -4.0; t <= 4.0; t += 1.0) {
      const term = new THREE.Mesh(
        new THREE.BoxGeometry(0.85, 1.1, 0.9),
        new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.4 })
      );
      term.position.set(t, 1.25, 2.4);
      group.add(term);
    }

    // Dual 4G/LTE SMA Antenna Connectors
    const ant1 = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 4.0, 16), new THREE.MeshStandardMaterial({ color: 0x1E293B, metalness: 0.9 }));
    ant1.position.set(4.2, 2.8, -2.4);
    group.add(ant1);
    const ant2 = ant1.clone();
    ant2.position.set(3.0, 2.8, -2.4);
    group.add(ant2);

    // 4. ATEX Sampling Sensor Probe (Exploded at Right, x = 6.8)
    const probeGroup = new THREE.Group();
    probeGroup.position.set(6.8, 1.2, 0);

    const flange = new THREE.Mesh(
      new THREE.CylinderGeometry(1.8, 1.8, 0.35, 32),
      new THREE.MeshStandardMaterial({ color: 0x64748B, metalness: 0.9, roughness: 0.2 })
    );
    flange.rotation.z = Math.PI / 2;
    probeGroup.add(flange);

    const tube = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 0.8, 6, 32),
      new THREE.MeshStandardMaterial({ color: 0x94A3B8, metalness: 0.95, roughness: 0.15 })
    );
    tube.rotation.z = Math.PI / 2;
    tube.position.x = 3.2;
    probeGroup.add(tube);

    const lens = new THREE.Mesh(
      new THREE.CylinderGeometry(0.85, 0.85, 0.3, 32),
      new THREE.MeshBasicMaterial({ color: 0x00F0FF })
    );
    lens.rotation.z = Math.PI / 2;
    lens.position.x = 6.3;
    probeGroup.add(lens);

    group.add(probeGroup);

    // 5. Top Cast-Aluminum Lid with Heat Sinks (Floating y = 4.2)
    const lid = new THREE.Mesh(
      new THREE.BoxGeometry(10.8, 0.8, 6.2),
      new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.85, roughness: 0.2, transparent: true, opacity: 0.9 })
    );
    lid.position.y = 4.2;
    group.add(lid);

    const bar = new THREE.Mesh(new THREE.BoxGeometry(10.9, 0.18, 0.35), new THREE.MeshBasicMaterial({ color: 0xFF2A4D }));
    bar.position.set(0, 4.3, 2.8);
    group.add(bar);

    scene.add(group);

    scene.add(new THREE.AmbientLight(0x0C182E, 1.8));
    const l1 = new THREE.DirectionalLight(0x00F0FF, 2.8);
    l1.position.set(18, 22, 18);
    scene.add(l1);
    const l2 = new THREE.DirectionalLight(0xFF2A4D, 2.0);
    l2.position.set(-18, 12, -12);
    scene.add(l2);

    renderer.render(scene, camera);
  });

  // =========================================================================
  // 3. 3D AI NEURAL COMBUSTION CORE (AI Section)
  // =========================================================================
  await renderScene('ai-combustion-core-3d.png', { width: 1024, height: 700, scale: 2, bg: '#060B18' }, function renderFn() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(16, 12, 19);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('container').appendChild(renderer.domElement);

    const group = new THREE.Group();

    const chamber = new THREE.Mesh(
      new THREE.CylinderGeometry(4.8, 4.8, 9, 32, 1, true, 0, Math.PI * 1.5),
      new THREE.MeshStandardMaterial({ color: 0x1E293B, metalness: 0.85, roughness: 0.25, side: THREE.DoubleSide })
    );
    group.add(chamber);

    const fCount = 600;
    const fGeo = new THREE.BufferGeometry();
    const fPos = new Float32Array(fCount * 3);
    const fCol = new Float32Array(fCount * 3);

    for (let f = 0; f < fCount; f++) {
      const fy = (Math.random() - 0.5) * 7.5;
      const r = Math.random() * 3.2 * (1 - Math.abs(fy) / 4.8);
      const angle = Math.random() * Math.PI * 2;

      fPos[f * 3] = Math.cos(angle) * r;
      fPos[f * 3 + 1] = fy;
      fPos[f * 3 + 2] = Math.sin(angle) * r;

      if (r < 1.4) {
        fCol[f * 3] = 0.2;
        fCol[f * 3 + 1] = 0.9;
        fCol[f * 3 + 2] = 1.0;
      } else {
        fCol[f * 3] = 1.0;
        fCol[f * 3 + 1] = 0.25;
        fCol[f * 3 + 2] = 0.1;
      }
    }

    fGeo.setAttribute('position', new THREE.BufferAttribute(fPos, 3));
    fGeo.setAttribute('color', new THREE.BufferAttribute(fCol, 3));
    const flame = new THREE.Points(fGeo, new THREE.PointsMaterial({ size: 0.38, vertexColors: true, transparent: true, opacity: 0.9 }));
    group.add(flame);

    for (let n = -2.5; n <= 2.5; n += 2.5) {
      const nozzle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.3, 2.2, 16),
        new THREE.MeshStandardMaterial({ color: 0x00FFA3, metalness: 0.9 })
      );
      nozzle.rotation.z = Math.PI / 2;
      nozzle.position.set(-4.6, n, 0);
      group.add(nozzle);
    }

    const nodes = [];
    const nTotal = 22;
    for (let i = 0; i < nTotal; i++) {
      const theta = (i / nTotal) * Math.PI * 2;
      const ny = ((i % 5) - 2) * 1.8;
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.32, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0x00FFA3 })
      );
      sphere.position.set(Math.cos(theta) * 5.6, ny, Math.sin(theta) * 5.6);
      nodes.push(sphere);
      group.add(sphere);
    }

    for (let a = 0; a < nodes.length; a++) {
      for (let b = a + 1; b < nodes.length; b++) {
        if (nodes[a].position.distanceTo(nodes[b].position) < 4.8) {
          const pts = [nodes[a].position, nodes[b].position];
          const line = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(pts),
            new THREE.LineBasicMaterial({ color: 0x00F0FF, transparent: true, opacity: 0.45 })
          );
          group.add(line);
        }
      }
    }

    scene.add(group);

    scene.add(new THREE.AmbientLight(0x0A1428, 1.8));
    const fireLight = new THREE.PointLight(0xFF5500, 3.5, 25);
    scene.add(fireLight);
    const cyberLight = new THREE.DirectionalLight(0x00FFA3, 2.5);
    cyberLight.position.set(12, 16, 12);
    scene.add(cyberLight);

    renderer.render(scene, camera);
  });

  // =========================================================================
  // 4. VIETNAM 3D TELEMETRY CYBER NETWORK MAP (Analytics Section)
  // =========================================================================
  await renderScene('vietnam-telemetry-map-3d.png', { width: 1024, height: 700, scale: 2, bg: '#070D1D' }, function renderFn() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(14, 18, 18);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('container').appendChild(renderer.domElement);

    const grid = new THREE.GridHelper(34, 34, 0x0066CC, 0x111E38);
    grid.position.y = -2.2;
    scene.add(grid);

    const mapGroup = new THREE.Group();

    const hubs = [
      { name: 'Hà Nội', pos: new THREE.Vector3(-2.2, 0, -5.0), color: 0xFF2A4D },
      { name: 'Hải Phòng / QN', pos: new THREE.Vector3(-1.3, 0, -4.5), color: 0x00F0FF },
      { name: 'Nghi Sơn (Thanh Hóa)', pos: new THREE.Vector3(-1.9, 0, -2.8), color: 0x00F0FF },
      { name: 'Đà Nẵng / Chu Lai', pos: new THREE.Vector3(0.1, 0, -0.6), color: 0xFF2A4D },
      { name: 'Dung Quất', pos: new THREE.Vector3(0.9, 0, 1.2), color: 0x00F0FF },
      { name: 'Khánh Hòa', pos: new THREE.Vector3(1.3, 0, 2.6), color: 0x00F0FF },
      { name: 'Bình Dương (VSIP)', pos: new THREE.Vector3(0.6, 0, 4.2), color: 0xFF2A4D },
      { name: 'TP. Hồ Chí Minh', pos: new THREE.Vector3(0.2, 0, 4.8), color: 0x00FFA3 },
      { name: 'Vũng Tàu', pos: new THREE.Vector3(1.0, 0, 5.2), color: 0x00F0FF },
      { name: 'Cần Thơ', pos: new THREE.Vector3(-0.9, 0, 5.8), color: 0x00F0FF }
    ];

    hubs.forEach(h => {
      const pin = new THREE.Mesh(
        new THREE.CylinderGeometry(0.14, 0.14, 2.2, 16),
        new THREE.MeshBasicMaterial({ color: h.color })
      );
      pin.position.copy(h.pos).add(new THREE.Vector3(0, 1.1, 0));
      mapGroup.add(pin);

      const orb = new THREE.Mesh(
        new THREE.SphereGeometry(0.35, 16, 16),
        new THREE.MeshBasicMaterial({ color: h.color })
      );
      orb.position.copy(h.pos).add(new THREE.Vector3(0, 2.2, 0));
      mapGroup.add(orb);

      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.4, 0.7, 32),
        new THREE.MeshBasicMaterial({ color: h.color, side: THREE.DoubleSide, transparent: true, opacity: 0.65 })
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.copy(h.pos).add(new THREE.Vector3(0, 0.05, 0));
      mapGroup.add(ring);
    });

    const cloudPos = new THREE.Vector3(0, 4.8, 0);
    const cloudCore = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.95, 2),
      new THREE.MeshStandardMaterial({ color: 0x00F0FF, metalness: 0.9, roughness: 0.1, wireframe: true })
    );
    cloudCore.position.copy(cloudPos);
    mapGroup.add(cloudCore);

    hubs.forEach(h => {
      const curve = new THREE.QuadraticBezierCurve3(
        h.pos.clone().add(new THREE.Vector3(0, 2.2, 0)),
        new THREE.Vector3((h.pos.x + cloudPos.x) / 2, 6.2, (h.pos.z + cloudPos.z) / 2),
        cloudPos
      );
      const pts = curve.getPoints(32);
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({ color: h.color, transparent: true, opacity: 0.85 })
      );
      mapGroup.add(line);
    });

    scene.add(mapGroup);

    scene.add(new THREE.AmbientLight(0x0C182E, 1.8));
    const topLight = new THREE.DirectionalLight(0x00F0FF, 2.8);
    topLight.position.set(12, 24, 12);
    scene.add(topLight);

    renderer.render(scene, camera);
  });

  console.log('=== ALL 4 ADVANCED 3D ASSETS SUCCESSFULLY RENDERED & READY ===');
}

main().catch(err => {
  console.error('Fatal 3D Render Error:', err);
  process.exit(1);
});
