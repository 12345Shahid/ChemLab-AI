// ═══════════════════════════════════════════════
// Custom Simulations for Gap Topics
// ═══════════════════════════════════════════════

export function renderCustomSim(topic) {
  const sims = {
    'f1-06': renderFiltrationSim,
    'f1-09': renderMetalsSim,
    'f2-02': renderGasTestsSim,
    'f2-03': renderCombustionSim,
    'f2-04': renderRespirationSim,
    'f3-10': renderRocksSim,
    'f3-11': renderRedoxSim,
    'f3-12': renderDistillationSim,
  };

  const renderer = sims[topic.id];
  if (renderer) return renderer(topic);

  return `
    <div class="custom-sim">
      <h2 class="custom-sim__title">${topic.name}</h2>
      <p class="custom-sim__desc">${topic.description}</p>
      <div class="sim-interactive">
        <div class="sim-interactive__area">
          <div class="sim-emoji">🧪</div>
          <p>Interactive simulation loading...</p>
          <p style="color:var(--text-muted); font-size:0.85rem;">Use the AI chatbot to learn about this topic!</p>
        </div>
      </div>
    </div>
  `;
}

function renderFiltrationSim(topic) {
  return `
    <div class="custom-sim">
      <h2 class="custom-sim__title">🔬 ${topic.name}</h2>
      <p class="custom-sim__desc">${topic.description}</p>

      <div class="sim-step active" id="filtration-step-1">
        <div class="sim-step__num">Step 1 of 4</div>
        <h3 class="sim-step__title">Set Up the Apparatus</h3>
        <div class="sim-step__content">
          <p>A filtration setup requires: <strong>filter funnel</strong>, <strong>filter paper</strong>, <strong>conical flask</strong>, and a <strong>retort stand</strong>.</p>
          <div class="sim-interactive" style="margin-top:16px;">
            <div class="sim-interactive__area">
              <div style="font-size:4rem;">🏗️ → 📐 → 🫗</div>
              <p style="font-size:0.9rem;">Fold the filter paper into a cone and place it in the funnel.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="sim-step" id="filtration-step-2">
        <div class="sim-step__num">Step 2 of 4</div>
        <h3 class="sim-step__title">Pour the Mixture</h3>
        <div class="sim-step__content">
          <p>Slowly pour the <strong>mixture of sand and water</strong> through the filter paper. Use a glass rod to guide the liquid.</p>
          <div class="sim-interactive" style="margin-top:16px;">
            <div class="sim-interactive__area">
              <div style="font-size:4rem;">🫗 → 📄 → 🧪</div>
              <p style="font-size:0.9rem;">The liquid passes through; solid particles are trapped.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="sim-step" id="filtration-step-3">
        <div class="sim-step__num">Step 3 of 4</div>
        <h3 class="sim-step__title">Observe the Results</h3>
        <div class="sim-step__content">
          <p><strong>Residue</strong> = the solid left on the filter paper (sand)<br>
          <strong>Filtrate</strong> = the clear liquid that passes through (water)</p>
          <div class="sim-interactive" style="margin-top:16px;display:flex;gap:24px;justify-content:center;flex-wrap:wrap;">
            <div class="glass-card" style="padding:16px;text-align:center;min-width:140px;">
              <div style="font-size:2rem;">🏜️</div>
              <strong>Residue</strong><br><span style="color:var(--text-muted);font-size:0.8rem;">Sand on paper</span>
            </div>
            <div class="glass-card" style="padding:16px;text-align:center;min-width:140px;">
              <div style="font-size:2rem;">💧</div>
              <strong>Filtrate</strong><br><span style="color:var(--text-muted);font-size:0.8rem;">Clean water</span>
            </div>
          </div>
        </div>
      </div>

      <div class="sim-step" id="filtration-step-4">
        <div class="sim-step__num">Step 4 of 4</div>
        <h3 class="sim-step__title">Key Concepts</h3>
        <div class="sim-step__content">
          <p>✅ Filtration separates <strong>insoluble solids</strong> from <strong>liquids</strong>.<br>
          ✅ It works because the filter paper has tiny holes — particles larger than the holes get trapped.<br>
          ✅ It <strong>cannot</strong> separate dissolved substances (like salt in water).</p>
        </div>
      </div>

      <div style="text-align:center; margin-top:24px;">
        <button class="btn btn--primary" onclick="location.hash='assessment?topic=${topic.id}'">
          ✅ Take the Quiz
        </button>
      </div>
    </div>
  `;
}

