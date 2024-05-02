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

const endpoint = "";

reservationCheck.addEventListener("click", () => {
  checkReservation();
});

const checkReservation = async () => {
  reservationCheck.innerText = "Verifica in corso...";
  reservationCheck.setAttribute("disabled", true);
  const path = "";
  const response = await fetch(endpoint + path);
  if (response.status == "200") {
    reservationCheck.innerText = "Verifica";
    reservationConfirmSection.classList.remove("hidden");
    reservationCheckSection.classList.add("hidden");
  }
  const responseJSON = await response.json();
  console.log(responseJSON);
};
