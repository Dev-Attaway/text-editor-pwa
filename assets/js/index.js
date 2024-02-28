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
  result.forEach((data) => {
    listItemHTML += `<div class="flex-row align-center">
    <p style="margin: 0;">-></p>
    <li tabindex="0" class="mr-2" >${data.todo}</li>
    </div>`;
  });

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
    item.addEventListener("click", (event) => {
      convertToListItemInput(event.target); // Convert the list item into an input field
    });
  });
});

// Register event listener for arrow key navigation and editing
document.addEventListener("keydown", async (event) => {
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
  } else if (event.key === "Enter" && focusedElement.tagName === "LI") {
    // Handle editing when Enter key is pressed on a list item

    console.log(`currentIndex ${currentIndex}`);

    const focusedElementId = currentIndex + 1;
    convertToListItemInput(focusedElement, focusedElementId);

    // await window.editList(focusedElement);
  }
});

function convertToListItemInput(listItem, listItemId) {
  const text = listItem.textContent.trim(); // Get the text content of the list item
  const inputField = document.createElement("input"); // Create an input field
  inputField.type = "text";
  inputField.value = text;
  inputField.classList.add("editable"); // Add a class to style the input field

  // Replace the list item with the input field
  listItem.replaceWith(inputField);

  // Focus on the input field and select its text
  inputField.focus();
  inputField.select();

  // Event listener to handle Enter key press
  inputField.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      saveEditedText(inputField, listItemId); // Save the edited text
    }
  });
}
function saveEditedText(inputField, inputFieldId) {
  const newText = inputField.value.trim(); // Get the edited text

  putDb(inputFieldId, newText)
    .then(() => {
      console.log("Text updated successfully");
    })
    .catch((error) => {
      console.error("Error updating text:", error);
    });

  const listItem = document.createElement("li"); // Create a new list item
  listItem.setAttribute("tabindex", "0");
  listItem.classList.add("mr-2");
  listItem.id = inputFieldId;
  listItem.textContent = newText;

  // Replace the input field with the new list item
  inputField.replaceWith(listItem);
  fetchList();
}

// Register service worker if supported
if ("serviceWorker" in navigator) {
  const workboxSW = new Workbox("./service-worker.js");
  workboxSW.register();
} else {
  console.error("Service workers are not supported in this browser.");
}

// Fetch initial list data
fetchList();
