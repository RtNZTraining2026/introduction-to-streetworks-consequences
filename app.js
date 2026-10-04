'use strict';

const propagationLayerNames = [
  'Intervention',
  'Immediate Physical Disturbance',
  'System Response',
  'Human / System Adaptation',
  'Observed Operational Outcomes',
  'Hidden / Secondary Consequences'
];

// Elements retain their Figure 7 layer allocation. Display wording uses "consequences".
const scpfElements = {
  excavation: { label: 'Excavation / Construction Activity', layer: 1 },
  trafficManagement: { label: 'Temporary Traffic Management', layer: 1 },
  siteMobility: { label: 'Construction Vehicle / Site Mobility', layer: 1 },
  roadspace: { label: 'Reduced Carriageway Space', layer: 2 },
  parkingLoss: { label: 'Parking / Loading Bay Loss', layer: 2 },
  footwayDisturbance: { label: 'Footway Obstruction / Disturbance', layer: 2 },
  noiseGeneration: { label: 'Construction Noise Generation', layer: 2 },
  dustRelease: { label: 'Dust And Air Pollutant Release', layer: 2 },
  junctionCapacity: { label: 'Reduced Junction Capacity', layer: 3 },
  trafficDisruption: { label: 'Traffic Flow Disruption', layer: 3 },
  accessDisruption: { label: 'Accessibility Disruption', layer: 3 },
  transportReliability: { label: 'Public Transport Reliability Degradation', layer: 3 },
  pedestrianRedistribution: { label: 'Pedestrian Flow Redistribution', layer: 3 },
  avoidance: { label: 'Driver / Pedestrian Avoidance', layer: 4 },
  rerouting: { label: 'Diversion / Rerouting', layer: 4 },
  modeShift: { label: 'Mode Shift', layer: 4 },
  tripRescheduling: { label: 'Trip Rescheduling', layer: 4 },
  reducedVisits: { label: 'Reduced Visits To High Street', layer: 4 },
  businessAdaptation: { label: 'Business Operational Adaptation', layer: 4 },
  trafficVolume: { label: 'Traffic Volume Change', layer: 5 },
  delayQueues: { label: 'Delay / LOS / Queue Condition Change', layer: 5 },
  vehicleEmissions: { label: 'Vehicle Emission Change', layer: 5 },
  noiseExposure: { label: 'Noise Exposure Level', layer: 5 },
  pedestrianVolume: { label: 'Pedestrian Volume Change', layer: 5 },
  businessActivity: { label: 'Business Activity Change', layer: 5 },
  suppressedDemand: { label: 'Suppressed Demand Masking Disruption', layer: 6 },
  transfer: { label: 'Consequences Transferred To Other Locations / Time / Place', layer: 6 },
  longTermBehaviour: { label: 'Long-Term Behavioural Change', layer: 6 },
  widerCommunity: { label: 'Wider Economic And Community Consequences', layer: 6 },
  cumulative: { label: 'Cumulative Consequences With Other Projects', layer: 6 }
};

