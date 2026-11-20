const trails = [
  { id: 'cedar', name: '雪松溪谷环线', region: '北岭山麓', terrain: '森林', tone: 'forest', km: 5.4, gain: 190, hours: '2–3 小时', level: '轻松', summary: '顺着溪声穿过雪松林，在木桥边停一会儿。', description: '环线经过溪谷、木桥和林间空地。前半程沿溪缓缓爬升，返程通过另一侧的林荫步道返回起点。' },
  { id: 'mirror', name: '镜湖牧场步道', region: '白石高原', terrain: '湖泊', tone: 'lake', km: 7.2, gain: 280, hours: '3 小时', level: '轻松', summary: '越过开阔牧草地，沿湖岸走到山影倒映的地方。', description: '步道从牧场边缘延伸到湖岸，湖边有一段碎石路。折返点是一片略高于水面的草坡，可以看到整片湖面。' },
  { id: 'sun', name: '日光垭口', region: '长风山脉', terrain: '山脊', tone: 'ridge', km: 10.8, gain: 620, hours: '4–5 小时', level: '适中', summary: '穿过矮松和岩坡，在垭口看见两侧的山谷。', description: '路线沿连续缓坡升高，最后一段是视野开阔的碎石坡。登上垭口后沿原路返回。' },
  { id: 'birch', name: '白桦坡穿越', region: '北岭山麓', terrain: '森林', tone: 'forest', km: 9.6, gain: 470, hours: '4 小时', level: '适中', summary: '穿过白桦林和草甸，沿旧牧道走到山脚。', description: '这条点到点步道以缓坡为主，连接山谷的两个入口。中段有一片面向西坡的开阔草甸。' },
  { id: 'stone', name: '石塔峰往返', region: '长风山脉', terrain: '山脊', tone: 'ridge', km: 14.3, gain: 980, hours: '6–7 小时', level: '挑战', summary: '沿高处的岩脊前进，越过有风的碎石坡。', description: '后半段持续爬升并经过露天岩脊。线路以山顶石塔为折返点，沿原路下撤。' },
  { id: 'blue', name: '蓝湾湖畔小径', region: '白石高原', terrain: '湖泊', tone: 'lake', km: 3.8, gain: 85, hours: '1–2 小时', level: '轻松', summary: '绕过芦苇湾，在临水平台看湖面换色。', description: '平缓的观景步道连接两段湖岸木栈道。靠近终点的临水平台视野最开阔。' },
];

const storageKey = 'ridge-atlas:favorites';
const form = document.querySelector('#filters');
const query = document.querySelector('#query');
const difficulty = document.querySelector('#difficulty');
const distance = document.querySelector('#distance');
const list = document.querySelector('#route-list');
const template = document.querySelector('#route-template');
const savedToggle = document.querySelector('.saved-toggle');
const dialog = document.querySelector('#route-dialog');
let savedOnly = false;

function readSaved() {
  try {
    const ids = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
    return new Set(Array.isArray(ids) ? ids.filter(id => trails.some(trail => trail.id === id)) : []);
  } catch {
    return new Set();
  }
}

const saved = readSaved();

function showTrail(trail) {
  dialog.querySelector('#dialog-region').textContent = trail.region;
  dialog.querySelector('#dialog-title').textContent = trail.name;
  dialog.querySelector('#dialog-meta').textContent = [trail.level, trail.km + ' 公里', '爬升 ' + trail.gain + ' 米', trail.hours].join(' · ');
  dialog.querySelector('#dialog-description').textContent = trail.description;
  dialog.showModal();
}

function updateFavorite(button, trail) {
  const active = saved.has(trail.id);
  button.textContent = active ? '已收藏' : '收藏';
  button.setAttribute('aria-label', (active ? '取消收藏' : '收藏') + trail.name);
  button.setAttribute('aria-pressed', String(active));
}

function cardFor(trail) {
  const card = template.content.firstElementChild.cloneNode(true);
  card.classList.add(trail.tone);
  card.querySelector('.terrain').textContent = trail.terrain;
  card.querySelector('.region').textContent = trail.region;
  card.querySelector('h3').textContent = trail.name;
  card.querySelector('.summary').textContent = trail.summary;
  card.querySelector('.length').textContent = trail.km + ' km';
  card.querySelector('.gain').textContent = trail.gain + ' m';
  card.querySelector('.level').textContent = trail.level;
  const details = card.querySelector('.details');
  details.setAttribute('aria-label', '查看路线：' + trail.name);
  details.addEventListener('click', () => showTrail(trail));
  const favorite = card.querySelector('.favorite');
  updateFavorite(favorite, trail);
  favorite.addEventListener('click', () => {
    if (saved.has(trail.id)) saved.delete(trail.id);
    else saved.add(trail.id);
    try {
      localStorage.setItem(storageKey, JSON.stringify([...saved]));
    } catch {
      // The current session can still use favorites when storage is unavailable.
    }
    if (savedOnly) {
      render();
      savedToggle.focus();
    } else {
      updateFavorite(favorite, trail);
      document.querySelector('#saved-count').textContent = saved.size;
    }
  });
  return card;
}

function render() {
  const search = query.value.trim().toLowerCase();
  const visible = trails.filter(trail => {
    const searchable = [trail.name, trail.region, trail.terrain].join(' ').toLowerCase();
    return (!savedOnly || saved.has(trail.id))
      && (!difficulty.value || trail.level === difficulty.value)
      && (!distance.value || trail.km <= Number(distance.value))
      && searchable.includes(search);
  });

  document.querySelector('#routes-title').textContent = savedOnly ? '我的收藏' : '发现路线';
  document.querySelector('#result-count').textContent = '共 ' + visible.length + ' 条路线';
  document.querySelector('#saved-count').textContent = saved.size;
  savedToggle.setAttribute('aria-pressed', String(savedOnly));
  list.replaceChildren(...visible.map(cardFor));
  if (visible.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty';
    empty.textContent = savedOnly && saved.size === 0 ? '还没有收藏的路线。' : '没有符合筛选条件的路线。';
    list.append(empty);
  }
}

form.addEventListener('submit', event => event.preventDefault());
form.addEventListener('input', render);
form.addEventListener('reset', () => queueMicrotask(render));
savedToggle.addEventListener('click', () => {
  savedOnly = !savedOnly;
  render();
  document.querySelector('#routes').scrollIntoView();
});
document.querySelector('.hero-link').addEventListener('click', () => {
  if (!savedOnly) return;
  savedOnly = false;
  render();
});
render();
