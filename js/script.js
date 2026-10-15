/**
 * FIGOS MARCHETTO — fundo botânico animado
 * Crescimento em cascata, colheita, envelhecimento das folhas e reinício do ciclo.
 * Requer fundo.css.
 */
(() => {
  'use strict';

  const ROOT_ID = 'fundo-botanico-global';
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const LEAF_DURATION = 1.65;
  const FIG_GAP = 0.18;
  const FIG_DURATION = 2.35;
  const HARVEST_PICK_COUNT = 9;
  const CRATE_SCALE = 0.72;
  const CRATES = {
    left: { x: 18, y: 768, scale: CRATE_SCALE },
    right: { x: 1210, y: 768, scale: CRATE_SCALE }
  };

  if (window.__figosMarchettoBotanicalInstalled) return;
  window.__figosMarchettoBotanicalInstalled = true;

  const ROOTS_LEFT = [
    {
      id: 'raiz-01', start: 0.0, duration: 19.6,
      d: 'M -65 1035 C 55 930 82 825 132 728 C 176 642 174 548 222 455 C 270 360 321 315 354 228 C 384 150 385 85 423 18',
      children: [ { t: 0.28, dx: 112, dy: -112 }, { t: 0.63, dx: -72, dy: -124 } ]
    },
    {
      id: 'raiz-02', start: 3.8, duration: 17.3,
      d: 'M -70 660 C 25 630 76 589 127 520 C 178 451 208 397 270 361 C 330 326 370 282 425 210',
      children: [ { t: 0.25, dx: 95, dy: -94 }, { t: 0.66, dx: -70, dy: -104 } ]
    },
    {
      id: 'raiz-03', start: 7.1, duration: 16.4,
      d: 'M -65 395 C 30 427 86 404 140 357 C 194 309 226 252 286 219 C 337 191 367 143 389 66',
      children: [ { t: 0.31, dx: 112, dy: -88 }, { t: 0.69, dx: -58, dy: -93 } ]
    },
    {
      id: 'raiz-04', start: 10.5, duration: 18.8,
      d: 'M -70 875 C 63 845 146 862 213 816 C 280 770 313 724 374 689 C 417 664 443 623 468 566',
      children: [ { t: 0.34, dx: 102, dy: -76 }, { t: 0.71, dx: -48, dy: -101 } ]
    },
    {
      id: 'raiz-05', start: 13.3, duration: 17.6,
      d: 'M -70 170 C 18 137 91 163 146 211 C 201 258 247 267 306 237 C 357 211 392 168 448 145',
      children: [ { t: 0.33, dx: 97, dy: 72 }, { t: 0.72, dx: -60, dy: -75 } ]
    }
  ];

  const ROOTS_RIGHT = [
    {
      id: 'raiz-r01', start: 1.7, duration: 19.1,
      d: 'M 1506 1035 C 1409 943 1384 837 1335 742 C 1288 653 1296 558 1242 462 C 1206 399 1142 347 1126 269 C 1110 192 1105 116 1069 22',
      children: [ { t: 0.27, dx: -118, dy: -105 }, { t: 0.62, dx: 68, dy: -126 } ]
    },
    {
      id: 'raiz-r02', start: 5.2, duration: 17.5,
      d: 'M 1510 700 C 1424 670 1378 612 1330 544 C 1279 471 1248 407 1184 365 C 1125 327 1093 278 1048 212',
      children: [ { t: 0.26, dx: -94, dy: -89 }, { t: 0.65, dx: 64, dy: -110 } ]
    },
    {
      id: 'raiz-r03', start: 8.2, duration: 16.7,
      d: 'M 1507 410 C 1419 451 1357 420 1303 360 C 1253 303 1210 251 1153 221 C 1100 193 1091 140 1071 75',
      children: [ { t: 0.32, dx: -108, dy: -84 }, { t: 0.68, dx: 55, dy: -94 } ]
    },
    {
      id: 'raiz-r04', start: 11.8, duration: 18.2,
      d: 'M 1508 895 C 1390 854 1317 881 1241 823 C 1176 774 1135 717 1079 675 C 1032 646 1012 604 985 552',
      children: [ { t: 0.33, dx: -103, dy: -73 }, { t: 0.70, dx: 52, dy: -100 } ]
    },
    {
      id: 'raiz-r05', start: 14.9, duration: 17.2,
      d: 'M 1498 166 C 1410 126 1341 157 1284 207 C 1228 257 1172 280 1115 244 C 1065 214 1024 179 974 151',
      children: [ { t: 0.34, dx: -98, dy: 70 }, { t: 0.70, dx: 61, dy: -76 } ]
    }
  ];

  // Ramos que nascem na base e crescem para cima, preservando o centro da página.
  const ROOTS_BOTTOM = [
    {
      id: 'base-01', start: 2.8, duration: 16.8,
      d: 'M 105 1042 C 160 951 204 900 242 816 C 278 736 302 674 359 622 C 412 574 456 542 492 468',
      children: [ { t: 0.34, dx: 88, dy: -74 }, { t: 0.69, dx: -58, dy: -88 } ]
    },
    {
      id: 'base-02', start: 8.6, duration: 17.6,
      d: 'M 1335 1042 C 1283 950 1241 899 1200 818 C 1159 737 1136 675 1080 620 C 1033 574 989 538 956 468',
      children: [ { t: 0.32, dx: -86, dy: -76 }, { t: 0.68, dx: 60, dy: -90 } ]
    }
  ];

  function svgEl(tag, attrs = {}) {
    const el = document.createElementNS(SVG_NS, tag);
    for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, String(value));
    return el;
  }

  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  function fmt(value) { return Number(value).toFixed(2); }

  function bezierAxis(t, first, last) {
    const inverse = 1 - t;
    return 3 * inverse * inverse * t * first + 3 * inverse * t * t * last + t * t * t;
  }

  // Espelha a curva CSS de recuo para sincronizar galhos filhos e folhas com a ponta visível.
  function recedeTimeFraction(progress) {
    const target = clamp(progress, 0, 1);
    let low = 0;
    let high = 1;
    for (let i = 0; i < 18; i += 1) {
      const middle = (low + high) / 2;
      if (bezierAxis(middle, 0.02, 1) < target) low = middle;
      else high = middle;
    }
    return bezierAxis((low + high) / 2, 0.38, 0.62);
  }

  function rhythm(value) {
    let hash = 2166136261;
    for (let i = 0; i < value.length; i += 1) {
      hash ^= value.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0) / 4294967295;
  }

  function makeDefs() {
    return `
      <defs>
        <linearGradient id="fm-glove-gradient" x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stop-color="#FFFFFF"/>
          <stop offset="58%" stop-color="#F5F3EA"/>
          <stop offset="100%" stop-color="#D8D8CC"/>
        </linearGradient>
        <linearGradient id="fm-crate-wood-gradient" x1="0" y1="0" x2="0.1" y2="1">
          <stop offset="0%" stop-color="#E4C48F"/>
          <stop offset="100%" stop-color="#C69C64"/>
        </linearGradient>
        <linearGradient id="fm-leaf-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#91A96A"/>
          <stop offset="30%" stop-color="#66834A"/>
          <stop offset="68%" stop-color="#466538"/>
          <stop offset="100%" stop-color="#29452B"/>
        </linearGradient>
        <linearGradient id="fm-leaf-back-gradient" x1="0" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stop-color="#A0B278"/>
          <stop offset="100%" stop-color="#4A6738"/>
        </linearGradient>
        <linearGradient id="fm-fig-gradient" x1="0" y1="0" x2="1" y2="0.2">
          <stop offset="0%" stop-color="#45162A"/>
          <stop offset="28%" stop-color="#70253F"/>
          <stop offset="62%" stop-color="#8D3C55"/>
          <stop offset="100%" stop-color="#572038"/>
        </linearGradient>
        <linearGradient id="fm-fig-highlight" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#F4C5BE" stop-opacity="0.68"/>
          <stop offset="100%" stop-color="#F4C5BE" stop-opacity="0"/>
        </linearGradient>
        <linearGradient id="fm-bark-gradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#3F4135"/>
          <stop offset="42%" stop-color="#70654D"/>
          <stop offset="100%" stop-color="#4E5940"/>
        </linearGradient>
        <linearGradient id="fm-young-branch-gradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#566344"/>
          <stop offset="55%" stop-color="#87915B"/>
          <stop offset="100%" stop-color="#596A43"/>
        </linearGradient>
        <radialGradient id="fm-leaf-glow" cx="28%" cy="20%" r="85%">
          <stop offset="0%" stop-color="#D2DDA8" stop-opacity="0.38"/>
          <stop offset="100%" stop-color="#D2DDA8" stop-opacity="0"/>
        </radialGradient>
      </defs>`;
  }

  function createBackground() {
    const container = document.createElement('div');
    container.id = ROOT_ID;
    container.setAttribute('aria-hidden', 'true');
    container.innerHTML = `
      <svg class="svg-arvore-fundo" viewBox="0 0 1440 1000" preserveAspectRatio="none" xmlns="${SVG_NS}">
        ${makeDefs()}
        <g class="plant-side plant-left" id="fm-plant-left"></g>
        <g class="plant-side plant-right" id="fm-plant-right" style="--side-phase: 1.35s"></g>
        <g class="plant-side plant-base" id="fm-plant-base" style="--side-phase: 2.1s"></g>
        <g id="fm-harvest-layer"></g>
      </svg>`;
    document.body.appendChild(container);
    return {
      container,
      svg: container.querySelector('svg'),
      left: container.querySelector('#fm-plant-left'),
      right: container.querySelector('#fm-plant-right'),
      base: container.querySelector('#fm-plant-base'),
      harvest: container.querySelector('#fm-harvest-layer')
    };
  }

  function getPoint(branch, fraction) {
    const length = branch.length || branch.path.getTotalLength();
    const distance = clamp(fraction, 0, 1) * length;
    const p = branch.path.getPointAtLength(distance);
    const d = Math.min(5, Math.max(1.5, length * 0.012));
    const before = branch.path.getPointAtLength(Math.max(0, distance - d));
    const after = branch.path.getPointAtLength(Math.min(length, distance + d));
    let tx = after.x - before.x;
    let ty = after.y - before.y;
    const mag = Math.hypot(tx, ty) || 1;
    tx /= mag; ty /= mag;
    return { x: p.x, y: p.y, tx, ty, angle: Math.atan2(ty, tx) * 180 / Math.PI };
  }

  function branchD(start, end, tangent) {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const c1x = start.x + tangent.tx * 27 + dx * 0.20;
    const c1y = start.y + tangent.ty * 27 + dy * 0.14;
    const c2x = end.x - dx * 0.22 - tangent.tx * 14;
    const c2y = end.y - dy * 0.18 - tangent.ty * 14;
    return `M ${fmt(start.x)} ${fmt(start.y)} C ${fmt(c1x)} ${fmt(c1y)}, ${fmt(c2x)} ${fmt(c2y)}, ${fmt(end.x)} ${fmt(end.y)}`;
  }

  function addBranchPath(sideGroup, d, depth, startTime, duration, id, shrinkDelay) {
    const pathGroup = svgEl('g', { class: `branch-unit depth-${depth}`, 'data-branch-id': id });
    const depthClass = `depth-${depth}`;
    const shrinkDuration = 1.55;
    const timing = `--branch-delay:${fmt(startTime)}s;--branch-duration:${fmt(duration)}s;--shrink-delay:${fmt(shrinkDelay)}s;--shrink-duration:${fmt(shrinkDuration)}s`;
    const under = svgEl('path', {
      d, class: `branch-line branch-under ${depthClass}`,
      style: timing
    });
    const highlight = svgEl('path', {
      d, class: `branch-line branch-highlight ${depthClass}`,
      style: timing
    });
    pathGroup.style.cssText = timing;
    pathGroup.append(under, highlight);
    sideGroup.appendChild(pathGroup);
    const length = under.getTotalLength();
    // Dashes are set to the actual SVG path length, so each branch is revealed continuously (not as tiny dashes).
    // Uma folga extra evita que as pontas arredondadas deixem um traço residual.
    const pathLength = length + 48;
    const pathLengthStyle = `${fmt(pathLength)}px`;
    under.style.setProperty('--path-length', pathLengthStyle);
    highlight.style.setProperty('--path-length', pathLengthStyle);
    return {
      id, d, depth, start: startTime, duration,
      path: under,
      length,
      pathLength,
      shrinkDelay,
      shrinkDuration,
      nodes: []
    };
  }

  function buildBranchSystem(sideGroup, rootSet) {
    const branches = [];
    const leaves = [];

    function makeBranch(d, depth, startTime, duration, id, childSpecs = [], shrinkDelay = 0) {
      duration *= 0.92 + rhythm(`${id}:speed`) * 0.16;
      startTime += rhythm(`${id}:delay`) * 0.48;
      const branch = addBranchPath(sideGroup, d, depth, startTime, duration, id, shrinkDelay);
      branches.push(branch);

      const nodeFractions = depth === 0 ? [0.19, 0.39, 0.59, 0.79] :
                            depth === 1 ? [0.32, 0.70] : [0.50];
      nodeFractions.forEach((fraction, index) => {
        const point = getPoint(branch, fraction);
        const leafStart = startTime + duration * fraction + 0.12 + rhythm(`${id}:leaf:${index}`) * 0.34;
        const alternatingSide = ((index + depth) % 2 === 0) ? -1 : 1;
        const baseSize = depth === 0 ? 1.12 : depth === 1 ? 0.91 : 0.74;
        const size = baseSize * (0.88 + rhythm(`${id}:size:${index}`) * 0.22);
        const variation = ((branches.length + index) % 3 - 1) * 7;
        const targetLeafAngle = point.angle + alternatingSide * (57 + variation);
        // A folha local aponta para cima e à direita; compensamos esse eixo para a posicionar na lateral do ramo.
        const leafRotation = targetLeafAngle + 70;
        leaves.push({
          x: point.x, y: point.y, side: alternatingSide,
          angle: leafRotation, leafStart, size,
          fruitStart: leafStart + LEAF_DURATION + FIG_GAP + rhythm(`${id}:fruit:${index}`) * 0.34,
          fruitDuration: FIG_DURATION * (0.92 + rhythm(`${id}:fruit-speed:${index}`) * 0.16),
          id: `${id}-n${index + 1}`,
          depth,
          recedeDelay: shrinkDelay + branch.shrinkDuration * recedeTimeFraction((1 - fraction) * (branch.length / branch.pathLength)),
          fruitRotation: alternatingSide * (5 + ((index * 7 + depth * 3) % 9) + rhythm(`${id}:fruit-angle:${index}`) * 4)
        });
        branch.nodes.push({ fraction, point, leafStart });
      });

      childSpecs.forEach((spec, childIndex) => {
        const p = getPoint(branch, spec.t);
        const end = { x: p.x + spec.dx, y: p.y + spec.dy };
        const childPath = branchD(p, end, p);
        const childStart = startTime + duration * spec.t + 0.32 + rhythm(`${id}:child:${childIndex}`) * 0.72;
        const estimatedLength = Math.hypot(spec.dx, spec.dy) * 1.12;
        const childDuration = depth === 0
          ? clamp(estimatedLength / 27, 5.8, 8.4)
          : clamp(estimatedLength / 29, 4.8, 6.6);
        const grandchildSpecs = depth === 0 ? [
          {
            t: childIndex % 2 === 0 ? 0.56 : 0.46,
            dx: (childIndex % 2 === 0 ? -1 : 1) * (42 + ((branches.length * 7) % 25)),
            dy: -58 - ((branches.length * 11) % 22)
          }
        ] : [];
        const childShrinkDelay = shrinkDelay + branch.shrinkDuration * recedeTimeFraction((1 - spec.t) * (branch.length / branch.pathLength));
        makeBranch(childPath, depth + 1, childStart, childDuration, `${id}-b${childIndex + 1}`, grandchildSpecs, childShrinkDelay);
      });
    }

    rootSet.forEach(root => {
      const initialRecedeDelay = rhythm(`${root.id}:recede-start`) * 0.22;
      makeBranch(root.d, 0, root.start, root.duration, root.id, root.children, initialRecedeDelay);
    });

    // Deixa todos os ramos atrás das folhas/frutos, mas mantém cada traço individual animado.
    leaves.forEach(leaf => addLeafAndFruit(sideGroup, leaf));
    const phase = Number.parseFloat(sideGroup.style.getPropertyValue('--side-phase')) || 0;
    const endTime = Math.max(
      0,
      ...branches.map(branch => branch.start + branch.duration + phase),
      ...leaves.map(leaf => leaf.fruitStart + leaf.fruitDuration + phase)
    );
    return { branches, leaves, endTime, phase };
  }

  function leafMarkup() {
    return `
      <path class="leaf-blade" d="M 0 0
        C 8 -6 13 -14 15 -23
        C 6 -21 -2 -26 -4 -33
        C -5 -41 3 -46 12 -40
        C 10 -50 16 -63 29 -94
        C 43 -75 45 -59 40 -46
        C 50 -53 61 -49 62 -41
        C 63 -33 54 -27 43 -30
        C 51 -21 51 -11 44 -5
        C 36 1 28 -6 22 -14
        C 16 -6 8 -1 0 0 Z"/>
      <path class="leaf-light-wash" d="M 0 0 C 8 -6 13 -14 15 -23 C 6 -21 -2 -26 -4 -33 C -5 -41 3 -46 12 -40 C 10 -50 16 -63 29 -94 C 43 -75 45 -59 40 -46 C 50 -53 61 -49 62 -41 C 63 -33 54 -27 43 -30 C 51 -21 51 -11 44 -5 C 36 1 28 -6 22 -14 C 16 -6 8 -1 0 0 Z"/>
      <path class="leaf-vein-main" d="M 0 0 C 13 -23 24 -58 29 -93"/>
      <path class="leaf-vein" d="M 13 -20 Q 4 -23 -2 -31 M 16 -31 Q 27 -36 39 -31 M 18 -42 Q 8 -47 5 -51 M 21 -49 Q 35 -57 47 -52 M 23 -60 Q 17 -67 17 -73 M 26 -64 Q 38 -72 42 -66"/>
      <path class="leaf-vein-fine" d="M 7 -24 Q 10 -28 13 -31 M 9 -39 Q 13 -43 16 -44 M 23 -34 Q 31 -40 36 -39 M 24 -52 Q 29 -57 34 -59 M 30 -70 Q 33 -77 35 -80 M 30 -23 Q 38 -23 43 -18 M 46 -34 Q 52 -38 56 -37"/>
      <path class="leaf-edge-detail" d="M -3 -33 Q -3 -29 1 -27 M 12 -40 Q 14 -44 17 -44 M 40 -46 Q 46 -51 51 -51 M 43 -30 Q 48 -33 52 -31"/>
    `;
  }

  function fruitMarkup() {
    return `
      <path class="fruit-pedicel" d="M 0 0 C 1 3 4 5 4 9"/>
      <path class="fruit-body" d="M 4 7
        C 0 12 -8 22 -8 31
        C -8 41 -2 47 6 46
        C 15 45 19 37 17 28
        C 15 19 9 11 4 7 Z"/>
      <path class="fruit-highlight" d="M 3 13 C -1 20 -4 27 -2 34"/>
      <path class="fruit-ridge" d="M 6 14 Q 11 27 10 38 M 3 16 Q 1 27 4 39"/>
      <path class="fruit-calyx" d="M 1 7 Q 4 10 7 8"/>
      <ellipse class="fruit-ostiole" cx="7" cy="43" rx="2.1" ry="1.35"/>
    `;
  }

  function addLeafAndFruit(sideGroup, node) {
    const leafWrapper = svgEl('g', {
      class: `leaf-unit leaf-depth-${node.depth}`,
      transform: `translate(${fmt(node.x)} ${fmt(node.y)}) rotate(${fmt(node.angle)}) scale(${fmt(node.size)})`,
      'data-node': node.id,
      style: `--leaf-delay:${fmt(node.leafStart)}s;--leaf-duration:${LEAF_DURATION}s;--organ-scale:${node.size}`
    });
    const leafGrowth = svgEl('g', { class: 'leaf-growth' });
    leafGrowth.innerHTML = leafMarkup();
    leafWrapper.appendChild(leafGrowth);

    const figSize = node.size * (node.depth === 0 ? 1.0 : node.depth === 1 ? 0.86 : 0.72);
    node.fruitX = node.x + node.side * 4;
    node.fruitY = node.y + 2;
    node.fruitSize = figSize;
    const figWrapper = svgEl('g', {
      class: `fruit-unit fruit-depth-${node.depth}`,
      transform: `translate(${fmt(node.fruitX)} ${fmt(node.fruitY)}) rotate(${fmt(node.fruitRotation)}) scale(${fmt(figSize)})`,
      'data-fruit-for': node.id,
      style: `--fig-delay:${fmt(node.fruitStart)}s;--fig-duration:${fmt(node.fruitDuration)}s`
    });
    const figGrowth = svgEl('g', { class: 'fig-growth' });
    figGrowth.innerHTML = fruitMarkup();
    figWrapper.appendChild(figGrowth);
    sideGroup.append(leafWrapper, figWrapper);
    node.leafWrapper = leafWrapper;
    node.leafGrowth = leafGrowth;
    node.fruitElement = figWrapper;
  }

  function wait(ms) {
    return new Promise(resolve => window.setTimeout(resolve, ms));
  }

  function tween(duration, update) {
    return new Promise(resolve => {
      const startedAt = performance.now();
      function frame(now) {
        const progress = clamp((now - startedAt) / duration, 0, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        update(eased, progress);
        if (progress < 1) requestAnimationFrame(frame);
        else resolve();
      }
      requestAnimationFrame(frame);
    });
  }

  function tweenTranslate(element, fromX, fromY, toX, toY, duration, scale = 1) {
    element.setAttribute('transform', `translate(${fmt(fromX)} ${fmt(fromY)}) scale(${fmt(scale)})`);
    return tween(duration, progress => {
      const x = fromX + (toX - fromX) * progress;
      const y = fromY + (toY - fromY) * progress;
      element.setAttribute('transform', `translate(${fmt(x)} ${fmt(y)}) scale(${fmt(scale)})`);
    });
  }

  function tweenOpacity(element, from, to, duration) {
    element.setAttribute('opacity', String(from));
    return tween(duration, progress => {
      element.setAttribute('opacity', fmt(from + (to - from) * progress));
    });
  }

  function makeHarvestProps(layer) {
    layer.replaceChildren();
    const slotPoints = [
      [43, 17], [81, 10], [119, 17], [157, 10], [195, 17],
      [62, -2], [100, -7], [138, -3], [176, -7]
    ];
    const crates = {};
    const supports = {};
    const storedFruit = {};
    Object.entries(CRATES).forEach(([side, position]) => {
      const crate = svgEl('g', {
        class: `produce-crate crate-${side}`,
        transform: `translate(${position.x} ${position.y + 130}) scale(${position.scale})`,
        opacity: 0
      });
      crate.innerHTML = `
        <g class="crate-sway">
        <ellipse class="crate-shadow" cx="145" cy="164" rx="160" ry="18"/>
        <path class="crate-back" d="M 19 47 L 57 4 L 239 4 L 276 47 Z"/>
        <path class="crate-side" d="M 19 45 L 68 57 L 55 163 L 7 151 Z"/>
        <path class="crate-side" d="M 239 45 L 276 47 L 287 151 L 251 163 Z"/>
        <path class="crate-interior" d="M 34 45 L 251 45 L 224 73 L 60 73 Z"/>
        <g class="crate-fruit-pile"></g>
        <path class="crate-front" d="M 19 46 L 258 46 L 276 151 L 7 151 Z"/>
        <path class="crate-rim" d="M 19 46 L 258 46 L 251 59 L 23 59 Z"/>
        <path class="crate-label" d="M 47 77 Q 142 70 237 77 L 233 132 Q 142 138 51 132 Z"/>
        <path class="crate-grain" d="M 27 64 Q 80 60 121 64 M 29 143 Q 90 139 133 143 M 159 62 Q 205 59 248 63"/>
        <text class="crate-brand" x="142" y="105" text-anchor="middle">MARCHETTO</text>
        </g>`;
      const pile = crate.querySelector('.crate-fruit-pile');
      storedFruit[side] = [];
      slotPoints.forEach(([x, y], index) => {
        const fruit = svgEl('g', {
          class: 'stored-fig',
          transform: `translate(${x} ${y}) scale(1) rotate(${index % 2 ? 8 : -7})`,
          opacity: 0
        });
        fruit.innerHTML = fruitMarkup();
        pile.appendChild(fruit);
        storedFruit[side].push(fruit);
      });
      layer.appendChild(crate);
      crates[side] = crate;

      const support = svgEl('g', {
        class: `crate-support support-${side}`,
        transform: `translate(${position.x} ${position.y}) scale(${position.scale})`,
        opacity: 0
      });
      support.innerHTML = `
        <g class="support-sway">
        <path class="support-sleeve" d="M 119 261 C 121 229 122 201 126 168 L 159 168 C 162 202 164 231 166 261 Z"/>
        <path class="support-cuff" d="M 125 166 Q 142 159 160 166 L 162 178 Q 143 172 124 179 Z"/>
        <path class="support-glove" d="M 111 155 C 110 149 116 145 122 148 L 132 154 L 130 146 C 129 139 138 137 142 144 L 147 153 L 148 145 C 149 138 158 139 160 147 L 161 156 L 168 150 C 174 146 181 152 177 159 L 166 174 C 160 182 145 184 133 179 L 117 171 C 112 168 109 161 111 155 Z"/>
        <path class="support-glove-seam" d="M 120 153 L 135 162 M 141 149 L 147 161 M 158 151 L 158 162 M 120 169 Q 141 180 160 171"/>
        </g>`;
      layer.appendChild(support);
      supports[side] = support;
    });

    const arms = {};
    Object.keys(CRATES).forEach(side => {
      const arm = svgEl('g', {
        class: `harvest-arm arm-${side}`,
        transform: side === 'left' ? 'translate(-220 760)' : 'translate(1660 760)',
        opacity: 0
      });
      const art = svgEl('g', { transform: side === 'left' ? 'scale(-1 1)' : 'scale(1 1)' });
      art.innerHTML = `
        <path class="harvest-sleeve" d="M 18 -14 C 90 -31 160 -41 250 -30 L 250 25 C 154 24 88 31 18 15 Z"/>
        <path class="harvest-seam" d="M 66 -22 C 123 -31 181 -34 237 -27 M 68 22 C 126 17 183 18 238 23"/>
        <path class="harvest-cuff" d="M 18 -15 Q 37 0 18 16 L 34 15 Q 51 1 33 -18 Z"/>
        <path class="harvest-glove" d="M 27 -9
          C 21 -16 15 -19 11 -16 C 8 -13 12 -7 16 -2
          L 8 -9 C 3 -13 -2 -9 2 -4 L 12 5
          L 2 1 C -4 -1 -8 4 -3 9 L 11 18
          C 18 23 28 21 35 15 L 43 8 L 35 -8 Z"/>
        <path class="glove-seam" d="M 9 -8 L 20 2 M 4 1 L 17 9 M 11 18 Q 22 21 31 13"/>
        <path class="glove-highlight" d="M 13 -14 Q 17 -10 21 -6 M 5 -8 Q 10 -4 16 2 M 2 3 Q 8 5 13 10 M 16 18 Q 24 20 31 13"/>`;
      arm.appendChild(art);
      layer.appendChild(arm);
      arms[side] = arm;
    });
    return { crates, supports, arms, storedFruit };
  }

  function setSleeveReach(arm, handX, side) {
    const reach = clamp(side === 'left' ? handX : 1440 - handX, 150, 1320);
    const sleeve = arm.querySelector('.harvest-sleeve');
    const seam = arm.querySelector('.harvest-seam');
    sleeve.setAttribute('d', `M 18 -13 C ${fmt(reach * 0.30)} -24 ${fmt(reach * 0.72)} -31 ${fmt(reach)} -25 L ${fmt(reach)} 19 C ${fmt(reach * 0.72)} 18 ${fmt(reach * 0.31)} 25 18 14 Z`);
    seam.setAttribute('d', `M 64 -19 C ${fmt(reach * 0.36)} -25 ${fmt(reach * 0.75)} -28 ${fmt(reach - 11)} -23 M 67 21 C ${fmt(reach * 0.36)} 16 ${fmt(reach * 0.75)} 17 ${fmt(reach - 11)} 21`);
  }

  function animateFruitToCrate(node, slot, cratePosition, duration) {
    const element = node.fruitElement;
    const fromX = node.fruitX;
    const fromY = node.fruitY;
    const slotTransform = slot.getAttribute('transform');
    const slotXY = slotTransform.match(/translate\(([-\d.]+)\s+([-\d.]+)\)/);
    const slotX = Number(slotXY?.[1] || 60);
    const slotY = Number(slotXY?.[2] || 20);
    const toX = cratePosition.x + slotX * cratePosition.scale;
    const toY = cratePosition.y + slotY * cratePosition.scale;
    const rotation = node.fruitRotation;
    const fromScale = node.fruitSize;
    const toScale = node.fruitSize;
    return tween(duration, progress => {
      const x = fromX + (toX - fromX) * progress;
      const y = fromY + (toY - fromY) * progress;
      const scale = fromScale + (toScale - fromScale) * progress;
      element.setAttribute('transform', `translate(${fmt(x)} ${fmt(y)}) rotate(${fmt(rotation)}) scale(${fmt(scale)})`);
      element.setAttribute('opacity', fmt(1 - progress * 0.18));
    }).then(() => {
      element.setAttribute('opacity', '0');
    });
  }

  async function runHarvest(layer, systems) {
    const background = document.getElementById(ROOT_ID);
    background.classList.add('fm-harvesting');
    const props = makeHarvestProps(layer);
    const { crates, supports, arms, storedFruit } = props;
    const fruits = systems.flatMap(system => system.leaves).filter(node => node.fruitElement);
    await Promise.all(Object.entries(CRATES).flatMap(([side, position]) => [
      tweenTranslate(crates[side], position.x, position.y + 130, position.x, position.y, 850, position.scale),
      tweenOpacity(crates[side], 0, 1, 700),
      tweenTranslate(supports[side], position.x, position.y + 130, position.x, position.y, 850, position.scale),
      tweenOpacity(supports[side], 0, 1, 760)
    ]));

    function selectEvenly(nodes, count) {
      return Array.from({ length: count }, (_, index) => {
        const at = count <= 1 ? 0 : Math.round(index * (nodes.length - 1) / (count - 1));
        return nodes[at];
      });
    }

    async function carryCrateAway(side) {
      const position = CRATES[side];
      const exitX = side === 'left' ? -340 : 1510;
      const liftedY = position.y - 14;
      await Promise.all([
        tweenTranslate(crates[side], position.x, position.y, position.x, liftedY, 300, position.scale),
        tweenTranslate(supports[side], position.x, position.y, position.x, liftedY, 300, position.scale)
      ]);
      await Promise.all([
        tweenTranslate(crates[side], position.x, liftedY, exitX, position.y + 42, 1180, position.scale),
        tweenTranslate(supports[side], position.x, liftedY, exitX, position.y + 42, 1180, position.scale),
        tweenOpacity(crates[side], 1, 0, 1180),
        tweenOpacity(supports[side], 1, 0, 1180)
      ]);
    }

    async function harvestSide(side, candidates) {
      const arm = arms[side];
      const cratePosition = CRATES[side];
      const leftSide = side === 'left';
      const motion = leftSide
        ? { startDelay: 350, pick: 680, pinch: 240, dropMin: 620, dropMax: 940, dropFactor: 1.48, sweep: 500, pause: 130, exit: 760 }
        : { startDelay: 2050, pick: 860, pinch: 310, dropMin: 760, dropMax: 1120, dropFactor: 1.72, sweep: 690, pause: 260, exit: 1040 };
      const sidePicks = selectEvenly(candidates, Math.min(HARVEST_PICK_COUNT, candidates.length));
      if (!leftSide) sidePicks.reverse();
      const picked = new Set(sidePicks);
      await wait(motion.startDelay);
      arm.setAttribute('opacity', '1');
      let actorX = side === 'left' ? -220 : 1660;
      let actorY = 760;

      for (let index = 0; index < sidePicks.length; index += 1) {
        const node = sidePicks[index];
        const handX = node.fruitX - 2;
        const handY = node.fruitY + 12;
        const armTargetX = handX + (side === 'left' ? 27 : -27);
        const armTargetY = handY - 2;
        setSleeveReach(arm, handX, side);
        await tweenTranslate(arm, actorX, actorY, armTargetX, armTargetY, motion.pick);
        actorX = armTargetX;
        actorY = armTargetY;
        arm.classList.add('is-pinching');
        await wait(motion.pinch);
        arm.classList.remove('is-pinching');

        const slot = storedFruit[side][index];
        const slotTransform = slot.getAttribute('transform');
        const slotXY = slotTransform.match(/translate\(([-\d.]+)\s+([-\d.]+)\)/);
        const localX = Number(slotXY?.[1] || 60);
        const localY = Number(slotXY?.[2] || 20);
        const localScale = node.fruitSize / cratePosition.scale;
        slot.setAttribute('transform', `translate(${localX} ${localY}) rotate(${fmt(node.fruitRotation)}) scale(${fmt(localScale)})`);
        const dropX = cratePosition.x + localX * cratePosition.scale;
        const dropY = cratePosition.y + localY * cratePosition.scale;
        const armDropX = dropX + (side === 'left' ? 27 : -27);
        const armDropY = dropY - 2;
        const travel = Math.max(motion.dropMin, Math.min(motion.dropMax, Math.hypot(dropX - handX, dropY - handY) * motion.dropFactor));
        await Promise.all([
          tweenTranslate(arm, actorX, actorY, armDropX, armDropY, travel),
          animateFruitToCrate(node, slot, cratePosition, travel)
        ]);
        actorX = armDropX;
        actorY = armDropY;
        tweenOpacity(slot, 0, 1, 260);
        await wait(motion.pause);
      }

      const remaining = candidates.filter(node => !picked.has(node));
      const sweepCount = Math.min(4, remaining.length);
      for (let index = 0; index < sweepCount; index += 1) {
        const at = sweepCount <= 1 ? 0 : Math.round(index * (remaining.length - 1) / (sweepCount - 1));
        const center = remaining[at];
        const handX = center.fruitX - 2;
        const handY = center.fruitY + 10;
        const armTargetX = handX + (side === 'left' ? 27 : -27);
        const armTargetY = handY - 2;
        setSleeveReach(arm, handX, side);
        await tweenTranslate(arm, actorX, actorY, armTargetX, armTargetY, motion.sweep);
        actorX = armTargetX;
        actorY = armTargetY;
        remaining.forEach(node => {
          if (Math.hypot(node.fruitX - handX, node.fruitY - handY) < 170) {
            node.fruitElement.style.transition = 'opacity 550ms ease';
            node.fruitElement.style.opacity = '0';
          }
        });
      }
      const exitX = side === 'left' ? -260 : 1700;
      await tweenTranslate(arm, actorX, actorY, exitX, 980, motion.exit);
      arm.setAttribute('opacity', '0');
      await carryCrateAway(side);
    }

    const leftCandidates = fruits.filter(node => node.fruitX < 340);
    const rightCandidates = fruits.filter(node => node.fruitX > 1100);
    const picked = new Set([
      ...selectEvenly(leftCandidates, Math.min(HARVEST_PICK_COUNT, leftCandidates.length)),
      ...selectEvenly(rightCandidates, Math.min(HARVEST_PICK_COUNT, rightCandidates.length))
    ]);
    await Promise.all([
      harvestSide('left', leftCandidates),
      harvestSide('right', rightCandidates)
    ]);
    fruits.filter(node => !picked.has(node)).forEach(node => {
      node.fruitElement.style.transition = 'opacity 320ms ease';
      node.fruitElement.style.opacity = '0';
    });

    let maxResetTimeline = 0;
    systems.flatMap(system => system.branches).forEach(branch => {
      maxResetTimeline = Math.max(maxResetTimeline, branch.shrinkDelay + branch.shrinkDuration);
    });
    systems.flatMap(system => system.leaves).forEach(node => {
      // A folha cai quando a ponta recolhida do seu próprio galho chega até ela.
      const delay = node.recedeDelay + 0.05;
      const duration = 1.35 + rhythm(`${node.id}:fall-speed`) * 0.3;
      node.leafWrapper.classList.add('is-aging');
      node.leafWrapper.style.setProperty('--fall-delay', `${fmt(delay)}s`);
      node.leafWrapper.style.setProperty('--fall-duration', `${fmt(duration)}s`);
      node.leafWrapper.style.setProperty('--fall-x', `${fmt((rhythm(`${node.id}:fall-x`) - 0.5) * 58)}px`);
      node.leafWrapper.style.setProperty('--fall-distance', `${fmt(58 + rhythm(`${node.id}:fall-y`) * 62)}px`);
      node.leafWrapper.style.setProperty('--fall-tilt', `${fmt((rhythm(`${node.id}:fall-tilt`) - 0.5) * 120)}deg`);
      maxResetTimeline = Math.max(maxResetTimeline, delay + duration);
    });

    background.classList.remove('fm-harvesting');
    background.classList.add('fm-resetting');
    // O próximo ciclo limpa os caminhos já recolhidos e só então os redesenha.
    await wait(maxResetTimeline * 1000 + 220);
  }

  function startCycle(groups) {
    const { left, right, base, harvest } = groups;
    groups.container.classList.remove('fm-harvesting', 'fm-resetting');
    left.replaceChildren();
    right.replaceChildren();
    base.replaceChildren();
    harvest.replaceChildren();

    // Em telas estreitas, menos ramificações reduzem o custo de SVG sem remover o ciclo.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const compactViewport = window.matchMedia('(max-width: 767px)').matches;
    const sideRoots = compactViewport ? [0, 1, 4] : null;
    const leftRoots = sideRoots ? sideRoots.map(index => ROOTS_LEFT[index]).filter(Boolean) : ROOTS_LEFT;
    const rightRoots = sideRoots ? sideRoots.map(index => ROOTS_RIGHT[index]).filter(Boolean) : ROOTS_RIGHT;
    const bottomRoots = compactViewport ? ROOTS_BOTTOM.slice(0, 1) : ROOTS_BOTTOM;
    const systems = [
      buildBranchSystem(left, leftRoots),
      buildBranchSystem(right, rightRoots),
      buildBranchSystem(base, bottomRoots)
    ];
    const endTime = Math.max(...systems.map(system => system.endTime));
    window.setTimeout(() => {
      runHarvest(harvest, systems).then(() => startCycle(groups));
    }, (endTime + 2.2) * 1000);
  }

  function inject() {
    if (!document.body || document.getElementById(ROOT_ID)) return;
    const groups = createBackground();
    const begin = () => {
      if (!document.body.classList.contains('pagina-conteudo')) return false;
      startCycle(groups);
      return true;
    };
    if (!begin()) {
      const observer = new MutationObserver(() => {
        if (begin()) observer.disconnect();
      });
      observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    }
  }

  function initOndeEncontrar() {
    const chipContainer = document.getElementById('chips-cidades');
    const cardContainer = document.getElementById('lista-estabelecimentos');
    if (!chipContainer || !cardContainer) return;

    // Locais transcritos da lista de pontos de venda que acompanha o projeto.
    const locations = [
      {
        city: 'Passo Fundo', state: 'RS', name: 'Fruteira Petrópolis',
        address: 'Av. Brasil Leste, 1213 - Petrópolis, Passo Fundo - RS, 99050-073',
        phone: '(54) 3311-5856', tel: '+555433115856',
        map: 'https://maps.app.goo.gl/CnaWSjn5YWdQ4yCs5'
      },
      {
        city: 'Concórdia', state: 'SC', name: 'Casa da Melancia',
        address: 'R. Dr. Maruri, 1689 - Centro, Concórdia - SC, 89700-000',
        phone: '(49) 3442-7598', tel: '+554934427598',
        map: 'https://maps.app.goo.gl/pmKzB4Bxb4tKsY4Z8'
      },
      {
        city: 'Getúlio Vargas', state: 'RS', name: 'Sulbrasil Supermercados',
        address: 'R. Maj. Cândido Cony, 183 - Nossa Sra. Consoladora, Getúlio Vargas - RS, 99900-000',
        phone: '(54) 3341-0010', tel: '+555433410010',
        map: 'https://maps.app.goo.gl/RNHDyL1ksx6jr3gFA'
      },
      {
        city: 'Getúlio Vargas', state: 'RS', name: 'Karpinski & Cia Ltda',
        address: 'Nossa Sra. Consoladora, Getúlio Vargas - RS, 99900-000',
        phone: '(54) 3341-0000', tel: '+555433410000',
        whatsapp: '(35) 99823-1124', whatsappTel: '5535998231124',
        map: 'https://maps.app.goo.gl/pqUwuEcu9BRbLzvp7'
      },
      {
        city: 'Erechim', state: 'RS', name: 'Arlindo',
        address: 'Ponto fixo · caminhão azul · veja a localização no mapa.',
        phone: '(54) 9983-0766', tel: '+555499830766',
        map: 'https://maps.app.goo.gl/4EqSYDapZ8eLLD3L6'
      },
      {
        city: 'Erechim', state: 'RS', name: 'Flora Morangos e Hortaliça',
        address: 'R. Zero Hora, 146 - Linho, Erechim - RS, 99704-362',
        phone: '(54) 99975-3900', tel: '+5554999753900',
        map: 'https://maps.app.goo.gl/eRpGUUBz3H9M3DBV9'
      },
      {
        city: 'Erechim', state: 'RS', name: 'Frutas Dolina',
        address: 'R. Espírito Santo - Erechim - RS, 99704-270',
        phone: '(54) 99148-7900', tel: '+5554991487900',
        map: 'https://maps.app.goo.gl/3TtXZ545iYftby9F9'
      },
      {
        city: 'Pato Branco', state: 'PR', name: 'No Ponto Supermercados - São Cristóvão',
        address: 'Av. Tupi, 6495 - São Cristóvão, Pato Branco - PR, 85508-005',
        phone: '(46) 3122-9300', tel: '+554631229300',
        map: 'https://maps.app.goo.gl/QE9stT3TvM8wMG22A'
      },
      {
        city: 'Pato Branco', state: 'PR', name: 'No Ponto Supermercado - Centro',
        address: 'R. Guarani, 285 - Centro, Pato Branco - PR, 85501-050',
        phone: '(46) 99970-2003', tel: '+5546999702003',
        map: 'https://maps.app.goo.gl/SqFcdnJ4ssxZWKUB8'
      },
      {
        city: 'Pato Branco', state: 'PR', name: 'No Ponto Supermercados - Zona Norte',
        address: 'Av. Tupi, 759 - Bortot, Pato Branco - PR, 85504-250',
        phone: '(46) 2604-1423', tel: '+554626041423',
        map: 'https://maps.app.goo.gl/vK7xw99k6DTTFXcVA'
      },
      {
        city: 'Jacutinga', state: 'RS', name: 'Supermercado De Gregori',
        address: 'Av. Ângelo Gaspareto, 350 - Jacutinga - RS, 99730-000',
        phone: '(54) 3368-1383', tel: '+555433681383',
        map: 'https://maps.app.goo.gl/RVuJGhVZmEfuE7bg9'
      },
      {
        city: 'Campinas do Sul', state: 'RS', name: 'Supermercado Orlando',
        address: 'Av. Pedro Álvares Cabral, 830 - Centro, Campinas do Sul - RS, 99660-000',
        phone: '(54) 3366-1514', tel: '+555433661514',
        map: 'https://maps.app.goo.gl/YmKqFpkCi3tHPbjz7'
      }
    ];

    const countElement = document.getElementById('contador-locais');
    const emptyMessage = document.getElementById('mensagem-vazio');
    const cities = [...new Set(locations.map(location => location.city))]
      .sort((a, b) => a.localeCompare(b, 'pt-BR'));
    const cityCounts = new Map(cities.map(city => [
      city,
      locations.filter(location => location.city === city).length
    ]));
    let selectedCity = 'Todas';

    const makeNode = (tag, className, text) => {
      const node = document.createElement(tag);
      if (className) node.className = className;
      if (text !== undefined) node.textContent = text;
      return node;
    };

    function makeContactLink(label, href, icon, extraClass = '', accessibleLabel = label) {
      const link = makeNode('a', `card-link-contato ${extraClass}`.trim(), '');
      link.href = href;
      link.setAttribute('aria-label', accessibleLabel);
      const iconNode = makeNode('i', icon);
      iconNode.setAttribute('aria-hidden', 'true');
      link.append(iconNode, makeNode('span', 'card-contato-texto', label));
      return link;
    }

    function makeCard(location) {
      const card = makeNode('article', 'card-estabelecimento');
      const info = makeNode('div', 'card-info');
      info.appendChild(makeNode('span', 'card-origem', `${location.city} · ${location.state}`));
      info.appendChild(makeNode('h2', 'card-nome', location.name));

      const address = makeNode('p', 'card-endereco');
      const pin = makeNode('i', 'fas fa-map-marker-alt');
      pin.setAttribute('aria-hidden', 'true');
      address.append(pin, makeNode('span', '', location.address));
      info.appendChild(address);

      const contacts = makeNode('div', 'card-contatos');
      if (location.phone) {
        contacts.appendChild(makeContactLink(`Ligar · ${location.phone}`, `tel:${location.tel}`, 'fas fa-phone', '', `Ligar para ${location.name}: ${location.phone}`));
      }
      if (location.whatsapp) {
        contacts.appendChild(makeContactLink(`WhatsApp · ${location.whatsapp}`, `https://wa.me/${location.whatsappTel}`, 'fab fa-whatsapp', 'link-whatsapp', `Abrir WhatsApp de ${location.name}: ${location.whatsapp}`));
      }
      if (contacts.childElementCount) info.appendChild(contacts);

      const actions = makeNode('div', 'card-acao');
      const mapLink = makeNode('a', 'btn-como-chegar', '');
      mapLink.href = location.map;
      mapLink.target = '_blank';
      mapLink.rel = 'noopener noreferrer';
      mapLink.append(document.createTextNode('Como chegar '));
      const arrow = makeNode('i', 'fas fa-arrow-up-right-from-square');
      arrow.setAttribute('aria-hidden', 'true');
      mapLink.appendChild(arrow);
      actions.appendChild(mapLink);
      card.append(info, actions);
      return card;
    }

    const filters = [
      { name: 'Todas', count: locations.length },
      ...cities.map(city => ({ name: city, count: cityCounts.get(city) }))
    ];
    filters.forEach(filter => {
      const button = makeNode('button', 'chip-btn', '');
      button.type = 'button';
      button.setAttribute('aria-pressed', filter.name === selectedCity ? 'true' : 'false');
      button.dataset.city = filter.name;
      button.append(document.createTextNode(filter.name === 'Todas' ? 'Todas as cidades' : filter.name));
      const badge = makeNode('span', 'badge-contagem', String(filter.count));
      badge.setAttribute('aria-hidden', 'true');
      button.appendChild(badge);
      button.addEventListener('click', () => {
        selectedCity = filter.name;
        renderLocations();
      });
      chipContainer.appendChild(button);
    });

    function renderLocations() {
      const visible = (selectedCity === 'Todas'
        ? locations
        : locations.filter(location => location.city === selectedCity))
        .slice()
        .sort((a, b) => a.city.localeCompare(b.city, 'pt-BR') || a.name.localeCompare(b.name, 'pt-BR'));
      cardContainer.replaceChildren(...visible.map(makeCard));
      if (emptyMessage) emptyMessage.style.display = visible.length ? 'none' : 'block';
      if (countElement) {
        const noun = visible.length === 1 ? 'local' : 'locais';
        countElement.textContent = selectedCity === 'Todas'
          ? `${visible.length} ${noun} em ${cities.length} cidades`
          : `${visible.length} ${noun} em ${selectedCity}`;
      }
      chipContainer.querySelectorAll('.chip-btn').forEach(button => {
        const active = button.dataset.city === selectedCity;
        button.classList.toggle('ativo', active);
        button.setAttribute('aria-pressed', String(active));
      });
    }

    renderLocations();

    const modal = document.getElementById('modal-revendedor');
    const openModal = document.getElementById('btn-abrir-modal-revendedor');
    const closeModal = document.getElementById('btn-fechar-modal');
    if (modal && openModal && closeModal) {
      const close = () => {
        modal.classList.remove('aberto');
        modal.setAttribute('aria-hidden', 'true');
        openModal.focus();
      };
      openModal.addEventListener('click', () => {
        modal.classList.add('aberto');
        modal.setAttribute('aria-hidden', 'false');
        closeModal.focus();
      });
      closeModal.addEventListener('click', close);
      modal.addEventListener('click', event => {
        if (event.target === modal) close();
      });
      document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && modal.classList.contains('aberto')) close();
      });
    }
  }

  function initMobileMenu() {
    const button = document.getElementById('btn-mobile');
    const menu = document.getElementById('menu-mobile');
    if (!button || !menu) return;

    const menuLinks = menu.querySelectorAll('a');
    const setOpen = (open, returnFocus = false) => {
      document.body.classList.toggle('mobile-menu-aberto', open);
      button.setAttribute('aria-expanded', String(open));
      button.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      menu.setAttribute('aria-hidden', String(!open));
      menu.inert = !open;
      if (open) menuLinks[0]?.focus();
      else if (returnFocus) button.focus();
    };

    setOpen(false);
    button.addEventListener('click', () => {
      setOpen(button.getAttribute('aria-expanded') !== 'true', true);
    });
    menu.addEventListener('click', event => {
      if (event.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
        setOpen(false, true);
      }
    });

    const desktopQuery = window.matchMedia('(min-width: 768px)');
    const closeOnDesktop = event => { if (event.matches) setOpen(false); };
    if (desktopQuery.addEventListener) desktopQuery.addEventListener('change', closeOnDesktop);
    else desktopQuery.addListener(closeOnDesktop);
  }

  function initMotionPreferences() {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.querySelectorAll('video[autoplay]').forEach(video => video.pause());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileMenu, { once: true });
    document.addEventListener('DOMContentLoaded', initMotionPreferences, { once: true });
  } else {
    initMobileMenu();
    initMotionPreferences();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initOndeEncontrar, { once: true });
  } else {
    initOndeEncontrar();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject, { once: true });
  } else {
    inject();
  }

  window.garantirFundoBotanico = inject;
})();
