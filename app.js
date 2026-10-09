'use strict';

// Keep the video explorer's labels and marker positions with the recovered SCPF data.
const titles = ['Biodiversity', 'Commercial Unit', 'Congestion', 'Direct Emissions', 'Loading Bay/Delivery', 'Non-Motorised', 'Public Transport', 'Resident', 'Street Trees'];
const positions = [[91,88], [11,56], [59,27], [47,41], [91,44], [35,65], [28,24], [92,14], [22,10]];
const markers = document.getElementById('markers');
const choices = document.getElementById('choices');
const video = document.getElementById('video');
const videoSource = document.getElementById('videoSource');
const videoNote = document.getElementById('videoNote');
const videoExamples = {
  0: {
    src: 'assets/biodiversity.mp4?v=7',
    note: 'Five-second illustrative animation: streetworks can affect nearby water and wildlife.'
  },
  1: {
    src: 'assets/commercial-unit.mp4?v=11',
    note: 'Five-second illustrative animation: streetworks can disrupt dining and discourage customers.'
  },
  2: {
    src: 'assets/congestion.mp4?v=14',
    note: 'Five-second illustrative animation: narrowed road space can cause queues and delay traffic.'
  },
  3: {
    src: 'assets/direct-emissions.mp4?v=13',
    note: 'Five-second illustrative animation: construction machinery can release exhaust emissions and excavation can generate dust.'
  },
  4: {
    src: 'assets/loading-bay.mp4?v=6',
    note: 'Five-second illustrative animation: loading activity can interrupt traffic movement.'
  },
  5: {
    src: 'assets/non-motorised.mp4?v=11',
    note: 'Five-second illustrative animation: restricted footways can increase effort and delay for pedestrians, cyclists and people with different access needs.'
  },
  6: {
    src: 'assets/public-transport.mp4?v=12',
    note: 'Five-second illustrative animation: changed bus stops and restricted routes can disrupt passengers’ journeys.'
  },
  7: {
    src: 'assets/resident.mp4?v=9',
    note: 'Five-second illustrative animation: streetworks noise can disrupt residents’ comfort and daily routines.'
  },
  8: {
    src: 'assets/street-trees.mp4?v=12',
    note: 'Five-second illustrative animation: streetworks excavation can disturb tree roots.'
  }
};
const panel = document.getElementById('consequencePanel');
const explored = new Set();
let current = 4;

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[char]));
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
      <div class="layer-heading"><span class="layer-number" aria-hidden="true">${index + 1}</span><h4>${escapeHTML(name)}</h4></div>
      ${elements.length ? `<ul class="layer-elements">${elements.map(entry => {
        const selection = typeof entry === 'string' ? { element: entry } : entry;
        const label = selection.element ? scpfElements[selection.element].label : selection.label;
        return `<li class="layer-element${selection.context ? ' is-context' : ''}">${selection.context ? '<span class="sr-only">Possible related consequence: </span>' : ''}${escapeHTML(label)}${selection.condition ? `<span class="element-condition">${escapeHTML(selection.condition)}</span>` : ''}</li>`;
      }).join('')}</ul>` : '<p class="layer-empty"><span aria-hidden="true">—</span><span class="sr-only">No element selected for this layer.</span></p>'}
    </li>`;
  }).join('')}</ol>`;
}

function renderDetails(impact) {
  return `<section class="spread-box" aria-labelledby="pathwayTitle">
    <h3 id="pathwayTitle">How It Can Spread</h3>
    ${renderElementKey(impact)}${renderPropagationLayers(impact)}</section>
    <section class="step"><h3>What This Can Mean</h3><ul class="effects">${impact.effects.map(effect => `<li>${escapeHTML(effect)}</li>`).join('')}</ul></section>
    <section class="step"><h3>Who Or What May Be Affected</h3><p>${escapeHTML(impact.people)}</p></section>
    <section class="step"><h3>A Question For Planning</h3><p>${escapeHTML(impact.question)}</p></section>
    <section class="step"><h3>Connected Consequences</h3><div class="related">${impact.related.map(index => `<button type="button" data-related="${index}">${escapeHTML(titles[index])}</button>`).join('')}</div></section>
    ${impact.reference ? `<p class="reference"><a href="${escapeHTML(impact.reference.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(impact.reference.label)}</a></p>` : ''}`;
}

titles.forEach((title, index) => {
  const marker = document.createElement('button');
  marker.type = 'button';
  marker.className = 'marker';
  marker.textContent = index + 1;
  marker.style.left = positions[index][0] + '%';
  marker.style.top = positions[index][1] + '%';
  marker.setAttribute('aria-label', `${index + 1}. ${title}`);
  marker.setAttribute('aria-controls', 'consequencePanel');
  marker.dataset.index = index;
  marker.addEventListener('click', () => select(index, true));
  markers.append(marker);
  const choice = document.createElement('button');
  choice.type = 'button';
  choice.className = 'choice';
  choice.textContent = `${index + 1} · ${title}`;
  choice.dataset.index = index;
  choice.setAttribute('aria-controls', 'consequencePanel');
  choice.addEventListener('click', () => select(index, true));
  choices.append(choice);
});

function playVideo() {
  const attempt = video.play();
  if (attempt && typeof attempt.catch === 'function') attempt.catch(() => {});
}

function select(index, play) {
  current = (index + impacts.length) % impacts.length;
  const impact = impacts[current];
  video.pause();
  if (video.readyState) video.currentTime = 0;
  document.getElementById('title').textContent = titles[current];
  document.getElementById('tag').textContent = `Consequence ${current + 1} / ${impacts.length}`;
  document.getElementById('consequenceIntro').textContent = impact.intro;
  const example = videoExamples[current];
  document.getElementById('videoWrap').hidden = !example;
  document.getElementById('pending').hidden = Boolean(example);
  if (example) {
    video.setAttribute('aria-label', `${titles[current]} example`);
    videoNote.textContent = example.note;
    if (videoSource.getAttribute('src') !== example.src) {
      videoSource.setAttribute('src', example.src);
      video.load();
    }
  }
  document.getElementById('details').innerHTML = renderDetails(impact);
  document.getElementById('counter').textContent = `${current + 1} / ${impacts.length}`;
  document.querySelectorAll('[data-index]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.index) === current)));
  explored.add(current);
  document.getElementById('exploredCount').textContent = `${explored.size} / ${impacts.length} Explored`;
  document.getElementById('announcement').textContent = `${titles[current]}. Consequence ${current + 1} of ${impacts.length}. Details updated.`;
  panel.scrollTop = 0;
  if (example && play) playVideo();
}

document.getElementById('details').addEventListener('click', event => {
  const related = event.target.closest('[data-related]');
  if (!related) return;
  select(Number(related.dataset.related), true);
  choices.querySelector(`[data-index="${current}"]`).focus();
});
document.getElementById('replay').addEventListener('click', () => {
  video.currentTime = 0;
  playVideo();
});
document.getElementById('previous').addEventListener('click', () => select(current - 1, true));
document.getElementById('next').addEventListener('click', () => select(current + 1, true));
select(4, false);
