// Show a popup message when an activity is clicked
document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", function(e) {
      const activity = this.querySelector("h3").textContent;
      console.log(`${activity} clicked`);
    });
  });
  