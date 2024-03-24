// Import the functions you need from the SDKs you need
//import { initializeApp } from "firebase/app";

function performSearch() {
    var searchString = document.getElementById('searchInput').value;
    //window.location.assign("results.html");
    // Send the search string to Python using output module
    google.colab.kernel.invokeFunction('notebook.receive_search_string', [searchString], {});

}

function performSearch_again() {
    var searchString = document.getElementById('searchbartext').value;
    google.colab.kernel.invokeFunction('notebook.receive_search_string', [searchString], {});
}

function backToHomePage() {
    google.colab.kernel.invokeFunction('notebook.back_to_home_page', [], {});
}

function backToAdmin() {
    google.colab.kernel.invokeFunction('notebook.back_to_admin', [], {});
}

function openChatBot() {
    google.colab.kernel.invokeFunction('notebook.open_chatbot_page', [], {});
}

function openIndexEditor() {
    google.colab.kernel.invokeFunction('notebook.open_indexeditor_page', [], {});
}

function getRandomIndexes() {
    google.colab.kernel.invokeFunction('notebook.get_random_indexes_with_counters', [], {});
}

function get_min_max_keys() {
    google.colab.kernel.invokeFunction('notebook.get_min_max_keys', [], {});
}


function askChatbot() {
    var question = document.getElementById('user-input-chatbot').value;
    var chatContainer = document.getElementById('chat');
    chatContainer.innerHTML += '<div><strong>User:</strong> ' + question + '</div>';
    // Send the question to Python using output module
    google.colab.kernel.invokeFunction('notebook.receive_question_chatbot', [question], {});
}

function ChatbotResponse(response) {

    // Append chatbot's response to the chat
    var chatContainer = document.getElementById('chat');
    chatContainer.innerHTML += '<div><strong>Chatbot:</strong> ' + response + '</div>';

    // Clear the user input
    document.getElementById('user-input-chatbot').value = '';

    // Scroll to the bottom of the chat
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function renderResults_title_link(titles, links) {
    // Get the container where you want to append the new div elements
    var container = document.getElementById('searchresultsarea');

    if (titles.length == 0 || links.length == 0) {
        var divElement = document.createElement('div');
        var h2Element = document.createElement('h2');
        h2Element.innerText = "No results found.";
        divElement.appendChild(h2Element);
        container.appendChild(divElement);

    }
    else {

        // Loop through titles and links arrays
        for (var i = 0; i < titles.length; i++) {
            // Create a new div element
            var divElement = document.createElement('div');
            divElement.classList.add('searchresult');

            // Create a new h2 element
            var h2Element = document.createElement('h2');
            h2Element.innerText = titles[i];

            // Create a new anchor element
            var anchorElement = document.createElement('a');
            anchorElement.href = links[i];
            anchorElement.appendChild(h2Element);

            // Append the anchor element to the div element
            divElement.appendChild(anchorElement);

            // Append the div element to the container
            container.appendChild(divElement);
        }
    }
}

// Function to add a query to the map or increment its counter if it already exists
function addQuery(query) {
    console.log("Query received:", query); // Debugging statement
    if (searchCounterMap[query]) {
        searchCounterMap[query]++; // Increment counter if query already exists
    } else {
        searchCounterMap[query] = 1; // Initialize counter if query is encountered for the first time
    }
    console.log("Updated searchCounterMap:", searchCounterMap); // Debugging statement
    console.log(Object.keys(searchCounterMap).length)
    console.log("Updated searchCounterMap:", searchCounterMap); // Debugging statement
}

// Function to get the query with the minimum counter
function getMinQuery() {
    let minName;
    let minCounter = 0;

    for (var name in searchCounterMap) {
        if (searchCounterMap[name] < minCounter) {
            minName = name;
            minCounter = searchCounterMap[name];
        }
    }

    return minName;
}

// Function to get the query with the maximum counter
function getMaxQuery() {
    let maxName;
    let maxCounter = 0;

    for (var name in searchCounterMap) {
        if (searchCounterMap[name] > maxCounter) {
            maxName = name;
            maxCounter = searchCounterMap[name];
        }
    }

    return maxName;
}

// Function to update statistics block with most and least common search
function updateStatisticsBlock(min_key, min_counter, max_key, max_counter) {
    var statisticsBlock = document.getElementById('statistics-block');
    statisticsBlock.innerHTML = `
        <p>Most common search: ["${max_key}" appeared in ${max_counter} searches]</p>
        <p>Least common search: ["${min_key}" appeared in ${min_counter} searches]</p>
      `;
}

function generateGraph() {
    const canvas = document.getElementById('wordGraph');
    const ctx = canvas.getContext('2d');

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the graph based on the selected word's data
    var data = getRandomIndexes();
    var xPos = 10;

    for (const [index, sumOfCounters] of data) {
        ctx.fillStyle = '#4CAF50'; // Green color for bars
        ctx.fillRect(xPos, canvas.height - sumOfCounters * 5, 30, sumOfCounters * 5);
        ctx.fillStyle = '#ffffff'; // White color for text
        ctx.fillText(`${sumOfCounters}`, xPos + 10, canvas.height - sumOfCounters * 5 - 10);
        ctx.fillText(index, xPos, canvas.height + 15);
        xPos += 50;
    }
}



// // Your web app's Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyCAxakgYrZ7JNViupl2eEDaaRXWn9wPEbE",
//     authDomain: "cloudprojectpanthers.firebaseapp.com",
//     projectId: "cloudprojectpanthers",
//     storageBucket: "cloudprojectpanthers.appspot.com",
//     messagingSenderId: "23178040617",
//     appId: "1:23178040617:web:e2a2fc03db689d22ef9338",
//     measurementId: "G-4YBSX1LQ7K"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
// console.log(db);

// // Define the function to update or add a document
// function updateOrAddStatistic(statisticName) {
//     var statisticsRef = db.collection("statisticsPanthers").doc(statisticName);

//     return db.runTransaction(function (transaction) {
//         return transaction.get(statisticsRef).then(function (doc) {
//             if (doc.exists) {
//                 // Document exists, update the counter
//                 var newValue = doc.data().counter + 1;
//                 transaction.update(statisticsRef, { counter: newValue });
//             } else {
//                 // Document doesn't exist, create a new one
//                 transaction.set(statisticsRef, { counter: 1 });
//             }
//         });
//     }).then(function () {
//         console.log("Transaction successfully committed!");
//     }).catch(function (error) {
//         console.error("Transaction failed: ", error);
//     });
// }
