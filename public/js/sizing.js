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

//call the function fetchMembers on UI form load
$(document).ready(function () {
  fetchMembers();
  fetchCategories();
});

//fetch members from backend
function fetchCategories() {
  $.ajax({
    url: `${API_URL}/public/trello/categories`,
    type: "GET",
    success: function (data) {
      populateCategories(data.data.categories);
    },
    error: function (error) {
      console.error("Error fetching members", error);
    },
  });
}

//populate the categories into the UI
function populateCategories(categories) {
  let cats = categories.map((ms) => ms._id);

  const categoriesList = $("#categories");
  categories.forEach(function (category) {
    // Exclude members that have sizing data
    const option = `<option value="${category._id}-${category.color}">${category.name}</option>`;
    categoriesList.append(option);
  });
}

//fetch members from backend
function fetchMembers() {
  $.ajax({
    url: `${API_URL}/public/trello/members`,
    type: "GET",
    success: function (data) {
      populateMembers(data.data.members);
    },
    error: function (error) {
      console.error("Error fetching members", error);
    },
  });
}

//populate the members into the UI
function populateMembers(members) {
  t.get("card", "shared", "memberSizing").then(async function (
    memberSizing = []
  ) {
    // memberSizing now contains the sizing data for members
    const cardId = await t.card("id");
    const board = await t.board("id");
    console.log("cardId", cardId.id);
    const response = await fetch(`${API_URL}/cards/${cardId.id}`);
    const data = await response.json();
    console.log("ddbdbdbdbb", data);
    const membersList = $("#members");
    members.forEach(function (member) {
      // Exclude members that have sizing data
      if (
        !data?.data?.members?.map((mem) => mem.memberId?._id).includes(member._id)
      ) {
        const option = `<option value="${member._id}">${member.name}</option>`;
        membersList.append(option);
      }
    });
  });
}

