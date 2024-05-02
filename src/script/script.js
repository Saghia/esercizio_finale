const reservationTime = document.getElementById("reservationTime");
const reservationData = document.getElementById("reservationData");
const reservationPeople = document.getElementById("reservationPeople");
const reservationCheck = document.getElementById("reservationCheck");
const reservationCheckSection = document.getElementById(
  "reservationCheckSection"
);
const reservationConfirm = document.getElementById("reservationConfirm");
const reservationConfirmSection = document.getElementById(
  "reservationConfirmSection"
);
const errorMessage = document.getElementById("errorMessage");
const reservationsStoric = document.getElementById("reservationsStoric");
let disponibile = false;

const endpoint = "http://localhost:8000/";
let reservationsMade = [];

reservationCheck.addEventListener("click", () => {
  checkReservation();
});

reservationConfirm.addEventListener("click", () => {
  confirmReservation();
});

const setErrorMessagge = (message, error = true) => {
  if (error) {
    errorMessage.classList.add("text-danger");
  } else {
    errorMessage.classList.add("text-success");
  }
  errorMessage.classList.remove("hidden");
  errorMessage.innerText = message;
  setTimeout(function () {
    errorMessage.innerText = "";
    errorMessage.className = "hidden";
  }, 3000);
};

const checkReservation = async () => {
  reservationCheck.innerText = "Verifica in corso...";
  reservationCheck.setAttribute("disabled", true);
  const path = "api/check_tavolo";
  const response = await fetch(endpoint + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: reservationData.value,
      ora: reservationTime.value,
    }),
  });
  if (response.status == "200") {
    reservationCheck.innerText = "Verifica";
    reservationCheck.removeAttribute("disabled");
    reservationConfirmSection.classList.remove("hidden");
    reservationCheckSection.classList.add("hidden");
    const responseJSON = await response.json();
    console.log(responseJSON);
    disponibile = true;
  } else {
    setErrorMessagge(
      "Spiacente, in questa fascia oraria di questo giorno siamo pieni"
    );
    reservationCheck.innerText = "Verifica";
    reservationCheck.removeAttribute("disabled");
  }
};

async function confirmReservation() {
  if (!disponibile) return;
  reservationConfirm.innerText = "Prenotazione in corso...";
  reservationConfirm.setAttribute("disabled", true);
  const path = "api/prenota";
  const response = await fetch(endpoint + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: reservationData.value,
      ora: reservationTime.value,
      numero_persone: reservationPeople.value,
    }),
  });
  const responseJSON = await response.json();
  console.log(responseJSON);
  if (responseJSON.detail == "Tavolo Prenotato") {
    reservationConfirm.innerText = "Prenota";
    reservationConfirm.removeAttribute("disabled");
    reservationConfirmSection.classList.add("hidden");
    reservationsMade.push({
      data: reservationData.value,
      ora: reservationTime.value,
      numero_persone: reservationPeople.value,
    });
    localStorage.setItem("prenotazioni", JSON.stringify(reservationsMade));
    setErrorMessagge(
      "Prenotazione confermata. La pagina si ricaricherà a breve"
    );
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }
}

const getReservationsMade = () => {
  let localReserv = localStorage.getItem("prenotazioni");
  reservationsMade = JSON.parse(localReserv);
  if (reservationsMade.length) {
    let lista = reservationsStoric.querySelector("ul");
    reservationsMade.forEach((reservation) => {
      let elemento = document.createElement("li");
      elemento.className = "list-group-item";
      elemento.innerText = `Prenotazione per ${reservation.numero_persone} alle ${reservation.ora} del ${reservation.data} `;
      lista.appendChild(elemento);
    });
    reservationsStoric.classList.remove("hidden");
  }
};

window.addEventListener("load", getReservationsMade);
