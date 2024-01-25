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

async function onCategoryButtonClick(t) {
  const lists = await t.lists("all");
  let obj = [];

  for (let i = 0; i < lists.length; i++) {
    let listId = lists[i].id;

    const response = await fetch(`${ENDPOINT_URL}/cards/list/${listId}`, {
      method: "GET",
    });
    const parsedResponse = await response.json();
    const cards = parsedResponse.data;

    let list = {
      listName: lists[i].name,
      categoriesSizing: {},
      total: 0,
    };

    cards.forEach((card) => {
      card.members.forEach((member) => {
        if (member.categoryId) {
          const categoryId = member.categoryId._id;
          if (!list.categoriesSizing[categoryId]) {
            list.categoriesSizing[categoryId] = {
              name: member.categoryId.name,
              sizing: 0,
color: member.categoryId.color
            };
          }
          list.categoriesSizing[categoryId].sizing += member.sizing;
          list.total += member.sizing;
        }
      });
    });

    obj.push(list)
  }

  console.log("Result:", obj);
  showResults(t, obj)
  return obj;
}

function showResults(t, obj) {
  return t.boardBar({
    url: "./results.html",
    height: 300,
    args: { message: obj },
  });
}


async function onTypeButtonClick(t) {
  const lists = await t.lists("all");
  let obj = [];

  for (let i = 0; i < lists.length; i++) {
    let listId = lists[i].id;

    const response = await fetch(`${ENDPOINT_URL}/cards/list/${listId}`, {
      method: "GET",
    });
    const parsedResponse = await response.json();
    const cards = parsedResponse.data;

    let list = {
      listName: lists[i].name,
      total: 0,
      types: {},
    };

    cards.forEach((card) => {
      card.members.forEach((member) => {
        card.types.forEach((type) => {
          if (!list.types[type._id]) {
            list.types[type._id] = { name: type.name, sizing: 0, color: type.color };
          }
          list.types[type._id].sizing += member.sizing;
          list.total += member.sizing;
        });
      });
    });

    // Convert types object to array
    list.types = Object.values(list.types);
    obj.push(list);
  }

  console.log("Result:", obj);
  showTypeResults(t, obj);
  return obj;
}