// Percentages keep each point anchored to its feature as the illustration scales.
// Training examples follow Figure 7 and Table A6 of the author's full SCPF draft.
// Ecological pathways are context-specific extensions, outside the retained core map.
const impacts = [
  {
    title: 'Biodiversity Consequences', short: 'Biodiversity Consequences', x: 86, y: 86, edge: 'edge-right',
    intro: 'Streetworks can affect biodiversity through sediment runoff, water pollution and disturbance to nearby habitats. Increased turbidity and contaminants can threaten fish and aquatic life, while construction noise and vegetation loss may displace ducks and other wildlife, potentially causing longer-term habitat degradation and reduced local biodiversity.',
    layers: [
      ['excavation'],
      [{ label: 'Soil Disturbance' }, { label: 'Sediment / Contaminated Runoff' }, { label: 'Vegetation / Habitat Disturbance' }],
      [{ label: 'Water Quality Change' }, { label: 'Receiving Habitat Disturbance' }],
      [{ label: 'Wildlife Displacement' }],
      [{ label: 'Aquatic Life Condition Change' }, { label: 'Wildlife Activity Change' }],
      [{ label: 'Longer-Term Habitat Degradation' }, { label: 'Reduced Local Biodiversity' }]
    ],
    extension: true,
    effects: ['Sediment or contaminated runoff can enter drains and nearby water bodies.', 'Changes to water movement or quality can affect aquatic habitats.', 'Noise, lighting and activity can disturb wildlife; the effect depends on the habitat and species present.'],
    people: 'Aquatic life, birds, other wildlife and people who use and care for local green and blue spaces.',
    question: 'Where does water leaving the work site go, and what habitats could it reach?',
    related: [3, 8]
  },
  {
    title: 'Commercial Unit Consequences', short: 'Commercial Unit Consequences', x: 9, y: 63, edge: 'edge-left',
    intro: 'Streetworks can compromise the dining experience by interrupting conversations, reducing comfort and making outdoor seating less attractive. Restricted access and an unpleasant environment may discourage customers, shorten visits and reduce passing trade, resulting in lost revenue and wider consequences for business viability.',
    layers: [
      ['trafficManagement', { element: 'excavation', context: true }],
      ['parkingLoss', 'footwayDisturbance', { element: 'noiseGeneration', context: true }],
      ['accessDisruption', 'pedestrianRedistribution'],
      ['businessAdaptation', 'reducedVisits'],
      ['businessActivity', 'pedestrianVolume'],
      ['widerCommunity']
    ],
    effects: ['Difficult access or an unclear entrance can deter visits.', 'Noise and dust can affect customer comfort and the use of outdoor seating.', 'An open business does not establish that its usual activity or customer access has been maintained.'],
    people: 'Business owners, employees, customers and people who rely on the commercial unit’s services.',
    question: 'Can customers find and use the premises, and how might the business need to adapt?',
    related: [4, 5, 7]
  },
  {
    title: 'Congestion Consequences', short: 'Congestion Consequences', x: 75, y: 22,
    intro: 'Streetworks can intensify congestion through lane restrictions, temporary traffic signals and disrupted traffic flow. Conflicting movements and unclear priority increase delays, queues and near-miss risks, while restricted manoeuvring space can obstruct emergency vehicles, including ambulances, delaying response times and potentially compromising patient safety.',
    layers: [
      ['trafficManagement'],
      ['roadspace', { element: 'parkingLoss', context: true }, { element: 'footwayDisturbance', context: true }],
      ['junctionCapacity', 'trafficDisruption'],
      ['avoidance', 'rerouting', 'tripRescheduling'],
      ['trafficVolume', 'delayQueues', 'vehicleEmissions'],
      ['suppressedDemand', 'transfer', 'cumulative']
    ],
    effects: ['Travel times can become longer and less predictable.', 'Diverted traffic can place additional pressure on neighbouring streets.', 'A quieter work-site street may reflect adaptation or reduced demand; it does not establish that disruption has disappeared.'],
    people: 'Drivers, passengers, people travelling for work, and residents on diversion routes.',
    question: 'Where might traffic go, and which journeys could be affected outside the work-site boundary?',
    related: [3, 4, 6]
  },
  {
    title: 'Direct Emission Consequences', short: 'Direct Emission Consequences', x: 42, y: 40,
    intro: 'Diesel-powered excavators, generators and construction vehicles produce direct emissions of CO₂, NOx and fine particulate matter (PM2.5). Prolonged operation and idling increase fuel consumption and contribute to local air pollution, exposing nearby residents and street users to harmful pollutants while adding to the carbon footprint of streetworks.',
    layers: [
      ['excavation'],
      ['dustRelease'],
      ['pedestrianRedistribution'],
      ['reducedVisits'],
      ['pedestrianVolume'],
      ['widerCommunity']
    ],
    effects: ['Dust can affect nearby footways, properties and outdoor areas.', 'The location and timing of work activity influence where emissions are released.', 'Source-emission estimates do not directly establish roadside concentrations or individual exposure.'],
    people: 'Workers, residents, pedestrians, cyclists and people with respiratory conditions.',
    question: 'Where could emissions from the work activity reach people, and how will releases be managed?',
    related: [0, 2, 7]
  },
  {
    title: 'Loading Bay Delivery Consequences', short: 'Loading Bay Delivery Consequences', x: 94, y: 50, edge: 'edge-right',
    intro: 'Suspended loading bays can force delivery vehicles to stop further away or obstruct traffic, increasing congestion and safety risks. Longer delivery routes and restricted access can disrupt business operations, delay deliveries and increase logistics costs.',
    layers: [
      ['trafficManagement', 'siteMobility'],
      ['parkingLoss'],
      ['accessDisruption'],
      ['businessAdaptation'],
      ['businessActivity'],
      ['widerCommunity']
    ],
    effects: ['A longer handling route can increase delivery time and effort.', 'Displaced loading can affect traffic movement or pedestrian and cycle routes.', 'Rescheduling and extra handling may conceal the disruption in records that only show whether a delivery was completed.'],
    people: 'Delivery drivers, business owners, employees and street users near loading activity.',
    question: 'Where can delivery vehicles stop, and can goods move safely from the vehicle to the premises?',
    related: [1, 2, 5]
  },
  {
    title: 'Non-Motorised Consequences', short: 'Non-Motorised Consequences', x: 35, y: 74,
    intro: 'Streetworks can create uneven surfaces, narrow diversions and physical barriers that restrict pedestrian and cycling access, particularly for disabled people and those with reduced mobility. Exposure to noise, dust and traffic further reduces comfort and safety, creating unequal accessibility and increasing the risk of social exclusion.',
    layers: [
      ['trafficManagement'],
      ['footwayDisturbance', { element: 'roadspace', context: true }],
      ['pedestrianRedistribution', { element: 'accessDisruption', context: true }],
      ['reducedVisits'],
      ['pedestrianVolume'],
      ['widerCommunity']
    ],
    effects: ['Wheelchair users and people with pushchairs may struggle with narrow routes, steps or uneven surfaces.', 'A longer or unfamiliar route can be difficult for people with visual impairments or limited mobility.', 'Cyclists and pedestrians may be brought closer to moving traffic or delivery activity.'],
    people: 'Pedestrians, cyclists, wheelchair users, people with visual impairments, older people and families with pushchairs.',
    question: 'Is there a continuous, usable route for people with different mobility and access needs?',
    related: [1, 4, 6]
  },
  {
    title: 'Public Transport Consequences', short: 'Public Transport Consequences', x: 42, y: 24,
    intro: 'Streetworks can disrupt bus users by relocating stops, obscuring wayfinding and creating uncertainty around temporary boarding points. Confusing rerouting, together with exposure to dust and vehicle fumes, can increase discomfort, delay journeys and reduce the accessibility and reliability of public transport.',
    layers: [
      ['trafficManagement', 'siteMobility'],
      ['parkingLoss'],
      ['transportReliability'],
      [{ element: 'modeShift', condition: 'Where Alternatives Exist' }],
      [{ label: 'Passenger Waiting Time Change', context: true }, { label: 'Bus Journey Time Change', context: true }, { label: 'Bus Patronage Change', context: true }],
      [{ label: 'Longer-Term Travel Habit Change', context: true }, { label: 'Reduced Access To Work, Education Or Appointments', context: true }, { label: 'Disruption Shifted To Other Routes Or Times', context: true }]
    ],
    effects: ['Queues and temporary signals can make service timings less reliable.', 'Relocated stops can increase walking distance or make boarding more difficult.', 'An unreliable connection can affect access to work, education and appointments.'],
    people: 'Bus passengers, operators and people who rely on public transport for essential journeys.',
    question: 'Can passengers still reach and use the service, including when stops are temporarily relocated?',
    related: [2, 5, 7]
  },
  {
    title: 'Resident Consequences', short: 'Resident Consequences', x: 16, y: 12, edge: 'edge-left edge-top',
    intro: 'Streetworks noise is often intermittent and unpredictable, intensifying annoyance and sleep disturbance, particularly for shift workers and families. The WHO recognises these as adverse health outcomes, with prolonged exposure potentially leading to longer-term health and economic costs.',
    layers: [
      ['excavation'],
      ['noiseGeneration'],
      [{ element: 'pedestrianRedistribution', context: true }],
      [{ element: 'reducedVisits', context: true }],
      ['noiseExposure', { element: 'pedestrianVolume', context: true }],
      ['widerCommunity']
    ],
    effects: ['Intermittent digging, vehicle movements and horns can interrupt conversations or concentration.', 'Activities during usual rest periods can disturb sleep, including daytime sleep for shift workers.', 'Timing, duration and personal circumstances influence the effect; a noise level alone does not describe every consequence.'],
    people: 'Nearby residents, children, shift workers and people working or studying at home.',
    question: 'Who is at home during the works, and what support or access arrangements might they need?',
    related: [2, 3, 5],
    reference: {label: 'WHO: Burden Of Disease From Environmental Noise', url: 'https://www.who.int/europe/publications/i/item/9789289002295'}
  },
  {
    title: 'Street Trees Consequences', short: 'Street Trees Consequences', x: 84, y: 17, edge: 'edge-right',
    intro: 'Streetworks can generate short, high-intensity emissions of fine particulate matter, dust and exhaust fumes, alongside intermittent noise and vibration, affecting local air quality and public health. Excavation near street trees can damage roots, restrict water and nutrient uptake, and compromise tree health and stability, potentially leading to tree loss.',
    layers: [
      ['excavation', 'siteMobility'],
      [{ label: 'Root Damage' }, { label: 'Soil Compaction' }],
      [{ label: 'Reduced Water / Nutrient Uptake' }, { label: 'Impaired Structural Support' }],
      [{ label: 'Additional Tree Care And Monitoring', context: true }, { label: 'Revised Excavation Or Vehicle Routes', context: true }],
      [{ label: 'Tree Condition Change' }],
      [{ label: 'Delayed Tree Decline, Instability Or Loss' }]
    ],
    extension: true,
    effects: ['Severed roots can reduce a tree’s ability to take up water and nutrients.', 'Damage to structural roots can affect stability.', 'An apparently intact canopy does not establish that the roots beneath the street are undamaged.'],
    people: 'Street trees and the people and habitats around them.',
    question: 'Where might roots extend, and how will excavation, storage and vehicle movement protect them?',
    related: [0, 5, 7],
    reference: {label: 'Forest Research: Tree Roots And Trenching', url: 'https://www.forestresearch.gov.uk/tools-and-resources/fthr/urban-regeneration-and-greenspace-partnership/practical-considerations-and-challenges-to-greenspace/tree-roots-and-trenching/'}
  }
];

