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

function openChatBot() {
    google.colab.kernel.invokeFunction('notebook.open_chatbot_page', [], {});
}

function openIndexEditor() {
    google.colab.kernel.invokeFunction('notebook.open_indexeditor_page', [], {});
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

// Define an empty object to store querys and counters
const searchCounterMap = {};

// Function to add a query to the map or increment its counter if it already exists
function addQuery(query) {
    if (searchCounterMap[query]) {
        searchCounterMap[query]++; // Increment counter if query already exists
    } else {
        searchCounterMap[query] = 1; // Initialize counter if query is encountered for the first time
    }
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
function updateStatisticsBlock() {
    const statisticsBlock = document.getElementById('statistics-block');

    if (statisticsBlock) {
        var minName = getMinQuery();
        var maxName = getMaxQuery();

        statisticsBlock.innerHTML = `
        <p>Most common search: ["${maxName}" appeared in ${searchCounterMap[maxName]} searches]</p>
        <p>Least common search: ["${minName}" appeared in ${searchCounterMap[minName]} searches]</p>
      `;
    }
    else {
        var divElement = document.createElement('div');
        var h2Element = document.createElement('h2');
        h2Element.innerText = "No results found.";
        divElement.appendChild(h2Element);
        statisticsBlock.appendChild(divElement);
    }

}