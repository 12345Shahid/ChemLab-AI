// ═══════════════════════════════════════════════
// Curriculum Data — All 32 HK Form 1-3 Topics
// ═══════════════════════════════════════════════

export const curriculum = [
  // ─── FORM 1: Foundational Chemistry ───
  {
    id: 'f1-01',
    name: 'States of Matter',
    nameCn: '物質的狀態',
    form: 1,
    category: 'Matter as Particles',
    description: 'Explore the properties of solids, liquids, and gases at the particle level.',
    descriptionCn: '從粒子層面探索固體、液體和氣體的性質。',
    learningObjectives: [
      'Describe properties of solids, liquids, and gases',
      'Explain particle arrangement in each state',
      'Relate particle motion to temperature'
    ],
    phetUrl: 'https://phet.colorado.edu/sims/html/states-of-matter/latest/states-of-matter_all.html',
    isCustomSim: false,
    status: 'covered',
    keywords: ['solid', 'liquid', 'gas', 'particles', 'temperature', 'phase']
  },
  {
    id: 'f1-02',
    name: 'Particle Theory',
    nameCn: '粒子理論',
    form: 1,
    category: 'Matter as Particles',
    description: 'Understand that all matter is made up of tiny particles (atoms and molecules).',
    descriptionCn: '了解所有物質都由微小粒子（原子和分子）組成。',
    learningObjectives: [
      'State the particle theory of matter',
      'Use particles to explain physical properties',
      'Distinguish between atoms and molecules'
    ],
    phetUrl: 'https://phet.colorado.edu/sims/html/states-of-matter-basics/latest/states-of-matter-basics_all.html',
    isCustomSim: false,
    status: 'covered',
    keywords: ['particle', 'atom', 'molecule', 'matter', 'theory']
  },
  {
    id: 'f1-03',
    name: 'Changes of Physical State',
    nameCn: '物態變化',
    form: 1,
    category: 'Water',
    description: 'Investigate melting, boiling, evaporation, and condensation processes.',
    descriptionCn: '研究熔化、沸騰、蒸發和凝結過程。',
    learningObjectives: [
      'Name the changes of state (melting, boiling, freezing, condensation)',
      'Explain changes using particle theory',
      'Identify melting and boiling points'
    ],
    phetUrl: 'https://phet.colorado.edu/sims/html/states-of-matter/latest/states-of-matter_all.html',
    isCustomSim: false,
    status: 'covered',
    keywords: ['melting', 'boiling', 'evaporation', 'condensation', 'freezing']
  },
  {
    id: 'f1-04',
    name: 'Dissolving',
    nameCn: '溶解',
    form: 1,
    category: 'Water',
    description: 'Explore solvent, solute, solution concepts and factors affecting dissolving rate.',
    descriptionCn: '探索溶劑、溶質、溶液概念以及影響溶解速率的因素。',
    learningObjectives: [
      'Define solvent, solute, and solution',
      'Investigate factors affecting rate of dissolving',
      'Distinguish between soluble and insoluble substances'
    ],
    phetUrl: 'https://phet.colorado.edu/sims/html/sugar-and-salt-solutions/latest/sugar-and-salt-solutions_all.html',
    isCustomSim: false,
    status: 'covered',
    keywords: ['dissolving', 'solvent', 'solute', 'solution', 'sugar', 'salt']
  },
  {
    id: 'f1-05',
    name: 'Solubility & Concentration',
    nameCn: '溶解度與濃度',
    form: 1,
    category: 'Water',
    description: 'Understand solubility limits and concentration of solutions.',
    descriptionCn: '了解溶解度極限和溶液濃度。',
    learningObjectives: [
      'Define solubility and saturated solutions',
      'Calculate concentration in simple terms',
      'Investigate temperature effects on solubility'
    ],
    phetUrl: 'https://phet.colorado.edu/sims/html/molarity/latest/molarity_all.html',
    isCustomSim: false,
    status: 'covered',
    keywords: ['solubility', 'concentration', 'molarity', 'saturated']
  },
  {
    id: 'f1-06',
    name: 'Filtration',
    nameCn: '過濾',
    form: 1,
    category: 'Separation Techniques',
    description: 'Learn to separate insoluble solids from liquids using filtration apparatus.',
    descriptionCn: '學習使用過濾裝置將不溶固體從液體中分離。',
    learningObjectives: [
      'Set up filtration apparatus correctly',
      'Explain when to use filtration',
      'Identify residue and filtrate'
    ],
    phetUrl: null,
    externalLabUrl: 'https://chemcollective.org/vlab/vlab.php',
    externalLabName: 'ChemCollective Virtual Lab',
    isCustomSim: false,
    status: 'partial',
    keywords: ['filtration', 'filter', 'residue', 'filtrate', 'separation']
  },
  {
    id: 'f1-07',
    name: 'Evaporation as Separation',
    nameCn: '蒸發分離',
    form: 1,
    category: 'Separation Techniques',
    description: 'Use evaporation to recover dissolved solids from solutions.',
    descriptionCn: '利用蒸發從溶液中回收溶解的固體。',
    learningObjectives: [
      'Explain how evaporation separates mixtures',
      'Identify suitable mixtures for evaporation',
      'Describe the evaporation procedure'
    ],
    phetUrl: 'https://phet.colorado.edu/sims/html/concentration/latest/concentration_all.html',
    isCustomSim: false,
    status: 'partial',
    keywords: ['evaporation', 'separation', 'dissolved', 'recovery']
  },
  {
    id: 'f1-08',
    name: 'Elements, Compounds & Mixtures',
    nameCn: '元素、化合物與混合物',
    form: 1,
    category: 'Classifying Substances',
    description: 'Classify substances as elements, compounds, or mixtures.',
    descriptionCn: '將物質分類為元素、化合物或混合物。',
    learningObjectives: [
      'Define element, compound, and mixture',
      'Distinguish between pure substances and mixtures',
      'Give examples of each category'
    ],
    phetUrl: 'https://phet.colorado.edu/sims/html/build-a-molecule/latest/build-a-molecule_all.html',
    isCustomSim: false,
    status: 'covered',
    keywords: ['element', 'compound', 'mixture', 'pure substance', 'classification']
  },
  {
    id: 'f1-09',
    name: 'Metals vs Non-metals',
    nameCn: '金屬與非金屬',
    form: 1,
    category: 'Classifying Substances',
    description: 'Compare physical properties of metals and non-metals.',
    descriptionCn: '比較金屬和非金屬的物理性質。',
    learningObjectives: [
      'List physical properties of metals and non-metals',
      'Classify elements by their properties',
      'Explain uses based on properties'
    ],
    phetUrl: 'https://phet.colorado.edu/sims/html/build-an-atom/latest/build-an-atom_all.html',
    externalLabUrl: null,
    externalLabName: null,
    isCustomSim: false,
    status: 'partial',
    keywords: ['metal', 'non-metal', 'conductivity', 'malleability', 'lustre']
  },
  {
    id: 'f1-10',
    name: 'Molecular Models & Chemical Formulae',
    nameCn: '分子模型與化學式',
    form: 1,
    category: 'Classifying Substances',
    description: 'Build molecular models and write simple chemical formulae.',
    descriptionCn: '建立分子模型並書寫簡單的化學式。',
    learningObjectives: [
      'Build molecular models of simple molecules',
      'Write chemical formulae from names',
      'Calculate number of atoms from formulae'
    ],
    phetUrl: 'https://phet.colorado.edu/sims/html/build-a-molecule/latest/build-a-molecule_all.html',
    isCustomSim: false,
    status: 'covered',
    keywords: ['molecular model', 'chemical formula', 'molecule', 'atom count']
  },

  // ─── FORM 2: Reactions, Acids & Gases ───
  {
    id: 'f2-01',
    name: 'Composition of Air',
    nameCn: '空氣的組成',
    form: 2,
    category: 'Living Things and Air',
    description: 'Learn about the main gases in air and their proportions.',
    descriptionCn: '了解空氣中主要氣體及其比例。',
    learningObjectives: [
      'State the composition of air (N₂, O₂, CO₂, etc.)',
      'Describe properties of atmospheric gases',
      'Explain role of each gas'
    ],
    phetUrl: 'https://phet.colorado.edu/sims/html/molecules-and-light/latest/molecules-and-light_all.html',
    isCustomSim: false,
    status: 'partial',
    keywords: ['air', 'nitrogen', 'oxygen', 'carbon dioxide', 'atmosphere']
  },
  {
    id: 'f2-02',
    name: 'Gas Tests',
    nameCn: '氣體測試',
    form: 2,
    category: 'Living Things and Air',
    description: 'Perform standard tests for oxygen, carbon dioxide, and hydrogen gases.',
    descriptionCn: '對氧氣、二氧化碳和氫氣進行標準測試。',
    learningObjectives: [
      'Describe and perform the test for oxygen (glowing splint)',
      'Describe and perform the test for carbon dioxide (limewater)',
      'Describe and perform the test for hydrogen (squeaky pop)'
    ],
    phetUrl: null,
    externalLabUrl: 'https://www.olabs.edu.in/?sub=73&brch=8',
    externalLabName: 'Amrita OLabs',
    isCustomSim: false,
    status: 'partial',
    keywords: ['gas test', 'oxygen', 'carbon dioxide', 'hydrogen', 'glowing splint', 'limewater']
  },
  {
    id: 'f2-03',
    name: 'Combustion',
    nameCn: '燃燒',
    form: 2,
    category: 'Living Things and Air',
    description: 'Understand the fire triangle and products of combustion reactions.',
    descriptionCn: '了解燃燒三角和燃燒反應的產物。',
    learningObjectives: [
      'Identify the three requirements for combustion (fuel, heat, oxygen)',
      'Name products of combustion',
      'Write word equations for combustion'
    ],
    phetUrl: null,
    externalLabUrl: 'https://chemcollective.org/vlab/vlab.php',
    externalLabName: 'ChemCollective Virtual Lab',
    isCustomSim: false,
    status: 'partial',
    keywords: ['combustion', 'fire triangle', 'fuel', 'oxygen', 'burning']
  },
  {
    id: 'f2-04',
    name: 'Respiration as a Chemical Reaction',
    nameCn: '呼吸作為化學反應',
    form: 2,
    category: 'Living Things and Air',
    description: 'Understand respiration as a chemical process involving oxygen and glucose.',
    descriptionCn: '將呼吸理解為涉及氧氣和葡萄糖的化學過程。',
    learningObjectives: [
      'Write the word equation for respiration',
      'Compare respiration and combustion',
      'Explain the role of oxygen in respiration'
    ],
    phetUrl: null,
    externalLabUrl: 'https://www.labxchange.org/library/pathway/lx-pathway:c2c8c1b0-1b1e-4b0a-9c1a-1a2b3c4d5e6f',
    externalLabName: 'LabXchange',
    isCustomSim: false,
    status: 'partial',
    keywords: ['respiration', 'glucose', 'oxygen', 'carbon dioxide', 'energy']
  },
  {
    id: 'f2-05',
    name: 'Acids & Alkalis',
    nameCn: '酸和鹼',
    form: 2,
    category: 'Common Acids and Alkalis',
    description: 'Explore properties and examples of acids and alkalis.',
    descriptionCn: '探索酸和鹼的性質及例子。',
    learningObjectives: [
      'List properties of acids and alkalis',
      'Give common examples of each',
      'Explain the corrosive nature of strong acids/alkalis'
    ],
    phetUrl: 'https://phet.colorado.edu/sims/html/acid-base-solutions/latest/acid-base-solutions_all.html',
    isCustomSim: false,
    status: 'covered',
    keywords: ['acid', 'alkali', 'base', 'corrosive', 'properties']
  },
  {
    id: 'f2-06',
    name: 'pH Scale & Indicators',
    nameCn: 'pH值與指示劑',
    form: 2,
    category: 'Common Acids and Alkalis',
    description: 'Use the pH scale and indicators to classify substances.',
    descriptionCn: '使用pH值和指示劑對物質進行分類。',
    learningObjectives: [
      'Use the pH scale (0-14)',
      'Use universal indicator and pH paper',
      'Classify substances as acidic, neutral, or alkaline'
    ],
    phetUrl: 'https://phet.colorado.edu/sims/html/ph-scale/latest/ph-scale_all.html',
    isCustomSim: false,
    status: 'covered',
    keywords: ['pH', 'indicator', 'universal indicator', 'acidic', 'alkaline', 'neutral']
  },
  {
    id: 'f2-07',
    name: 'Neutralization',
    nameCn: '中和反應',
    form: 2,
    category: 'Common Acids and Alkalis',
    description: 'Understand neutralization reactions between acids and bases.',
    descriptionCn: '了解酸和鹼之間的中和反應。',
    learningObjectives: [
      'Describe what happens during neutralization',
      'Write word equations for neutralization',
      'Give everyday uses of neutralization'
    ],
    phetUrl: 'https://phet.colorado.edu/sims/html/acid-base-solutions/latest/acid-base-solutions_all.html',
    isCustomSim: false,
    status: 'covered',
    keywords: ['neutralization', 'acid', 'base', 'salt', 'water']
  },
  {
    id: 'f2-08',
    name: 'Preparation & Uses of Salts',
    nameCn: '鹽的製備和用途',
    form: 2,
    category: 'Common Acids and Alkalis',
    description: 'Learn how salts are prepared from acid-base reactions and their uses.',
    descriptionCn: '學習如何從酸鹼反應中製備鹽及其用途。',
    learningObjectives: [
      'Describe methods of salt preparation',
      'Name salts formed from common reactions',
      'List everyday uses of salts'
    ],
    phetUrl: 'https://phet.colorado.edu/sims/html/acid-base-solutions/latest/acid-base-solutions_all.html',
    isCustomSim: false,
    status: 'partial',
    keywords: ['salt', 'preparation', 'acid-base', 'uses']
  },
  {
    id: 'f2-09',
    name: 'Gas Properties',
    nameCn: '氣體性質',
    form: 2,
    category: 'Living Things and Air',
    description: 'Explore pressure, volume, and temperature relationships of gases.',
    descriptionCn: '探索氣體的壓力、體積和溫度關係。',
    learningObjectives: [
      'Describe relationship between pressure and volume',
      'Explain gas behavior using particle theory',
      'Relate temperature to particle motion'
    ],
    phetUrl: 'https://phet.colorado.edu/sims/html/gas-properties/latest/gas-properties_all.html',
    isCustomSim: false,
    status: 'covered',
    keywords: ['gas', 'pressure', 'volume', 'temperature', 'particles']
  },

  // ─── FORM 3: Atomic World & Materials ───
  {
    id: 'f3-01',
    name: 'Atomic Structure',
    nameCn: '原子結構',
    form: 3,
    category: 'From Atoms to Materials',
    description: 'Learn about protons, neutrons, and electrons within the atom.',
    descriptionCn: '了解原子內的質子、中子和電子。',
    learningObjectives: [
      'Describe the structure of an atom',
      'State the charges and masses of subatomic particles',
      'Draw atomic diagrams'
    ],
    phetUrl: 'https://phet.colorado.edu/sims/html/build-an-atom/latest/build-an-atom_all.html',
    isCustomSim: false,
    status: 'covered',
    keywords: ['atom', 'proton', 'neutron', 'electron', 'nucleus']
  },
  {
    id: 'f3-02',
    name: 'Atomic Number & Mass Number',
    nameCn: '原子序數與質量數',
    form: 3,
    category: 'From Atoms to Materials',
    description: 'Understand atomic number, mass number, and electron configuration.',
    descriptionCn: '了解原子序數、質量數和電子排列。',
    learningObjectives: [
      'Define atomic number and mass number',
      'Calculate number of subatomic particles',
      'Write electron configurations'
    ],
    phetUrl: 'https://phet.colorado.edu/sims/html/build-an-atom/latest/build-an-atom_all.html',
    isCustomSim: false,
    status: 'covered',
    keywords: ['atomic number', 'mass number', 'electron configuration']
  },
  {
    id: 'f3-03',
    name: 'Isotopes',
    nameCn: '同位素',
    form: 3,
    category: 'From Atoms to Materials',
    description: 'Learn what isotopes are and how to calculate average atomic mass.',
    descriptionCn: '了解什麼是同位素以及如何計算平均原子質量。',
    learningObjectives: [
      'Define isotopes',
      'Give examples of common isotopes',
      'Calculate average atomic mass'
    ],
    phetUrl: 'https://phet.colorado.edu/sims/html/isotopes-and-atomic-mass/latest/isotopes-and-atomic-mass_all.html',
    isCustomSim: false,
    status: 'covered',
    keywords: ['isotope', 'atomic mass', 'neutron', 'mass number']
  },
  {
    id: 'f3-04',
    name: 'The Periodic Table',
    nameCn: '元素週期表',
    form: 3,
    category: 'From Atoms to Materials',
    description: 'Understand the organization of elements in the periodic table.',
    descriptionCn: '了解元素在週期表中的排列。',
    learningObjectives: [
      'Describe the arrangement of the periodic table',
      'Identify groups and periods',
      'Relate position to electron configuration'
    ],
    phetUrl: 'https://phet.colorado.edu/sims/html/build-an-atom/latest/build-an-atom_all.html',
    isCustomSim: false,
    status: 'covered',
    keywords: ['periodic table', 'group', 'period', 'element']
  },
  {
    id: 'f3-05',
    name: 'Ionic Bonding',
    nameCn: '離子鍵',
    form: 3,
    category: 'Chemical Bonding',
    description: 'Understand how atoms transfer electrons to form ionic bonds.',
    descriptionCn: '了解原子如何通過轉移電子形成離子鍵。',
    learningObjectives: [
      'Explain electron transfer in ionic bonding',
      'Draw dot-and-cross diagrams',
      'Describe properties of ionic compounds'
    ],
    phetUrl: 'https://phet.colorado.edu/sims/html/atomic-interactions/latest/atomic-interactions_all.html',
    isCustomSim: false,
    status: 'partial',
    keywords: ['ionic bond', 'electron transfer', 'ion', 'cation', 'anion']
  },
  {
    id: 'f3-06',
    name: 'Covalent Bonding',
    nameCn: '共價鍵',
    form: 3,
    category: 'Chemical Bonding',
    description: 'Understand how atoms share electrons to form covalent bonds.',
    descriptionCn: '了解原子如何通過共享電子形成共價鍵。',
    learningObjectives: [
      'Explain electron sharing in covalent bonding',
      'Draw dot-and-cross diagrams for covalent molecules',
      'Compare ionic and covalent bonding'
    ],
    phetUrl: 'https://phet.colorado.edu/sims/html/molecule-polarity/latest/molecule-polarity_all.html',
    isCustomSim: false,
    status: 'partial',
    keywords: ['covalent bond', 'electron sharing', 'molecule', 'polarity']
  },
  {
    id: 'f3-07',
    name: 'Chemical Formulae & Naming',
    nameCn: '化學式與命名',
    form: 3,
    category: 'From Atoms to Materials',
    description: 'Write chemical formulae and name compounds systematically.',
    descriptionCn: '系統地書寫化學式和命名化合物。',
    learningObjectives: [
      'Write formulae for common compounds',
      'Name compounds from their formulae',
      'Use valency to determine formulae'
    ],
    phetUrl: 'https://phet.colorado.edu/sims/html/build-a-molecule/latest/build-a-molecule_all.html',
    isCustomSim: false,
    status: 'covered',
    keywords: ['chemical formula', 'naming', 'valency', 'compound']
  },
  {
    id: 'f3-08',
    name: 'Balancing Chemical Equations',
    nameCn: '配平化學方程式',
    form: 3,
    category: 'Chemical Reactions',
    description: 'Learn to balance chemical equations to conserve mass.',
    descriptionCn: '學習配平化學方程式以守恆質量。',
    learningObjectives: [
      'Balance simple chemical equations',
      'Apply the law of conservation of mass',
      'Interpret balanced equations'
    ],
    phetUrl: 'https://phet.colorado.edu/sims/html/balancing-chemical-equations/latest/balancing-chemical-equations_all.html',
    isCustomSim: false,
    status: 'covered',
    keywords: ['balancing', 'equation', 'conservation of mass', 'reactants', 'products']
  },
  {
    id: 'f3-09',
    name: 'Reaction Rates',
    nameCn: '反應速率',
    form: 3,
    category: 'Chemical Reactions',
    description: 'Investigate factors that affect the rate of chemical reactions.',
    descriptionCn: '探究影響化學反應速率的因素。',
    learningObjectives: [
      'List factors affecting reaction rate',
      'Explain using collision theory',
      'Plan experiments to test rate factors'
    ],
    phetUrl: 'https://phet.colorado.edu/sims/html/reactions-and-rates/latest/reactions-and-rates_all.html',
    isCustomSim: false,
    status: 'covered',
    keywords: ['reaction rate', 'collision theory', 'temperature', 'concentration', 'catalyst']
  },
  {
    id: 'f3-10',
    name: 'Rocks, Minerals & Metal Extraction',
    nameCn: '岩石、礦物與金屬提煉',
    form: 3,
    category: 'From Atoms to Materials',
    description: 'Learn about types of rocks and how metals are extracted from ores.',
    descriptionCn: '了解岩石的類型以及如何從礦石中提煉金屬。',
    learningObjectives: [
      'Classify rocks (igneous, sedimentary, metamorphic)',
      'Describe extraction of metals from ores',
      'Relate reactivity to extraction method'
    ],
    phetUrl: 'https://phet.colorado.edu/sims/html/reactants-products-and-leftovers/latest/reactants-products-and-leftovers_all.html',
    externalLabUrl: null,
    externalLabName: null,
    isCustomSim: false,
    status: 'partial',
    keywords: ['rock', 'mineral', 'ore', 'extraction', 'smelting', 'reactivity']
  },
  {
    id: 'f3-11',
    name: 'Oxidation & Reduction (Redox)',
    nameCn: '氧化與還原',
    form: 3,
    category: 'Chemical Reactions',
    description: 'Understand oxidation and reduction as electron transfer processes.',
    descriptionCn: '將氧化和還原理解為電子轉移過程。',
    learningObjectives: [
      'Define oxidation and reduction',
      'Identify redox reactions',
      'Relate to rusting and corrosion'
    ],
    phetUrl: null,
    externalLabUrl: 'https://chemcollective.org/vlab/vlab.php',
    externalLabName: 'ChemCollective Virtual Lab',
    isCustomSim: false,
    status: 'partial',
    keywords: ['oxidation', 'reduction', 'redox', 'electron transfer', 'rusting']
  },
  {
    id: 'f3-12',
    name: 'Distillation & Crystallization',
    nameCn: '蒸餾與結晶',
    form: 3,
    category: 'Separation Techniques',
    description: 'Advanced separation techniques for mixtures of liquids and dissolved solids.',
    descriptionCn: '用於分離液體混合物和溶解固體的進階分離技術。',
    learningObjectives: [
      'Describe the distillation process',
      'Explain crystallization technique',
      'Choose appropriate separation methods'
    ],
    phetUrl: null,
    externalLabUrl: 'https://www.olabs.edu.in/?sub=73&brch=8',
    externalLabName: 'Amrita OLabs',
    isCustomSim: false,
    status: 'partial',
    keywords: ['distillation', 'crystallization', 'separation', 'boiling point']
  },
  {
    id: 'f3-13',
    name: 'Density',
    nameCn: '密度',
    form: 3,
    category: 'From Atoms to Materials',
    description: 'Understand density and its relationship to mass and volume.',
    descriptionCn: '了解密度及其與質量和體積的關係。',
    learningObjectives: [
      'Define density (mass/volume)',
      'Calculate density from measurements',
      'Compare densities of different materials'
    ],
    phetUrl: 'https://phet.colorado.edu/sims/html/density/latest/density_all.html',
    isCustomSim: false,
    status: 'covered',
    keywords: ['density', 'mass', 'volume', 'measurement']
  }
];

export function getTopicsByForm(form) {
  return curriculum.filter(t => t.form === form);
}

export function getTopicById(id) {
  return curriculum.find(t => t.id === id);
}

export function getCustomSimTopics() {
  return curriculum.filter(t => t.isCustomSim);
}

export function getCoveredTopics() {
  return curriculum.filter(t => t.status === 'covered');
}

export function getFormStats(form) {
  const topics = getTopicsByForm(form);
  return {
    total: topics.length,
    covered: topics.filter(t => t.status === 'covered').length,
    partial: topics.filter(t => t.status === 'partial').length,
    gap: topics.filter(t => t.status === 'gap').length
  };
}