const hotspotContainer = document.getElementById('hotspots');
const impactList = document.getElementById('impact-list');
const content = document.getElementById('detail-content');
const detailScroll = document.getElementById('detail-scroll');
const scene = document.getElementById('scene');
const labelToggle = document.getElementById('label-toggle');
let currentIndex = 0;
const explored = new Set();

function escapeHTML(text) {
  return text.replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}

function renderElementKey(impact) {
  const hasEmptyLayer = impact.layers.some(elements => elements.length === 0);
  return `<div class="element-key" role="note" aria-label="Element colour key">
    <ul class="element-key-items">
      <li><span class="element-key-swatch" aria-hidden="true"></span><span>Green: Consequence Propagation Elements Illustrated In Literature</span></li>
      <li><span class="element-key-swatch related-swatch" aria-hidden="true"></span><span>White: Possible Related Consequences</span></li>
    </ul>
    <p class="element-key-note">Colour shows the roles in this example.</p>
    ${hasEmptyLayer ? '<p class="element-key-note">A dash means no element is shown for this stage.</p>' : ''}
  </div>`;
}

function renderPropagationLayers(impact) {
  return `<ol class="propagation-layers">${propagationLayerNames.map((name, index) => {
    const elements = impact.layers[index];
    return `<li class="propagation-layer${elements.length ? '' : ' unfilled'}">
      <div class="layer-heading"><span class="layer-number" aria-hidden="true">${index + 1}</span><h5>${escapeHTML(name)}</h5></div>
      ${elements.length ? `<ul class="layer-elements">${elements.map(entry => {
        const selection = typeof entry === 'string' ? { element: entry } : entry;
        const label = selection.element ? scpfElements[selection.element].label : selection.label;
        return `<li class="layer-element${selection.context ? ' is-context' : ''}">${selection.context ? '<span class="sr-only">Possible related consequence: </span>' : ''}${escapeHTML(label)}${selection.condition ? `<span class="element-condition">${escapeHTML(selection.condition)}</span>` : ''}</li>`;
      }).join('')}</ul>` : '<p class="layer-empty"><span aria-hidden="true">—</span><span class="sr-only">No element selected for this layer.</span></p>'}
    </li>`;
  }).join('')}</ol>`;
}

