const currentTicketSpan = document.querySelector('span');
const createTicketButton = document.querySelector('button');

async function getLastTicket() {
    const resp = await fetch('/api/tickets/last').then(res => res.json());
    currentTicketSpan.innerText = resp;
}

async function createTicket() {
    const resp = await fetch('/api/tickets', {
        method: 'POST'
    }).then(res => res.json());
    currentTicketSpan.innerText = resp.number;
}

createTicketButton.addEventListener('click', createTicket);
getLastTicket();