function renderMetalsSim(topic) {
  return `
    <div class="custom-sim">
      <h2 class="custom-sim__title">⚙️ ${topic.name}</h2>
      <p class="custom-sim__desc">${topic.description}</p>

      <div class="sim-interactive" style="margin-bottom:24px;">
        <h3 style="margin-bottom:16px;">Compare Properties</h3>
        <table style="width:100%;border-collapse:collapse;text-align:left;font-size:0.9rem;">
          <thead>
            <tr style="border-bottom:2px solid var(--border-subtle);">
              <th style="padding:12px;">Property</th>
              <th style="padding:12px;">Metals 🔩</th>
              <th style="padding:12px;">Non-metals 🧊</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom:1px solid var(--border-subtle);">
              <td style="padding:10px;">Appearance</td>
              <td style="padding:10px;color:var(--accent-teal);">Shiny (lustrous)</td>
              <td style="padding:10px;color:var(--accent-amber);">Dull (non-lustrous)</td>
            </tr>
            <tr style="border-bottom:1px solid var(--border-subtle);">
              <td style="padding:10px;">State at Room Temp</td>
              <td style="padding:10px;color:var(--accent-teal);">Mostly solid (except Hg)</td>
              <td style="padding:10px;color:var(--accent-amber);">Solid, liquid, or gas</td>
            </tr>
            <tr style="border-bottom:1px solid var(--border-subtle);">
              <td style="padding:10px;">Electrical Conductivity</td>
              <td style="padding:10px;color:var(--accent-teal);">Good conductors ⚡</td>
              <td style="padding:10px;color:var(--accent-amber);">Poor conductors (except C)</td>
            </tr>
            <tr style="border-bottom:1px solid var(--border-subtle);">
              <td style="padding:10px;">Heat Conductivity</td>
              <td style="padding:10px;color:var(--accent-teal);">Good conductors 🔥</td>
              <td style="padding:10px;color:var(--accent-amber);">Poor conductors</td>
            </tr>
            <tr style="border-bottom:1px solid var(--border-subtle);">
              <td style="padding:10px;">Malleability</td>
              <td style="padding:10px;color:var(--accent-teal);">Can be bent/hammered</td>
              <td style="padding:10px;color:var(--accent-amber);">Brittle (break easily)</td>
            </tr>
            <tr>
              <td style="padding:10px;">Sound</td>
              <td style="padding:10px;color:var(--accent-teal);">Sonorous (rings) 🔔</td>
              <td style="padding:10px;color:var(--accent-amber);">Not sonorous</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="sim-step">
        <h3 class="sim-step__title">🧩 Classify These Elements</h3>
        <div class="sim-step__content">
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:8px;margin-top:12px;">
            ${['Iron (Fe) 🔩', 'Sulfur (S) 🟡', 'Copper (Cu) 🟤', 'Oxygen (O₂) 💨', 'Gold (Au) 🥇', 'Carbon (C) ⚫', 'Aluminium (Al) 🪶', 'Chlorine (Cl₂) 🟢'].map(el => `
              <div class="glass-card" style="padding:10px;text-align:center;font-size:0.8rem;cursor:pointer;">
                ${el}
              </div>
            `).join('')}
          </div>
          <p style="margin-top:16px;color:var(--text-muted);font-size:0.85rem;">
            💡 <strong>Metals:</strong> Fe, Cu, Au, Al | <strong>Non-metals:</strong> S, O₂, C, Cl₂
          </p>
        </div>
      </div>

      <div style="text-align:center; margin-top:24px;">
        <button class="btn btn--primary" onclick="location.hash='assessment?topic=${topic.id}'">✅ Take the Quiz</button>
      </div>
    </div>
  `;
}

