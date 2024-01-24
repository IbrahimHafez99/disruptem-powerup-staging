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
                  option.value = `${member._id}-${member.name}`;
                  option.textContent = member.name;
                  memberIdSelect.appendChild(option);
                }
              });
            });
        });

      // Fetch categories and populate the category select
      fetch(`${ENDPOINT_URL}/public/trello/categories`)
        .then((response) => response.json())
        .then((data) => {
          console.log("categoriessss", data);
          data.data.categories.forEach((category) => {
            var option = document.createElement("option");
            option.value = `${category._id}-${category.color}-${category.name}`;
            option.textContent = category.name;
            option.selected = category._id === defaultCategory;
            categorySelect.appendChild(option);
          });
        });
    });
  document.getElementById("deleteBtn").addEventListener("click", function () {
    // Fetch request to delete item
    fetch(`${ENDPOINT_URL}/cards/delete-point`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
      console.log("datadatadatadata", data)
      t.get("card", "shared", "detailBadgeData").then(function (detailBadgeData) {
        
      })
        // Handle successful deletion
        // t.closePopup();
      })
      .catch((error) => {
        // Handle error
        console.error("Error:", error);
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
      memberId: memberIdSelect.value.split("-")[0],
      categoryId: categorySelect.value.split("-")[0],
      sizing: parseFloat(sizingInput.value),
      pointId: initialData.pointId,
      cardId: initialData.cardId,
    };
    fetch(`${ENDPOINT_URL}/cards/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    })
      .then((response) => response.json())
      .then((data) => console.log(data));
    console.log(updatedData);
    t.get("card", "shared", "detailBadgeData").then(function (detailBadgeData) {
      console.log("SADASDASDASD", detailBadgeData);
      // filtering(deleting) all badges for this point
      detailBadgeData = detailBadgeData.filter(
        (badge) => badge.pointId === initialData.pointId
      );
      //creating new badge for category
      if (updatedData.categoryId) {
        const existingCategoryBadge = detailBadgeData.find(
          (badge) =>
            updatedData.categoryId &&
            badge.categoryId &&
            badge.categoryId === updatedData.categoryId
        );
        if (!existingCategoryBadge) {
          const categoryBadge = {
            title: "",
            text: categorySelect.value.split("-")[2],
            sizing: parseFloat(sizingInput.value),
            color: categorySelect.value.split("-")[1],
            cardId: initialData.cardId,
            categoryId: categorySelect.value.split("-")[0],
            pointId: initialData.pointId,
            listId: initialData.listId,
            // callback: function (t) {
            //   // Fetch initial data
            //   //fetch
            //   const initialFormData = {
            //     cardId: initialData.cardId,
            //     pointId: initialData.pointId,
            //     listId: initialData.listId,
            //   };
            //   return t.popup({
            //     title: "Adjust Member Sizing",
            //     url: "./adjust-size.html",
            //     args: { initialFormData },
            //     height: 240,
            //   });
            // },
          };
          detailBadgeData.push(categoryBadge);
        }
      }
      if (updatedData.memberId) {
        const existingMemberBadge = detailBadgeData.find(
          (badge) =>
            updatedData.memberId &&
            badge.memberId &&
            badge.memberId === updatedData.memberId
        );
        if (!existingMemberBadge) {
          const memberBadge = {
            title: memberIdSelect.value.split("-")[1],
            text: parseFloat(sizingInput.value),
            sizing: parseFloat(sizingInput.value),
            color: "red",
            memberId: memberIdSelect.value.split("-")[0],
            cardId: initialData.cardId,
            pointId: initialData.pointId,
            listId: initialData.listId,
            callback: function (t) {
              // Fetch initial data
              //fetch
              const initialFormData = {
                cardId: initialData.cardId,
                pointId: initialData.pointId,
                listId: initialData.listId,
              };
              return t.popup({
                title: "Adjust Member Sizing",
                url: "./adjust-size.html",
                args: { initialFormData },
                height: 240,
              });
            },
          };
          detailBadgeData.push(memberBadge);
        }
      }
      // detailBadgeData.forEach((badge) => {
      //   if (badge.pointId === initialData.pointId && badge.categoryId) {
      //     badge.color = categorySelect.value.split("-")[1];
      //     badge.sizing = parseFloat(sizingInput.value);
      //     badge.categoryId = categorySelect.value.split("-")[0];
      //     badge.text = categorySelect.value.split("-")[2];
      //   } else if (badge.pointId === initialData.pointId && badge.memberId) {
      //     badge.sizing = parseFloat(sizingInput.value);
      //     badge.memberId = memberIdSelect.value.split("-")[0];
      //     badge.text = parseFloat(sizingInput.value);
      //     badge.sizing = parseFloat(sizingInput.value);
      //     badge.title = memberIdSelect.value.split("-")[1];
      //   }
      // });
      t.set("card", "shared", "detailBadgeData", detailBadgeData)
        .then(() => t.closePopup())
        .catch((error) => console.log(error));
    });
  });
});
