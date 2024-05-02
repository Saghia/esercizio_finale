const reservationTime = document.getElementById("reservationTime");
const reservationData = document.getElementById("reservationData");
const reservationCheck = document.getElementById("reservationCheck");
const reservationCheckSection = document.getElementById(
  "reservationCheckSection"
);
const reservationConfirm = document.getElementById("reservationConfirm");
const reservationConfirmSection = document.getElementById(
  "reservationConfirmSection"
);

const endpoint = "http://localhost:8000/";

reservationCheck.addEventListener("click", () => {
  checkReservation();
});

const checkReservation = async () => {
  reservationCheck.innerText = "Verifica in corso...";
  reservationCheck.setAttribute("disabled", true);
  const path = "api/check_tavolo";
  const body = {
    data: reservationData.value,
    ora: reservationTime.value,
  };
  const response = await fetch(endpoint + path, {
    body: JSON.parse(body),
    method: "GET",
    "Content-type": "application/json",
  });
  if (response.status == "200") {
    reservationCheck.innerText = "Verifica";
    reservationConfirmSection.classList.remove("hidden");
    reservationCheckSection.classList.add("hidden");
    const responseJSON = await response.json();
    console.log(responseJSON);
  } else {
    alert("Siamo pieni in questo orario di questo giorno");
  }
};
