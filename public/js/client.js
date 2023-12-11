/* global TrelloPowerUp */

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

var UXPERTS_ICON =
  "https://cdn.glitch.global/b9a2fc2c-0745-4a5e-83e6-d1ab9f13253f/Icon-Color%20(1).png?v=1698916395399";
var ENDPOINT_URL = "http://localhost:9000/api/v1";
// var ENDPOINT_URL = "https://uxperts-backend-staging.disruptem.com/api/v1"
// var ENDPOINT_URL = "https://powerup-backend.uxperts.io/api/v1";
async function fetchCards() {
  const response = await fetch(`${ENDPOINT_URL}/cards/`, { method: "GET" });
  return await response.json();
}
function aggregateCategories(data) {
  const categories = {};

  data.forEach((item) => {
    // Check if the item is a category
    if (item.categoryId) {
      // Initialize the category if it hasn't been already
      if (!categories[item.categoryId]) {
        categories[item.categoryId] = {
          text: item.text,
          color: item.color,
          icon: item.icon,
          categoryId: item.categoryId,
          sizing: 0,
        };
      }

      // Add the sizing of each memberId associated with this category
      item.memberIds.forEach((memberId) => {
        const member = data.find((member) => member.memberId === memberId);
        if (member) {
          categories[item.categoryId].sizing += member.sizing;
        }
      });
    }
  });

  // Convert the categories object into an array
  return Object.values(categories);
}

function onBtnClickTwo(t) {
  return t.lists("all").then(function (lists) {
    t.list;
    console.log("lists", lists);
    // lists.sort((a, b) => a.pos - b.pos);
    let results = Array(lists.length);
    let listPromises = lists.map(function (list, index) {
      return t.cards("all").then(function (cards) {
        var cardList = cards.filter((card) => card.idList === list.id);
        console.log("CARDSSSSS", cardList);
        let totalSizeList = 0;
        let categories = [];

        let cardPromises = cardList.map(function (card, index) {
          return t
            .get(card.id, "shared", "badgeData")
            .then(function (badgeData) {
              let totalSizeCard = 0;
              console.log(`badgeDatra_${index}`, badgeData);
              if (badgeData) {
                totalSizeCard = badgeData.reduce((acc, element) => {
                  if (
                    element.sizing &&
                    cardList.map((card) => card.id).includes(element.cardId)
                  ) {
                    return acc + Number(element.sizing);
                  }
                  return acc;
                }, 0);
                console.log("totalSizeCardtotalSizeCard", totalSizeCard);
                totalSizeList += totalSizeCard;

                const categorySize = badgeData
                  .filter(
                    (badge) =>
                      badge.categoryId &&
                      badge.listId === list.id &&
                      badge.cardId === card.id
                  )
                  .map((category) => {
                    return {
                      categoryId: category.categoryId,
                      name: category.text,
                      color: category.color,
                      sizing: category.memberIds.reduce((acc, memberId) => {
                        const index = badgeData.findIndex(
                          (badge) =>
                            badge.memberId === memberId &&
                            badge.listId === list.id &&
                            badge.cardId === card.id
                        );
                        return acc + (index >= 0 ? badgeData[index].sizing : 0);
                      }, 0),
                    };
                  });
                const aggregatedCategories = aggregateCategories(badgeData);
                console.log("aggregatedCategories", aggregatedCategories);
                categories = [...categories, ...aggregatedCategories];
              }
              return Promise.resolve();
            });
        });

        return Promise.all(cardPromises).then(() => {
          // Group by 'text' and sum 'sizing'
          const result = Object.values(
            categories.reduce((acc, { text, color, icon, sizing }) => {
              if (!acc[text]) {
                acc[text] = { text, color, icon, sizing: 0 };
              }
              acc[text].sizing += sizing;
              return acc;
            }, {})
          );
          results[index] = {
            listName: list.name,
            totalPoints: totalSizeList,
            categoryPoints: result,
          };
        });
      });
    });

    return Promise.all(listPromises).then(() => {
      console.log("results", results);
      showResults(t, results);
    });
  });
}

function showResults(t, obj2) {
  return t.boardBar({
    url: "./results.html",
    height: 300,
    args: { message: obj2 },
  });
}