function renderGasTestsSim(topic) {
  return `
    <div class="custom-sim">
      <h2 class="custom-sim__title">🧪 ${topic.name}</h2>
      <p class="custom-sim__desc">${topic.description}</p>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;">
        <div class="glass-card" style="padding:24px;text-align:center;border-top:3px solid var(--accent-sky);">
          <div style="font-size:2.5rem;margin-bottom:12px;">💨</div>
          <h3 style="margin-bottom:8px;">Oxygen (O₂)</h3>
          <div style="font-size:0.85rem;color:var(--text-secondary);line-height:1.6;">
            <strong>Test:</strong> Insert a <span style="color:var(--accent-amber);">glowing splint</span><br>
            <strong>Result:</strong> Splint <span style="color:var(--accent-emerald);">relights</span> 🔥<br>
            <strong>Why:</strong> O₂ supports combustion
          </div>
        </div>

        <div class="glass-card" style="padding:24px;text-align:center;border-top:3px solid var(--accent-secondary);">
          <div style="font-size:2.5rem;margin-bottom:12px;">🫧</div>
          <h3 style="margin-bottom:8px;">Carbon Dioxide (CO₂)</h3>
          <div style="font-size:0.85rem;color:var(--text-secondary);line-height:1.6;">
            <strong>Test:</strong> Bubble through <span style="color:var(--accent-amber);">limewater</span><br>
            <strong>Result:</strong> Turns <span style="color:var(--accent-emerald);">milky/cloudy</span> 🥛<br>
            <strong>Why:</strong> CO₂ + Ca(OH)₂ → CaCO₃
          </div>
        </div>

        <div class="glass-card" style="padding:24px;text-align:center;border-top:3px solid var(--accent-rose);">
          <div style="font-size:2.5rem;margin-bottom:12px;">💥</div>
          <h3 style="margin-bottom:8px;">Hydrogen (H₂)</h3>
          <div style="font-size:0.85rem;color:var(--text-secondary);line-height:1.6;">
            <strong>Test:</strong> Insert a <span style="color:var(--accent-amber);">lit splint</span><br>
            <strong>Result:</strong> <span style="color:var(--accent-emerald);">Squeaky pop</span> 💢<br>
            <strong>Why:</strong> H₂ burns rapidly in air
          </div>
        </div>
      </div>

      <div class="sim-step" style="margin-top:24px;">
        <h3 class="sim-step__title">🔑 Key Points to Remember</h3>
        <div class="sim-step__content">
          <p>• <strong>Glowing</strong> splint (no flame) → tests for O₂<br>
          • <strong>Lit</strong> splint (with flame) → tests for H₂<br>
          • <strong>Limewater</strong> (calcium hydroxide solution) → tests for CO₂<br>
          • These tests are required knowledge for HK exams!</p>
        </div>
      </div>

      <div style="text-align:center; margin-top:24px;">
        <button class="btn btn--primary" onclick="location.hash='assessment?topic=${topic.id}'">✅ Take the Quiz</button>
      </div>
    </div>
  `;
}

function renderCombustionSim(topic) {
  return `
    <div class="custom-sim">
      <h2 class="custom-sim__title">🔥 ${topic.name}</h2>
      <p class="custom-sim__desc">${topic.description}</p>

      <div class="sim-interactive" style="margin-bottom:24px;">
        <h3 style="margin-bottom:20px;">The Fire Triangle</h3>
        <div style="display:flex;justify-content:center;gap:32px;flex-wrap:wrap;">
          <div style="text-align:center;">
            <div style="font-size:3rem;">⛽</div>
            <strong>Fuel</strong>
            <p style="font-size:0.8rem;color:var(--text-muted);">Wood, gas, candle wax</p>
          </div>
          <div style="text-align:center;">
            <div style="font-size:3rem;">🔥</div>
            <strong>Heat</strong>
            <p style="font-size:0.8rem;color:var(--text-muted);">Match, spark, friction</p>
          </div>
          <div style="text-align:center;">
            <div style="font-size:3rem;">💨</div>
            <strong>Oxygen</strong>
            <p style="font-size:0.8rem;color:var(--text-muted);">~21% in air</p>
          </div>
        </div>
        <p style="margin-top:16px;color:var(--accent-amber);font-size:0.9rem;font-weight:600;">
          Remove any ONE side → fire goes out! 🚒
        </p>
      </div>

      <div class="sim-step">
        <h3 class="sim-step__title">Products of Combustion</h3>
        <div class="sim-step__content">
          <p><strong>Complete combustion</strong> (excess oxygen):</p>
          <div class="glass-card" style="padding:12px;margin:8px 0;font-family:var(--font-mono);font-size:0.85rem;">
            Fuel + O₂ → CO₂ + H₂O + Energy
          </div>
          <p><strong>Incomplete combustion</strong> (limited oxygen):</p>
          <div class="glass-card" style="padding:12px;margin:8px 0;font-family:var(--font-mono);font-size:0.85rem;">
            Fuel + O₂ → CO + C + H₂O + Energy ⚠️
          </div>
          <p style="color:var(--accent-rose);font-size:0.85rem;">⚠️ CO (carbon monoxide) is a toxic, odourless gas!</p>
        </div>
      </div>

      <div style="text-align:center; margin-top:24px;">
        <button class="btn btn--primary" onclick="location.hash='assessment?topic=${topic.id}'">✅ Take the Quiz</button>
      </div>
    </div>
  `;
}

