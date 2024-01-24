var t = window.TrelloPowerUp.iframe();

t.render(function() {
    // Retrieve the passed arguments
    var args = t.arg('message');
    var results = args;
    console.log("Received Results: ", results);

    // Reference to the container in your HTML
    var resultsContainer = document.getElementById("resultsContainer");
    resultsContainer.innerHTML = ''; // Clear any existing content

    // Iterate over each list in the results
    results.forEach(function(list) {
        // Create a card element for each list
        var listCard = document.createElement("div");
        listCard.className = "card";

        // Add list title as card header
        var listHeader = document.createElement("div");
        listHeader.className = "card-header";
        listHeader.textContent = list.listName;
        listCard.appendChild(listHeader);

        // Add types and their sizings
        list.types.forEach(function(type) {
            var typeDiv = document.createElement("div");
            typeDiv.className = "card-item";
            typeDiv.style.backgroundColor = type.color;
            typeDiv.textContent = `${type.name}: ${type.sizing}`;
            listCard.appendChild(typeDiv);
        });

        // Add total sizing
        var totalDiv = document.createElement("div");
        totalDiv.className = "card-item card-total";
        totalDiv.textContent = `Total Sizing: ${list.total}`;
        listCard.appendChild(totalDiv);

        // Append the list card to the container
        resultsContainer.appendChild(listCard);
    });
});
