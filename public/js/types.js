var API_URL = "http://localhost:9000/api/v1";
// var API_URL = "https://uxperts-backend-staging.disruptem.com/api/v1"
// var API_URL = "https://powerup-backend.uxperts.io/api/v1"
var GREY_ROCKET_ICON =
  "https://cdn.glitch.com/c69415fd-f70e-4e03-b43b-98b8960cd616%2Frocket-ship-grey.png?1496162964717";
var WHITE_ROCKET_ICON =
  "https://cdn.glitch.com/c69415fd-f70e-4e03-b43b-98b8960cd616%2Fwhite-rocket-ship.png?1495811896182";
var BLACK_ROCKET_ICON =
  "https://cdn.glitch.com/1b42d7fe-bda8-4af8-a6c8-eff0cea9e08a%2Frocket-ship.png?1494946700421";

var BACKEND_ICON =
  "https://cdn.glitch.com/aef55bcb-cec2-438b-98c0-959249969810%2Fworksheet-number-monochrome-b-classroom.jpg?v=1616731943091";
// var FRONTEND_ICONn
var ROCKET_ICON =
  "https://cdn.glitch.com/aef55bcb-cec2-438b-98c0-959249969810%2Fc69415fd-f70e-4e03-b43b-98b8960cd616_white-rocket-ship.png?v=1616729876518";

var DISRUPTEM_ICON1 =
  "https://cdn.glitch.com/bcb67d52-05a1-4b6e-a315-f5bae36b69eb%2FIcon-Color%403x.png?v=1625811265010";
var DISRUPTEM_ICON2 =
  "https://cdn.glitch.com/bcb67d52-05a1-4b6e-a315-f5bae36b69eb%2F1.png?v=1625811412559";
var DISRUPTEM_ICON3 =
  "https://cdn.glitch.com/bcb67d52-05a1-4b6e-a315-f5bae36b69eb%2Fdisruptem-Icon_White.png?v=1625811831046";

var t = window.TrelloPowerUp.iframe();

//call the function fetchTypes on UI form load
$(document).ready(function () {
  fetchTypes();
});

//fetch members from backend
function fetchTypes() {
  $.ajax({
    url: `${API_URL}/public/trello/types`,
    type: "GET",
    success: function (data) {
      console.log("datadatadatadatadata", data);
      populateTypes(data.types);
    },
    error: function (error) {
      console.error("Error fetching members", error);
    },
  });
}

//populate the types into the UI
function populateTypes(types) {
  console.log("types", types);

  const typesList = $("#types");
  types.forEach(function (type) {
    console.log("type", type);
    // Exclude members that have sizing data
    const option = `<option value="${type._id}-${type.color}">${type.name}</option>`;
    typesList.append(option);
  });
}

//handle submit sizing form
$("#estimate").submit(async function (event) {
  event.preventDefault();

  const [selectedTypeId, selectedTypeColor] = $("#types")
    .val()
    .split("-");
  const selectedTypeName = $("#types option:selected").text();
  if (!selectedTypeName) {
    return;
  }
  try {
    // Fetch the card, list, and board IDs
    const card = await t.card("id");
    const list = await t.list("id");
    const board = await t.board("id");

    // Send the data to the backend
    const data = {
      type: {
        typeId: selectedTypeId,
        typeColor: selectedTypeColor,
        typeName: selectedTypeName,
      },
      cardId: card.id,
      listId: list.id,
      boardId: board.id,
    };
    const dataTobeSent = {
      typeId: selectedTypeId,
      cardId: card.id,
      listId: list.id,
      boardId: board.id,
    };
    console.log("OUTPUTTTTTTTTTTTTTTTT", data);
    const response = await fetch(`${API_URL}/cards/type`, {
      // Replace '/your-endpoint' with your actual endpoint
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataTobeSent),
    });

    if (response.ok) {
      const badgeData = (await t.get("card", "shared", "detailBadgeData")) || [];
      const typeExists = badgeData.some(
        (badge) => badge.typeId === selectedTypeId
      );

      if (!typeExists) {
        const newTypeBadge = {
          cardId: card.id,
          typeId: selectedTypeId,
          color: selectedTypeColor,
          text: $("#types option:selected").text(),
        };

        badgeData.push(newTypeBadge);
        await t.set("card", "shared", "badgeData", badgeData);
      }

      t.closePopup();
    } else {
      console.error("Error updating card:", response.statusText);
    }
  } catch (error) {
    console.error("Error:", error);
  }
});
