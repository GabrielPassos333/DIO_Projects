// Funções utilitárias para manipular os itens
let itens = ["Exemplo 1", "Exemplo 2", "Exemplo 3"];
let editIndex = null;
let girando = false;
let anguloAtual = 0;

const itemList = document.getElementById('item-list');
const itemInput = document.getElementById('item-input');
const addItemBtn = document.getElementById('add-item');
const roletaCanvas = document.getElementById('roleta');
const girarBtn = document.getElementById('girar');
const resultadoDiv = document.getElementById('resultado');

function renderItens() {
    itemList.innerHTML = '';
    itens.forEach((item, idx) => {
        const li = document.createElement('li');
        const span = document.createElement('span');
        span.textContent = item;
        li.appendChild(span);

        const actions = document.createElement('div');
        actions.className = 'actions';

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Editar';
        editBtn.className = 'edit';
        editBtn.onclick = () => {
            itemInput.value = item;
            editIndex = idx;
            addItemBtn.textContent = 'Salvar';
        };
        actions.appendChild(editBtn);

        const delBtn = document.createElement('button');
        delBtn.textContent = 'Apagar';
        delBtn.onclick = () => {
            itens.splice(idx, 1);
            renderItens();
            desenharRoleta();
        };
        actions.appendChild(delBtn);

        li.appendChild(actions);
        itemList.appendChild(li);
    });
}

addItemBtn.onclick = () => {
    const valor = itemInput.value.trim();
    if (!valor) return;
    if (editIndex !== null) {
        itens[editIndex] = valor;
        editIndex = null;
        addItemBtn.textContent = 'Adicionar';
    } else {
        itens.push(valor);
    }
    itemInput.value = '';
    renderItens();
    desenharRoleta();
};

itemInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addItemBtn.click();
});

function desenharRoleta() {
    const ctx = roletaCanvas.getContext('2d');
    const w = roletaCanvas.width;
    const h = roletaCanvas.height;
    ctx.clearRect(0, 0, w, h);
    const raio = w/2 - 10;
    const cx = w/2, cy = h/2;
    const n = itens.length;
    if (n === 0) return;
    const angulo = 2 * Math.PI / n;
    for (let i = 0; i < n; i++) {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, raio, anguloAtual + i*angulo, anguloAtual + (i+1)*angulo);
        ctx.closePath();
        ctx.fillStyle = i % 2 === 0 ? '#f39c12' : '#e67e22';
        ctx.fill();
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(anguloAtual + (i+0.5)*angulo);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 18px Arial';
        ctx.fillText(itens[i], raio-10, 8);
        ctx.restore();
    }
    // Desenhar seta
    ctx.save();
    ctx.translate(cx, cy);
    ctx.beginPath();
    ctx.moveTo(0, -raio-5);
    ctx.lineTo(-12, -raio-30);
    ctx.lineTo(12, -raio-30);
    ctx.closePath();
    ctx.fillStyle = '#c0392b';
    ctx.fill();
    ctx.restore();
}

function girarRoleta() {
    if (girando || itens.length === 0) return;
    girando = true;
    resultadoDiv.textContent = '';
    const n = itens.length;
    const anguloPorItem = 2 * Math.PI / n;
    const giroFinal = Math.random() * 2 * Math.PI + 10 * 2 * Math.PI;
    const duracao = 3500; // ms
    const inicio = performance.now();
    function animar(now) {
        const t = Math.min((now - inicio) / duracao, 1);
        const ease = t < 1 ? 1 - Math.pow(1-t, 3) : 0;
        anguloAtual = giroFinal * ease;
        desenharRoleta();
        if (t < 1) {
            requestAnimationFrame(animar);
        } else {
            anguloAtual = giroFinal % (2*Math.PI);
            desenharRoleta();
            const idx = n - Math.floor((anguloAtual + anguloPorItem/2) / anguloPorItem) % n;
            resultadoDiv.textContent = `Resultado: ${itens[idx % n]}`;
            girando = false;
        }
    }
    requestAnimationFrame(animar);
}

girarBtn.onclick = girarRoleta;

window.onload = () => {
    renderItens();
    desenharRoleta();
};
