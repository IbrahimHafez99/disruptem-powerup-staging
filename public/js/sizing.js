// var API_URL = "http://localhost:9000/api/v1";
// var API_URL = "https://uxperts-backend-staging.disruptem.com/api/v1"
var API_URL = "https://powerup-backend.uxperts.io/api/v1"
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
});

//fetch members from backend
function fetchMembers() {
  $.ajax({
    url: `${API_URL}/public/trello/members`,
    type: "GET",
    success: function (data) {
      console.log(data);
      populateMembers(data.data.members);
    },
    error: function (error) {
      console.error("Error fetching members", error);
    },
  });
}

//populate the members into the UI
function populateMembers(members) {
  t.get("card", "shared", "memberSizing").then(function (memberSizing = []) {
    // memberSizing now contains the sizing data for members
    console.log(members);
    let memberIdsWithSizing = members.map((ms) => ms._id);
    console.log("memberIdsWithSizing", memberIdsWithSizing);

    const membersList = $("#members");
    members.forEach(function (member) {
      // Exclude members that have sizing data
      console.log(member.id);
      if (!memberIdsWithSizing.includes(String(member.id))) {
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
  const sizing = $("#estimation-size").val();
  const selectedMemberName = $("#members option:selected").text();
  if (!sizing || !selectedMemberName) {
    return;
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
        sizing: sizing,
        date: new Date(), //the current date
      },
      cardId: card.id,
      listId: list.id,
      boardId: board.id,
    };

    const response = await fetch(`${API_URL}/cards/`, {
      // Replace '/your-endpoint' with your actual endpoint
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      console.log("Success:", await response.json());
      t.get("card", "shared", "detailBadgeData").then(function (
        badgeData = []
      ) {
        console.log("before badgeData", JSON.stringify(badgeData));
        console.log(data.member.memberId);
        // Check if a badge with this ID already exists
        const existingBadgeIndex = badgeData.findIndex(
          (badge) =>
            badge.memberId === data.member.memberId &&
            badge.cardId === data.cardId
        );
        console.log("existingBadgeIndex", existingBadgeIndex);
        if (existingBadgeIndex >= 0) {
          console.log("UPDATEDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD");
          // Update the existing badge
          badgeData[existingBadgeIndex].text = data.member.sizing;
          badgeData[existingBadgeIndex].sizing = data.member.sizing;
          return t.set("card", "shared", "badgeData", badgeData).then(() => t.closePopup());
        } else {
          console.log("CREATEDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD");
          fetch(`${API_URL}/members/member/${data.member.memberId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((response) => {
              console.log("Response Status:", response.status);
              if (response.ok) {
                return response.json();
              } else {
                throw new Error("Failed to fetch");
              }
            })
            .then((m) => {
              console.log("MEMBER", m);
              const member = m.data;
              const memberBadge = {
                title: member.name,
                text: data.member.sizing,
                color: "red",
                memberId: member._id,
                cardId: data.cardId,
                listId: data.listId,
                callback: function (t) {
                  let outSideContext = t;
                  return outSideContext.popup({
                    title: "Adjust Member Sizing",
                    items: [
                      // {
                      //   text: "Member: " + member.memberId.name,
                      // },
                      // {
                      //   text: "Current Sizing: " + member.sizing,
                      //   callback: function (t) {
                      //     return t.popup({
                      //       url: "input",
                      //       title: "Adjust Sizing",
                      //       url: `../adjust-size.html?cardId=${cardId.id}&idList=${idList.id}&idBoard=${idBoard.id}&memberId=${member.memberId.id}&memberName=${member.memberId.name}&currentSizing=${member.sizing}`,
                      //     });
                      //   },
                      // },
                      {
                        text: "Delete Member",
                        callback: function (t) {
                          const data = {
                            memberId: member._id,
                            cardId: data.cardId,
                          };
                          fetch(`${API_URL}/cards/delete-member`, {
                            method: "POST", // Specifying the HTTP method
                            headers: {
                              "Content-Type": "application/json", // Setting the content type of the request
                            },
                            body: JSON.stringify(data), // Converting the data to a JSON string
                          })
                            .then((response) => response.json()) // Parsing the JSON response from the server
                            .then((data) => {
                              console.log("Success:", data);
                              return t
                                .get("card", "shared", "detailBadgeData")
                                .then(function (badgeData) {
                                  console.log(
                                    "badgeDatabadgeDatabadgeData",
                                    badgeData
                                  );
                                  if (!badgeData) return;

                                  badgeData.forEach((badge) => {
                                    if (
                                      badge.memberId &&
                                      badge.memberId === data.memberId &&
                                      badge.cardId === data.cardId
                                    ) {
                                      console.log(badge.memberId, badge.cardId);
                                      badgeData = badgeData.filter(
                                        (b) =>
                                          b.memberId !== data.memberId &&
                                          b.cardId !== data.cardId
                                      );
                                    }
                                    if (
                                      badge.memberIds &&
                                      badge.memberIds.includes(data.memberId) &&
                                      badge.cardId === data.cardId
                                    ) {
                                      // Remove the member ID from the badge's memberIds array
                                      badge.memberIds = badge.memberIds.filter(
                                        (id) => id !== data.memberId
                                      );

                                      // If the memberIds array is now empty, remove the badge
                                      if (badge.memberIds.length === 0) {
                                        badgeData = badgeData.filter(
                                          (b) =>
                                            b.categoryId !== badge.categoryId &&
                                            b.cardId === data.cardId
                                        );
                                      }
                                    }
                                  });
                                  console.log("badgeData", badgeData);
                                  // Update pluginData with the updated badge data
                                  t.set(
                                    "card",
                                    "shared",
                                    "badgeData",
                                    badgeData
                                  );
                                });
                            })
                            .catch((error) => {
                              console.error("Error:", error); // Handling errors
                            });
                        },
                      },
                    ],
                  });
                },
              };
              badgeData.push(memberBadge);
              if (
                !(
                  badgeData.findIndex(
                    (badge) =>
                      badge.categoryId === member.category._id &&
                      badge.cardId === data.cardId
                  ) >= 0
                )
              ) {
                const categoryBadge = {
                  cardId: data.cardId,
                  categoryId: member.category._id,
                  color: member.category.color,
                  memberIds: [member._id],
                  listId: data.listId,
                  text: member.category.name,
                };
                badgeData.push(categoryBadge);
              }
              return t
                .set("card", "shared", "detailBadgeData", badgeData)
                .then(() => t.closePopup());
            })
            .catch((error) => console.log("Error:", error));
        }
        console.log("after badgeData", JSON.stringify(badgeData));
      });
    } else {
      console.error("Server responded with status", response.status);
    }
  } catch (error) {
    console.error("Error:", error);
  }
});
