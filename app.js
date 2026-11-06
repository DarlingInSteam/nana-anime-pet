const canvas = document.querySelector('#pet');
const context = canvas.getContext('2d');
const select = document.querySelector('#animation');
const pauseButton = document.querySelector('#pause');
const stage = document.querySelector('#stage');
const stateLabel = document.querySelector('#state-label');
const hint = document.querySelector('#hint');
const size = document.querySelector('#size');
const sizeValue = document.querySelector('#size-value');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let paused = reducedMotion.matches;

size.addEventListener('input', () => {
  canvas.style.setProperty('--pet-width', `${192 * Number(size.value) / 100}px`);
  sizeValue.value = `${size.value}%`;
});

async function start() {
  const response = await fetch('pet.json');
  if (!response.ok) throw new Error('Could not load animation data.');
  const pet = await response.json();
  const image = new Image();
  image.src = pet.spritesheet;
  await image.decode();
  for (const state of pet.animations) select.add(new Option(state.label, state.id));
  select.add(new Option('Cursor tracking', 'gaze'));
  select.disabled = false;
  pauseButton.disabled = false;
  let state = pet.animations[0];
  let frame = 0;
  let lastTime = performance.now();
  let elapsed = 0;

  function draw(row, column) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, column * pet.cell.width, row * pet.cell.height,
      pet.cell.width, pet.cell.height, 0, 0, canvas.width, canvas.height);
  }

  function updatePauseLabel() {
    pauseButton.textContent = paused ? 'Resume' : 'Pause';
    pauseButton.setAttribute('aria-pressed', String(paused));
  }

  select.addEventListener('change', () => {
    frame = 0;
    elapsed = 0;
    if (select.value === 'gaze') {
      pauseButton.disabled = true;
      stateLabel.textContent = 'Cursor tracking';
      hint.textContent = 'Move the pointer or touch the area around Nana';
      draw(0, 0);
    } else {
      state = pet.animations.find(item => item.id === select.value);
      stateLabel.textContent = state.label;
      hint.textContent = 'Select an animation or enable cursor tracking';
      pauseButton.disabled = false;
      draw(state.row, frame);
    }
  });

  pauseButton.addEventListener('click', () => {
    paused = !paused;
    elapsed = 0;
    updatePauseLabel();
  });

  stage.addEventListener('pointermove', event => {
    if (select.value !== 'gaze') return;
    const bounds = canvas.getBoundingClientRect();
    const dx = event.clientX - (bounds.left + bounds.width / 2);
    const dy = event.clientY - (bounds.top + bounds.height * 0.38);
    if (Math.hypot(dx, dy) < 24) return draw(0, 0);
    const angle = (Math.atan2(dx, -dy) * 180 / Math.PI + 360) % 360;
    const direction = Math.round(angle / 22.5) % 16;
    draw(9 + Math.floor(direction / 8), direction % 8);
  });
  stage.addEventListener('pointerleave', () => {
    if (select.value === 'gaze') draw(0, 0);
  });

  function animate(time) {
    const delta = Math.min(time - lastTime, 250);
    lastTime = time;
    if (!paused && select.value !== 'gaze') {
      elapsed += delta;
      while (elapsed >= state.durations[frame]) {
        elapsed -= state.durations[frame];
        frame = (frame + 1) % state.durations.length;
      }
      draw(state.row, frame);
    }
    requestAnimationFrame(animate);
  }
  stateLabel.textContent = state.label;
  updatePauseLabel();
  draw(0, 0);
  requestAnimationFrame(animate);
}

start().catch(error => {
  const message = document.querySelector('#error');
  message.textContent = `${error.message} Serve the demo locally or view the GIF in the README.`;
  message.hidden = false;
  stateLabel.textContent = 'Loading error';
});