impacts.forEach((impact, index) => {
  const hotspot = document.createElement('button');
  hotspot.type = 'button';
  hotspot.className = 'hotspot ' + (impact.edge || '');
  hotspot.style.setProperty('--x', impact.x + '%');
  hotspot.style.setProperty('--y', impact.y + '%');
  hotspot.setAttribute('aria-label', `${index + 1}. ${impact.title}: show details beside the illustration`);
  hotspot.setAttribute('aria-controls', 'detail-content');
  hotspot.setAttribute('aria-pressed', 'false');
  hotspot.dataset.impact = String(index);
  hotspot.innerHTML = `<span aria-hidden="true">${index + 1}</span><span class="hotspot-label" aria-hidden="true">${escapeHTML(impact.short)}</span>`;
  hotspotContainer.appendChild(hotspot);

  const item = document.createElement('li');
  item.innerHTML = `<button type="button" data-impact="${index}" aria-label="${index + 1}. ${escapeHTML(impact.title)}" aria-controls="detail-content" aria-pressed="false"><span class="picker-number" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span><span>${escapeHTML(impact.title)}</span></button>`;
  impactList.appendChild(item);
});

function renderImpact(index) {
  currentIndex = (index + impacts.length) % impacts.length;
  const impact = impacts[currentIndex];
  content.innerHTML = `
    <div class="detail-kicker"><span>Consequence ${String(currentIndex + 1).padStart(2, '0')}</span><span class="planning-lens">Planning Lens</span></div>
    <h3 class="detail-title" id="detail-title">${escapeHTML(impact.title)}</h3>
    <p class="detail-intro" id="detail-intro">${escapeHTML(impact.intro)}</p>
    <section class="spread-box" aria-labelledby="pathway-title">
      <h4 id="pathway-title">How It Can Spread</h4>
      ${renderElementKey(impact)}
      ${renderPropagationLayers(impact)}
    </section>
    <section class="detail-section" aria-labelledby="effects-title"><h4 id="effects-title">What This Can Mean</h4><ul class="effects">${impact.effects.map(effect => `<li>${escapeHTML(effect)}</li>`).join('')}</ul></section>
    <section class="detail-section" aria-labelledby="people-title"><h4 id="people-title">Who Or What May Be Affected</h4><p class="people">${escapeHTML(impact.people)}</p></section>
    <div class="planning-question"><h4>A Question For Planning</h4><p>${escapeHTML(impact.question)}</p></div>
    <section class="detail-section" aria-labelledby="related-title"><h4 id="related-title">Connected Consequences</h4><div class="related">${impact.related.map(i => `<button type="button" data-related="${i}">${escapeHTML(impacts[i].title)}</button>`).join('')}</div></section>
    ${impact.reference ? `<p class="detail-reference"><a href="${escapeHTML(impact.reference.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(impact.reference.label)}</a></p>` : ''}`;
  explored.add(currentIndex);
  document.getElementById('explored-count').textContent = `${explored.size} / ${impacts.length} explored`;
  document.getElementById('impact-counter').textContent = `${currentIndex + 1} of ${impacts.length}`;
  detailScroll.scrollTop = 0;
  document.querySelectorAll('[data-impact]').forEach(button => {
    const selected = Number(button.dataset.impact) === currentIndex;
    button.setAttribute('aria-pressed', String(selected));
    button.classList.toggle('selected', selected);
  });
  document.getElementById('impact-announcement').textContent = `Consequence ${currentIndex + 1} of ${impacts.length}: ${impact.title}. Details updated.`;
}