function renderRespirationSim(topic) {
  return `
    <div class="custom-sim">
      <h2 class="custom-sim__title">🫁 ${topic.name}</h2>
      <p class="custom-sim__desc">${topic.description}</p>

      <div class="sim-step active">
        <h3 class="sim-step__title">The Respiration Equation</h3>
        <div class="sim-step__content">
          <div class="glass-card" style="padding:16px;margin:12px 0;text-align:center;font-size:1rem;">
            <strong>Glucose + Oxygen → Carbon Dioxide + Water + Energy</strong>
          </div>
          <div class="glass-card" style="padding:16px;margin:12px 0;text-align:center;font-family:var(--font-mono);font-size:0.9rem;">
            C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + Energy
          </div>
        </div>
      </div>

      <div class="sim-step">
        <h3 class="sim-step__title">Respiration vs Combustion</h3>
        <div class="sim-step__content">
          <table style="width:100%;border-collapse:collapse;font-size:0.85rem;">
            <thead>
              <tr style="border-bottom:2px solid var(--border-subtle);">
                <th style="padding:10px;text-align:left;">Feature</th>
                <th style="padding:10px;text-align:left;">Respiration 🫁</th>
                <th style="padding:10px;text-align:left;">Combustion 🔥</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom:1px solid var(--border-subtle);">
                <td style="padding:8px;">Speed</td>
                <td style="padding:8px;">Slow, controlled</td>
                <td style="padding:8px;">Fast, uncontrolled</td>
              </tr>
              <tr style="border-bottom:1px solid var(--border-subtle);">
                <td style="padding:8px;">Temperature</td>
                <td style="padding:8px;">Body temperature (~37°C)</td>
                <td style="padding:8px;">Very high</td>
              </tr>
              <tr style="border-bottom:1px solid var(--border-subtle);">
                <td style="padding:8px;">Enzymes</td>
                <td style="padding:8px;">Yes (biological catalysts)</td>
                <td style="padding:8px;">No</td>
              </tr>
              <tr>
                <td style="padding:8px;">Light produced?</td>
                <td style="padding:8px;">No</td>
                <td style="padding:8px;">Yes (flame)</td>
              </tr>
            </tbody>
          </table>
          <p style="margin-top:12px;color:var(--accent-teal);">Both produce CO₂ and H₂O, and both need O₂ as a reactant!</p>
        </div>
      </div>

      <div style="text-align:center; margin-top:24px;">
        <button class="btn btn--primary" onclick="location.hash='assessment?topic=${topic.id}'">✅ Take the Quiz</button>
      </div>
    </div>
  `;
}

