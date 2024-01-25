var t = window.TrelloPowerUp.iframe();

// Access the args directly
var args = t.args[1]; // args is an object containing the arguments

// Now use args to get your data
var message = args.message;
var results = message;
console.log("resultsresultsresults", results)
var resultsContainer = document.getElementById("resultsContainer");

results.forEach(function (list) {
  var listCard = document.createElement("div");
  listCard.className = "list-card";

  var listTitle = document.createElement("h3");
  listTitle.textContent = list.listName;
  listCard.appendChild(listTitle);

  for (var categoryId in list.categoriesSizing) {
    var category = list.categoriesSizing[categoryId];
    var categoryDiv = document.createElement("div");
    categoryDiv.className = "category";
    categoryDiv.style.backgroundColor = category.color;
    categoryDiv.textContent = `${category.name}: ${category.sizing}`;
    listCard.appendChild(categoryDiv);
  }

  var totalDiv = document.createElement("div");
  totalDiv.className = "total-sizing";
  totalDiv.textContent = `Total Sizing: ${list.total}`;
  listCard.appendChild(totalDiv);

  resultsContainer.appendChild(listCard);
});
