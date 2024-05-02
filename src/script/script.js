const reservationTime = document.getElementById("reservationTime");
const reservationData = document.getElementById("reservationData");
const reservationPeople = document.getElementById("reservationPeople");

const reservationCheckSection = document.getElementById(
  "reservationCheckSection"
);
const reservationCheck = document.getElementById("reservationCheck");
const reservationConfirmSection = document.getElementById(
  "reservationConfirmSection"
);
const reservationConfirm = document.getElementById("reservationConfirm");

let disponibile = false;
const endpoint = "http://localhost:8000/";

reservationCheck.addEventListener("click", () => {
  checkReservation();
});

reservationConfirm.addEventListener("click", () => {
  confirmReservation();
});

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
    reservationConfirmSection.classList.remove("d-none");
    reservationCheckSection.classList.add("d-none");
    const responseJSON = await response.json();
    console.log(responseJSON);
    disponibile = true;
  } else {
    reservationCheck.innerText = "Verifica";
    reservationCheck.removeAttribute("disabled");
    alert(
      "Purtroppo in questa fascia oraria di questo giorno esiste già una prenotazione"
    );
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
    reservationConfirmSection.classList.add("d-none");
    reservationsMade.push({
      data: reservationData.value,
      ora: reservationTime.value,
      numero_persone: reservationPeople.value,
    });
    setTimeout(() => {
      window.location.reload();
    }, 2000);
    alert("PRENOTAZIONE AVVENUTA CON SUCCESSO!");
  }
}