function renderRocksSim(topic) {
  return `
    <div class="custom-sim">
      <h2 class="custom-sim__title">🪨 ${topic.name}</h2>
      <p class="custom-sim__desc">${topic.description}</p>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px;margin-bottom:24px;">
        <div class="glass-card" style="padding:20px;text-align:center;border-top:3px solid var(--accent-rose);">
          <div style="font-size:2rem;margin-bottom:8px;">🌋</div>
          <h3 style="font-size:1rem;margin-bottom:6px;">Igneous</h3>
          <p style="font-size:0.8rem;color:var(--text-secondary);">Formed from cooled magma/lava<br>e.g. Granite, Basalt</p>
        </div>
        <div class="glass-card" style="padding:20px;text-align:center;border-top:3px solid var(--accent-amber);">
          <div style="font-size:2rem;margin-bottom:8px;">🏖️</div>
          <h3 style="font-size:1rem;margin-bottom:6px;">Sedimentary</h3>
          <p style="font-size:0.8rem;color:var(--text-secondary);">Formed from deposited layers<br>e.g. Limestone, Sandstone</p>
        </div>
        <div class="glass-card" style="padding:20px;text-align:center;border-top:3px solid var(--accent-secondary);">
          <div style="font-size:2rem;margin-bottom:8px;">💎</div>
          <h3 style="font-size:1rem;margin-bottom:6px;">Metamorphic</h3>
          <p style="font-size:0.8rem;color:var(--text-secondary);">Changed by heat/pressure<br>e.g. Marble, Slate</p>
        </div>
      </div>

      <div class="sim-step">
        <h3 class="sim-step__title">Metal Extraction — Reactivity Series</h3>
        <div class="sim-step__content">
          <p>How we extract a metal depends on its <strong>reactivity</strong>:</p>
          <div style="display:flex;flex-direction:column;gap:6px;margin:12px 0;">
            <div class="glass-card" style="padding:8px 16px;border-left:3px solid var(--accent-rose);">
              <strong>Very reactive</strong> (K, Na, Ca, Mg, Al) → <span style="color:var(--accent-teal);">Electrolysis</span>
            </div>
            <div class="glass-card" style="padding:8px 16px;border-left:3px solid var(--accent-amber);">
              <strong>Medium reactive</strong> (Zn, Fe, Sn, Pb) → <span style="color:var(--accent-teal);">Reduction with carbon</span>
            </div>
            <div class="glass-card" style="padding:8px 16px;border-left:3px solid var(--accent-emerald);">
              <strong>Unreactive</strong> (Cu, Ag, Au, Pt) → <span style="color:var(--accent-teal);">Found native / simple heating</span>
            </div>
          </div>
        </div>
      </div>

      <div style="text-align:center; margin-top:24px;">
        <button class="btn btn--primary" onclick="location.hash='assessment?topic=${topic.id}'">✅ Take the Quiz</button>
      </div>
    </div>
  `;
}

function renderRedoxSim(topic) {
  return `
    <div class="custom-sim">
      <h2 class="custom-sim__title">⚡ ${topic.name}</h2>
      <p class="custom-sim__desc">${topic.description}</p>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px;">
        <div class="glass-card" style="padding:24px;text-align:center;border-top:3px solid var(--accent-rose);">
          <h3 style="margin-bottom:12px;">Oxidation 🔴</h3>
          <div style="font-size:0.9rem;color:var(--text-secondary);line-height:1.6;">
            <strong>Gain</strong> of oxygen<br>
            <strong>Loss</strong> of electrons<br>
            <strong>Loss</strong> of hydrogen<br>
            <div class="glass-card" style="padding:8px;margin-top:8px;font-family:var(--font-mono);font-size:0.8rem;">
              Fe → Fe²⁺ + 2e⁻
            </div>
          </div>
        </div>
        <div class="glass-card" style="padding:24px;text-align:center;border-top:3px solid var(--accent-sky);">
          <h3 style="margin-bottom:12px;">Reduction 🔵</h3>
          <div style="font-size:0.9rem;color:var(--text-secondary);line-height:1.6;">
            <strong>Loss</strong> of oxygen<br>
            <strong>Gain</strong> of electrons<br>
            <strong>Gain</strong> of hydrogen<br>
            <div class="glass-card" style="padding:8px;margin-top:8px;font-family:var(--font-mono);font-size:0.8rem;">
              Cu²⁺ + 2e⁻ → Cu
            </div>
          </div>
        </div>
      </div>

      <div class="sim-step">
        <h3 class="sim-step__title">💡 Remember: OIL RIG</h3>
        <div class="sim-step__content" style="text-align:center;font-size:1.1rem;">
          <p><strong style="color:var(--accent-rose);">O</strong>xidation <strong style="color:var(--accent-rose);">I</strong>s <strong style="color:var(--accent-rose);">L</strong>oss (of electrons)</p>
          <p><strong style="color:var(--accent-sky);">R</strong>eduction <strong style="color:var(--accent-sky);">I</strong>s <strong style="color:var(--accent-sky);">G</strong>ain (of electrons)</p>
        </div>
      </div>

      <div class="sim-step">
        <h3 class="sim-step__title">Everyday Redox: Rusting</h3>
        <div class="sim-step__content">
          <div class="glass-card" style="padding:12px;font-family:var(--font-mono);font-size:0.85rem;text-align:center;">
            4Fe + 3O₂ + 6H₂O → 4Fe(OH)₃ (rust)
          </div>
          <p style="margin-top:8px;">Iron is <strong>oxidized</strong> (gains oxygen). This is why we paint or galvanize iron to prevent rusting!</p>
        </div>
      </div>

      <div style="text-align:center; margin-top:24px;">
        <button class="btn btn--primary" onclick="location.hash='assessment?topic=${topic.id}'">✅ Take the Quiz</button>
      </div>
    </div>
  `;
}

