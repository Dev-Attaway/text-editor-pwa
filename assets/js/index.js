// Import necessary modules and styles
import { Workbox } from "workbox-window";
import "../css/styles.css";
import { postDb, getAllDb, getOneDb, deleteDb, putDb } from "./database";

// Define constants and select elements from the DOM
const form = document.getElementById("contact-form");
const listGroup = document.getElementById("list-group");

// Function to handle form submission
form.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent form submission from reloading the page

  // Extract todo from the form
  const todo = form.elements["todo"].value;

  // Post form data to IndexedDB
  await postDb(todo);

  // Clear the form input after submission
  form.reset();

  // Update the list after adding a new todo
  fetchList();
});

// Function to fetch data from IndexedDB and update the list
const fetchList = async () => {
  // Grab card data from IndexedDB
  const result = await getAllDb();

  // Construct HTML for list items
  let listItemHTML = "";
  for (let data of result) {
    listItemHTML += `
        <li tabindex="0" class="mr-2" id="list-item">${data.id}\t${data.todo}</li>
    `;
  }

  // Update the list group container with the generated HTML
  listGroup.innerHTML = listItemHTML;
};

// Register event listeners for focusing and blurring list items
document.addEventListener("DOMContentLoaded", () => {
  const listItems = document.querySelectorAll("#list-group li");

  listItems.forEach((item) => {
    item.addEventListener("focus", () => {
      item.classList.add("focused");
    });

    item.addEventListener("blur", () => {
      item.classList.remove("focused");
    });
  });
});

// Register event listener for arrow key navigation
document.addEventListener("keydown", (event) => {
  const focusedElement = document.activeElement;
  const listItems = document.querySelectorAll("#list-group li");

  const currentIndex = Array.from(listItems).indexOf(focusedElement);

  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
    event.preventDefault(); // Prevent default behavior of the arrow key

    if (currentIndex !== -1) {
      let nextIndex;
      if (event.key === "ArrowUp") {
        nextIndex = currentIndex > 0 ? currentIndex - 1 : listItems.length - 1;
      } else {
        nextIndex = currentIndex < listItems.length - 1 ? currentIndex + 1 : 0;
      }
      listItems[nextIndex].focus();
    }
  }
});

// Register service worker if supported
if ("serviceWorker" in navigator) {
  const workboxSW = new Workbox("./service-worker.js");
  workboxSW.register();
} else {
  console.error("Service workers are not supported in this browser.");
}

// Fetch initial list data
fetchList();
