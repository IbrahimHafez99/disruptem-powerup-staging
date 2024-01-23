var t = window.TrelloPowerUp.iframe();

var ENDPOINT_URL = "http://localhost:9000/api/v1";
// Wait for the DOM to be loaded
document.addEventListener("DOMContentLoaded", function () {
  var memberIdSelect = document.getElementById("member");
  var categorySelect = document.getElementById("category");
  var sizingInput = document.getElementById("sizing");
  // Populate form fields from initial data passed to the iframe
  var initialData = t.arg("initialFormData");
  console.log("initialFormDatainitialFormData", initialData);
  const body = { pointId: initialData.pointId, cardId: initialData.cardId };
  // Fetch point data and populate the selects
  fetch(`${ENDPOINT_URL}/public/trello/points`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("bodybody", data);
      const defaultMember = data.data?.memberId?._id;
      const defaultCategory = data.data?.categoryId?._id;
      sizingInput.value = data.data?.sizing;
      // Fetch additional members and populate the member select
      fetch(`${ENDPOINT_URL}/public/trello/members`)
        .then((response) => response.json())
        .then((data) => {
          console.log("membersss", data);
          fetch(`${ENDPOINT_URL}/cards/${initialData.cardId}`)
            .then((response) => response.json())
            .then((card) => {
              console.log("membersss", data);
              console.log("cardssss", card);
              data.data.members.forEach((member) => {
                if (
                  !card.data.members
                    .map((mem) => mem.memberId?._id)
                    .includes(member._id) ||
                  (card.data.members
                    .map((mem) => mem.memberId?._id)
                    .includes(member._id) &&
                    member._id === defaultMember)
                ) {
                  var option = document.createElement("option");
                  option.selected = member._id === defaultMember;
                  option.value = member._id;
                  option.textContent = member.name;
                  memberIdSelect.appendChild(option);
                }
              });
            });
          // data.data.members.forEach((member) => {
          //   var option = document.createElement("option");
          //   option.selected = member._id === defaultMember;
          //   option.value = member._id;
          //   option.textContent = member.name;
          //   memberIdSelect.appendChild(option);
          // });
        });

      // Fetch categories and populate the category select
      fetch(`${ENDPOINT_URL}/public/trello/categories`)
        .then((response) => response.json())
        .then((data) => {
          console.log("categoriessss", data);
          data.data.categories.forEach((category) => {
            var option = document.createElement("option");
            option.value = category._id;
            option.textContent = category.name;
            option.selected = category._id === defaultCategory;
            categorySelect.appendChild(option);
          });
        });
    });

  // Submit button logic
  document.getElementById("submit").addEventListener("click", function () {
    // Construct the data to be sent
    console.log(
      !parseFloat(sizingInput.value) ||
        (parseFloat(sizingInput.value) &&
          (!memberIdSelect.value || !categorySelect.value))
    );
    if (
      !parseFloat(sizingInput.value) ||
      (parseFloat(sizingInput.value) &&
        !memberIdSelect.value &&
        !categorySelect.value)
    ) {
      return;
    }
    console.log("REACH");
    var updatedData = {
      memberId: memberIdSelect.value,
      category: categorySelect.value,
      sizing: parseFloat(sizingInput.value),
      pointId: initialData.pointId,
      cardId: initialData.cardId,
    };
    fetch()
    console.log(updatedData);
    // Send the data back to the Trello card
    // t.set("card", "shared", "memberSizing", updatedData).then(function () {
    //   t.closePopup();
    // });
  });
});