function renderDistillationSim(topic) {
  return `
    <div class="custom-sim">
      <h2 class="custom-sim__title">🧫 ${topic.name}</h2>
      <p class="custom-sim__desc">${topic.description}</p>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px;">
        <div class="glass-card" style="padding:24px;">
          <h3 style="margin-bottom:12px;text-align:center;">Simple Distillation</h3>
          <div style="text-align:center;font-size:2.5rem;margin-bottom:12px;">🔥 → 💨 → ❄️ → 💧</div>
          <div style="font-size:0.85rem;color:var(--text-secondary);line-height:1.6;">
            <p><strong>Use:</strong> Separating a <em>dissolved solid</em> from a liquid (e.g., salt from seawater)</p>
            <ol style="margin-top:8px;padding-left:16px;">
              <li>Heat the solution</li>
              <li>Liquid evaporates, rises as steam</li>
              <li>Steam condenses in the condenser</li>
              <li>Pure liquid is collected</li>
            </ol>
          </div>
        </div>
        <div class="glass-card" style="padding:24px;">
          <h3 style="margin-bottom:12px;text-align:center;">Crystallization</h3>
          <div style="text-align:center;font-size:2.5rem;margin-bottom:12px;">🔥 → 💧↓ → 🧊</div>
          <div style="font-size:0.85rem;color:var(--text-secondary);line-height:1.6;">
            <p><strong>Use:</strong> Obtaining pure <em>solid crystals</em> from a solution</p>
            <ol style="margin-top:8px;padding-left:16px;">
              <li>Gently heat the solution</li>
              <li>Evaporate until saturated</li>
              <li>Cool slowly — crystals form</li>
              <li>Filter and dry crystals</li>
            </ol>
          </div>
        </div>
      </div>

      <div class="sim-step">
        <h3 class="sim-step__title">When to Use Which Method?</h3>
        <div class="sim-step__content">
          <table style="width:100%;border-collapse:collapse;font-size:0.85rem;">
            <thead>
              <tr style="border-bottom:2px solid var(--border-subtle);">
                <th style="padding:10px;text-align:left;">If you want to collect...</th>
                <th style="padding:10px;text-align:left;">Method</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom:1px solid var(--border-subtle);">
                <td style="padding:8px;">The <strong>liquid</strong> from a solution</td>
                <td style="padding:8px;color:var(--accent-teal);">Distillation</td>
              </tr>
              <tr style="border-bottom:1px solid var(--border-subtle);">
                <td style="padding:8px;">The <strong>solid</strong> from a solution</td>
                <td style="padding:8px;color:var(--accent-teal);">Crystallization (or evaporation)</td>
              </tr>
              <tr>
                <td style="padding:8px;">Two <strong>miscible liquids</strong></td>
                <td style="padding:8px;color:var(--accent-teal);">Fractional distillation</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div style="text-align:center; margin-top:24px;">
        <button class="btn btn--primary" onclick="location.hash='assessment?topic=${topic.id}'">✅ Take the Quiz</button>
      </div>
    </div>
  `;
}
