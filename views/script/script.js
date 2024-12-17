const form = document.querySelector("#scrapeForm");

// Add an event listener to the form to scrape the product from the URL when the form is submitted
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const url = document.querySelector("#url").value;

  const response = await fetch("/scrape", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  if (response.ok) {
    window.location.reload();
  }
});

const remove = document.querySelectorAll(".remove");

// Add an event listener to each remove button to remove the product from the list
remove.forEach((button) => {
  button.addEventListener("click", async (e) => {
    const url = button.dataset.url;

    const response = await fetch("/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    if (response.ok) {
      window.location.reload();
    }
  });
});