function showTypeResults(t, obj) {
  return t.boardBar({
    url: "./type-results.html",
    height: 300,
    args: { message: obj },
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
        text: "Categories Report",
        condition: "always",
        callback: function (t) {
          return onCategoryButtonClick(t);
        },
      },
      {
        // we can either provide a button that has a callback function
        icon: {
          dark: UXPERTS_ICON,
          light: UXPERTS_ICON,
        },
        text: "Type Report",
        condition: "always",
        callback: function (t) {
          return onTypeButtonClick(t);
        },
      },
    ];
  },

  "card-buttons": async function (t, options) {
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
          t.get;
          return t.popup({
            // Title of the popup
            title: "Sizing Details",
            // URL of the page to load into the iframe
            url: "./sizing.html",

            // Height of the popup in pixels
            height: 240,
          });
        },
      },
      //       {
      //         // icon is the URL to an image to be used as the button's icon.
      //         // The image should be 24x24 pixels.
      //         icon: "https://cdn.glitch.global/bcb67d52-05a1-4b6e-a315-f5bae36b69eb/Add-Button-PNG.png?v=1688645933100",

      //         // text is the name of the button.
      //         text: "Category",

      //         // callback is a function that is called when the button is clicked.
      //         callback: function (t) {
      //           // Popup an iframe when the button is clicked.
      //           // The iframe will load the URL provided and display it in a modal.
      //           return t.popup({
      //             // Title of the popup
      //             title: "Add Category",

      //             // URL of the page to load into the iframe
      //             url: "./category.html",

      //             // Height of the popup in pixels
      //             height: 184,
      //           });
      //         },
      //       },
      {
        // icon is the URL to an image to be used as the button's icon.
        // The image should be 24x24 pixels.
        icon: "https://cdn.glitch.global/bcb67d52-05a1-4b6e-a315-f5bae36b69eb/Add-Button-PNG.png?v=1688645933100",

        // text is the name of the button.
        text: "Type",

        // callback is a function that is called when the button is clicked.
        callback: function (t) {
          // Popup an iframe when the button is clicked.
          // The iframe will load the URL provided and display it in a modal.
          return t.popup({
            // Title of the popup
            title: "Add Type",

            // URL of the page to load into the iframe
            url: "./type.html",

            // Height of the popup in pixels
            height: 240,
          });
        },
      },
    ];
  },
  // "card-badges": function (t, options) {
  //   return t.get("card", "shared", "badgeData").then(function (badgeData) {
  //     console.log("badgeData", badgeData);
  //     // Otherwise, fetch the badge data from the backend and store it in pluginData
  //     return t
  //       .card("id")
  //       .get("id")
  //       .then(function (cardId) {
  //         return fetch(`${ENDPOINT_URL}/cards/${cardId}`)
  //           .then((response) => response.json())
  //           .then((data) => {
  //             console.log("data", data);
  //             const membersBadges = data.data.members.map((member) => {
  //               return {
  //                 text: `${member.memberId.name} ${member.sizing}`,
  //                 color: "red",
  //                 sizing: member.sizing,
  //                 memberId: member.memberId._id,
  //                 cardId: cardId,
  //                 listId: data.data.listId,
  //               };
  //             });
  //             console.log(data.data.categories);
  //             const categoriesBadges = data.data.categories.map((category) => ({
  //               text: category.name,
  //               color: category.color,
  //               icon: category.icon,
  //               categoryId: category.id,
  //               cardId: cardId,
  //               listId: data.data.listId,
  //             }));
  //             const typesBadges = data.data.types.map((type) => ({
  //               text: type.name,
  //               color: type.color,
  //               typeId: type.id,
  //               cardId: cardId,
  //               listId: data.data.listId,
  //             }));
  //             const badges = [
  //               ...membersBadges,
  //               ...categoriesBadges,
  //               ...typesBadges,
  //             ];
  //             // Store the badge data in pluginData for future use
  //             return t.set("card", "shared", "badgeData", badges).then(() => {
  //               return badges;
  //             });
  //           });
  //       });
  //   });
  // },
  "card-badges": function (t, options) {
    return FetchAndPaint(t);
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
                console.log("datadatadatadatadata", data);
                let detailBadges = [];
                if (data.data) {
                  let memberBadges = [];
                  data.data.members.forEach((member) => {
                    console.log(member);
                    if (member?.memberId?._id) {
                      memberBadges.push({
                        title: member.memberId.name,
                        text: member.sizing,
                        sizing: member.sizing,
                        color: "red",
                        memberId: member.memberId._id,
                        cardId: cardId,
                        listId: data.data.listId,
                        pointId: member._id,
                        callback: function (t) {
                          // Fetch initial data
                          //fetch
                          const initialFormData = {
                            cardId: cardId,
                            pointId: member._id,
                          };
                          return t.popup({
                            title: "Adjust Member Sizing",
                            url: "./adjust-size.html",
                            args: { initialFormData },
                            height: 240,
                          });
                        },
                      });
                      console.log(
                        "memberBadgesmemberBadgesmemberBadges",
                        memberBadges
                      );
                    }
                  });
                  const categoriesBadges = data.data.members
                    // First, reduce to unique categories
                    .reduce((uniqueCategories, member) => {
                      if (
                        !uniqueCategories.some(
                          (uc) => uc.categoryId?._id === member.categoryId?._id
                        )
                      ) {
                        uniqueCategories.push(member);
                      }
                      return uniqueCategories;
                    }, [])
                    .filter((member) => member.categoryId)
                    .map((member) => {
                      const categoryBadge = {
                        title: "",
                        text: member.categoryId.name,
                        sizing: member.sizing,
                        color: member.categoryId.color,
                        cardId: cardId,
                        categoryId: member.categoryId._id,
                        pointId: member._id,
                        listId: data.data.listId,
                        // callback: function (t) {
                        //   // Fetch initial data
                        //   //fetch
                        //   const initialFormData = {
                        //     cardId: cardId,
                        //     pointId: member._id,
                        //     listId: data.data.listId
                        //   };
                        //   return t.popup({
                        //     title: "Adjust Member Sizing",
                        //     url: "./adjust-size.html",
                        //     args: { initialFormData },
                        //     height: 240,
                        //   });
                        // },
                      };
                      console.log("Unique Category Badge:", categoryBadge);
                      return categoryBadge;
                    });

                  const typesBadges = data.data.types.map((type) => ({
                    text: type.name,
                    color: type.color,
                    icon: type.icon,
                    typeId: type.id,
                    cardId: cardId,
                    listId: data.data.listId,

                    callback: function (t) {
                      // Logic to handle type deletion
                      const deleteData = {
                        typeId: type.id,
                        cardId: cardId,
                      };
                      console.log("deleteData", deleteData);
                      fetch(`${ENDPOINT_URL}/cards/delete-type`, {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify(deleteData),
                      })
                        .then((response) => response.json())
                        .then((responseData) => {
                          // Remove the type from the badgeData
                          const updatedDetailBadges = detailBadgeData.filter(
                            (badge) => badge.typeId !== type.id
                          );
                          return t.set(
                            "card",
                            "shared",
                            "detailBadgeData",
                            updatedDetailBadges
                          );
                        })
                        .catch((error) => {
                          console.error("Error deleting type:", error);
                        });
                    },
                  }));

                  detailBadges = [
                    ...memberBadges,
                    ...categoriesBadges,
                    ...typesBadges,
                  ];
                  console.log("detailBadges", detailBadges);
                }

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

function FetchAndPaint(t) {
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
              console.log("datadatadatadatadata", data);
              let detailBadges = [];
              if (data.data) {
                let memberBadges = [];
                data.data.members.forEach((member) => {
                  console.log(member);
                  if (member?.memberId?._id) {
                    memberBadges.push({
                      text: `${member.memberId.name} ${member.sizing}`,
                      sizing: member.sizing,
                      color: "red",
                      memberId: member.memberId._id,
                      cardId: cardId,
                      listId: data.data.listId,
                      pointId: member._id,
                    });
                    console.log(
                      "memberBadgesmemberBadgesmemberBadges",
                      memberBadges
                    );
                  }
                });
                const categoriesBadges = data.data.members
                  // First, reduce to unique categories
                  .reduce((uniqueCategories, member) => {
                    if (
                      !uniqueCategories.some(
                        (uc) => uc.categoryId?._id === member.categoryId?._id
                      )
                    ) {
                      uniqueCategories.push(member);
                    }
                    return uniqueCategories;
                  }, [])
                  .filter((member) => member.categoryId)
                  .map((member) => {
                    const categoryBadge = {
                      text: member.categoryId.name,
                      sizing: member.sizing,
                      color: member.categoryId.color,
                      cardId: cardId,
                      categoryId: member.categoryId._id,
                      pointId: member._id,
                      listId: data.data.listId,
                    };
                    console.log("Unique Category Badge:", categoryBadge);
                    return categoryBadge;
                  });
                console.log(
                  "data.data.typesdata.data.typesdata.data.types",
                  data.data.types
                );
                const typesBadges = data.data.types.map((type) => ({
                  text: type.name,
                  color: type.color,
                  icon: type.icon,
                  typeId: type.id,
                  cardId: cardId,
                  listId: data.data.listId,

                  callback: function (t) {
                    // Logic to handle type deletion
                    const deleteData = {
                      typeId: type.id,
                      cardId: cardId,
                    };
                    console.log("deleteData", deleteData);
                    fetch(`${ENDPOINT_URL}/cards/delete-type`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify(deleteData),
                    })
                      .then((response) => response.json())
                      .then((responseData) => {
                        // Remove the type from the badgeData
                        const updatedDetailBadges = detailBadgeData.filter(
                          (badge) => badge.typeId !== type.id
                        );
                        return t.set(
                          "card",
                          "shared",
                          "detailBadgeData",
                          updatedDetailBadges
                        );
                      })
                      .catch((error) => {
                        console.error("Error deleting type:", error);
                      });
                  },
                }));

                detailBadges = [
                  ...memberBadges,
                  ...categoriesBadges,
                  ...typesBadges,
                ];
                console.log("detailBadges", detailBadges);
              }
              return detailBadges;
            });
        });
    });
}
