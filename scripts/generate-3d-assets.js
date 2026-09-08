import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

async function renderScene(name, options, renderFn) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: options.width, height: options.height, deviceScaleFactor: options.scale || 2 }
  });

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { margin: 0; padding: 0; overflow: hidden; background: ${options.bg || '#060B18'}; }
    canvas { display: block; width: 100vw; height: 100vh; }
  </style>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
</head>
<body>
  <div id="container"></div>
  <script>
    ${renderFn.toString()}
    renderFn();
  </script>
</body>
</html>`;

  await page.setContent(html);
  await page.waitForTimeout(options.wait || 800);
  
  const outputPath = path.join(process.cwd(), 'assets', name);
  await page.screenshot({ path: outputPath, omitBackground: options.transparent || false });
  await browser.close();
  console.log(`✓ Successfully rendered: assets/${name}`);
}

async function main() {
  console.log('=== STARTING 3D ASSET GENERATION VIA THREE.JS & PLAYWRIGHT ===');

  // 1. Digital Twin 3D Monolith Stack Tower (Front Cover Hero)
  await renderScene('digital-twin-3d-monolith.png', { width: 1024, height: 700, scale: 2, bg: '#060B18' }, function renderFn() {
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060B18, 0.015);

    const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(22, 14, 28);
    camera.lookAt(0, 5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    document.getElementById('container').appendChild(renderer.domElement);

    // Grid floor
    const grid = new THREE.GridHelper(60, 40, 0x00F0FF, 0x15223E);
    grid.position.y = -6;
    scene.add(grid);

    // Radial floor rings
    for (let r = 5; r <= 25; r += 5) {
      const ringGeo = new THREE.RingGeometry(r - 0.05, r + 0.05, 64);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x00A389, opacity: 0.25, transparent: true, side: THREE.DoubleSide });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = -5.9;
      scene.add(ring);
    }

    // Main Industrial Stack Tower
    const stackGroup = new THREE.Group();

    // Concrete base pedestal
    const baseGeo = new THREE.CylinderGeometry(5.5, 6.2, 3, 32);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.6, metalness: 0.4 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = -4.5;
    stackGroup.add(base);

    // Stack column sections
    const heights = [6, 7, 7, 5];
    const radii = [4.2, 3.8, 3.4, 3.0, 2.7];
    let currY = -3;
    
    for (let i = 0; i < 4; i++) {
      const secH = heights[i];
      const secGeo = new THREE.CylinderGeometry(radii[i + 1], radii[i], secH, 32);
      const secMat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0x2A3B53 : 0x1E293B,
        roughness: 0.35,
        metalness: 0.75
      });
      const sec = new THREE.Mesh(secGeo, secMat);
      sec.position.y = currY + secH / 2;
      stackGroup.add(sec);

      // Flange ring
      const flangeGeo = new THREE.TorusGeometry(radii[i + 1] + 0.25, 0.15, 16, 32);
      const flangeMat = new THREE.MeshStandardMaterial({ color: 0xC8102E, metalness: 0.8, roughness: 0.3 });
      const flange = new THREE.Mesh(flangeGeo, flangeMat);
      flange.rotation.x = Math.PI / 2;
      flange.position.y = currY + secH;
      stackGroup.add(flange);

      currY += secH;
    }

    // Laser telemetry scanner rings
    const laserColors = [0xFF2A4D, 0x00F0FF, 0x00FFA3, 0xFFB800];
    const laserHeights = [1, 7, 13, 18];
    
    for (let j = 0; j < 4; j++) {
      const lColor = laserColors[j];
      const lH = laserHeights[j];
      const lRingGeo = new THREE.TorusGeometry(4.6 - j * 0.35, 0.12, 16, 64);
      const lRingMat = new THREE.MeshBasicMaterial({ color: lColor });
      const lRing = new THREE.Mesh(lRingGeo, lRingMat);
      lRing.rotation.x = Math.PI / 2;
      lRing.position.y = lH;
      stackGroup.add(lRing);

      // 4 Laser projection beams per ring
      for (let b = 0; b < 4; b++) {
        const angle = (b * Math.PI / 2) + (j * 0.4);
        const bGeo = new THREE.CylinderGeometry(0.04, 0.04, 8, 8);
        const bMat = new THREE.MeshBasicMaterial({ color: lColor, transparent: true, opacity: 0.75 });
        const beam = new THREE.Mesh(bGeo, bMat);
        beam.rotation.z = Math.PI / 2;
        beam.rotation.y = angle;
        beam.position.set(Math.cos(angle) * 4, lH, Math.sin(angle) * 4);
        stackGroup.add(beam);
      }
    }

    // Emission plume particles
    const partCount = 400;
    const partGeo = new THREE.BufferGeometry();
    const partPos = new Float32Array(partCount * 3);
    const partCol = new Float32Array(partCount * 3);

    for (let p = 0; p < partCount; p++) {
      const py = 22 + Math.random() * 14;
      const spread = (py - 22) * 0.35 + 1.2;
      const theta = Math.random() * Math.PI * 2;
      const rad = Math.sqrt(Math.random()) * spread;
      
      partPos[p * 3] = Math.cos(theta) * rad;
      partPos[p * 3 + 1] = py;
      partPos[p * 3 + 2] = Math.sin(theta) * rad;

      const t = (py - 22) / 14;
      partCol[p * 3] = 0.0;
      partCol[p * 3 + 1] = 0.8 + 0.2 * (1 - t);
      partCol[p * 3 + 2] = 0.9 * (1 - t);
    }

    partGeo.setAttribute('position', new THREE.BufferAttribute(partPos, 3));
    partGeo.setAttribute('color', new THREE.BufferAttribute(partCol, 3));
    const partMat = new THREE.PointsMaterial({ size: 0.6, vertexColors: true, transparent: true, opacity: 0.7 });
    const plume = new THREE.Points(partGeo, partMat);
    stackGroup.add(plume);

    scene.add(stackGroup);

    // High-tech lighting setup
    const ambientLight = new THREE.AmbientLight(0x0E1E38, 1.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x00F0FF, 2.5);
    dirLight1.position.set(20, 30, 20);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xFF2A4D, 2.2);
    dirLight2.position.set(-20, 15, -10);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0x00FFA3, 3, 35);
    pointLight.position.set(0, 15, 6);
    scene.add(pointLight);

    renderer.render(scene, camera);
  });

  // 2. Datalogger Exploded 3D View (Hardware Section)
  await renderScene('datalogger-exploded-3d.png', { width: 1024, height: 700, scale: 2, bg: '#080E1E' }, function renderFn() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(16, 12, 18);
    camera.lookAt(0, 1, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('container').appendChild(renderer.domElement);

    const grid = new THREE.GridHelper(30, 30, 0x0066CC, 0x15223E);
    grid.position.y = -5;
    scene.add(grid);

    const group = new THREE.Group();

    // 1. Bottom Chassis DIN Rail Mount (y = -3)
    const dinGeo = new THREE.BoxGeometry(10, 0.8, 6);
    const dinMat = new THREE.MeshStandardMaterial({ color: 0x1E293B, metalness: 0.85, roughness: 0.3 });
    const dinChassis = new THREE.Mesh(dinGeo, dinMat);
    dinChassis.position.y = -3;
    group.add(dinChassis);

    // DIN Rail clamp
    const clampGeo = new THREE.BoxGeometry(1.2, 1.2, 6.4);
    const clampMat = new THREE.MeshStandardMaterial({ color: 0xC8102E, metalness: 0.9, roughness: 0.2 });
    const clamp = new THREE.Mesh(clampGeo, clampMat);
    clamp.position.set(-3.5, -3, 0);
    group.add(clamp);

    // 2. Lithium UPS Battery pack (y = -1.2)
    const batGeo = new THREE.BoxGeometry(7, 0.9, 4.5);
    const batMat = new THREE.MeshStandardMaterial({ color: 0x0F172A, metalness: 0.5, roughness: 0.5 });
    const bat = new THREE.Mesh(batGeo, batMat);
    bat.position.y = -1.2;
    group.add(bat);

    // Battery cell details
    for (let c = -2.2; c <= 2.2; c += 1.4) {
      const cellGeo = new THREE.CylinderGeometry(0.5, 0.5, 4.2, 16);
      const cellMat = new THREE.MeshStandardMaterial({ color: 0x00A389, metalness: 0.7, roughness: 0.3 });
      const cell = new THREE.Mesh(cellGeo, cellMat);
      cell.rotation.x = Math.PI / 2;
      cell.position.set(c, -1.2, 0);
      group.add(cell);
    }

    // 3. Main Motherboard PCB (y = 0.8)
    const pcbGeo = new THREE.BoxGeometry(9.2, 0.25, 5.4);
    const pcbMat = new THREE.MeshStandardMaterial({ color: 0x064E3B, metalness: 0.4, roughness: 0.4 });
    const pcb = new THREE.Mesh(pcbGeo, pcbMat);
    pcb.position.y = 0.8;
    group.add(pcb);

    // CPU SoC ARM Cortex-A53
    const cpuGeo = new THREE.BoxGeometry(2.4, 0.4, 2.4);
    const cpuMat = new THREE.MeshStandardMaterial({ color: 0x0B132B, metalness: 0.9, roughness: 0.2 });
    const cpu = new THREE.Mesh(cpuGeo, cpuMat);
    cpu.position.set(0, 1.05, 0);
    group.add(cpu);

    // Glowing CPU core ring
    const cpuGlowGeo = new THREE.RingGeometry(0.7, 0.9, 32);
    const cpuGlowMat = new THREE.MeshBasicMaterial({ color: 0x00F0FF, side: THREE.DoubleSide });
    const cpuGlow = new THREE.Mesh(cpuGlowGeo, cpuGlowMat);
    cpuGlow.rotation.x = -Math.PI / 2;
    cpuGlow.position.set(0, 1.26, 0);
    group.add(cpuGlow);

    // Terminal green blocks for RS485 / 4-20mA
    for (let t = -3.5; t <= 3.5; t += 1.0) {
      const termGeo = new THREE.BoxGeometry(0.8, 1.0, 0.8);
      const termMat = new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.4 });
      const term = new THREE.Mesh(termGeo, termMat);
      term.position.set(t, 1.2, 2.2);
      group.add(term);
    }

    // Dual 4G Antenna Mounts
    const ant1 = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 3.5, 16), new THREE.MeshStandardMaterial({ color: 0x1E293B, metalness: 0.8 }));
    ant1.position.set(3.8, 2.5, -2.2);
    group.add(ant1);
    const ant2 = ant1.clone();
    ant2.position.set(2.8, 2.5, -2.2);
    group.add(ant2);

    // 4. Top Aluminum Case Lid with Vents (Floating y = 3.8)
    const lidGeo = new THREE.BoxGeometry(9.8, 0.7, 5.8);
    const lidMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.25, transparent: true, opacity: 0.88 });
    const lid = new THREE.Mesh(lidGeo, lidMat);
    lid.position.y = 3.8;
    group.add(lid);

    // Red accent trim on lid
    const trimGeo = new THREE.BoxGeometry(9.9, 0.15, 0.3);
    const trimMat = new THREE.MeshBasicMaterial({ color: 0xFF2A4D });
    const trim = new THREE.Mesh(trimGeo, trimMat);
    trim.position.set(0, 3.9, 2.6);
    group.add(trim);

    scene.add(group);

    // Lighting
    scene.add(new THREE.AmbientLight(0x0E1E38, 1.5));
    const dLight1 = new THREE.DirectionalLight(0x00F0FF, 2.2);
    dLight1.position.set(15, 20, 15);
    scene.add(dLight1);
    const dLight2 = new THREE.DirectionalLight(0xFF2A4D, 1.8);
    dLight2.position.set(-15, 10, -10);
    scene.add(dLight2);

    renderer.render(scene, camera);
  });

  // 3. AI Combustion Core 3D (AI Section)
  await renderScene('ai-combustion-core-3d.png', { width: 1024, height: 700, scale: 2, bg: '#060B18' }, function renderFn() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(15, 10, 18);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('container').appendChild(renderer.domElement);

    const group = new THREE.Group();

    // Cylindrical Combustion chamber with open cutaway
    const chamberGeo = new THREE.CylinderGeometry(4.5, 4.5, 8, 32, 1, true, 0, Math.PI * 1.5);
    const chamberMat = new THREE.MeshStandardMaterial({
      color: 0x1E293B,
      metalness: 0.8,
      roughness: 0.3,
      side: THREE.DoubleSide
    });
    const chamber = new THREE.Mesh(chamberGeo, chamberMat);
    group.add(chamber);

    // Flame Core Particles (Amber & Hot Cyan)
    const flameCount = 500;
    const flameGeo = new THREE.BufferGeometry();
    const flamePos = new Float32Array(flameCount * 3);
    const flameCol = new Float32Array(flameCount * 3);

    for (let f = 0; f < flameCount; f++) {
      const fy = (Math.random() - 0.5) * 6;
      const r = Math.random() * 2.8 * (1 - Math.abs(fy) / 4);
      const angle = Math.random() * Math.PI * 2;

      flamePos[f * 3] = Math.cos(angle) * r;
      flamePos[f * 3 + 1] = fy;
      flamePos[f * 3 + 2] = Math.sin(angle) * r;

      if (r < 1.2) {
        flameCol[f * 3] = 0.2;
        flameCol[f * 3 + 1] = 0.8;
        flameCol[f * 3 + 2] = 1.0;
      } else {
        flameCol[f * 3] = 1.0;
        flameCol[f * 3 + 1] = 0.3;
        flameCol[f * 3 + 2] = 0.1;
      }
    }

    flameGeo.setAttribute('position', new THREE.BufferAttribute(flamePos, 3));
    flameGeo.setAttribute('color', new THREE.BufferAttribute(flameCol, 3));
    const flamePoints = new THREE.Points(flameGeo, new THREE.PointsMaterial({ size: 0.35, vertexColors: true, transparent: true, opacity: 0.85 }));
    group.add(flamePoints);

    // Neural Network Synaptic Cage around Chamber
    const nodeCount = 18;
    const nodes = [];
    for (let n = 0; n < nodeCount; n++) {
      const theta = (n / nodeCount) * Math.PI * 2;
      const ny = ((n % 3) - 1) * 2.8;
      const nodeMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.28, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0x00FFA3 })
      );
      nodeMesh.position.set(Math.cos(theta) * 5.2, ny, Math.sin(theta) * 5.2);
      nodes.push(nodeMesh);
      group.add(nodeMesh);
    }

    // Synaptic connection lines between nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].position.distanceTo(nodes[j].position) < 4.5) {
          const lineGeo = new THREE.BufferGeometry().setFromPoints([nodes[i].position, nodes[j].position]);
          const lineMat = new THREE.LineBasicMaterial({ color: 0x00F0FF, transparent: true, opacity: 0.4 });
          group.add(new THREE.Line(lineGeo, lineMat));
        }
      }
    }

    scene.add(group);

    scene.add(new THREE.AmbientLight(0x0E1E38, 1.8));
    const fireLight = new THREE.PointLight(0xFF5500, 3, 20);
    fireLight.position.set(0, 0, 0);
    scene.add(fireLight);

    const cyberLight = new THREE.DirectionalLight(0x00FFA3, 2);
    cyberLight.position.set(10, 15, 10);
    scene.add(cyberLight);

    renderer.render(scene, camera);
  });

  // 4. Vietnam Nationwide Telemetry Network 3D Map
  await renderScene('vietnam-telemetry-map-3d.png', { width: 1024, height: 700, scale: 2, bg: '#080E1E' }, function renderFn() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(12, 16, 16);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('container').appendChild(renderer.domElement);

    const grid = new THREE.GridHelper(30, 30, 0x0066CC, 0x15223E);
    grid.position.y = -2;
    scene.add(grid);

    const mapGroup = new THREE.Group();

    // S-curve spine of Vietnam key telemetry nodes
    const hubs = [
      { name: 'Hà Nội (Hub Bắc)', pos: new THREE.Vector3(-2, 0, -4.5), color: 0xFF2A4D },
      { name: 'Hải Phòng / Quảng Ninh', pos: new THREE.Vector3(-1.2, 0, -4.2), color: 0x00F0FF },
      { name: 'Thanh Hóa / Nghệ An', pos: new THREE.Vector3(-1.8, 0, -2.5), color: 0x00F0FF },
      { name: 'Đà Nẵng / Quảng Nam', pos: new THREE.Vector3(0, 0, -0.5), color: 0xFF2A4D },
      { name: 'Dung Quất / Bình Định', pos: new THREE.Vector3(0.8, 0, 1.2), color: 0x00F0FF },
      { name: 'Khánh Hòa', pos: new THREE.Vector3(1.2, 0, 2.5), color: 0x00F0FF },
      { name: 'Bình Dương / Đồng Nai', pos: new THREE.Vector3(0.5, 0, 4.0), color: 0xFF2A4D },
      { name: 'TP. Hồ Chí Minh (Central)', pos: new THREE.Vector3(0.2, 0, 4.5), color: 0x00FFA3 },
      { name: 'Cần Thơ / ĐBSCL', pos: new THREE.Vector3(-0.8, 0, 5.5), color: 0x00F0FF }
    ];

    hubs.forEach(h => {
      const pinGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.8, 16);
      const pinMat = new THREE.MeshBasicMaterial({ color: h.color });
      const pin = new THREE.Mesh(pinGeo, pinMat);
      pin.position.copy(h.pos).add(new THREE.Vector3(0, 0.9, 0));
      mapGroup.add(pin);

      const orbGeo = new THREE.SphereGeometry(0.3, 16, 16);
      const orb = new THREE.Mesh(orbGeo, new THREE.MeshBasicMaterial({ color: h.color }));
      orb.position.copy(h.pos).add(new THREE.Vector3(0, 1.8, 0));
      mapGroup.add(orb);

      const pRing = new THREE.Mesh(
        new THREE.RingGeometry(0.3, 0.5, 32),
        new THREE.MeshBasicMaterial({ color: h.color, side: THREE.DoubleSide, transparent: true, opacity: 0.6 })
      );
      pRing.rotation.x = Math.PI / 2;
      pRing.position.copy(h.pos).add(new THREE.Vector3(0, 0.05, 0));
      mapGroup.add(pRing);
    });

    const cloudNode = new THREE.Vector3(0, 4, 0);
    const cloudOrb = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.8, 2),
      new THREE.MeshStandardMaterial({ color: 0x00F0FF, metalness: 0.9, roughness: 0.1, wireframe: true })
    );
    cloudOrb.position.copy(cloudNode);
    mapGroup.add(cloudOrb);

    hubs.forEach(h => {
      const curve = new THREE.QuadraticBezierCurve3(
        h.pos.clone().add(new THREE.Vector3(0, 1.8, 0)),
        new THREE.Vector3((h.pos.x + cloudNode.x) / 2, 5.5, (h.pos.z + cloudNode.z) / 2),
        cloudNode
      );
      const pts = curve.getPoints(30);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const arcMat = new THREE.LineBasicMaterial({ color: h.color, transparent: true, opacity: 0.75 });
      mapGroup.add(new THREE.Line(arcGeo, arcMat));
    });

    scene.add(mapGroup);

    scene.add(new THREE.AmbientLight(0x0E1E38, 1.5));
    const topLight = new THREE.DirectionalLight(0x00F0FF, 2.5);
    topLight.position.set(10, 20, 10);
    scene.add(topLight);

    renderer.render(scene, camera);
  });

  console.log('=== ALL 4 3D ASSETS SUCCESSFULLY RENDERED & SAVED TO ASSETS/ ===');
}

main().catch(err => {
  console.error('Fatal 3D Render Error:', err);
  process.exit(1);
});