window.TrelloPowerUp.initialize({
  "board-buttons": function (t, opts) {
    console.log(opts);
    return [
      {
        // we can either provide a button that has a callback function
        icon: {
          dark: UXPERTS_ICON,
          light: UXPERTS_ICON,
        },
        text: "Report",
        condition: "always",
        callback: function (t) {
          return onBtnClickTwo(t);
        },
      },
    ];
  },

  "card-buttons": async function (t, options) {
    const completionStatusButton = await t
      .card("id")
      .get("id")
      .then((cardId) => {
        // Fetch the completion status from your backend
        return fetch(`${ENDPOINT_URL}/cards/${cardId}`, { method: "GET" })
          .then((response) => {
            console.log("response", response);
            return response.json();
          })
          .then(async (response) => {
            const data = response.data;
            console.log("datadatadatadatadatadata", data);
            const isCompleted = await t.get(
              "card",
              "shared",
              "isCompleted",
              data.isCompleted
            );
            const buttonColor = isCompleted ? "green" : "red";
            const buttonText = isCompleted ? "Completed" : "Mark as Completed";

            return {
              icon: "https://your-icon-url.com/icon.png",
              text: buttonText,
              color: buttonColor,
              callback: function (t) {
                // Logic to toggle the completion status
                return fetch(`${ENDPOINT_URL}/cards/status`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    cardId,
                    isCompleted: !isCompleted,
                  }),
                }).then((response) => {
                  if (response.ok) {
                    // If API call is successful, trigger UI update
                    t.set("card", "shared", "isCompleted", !isCompleted);
                  }
                  return response.json();
                });
              },
              condition: "edit",
            };
          }).catch(error => console.log(error));
      });
    return [
      {
        // icon is the URL to an image to be used as the button's icon.
        // The image should be 24x24 pixels.
        icon: "https://cdn.glitch.global/bcb67d52-05a1-4b6e-a315-f5bae36b69eb/Add-Button-PNG.png?v=1688645933100",

        // text is the name of the button.
        text: "Estimate",

        // callback is a function that is called when the button is clicked.
        callback: function (t) {
          // Popup an iframe when the button is clicked.
          // The iframe will load the URL provided and display it in a modal.
          return t.popup({
            // Title of the popup
            title: "Sizing Details",

            // URL of the page to load into the iframe
            url: "./sizing.html",

            // Height of the popup in pixels
            height: 184,
          });
        },
      },
      completionStatusButton,
    ];
  },
  "card-badges": function (t, options) {
    return t.get("card", "shared", "badgeData").then(function (badgeData) {
      console.log("badgeData", badgeData);
      // Otherwise, fetch the badge data from the backend and store it in pluginData
      return t
        .card("id")
        .get("id")
        .then(function (cardId) {
          return fetch(`${ENDPOINT_URL}/cards/${cardId}`)
            .then((response) => response.json())
            .then((data) => {
              console.log("data", data);
              const membersBadges = data.data.members.map((member) => {
                return {
                  text: `${member.memberId.name} ${member.sizing}`,
                  color: "red",
                  sizing: member.sizing,
                  memberId: member.memberId._id,
                  cardId: cardId,
                  listId: data.data.listId,
                };
              });

              const categoriesBadges = data.data.members.reduce(
                (acc, member) => {
                  const category = member.memberId.category;
                  const existingCategoryBadge = acc.find(
                    (badge) => badge.categoryId === category.id
                  );
                  if (existingCategoryBadge) {
                    existingCategoryBadge.memberIds.push(member.memberId._id);
                  } else {
                    acc.push({
                      text: category.name,
                      color: category.color,
                      icon: category.icon,
                      categoryId: category.id,
                      memberIds: [member.memberId._id],
                      cardId: cardId,
                      listId: data.data.listId,
                    });
                  }
                  return acc;
                },
                []
              );
              const badges = [...membersBadges, ...categoriesBadges];

              // Store the badge data in pluginData for future use
              return t.set("card", "shared", "badgeData", badges).then(() => {
                return badges;
              });
            });
        });
    });
  },
  "card-detail-badges": function (t, options) {
    return t
      .get("card", "shared", "detailBadgeData")
      .then(function (detailBadgeData) {
        return t
          .card("id")
          .get("id")
          .then(function (cardId) {
            return fetch(`${ENDPOINT_URL}/cards/${cardId}`)
              .then((response) => response.json())
              .then((data) => {
                const membersBadges = data.data.members.map((member) => {
                  const badge = {
                    title: member.memberId.name,
                    text: member.sizing,
                    sizing: member.sizing,
                    color: "red",
                    memberId: member.memberId._id,
                    cardId: cardId,
                    listId: data.data.listId,
                    callback: function (t) {
                      let outSideContext = t;
                      return outSideContext.popup({
                        title: "Adjust Member Sizing",
                        items: [
                          {
                            text: "Delete Member",
                            callback: function (t) {
                              const data = {
                                memberId: member.memberId._id,
                                cardId: cardId,
                              };
                              fetch(`${ENDPOINT_URL}/cards/delete-member`, {
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
                                          console.log(
                                            badge.memberId,
                                            badge.cardId
                                          );
                                          badgeData = badgeData.filter(
                                            (b) =>
                                              b.memberId !== data.memberId &&
                                              b.cardId !== data.cardId
                                          );
                                        }
                                        if (
                                          badge.memberIds &&
                                          badge.memberIds.includes(
                                            data.memberId
                                          ) &&
                                          badge.cardId === data.cardId
                                        ) {
                                          // Remove the member ID from the badge's memberIds array
                                          badge.memberIds =
                                            badge.memberIds.filter(
                                              (id) => id !== data.memberId
                                            );

                                          // If the memberIds array is now empty, remove the badge
                                          if (badge.memberIds.length === 0) {
                                            badgeData = badgeData.filter(
                                              (b) =>
                                                b.categoryId !==
                                                  badge.categoryId &&
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

                              console.log(
                                "Deleting member with ID: ",
                                member.memberId._id,
                                cardId.id
                              );
                              // Implement your logic here to delete the member from the card
                            },
                          },
                        ],
                      });
                    },
                  };
                  console.log("badgebadgebadgebadge", badge);
                  // Add a callback if this isn’t a member sizing badge

                  return badge;
                });

                const categoriesBadges = data.data.members.reduce(
                  (acc, member) => {
                    const category = member.memberId.category;
                    const existingCategoryBadge = acc.find(
                      (badge) => badge.categoryId === category.id
                    );

                    if (existingCategoryBadge) {
                      existingCategoryBadge.memberIds.push(member.memberId._id);
                    } else {
                      acc.push({
                        text: category.name,
                        color: category.color,
                        icon: category.icon, // Only if categories have icons
                        categoryId: category.id,
                        memberIds: [member.memberId._id],
                        cardId: cardId,
                        listId: data.data.listId,
                      });
                    }
                    return acc;
                  },
                  []
                );

                const detailBadges = [...membersBadges ]; //...categoriesBadges removed
                console.log("detailBadges", detailBadges);

                // Store the badge data in pluginData for future use
                return t
                  .set("card", "shared", "detailBadgeData", detailBadges)
                  .then(() => {
                    return detailBadges;
                  });
              });
          });
      });
  },
});