document.querySelectorAll('[data-impact]').forEach(button => {
  const index = Number(button.dataset.impact);
  button.addEventListener('click', () => renderImpact(index));
  const highlight = enabled => document.querySelectorAll(`[data-impact="${index}"]`).forEach(el => el.classList.toggle('highlighted', enabled));
  button.addEventListener('mouseenter', () => highlight(true));
  button.addEventListener('mouseleave', () => highlight(false));
  button.addEventListener('focus', () => highlight(true));
  button.addEventListener('blur', () => highlight(false));
});

labelToggle.addEventListener('click', () => {
  const enabled = labelToggle.getAttribute('aria-pressed') !== 'true';
  labelToggle.setAttribute('aria-pressed', String(enabled));
  labelToggle.querySelector('span').textContent = enabled ? 'Hide Labels' : 'Show Labels';
  scene.classList.toggle('show-labels', enabled);
});

content.addEventListener('click', event => {
  const related = event.target.closest('[data-related]');
  if (related) {
    renderImpact(Number(related.dataset.related));
    // Move focus to the persistent selector because the related button is replaced.
    impactList.querySelector(`[data-impact="${currentIndex}"]`).focus();
  }
});
document.getElementById('previous-impact').addEventListener('click', () => renderImpact(currentIndex - 1));
document.getElementById('next-impact').addEventListener('click', () => renderImpact(currentIndex + 1));

renderImpact(0);
