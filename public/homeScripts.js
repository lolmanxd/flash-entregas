$(document).ready(function() {
  $(".parallax").parallax();
  $("nav").addClass("grey lighten-2");
  $("#flash-logo-peq").css("margin-top", "5px");

  $(".datepicker").pickadate({
    selectMonths: true, // Creates a dropdown to control month
    selectYears: 15, // Creates a dropdown of 15 years to control year,
    today: "Hoje",
    clear: "Limpar",
    close: "Ok",
    closeOnSelect: false // Close upon selecting a date,
  });
});