//handle submit sizing form
$("#estimate").submit(async function (event) {
  event.preventDefault();

  const selectedMemberId = $("#members").val();
  const [selectedCategoryId, selectedCategoryColor] = $("#categories")
    .val()
    .split("-");
  const sizing = $("#estimation-size").val();
  
  const selectedMemberName = $("#members option:selected").text();
  const selectedCategoryName = $("#categories option:selected").text();
console.log(!selectedMemberName, !selectedCategoryName )
  if (!sizing && (selectedMemberName || selectedCategoryName)) {
    return 0;
  }
  try {
    // Fetch the card, list, and board IDs
    const card = await t.card("id");
    const list = await t.list("id");
    const board = await t.board("id");

    // Send the data to the backend
    const data = {
      member: {
        memberId: selectedMemberId,
        categoryId: selectedCategoryId,
        sizing: sizing,
      },
      cardId: card.id,
      listId: list.id,
      boardId: board.id,
    };

    const response = await fetch(`${API_URL}/cards/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((cardData) => {
        t.get("card", "shared", "detailBadgeData").then(function (
          badgeData = []
        ) {
          const existingMemberBadge = badgeData.find(
            (badge) => badge.memberId === data?.member?.memberId
          );

          if (!existingMemberBadge && data?.member?.memberId) {
            const memberBadge = {
              pointId: cardData.data.members[0]._id,
              title: selectedMemberName,
              text: data.member.sizing,
              color: "red",
              memberId: data.member.memberId,
              cardId: data.cardId,
              listId: data.listId,

              //               callback: function (t) {
              //                 let outSideContext = t;
              //                 return outSideContext.popup({
              //                   title: "Adjust Member Sizing",
              //                   items: [
              //                     // {
              //                     //   text: "Member: " + member.memberId.name,
              //                     // },
              //                     // {
              //                     //   text: "Current Sizing: " + member.sizing,
              //                     //   callback: function (t) {
              //                     //     return t.popup({
              //                     //       url: "input",
              //                     //       title: "Adjust Sizing",
              //                     //       url: `../adjust-size.html?cardId=${cardId.id}&idList=${idList.id}&idBoard=${idBoard.id}&memberId=${member.memberId.id}&memberName=${member.memberId.name}&currentSizing=${member.sizing}`,
              //                     //     });
              //                     //   },
              //                     // },
              //                     {
              //                       text: "Delete Member",
              //                       callback: function (t) {
              //                         const data = {
              //                           memberId: member._id,
              //                           cardId: data.cardId,
              //                         };
              //                         fetch(`${API_URL}/cards/delete-member`, {
              //                           method: "POST", // Specifying the HTTP method
              //                           headers: {
              //                             "Content-Type": "application/json", // Setting the content type of the request
              //                           },
              //                           body: JSON.stringify(data), // Converting the data to a JSON string
              //                         })
              //                           .then((response) => response.json()) // Parsing the JSON response from the server
              //                           .then((data) => {
              //                             console.log("Success:", data);
              //                             return t
              //                               .get("card", "shared", "detailBadgeData")
              //                               .then(function (badgeData) {
              //                                 console.log(
              //                                   "badgeDatabadgeDatabadgeData",
              //                                   badgeData
              //                                 );
              //                                 if (!badgeData) return;

              //                                 badgeData.forEach((badge) => {
              //                                   if (
              //                                     badge.memberId &&
              //                                     badge.memberId === data.memberId &&
              //                                     badge.cardId === data.cardId
              //                                   ) {
              //                                     console.log(badge.memberId, badge.cardId);
              //                                     badgeData = badgeData.filter(
              //                                       (b) =>
              //                                         b.memberId !== data.memberId &&
              //                                         b.cardId !== data.cardId
              //                                     );
              //                                   }
              //                                   if (
              //                                     badge.memberIds &&
              //                                     badge.memberIds.includes(data.memberId) &&
              //                                     badge.cardId === data.cardId
              //                                   ) {
              //                                     // Remove the member ID from the badge's memberIds array
              //                                     badge.memberIds = badge.memberIds.filter(
              //                                       (id) => id !== data.memberId
              //                                     );

              //                                     // If the memberIds array is now empty, remove the badge
              //                                     if (badge.memberIds.length === 0) {
              //                                       badgeData = badgeData.filter(
              //                                         (b) =>
              //                                           b.categoryId !== badge.categoryId &&
              //                                           b.cardId === data.cardId
              //                                       );
              //                                     }
              //                                   }
              //                                 });
              //                                 console.log("badgeData", badgeData);
              //                                 // Update pluginData with the updated badge data
              //                                 t.set("card", "shared", "badgeData", badgeData);
              //                               });
              //                           })
              //                           .catch((error) => {
              //                             console.error("Error:", error); // Handling errors
              //                           });
              //                       },
              //                     },
              //                   ],
              //                 });
              //               },
            };
            badgeData.push(memberBadge);
          }
          console.log("badgeDatabadgeData_1111111111111",badgeData)
          const existingCategoryBadge = badgeData.find(
            (badge) => badge.categoryId === data.member.categoryId
          );
          
          console.log('existingCategoryBadgeexistingCategoryBadge', existingCategoryBadge.categoryId)
          console.log('data.member.categoryIddata.member.categoryId', data.member.categoryId)
          console.log("condition", !existingCategoryBadge && data?.member?.categoryId)
          if (!existingCategoryBadge && data?.member?.categoryId) {
            const categoryBadge = {
              title: "category",
              text: selectedCategoryName,
              color: selectedCategoryColor,
              categoryId: data.member.categoryId,
              cardId: data.cardId,
              listId: data.listId,
              pointId: cardData.data.members[0]._id,
            };
            badgeData.push(categoryBadge);
          }
          console.log(
            "badgeDatabadgeDatabadgeDatabadgeDatabadgeDatabadgeDatabadgeData",
            badgeData
          );

          return (
            t
              // .set("card", "shared", "detailBadgeData", badgeData)
              .set("card", "shared", "detailBadgeData", badgeData)
              .then(() => t.closePopup())
              .catch((error) => console.log(error))
          );
        });
      });
  } catch (error) {
    console.error("Error:", error);
  }
});
