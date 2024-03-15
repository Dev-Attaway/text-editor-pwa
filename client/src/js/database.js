// Importing the openDB function from the 'idb' package
import { openDB } from "idb";

// Initializing the database
const initdb = async () =>
  openDB("jate", 1, {
    // Database upgrade function called when the database version is upgraded
    upgrade(db) {
      // Checking if the object store 'jate' already exists in the database
      if (db.objectStoreNames.contains("jate")) {
        console.log("jate database already exists");
        return;
      }
      // Creating the 'jate' object store with auto-incrementing keys
      db.createObjectStore("jate", { keyPath: "id", autoIncrement: true });
      console.log("jate database created");
    },
  });

// Function to save data into the database
export const putDb = async (content) => {
  console.log("putDb is saving data");
  // Opening the 'jate' database

  const jateDb = await openDB("jate", 1);
  // Starting a read-write transaction

  const tx = jateDb.transaction("jate", "readwrite");
  // Accessing the 'jate' object store

  const store = tx.objectStore("jate");
  // Putting data into the object store with a specific key

  const request = store.put({ id: 1, value: content });
  // Waiting for the put operation to complete

  const result = await request;
  console.log("data saved: ", result.value);
};

// Function to read data from the database
export const getDb = async () => {
  console.log("getDb is reading data");
  // Opening the 'jate' database

  const jateDb = await openDB("jate", 1);
  // Starting a read-only transaction

  const tx = jateDb.transaction("jate", "readonly");
  // Accessing the 'jate' object store

  const store = tx.objectStore("jate");
  // Getting data from the object store using a specific key

  const request = store.get(1);
  // Waiting for the get operation to complete

  const result = await request;
  if (result) {
    console.log("data found: ", result.value);
    return result.value;
  } else {
    console.log("data not found");
    return;
  }
};

// Initializing the database when the module is imported
initdb();
