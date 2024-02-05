const lblPending = document.querySelector('#lbl-pending');
const header = document.querySelector('h1');
const noMoreAlert = document.querySelector('.alert');
const btnDraw = document.querySelector('#btn-draw');
const btnDone = document.querySelector('#btn-done');
const currentTicketSpan = document.querySelector('small');

const searchParams = new URLSearchParams(window.location.search);
if (!searchParams.has('escritorio')) {
    window.location = 'index.html';
    throw new Error('Desk is required');
}

const deskNumber = searchParams.get('escritorio');
let currentTicket = null;
header.innerText = `${deskNumber}`;

function checkTicketCount(currentCount = 0) {
    if (currentCount === 0) {
        noMoreAlert.classList.remove('d-none');
    } else {
        noMoreAlert.classList.add('d-none');
    }
    lblPending.innerText = currentCount;
}

async function loadInitialCount() {
    const pending = await fetch('/api/tickets/pending').then(res => res.json());
    checkTicketCount(pending.length);
}

async function getTicket() {
    await finishTicket();
    const { status, ticket } = await fetch(`/api/tickets/draw/${deskNumber}`).then(res => res.json());
    if (status === 'error') {
        currentTicketSpan.innerText = 'No more tickets';
        return;
    }
    currentTicket = ticket;
    currentTicketSpan.innerText = `Ticket ${ticket.number}`;
}

async function finishTicket() {
    if (!currentTicket) return;
    const { status } = await fetch(`/api/tickets/done/${currentTicket.id}`, {
        method: 'PUT'
    }).then(res => res.json());
    if (status === 'ok') {
        currentTicket = null;
        currentTicketSpan.innerText = '---';
    }
}

function connectToWebSockets() {

    const socket = new WebSocket('ws://localhost:3000/ws');
    socket.onmessage = (event) => {
        const { type, payload } = JSON.parse(event.data);
        if (type !== 'on-ticket-count-changed') return;
        checkTicketCount(payload);
    };

    socket.onclose = (event) => {
        console.log('Connection closed');
        setTimeout(() => {
            console.log('retrying to connect');
            connectToWebSockets();
        }, 1500);

    };

    socket.onopen = (event) => {
        console.log('Connected');
    };

}

btnDraw.addEventListener('click', getTicket);
btnDone.addEventListener('click', finishTicket);
loadInitialCount();
connectToWebSockets();