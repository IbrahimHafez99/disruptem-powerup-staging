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

var DISRUPTEM_ICON1 =
  "https://cdn.glitch.com/bcb67d52-05a1-4b6e-a315-f5bae36b69eb%2FIcon-Color%403x.png?v=1625811265010";
var DISRUPTEM_ICON2 =
  "https://cdn.glitch.com/bcb67d52-05a1-4b6e-a315-f5bae36b69eb%2F1.png?v=1625811412559";
var DISRUPTEM_ICON3 =
  "https://cdn.glitch.com/bcb67d52-05a1-4b6e-a315-f5bae36b69eb%2Fdisruptem-Icon_White.png?v=1625811831046";

var onBtnClick = function (t, opts) {
  // console.log('Someone clicked the button');
  var cardEstimateArr = new Array();
  var obj2 = [];

  // t.cards return a set of values,
  //values are in object of nested array,
  //values of outer array assign to tempArray
  //then values of inner array assigned to an array of card IDs as keys
  return t.cards("id", "idList", "name").then(function (cards) {
    //cardID array created with all IDs in on the board
    // var tempArray = Object.values(cards);
    console.log("Cards values :", cards);

    var listEstimateArr = [];
    var backendEstimate = 0;
    var result = [];

    var promises = [];
    var cArr = [];

    cards.map(
      (key) =>
        promises.push(
          t.get(key.id, "shared").then(function (data) {
            listEstimateArr.push({
              idList: key.idList,
              backendEstimate: data.backend_estimate
                ? data.backend_estimate
                : 0,
              frontendEstimate: data.frontend_estimate
                ? data.frontend_estimate
                : 0,
            });
            // });
          })
        )
      // .then(() =>console.log("listEstimateArr: ", listEstimateArr))
    );

    //Pass listEstimateArr to promise caller, merge idList that are equal and sum the their backendEstimate values
    Promise.all(promises, t).then(() => {
      var holder = {}; // holds the merged lists of backend_estimate
      var holder2 = {}; // holds the merged lists of frontend_estimate

      console.log("listEstimateArr...2:", listEstimateArr);
      // Combine same idList and add their values
      listEstimateArr.forEach(function (d) {
        if (holder.hasOwnProperty(d.idList)) {
          holder[d.idList] =
            holder[d.idList] +
            (parseFloat(d.backendEstimate) ? parseFloat(d.backendEstimate) : 0);

          holder2[d.idList] =
            holder2[d.idList] +
            (parseFloat(d.frontendEstimate)
              ? parseFloat(d.frontendEstimate)
              : 0);
        } else {
          holder[d.idList] = parseFloat(d.backendEstimate)
            ? parseFloat(d.backendEstimate)
            : 0;
          holder2[d.idList] = parseFloat(d.frontendEstimate)
            ? parseFloat(d.frontendEstimate)
            : 0;
        }
      });

      console.log("listEstimateArr...3:", listEstimateArr);

      console.log("holder: ", holder);
      console.log("holder2: ", holder2);

      return t.lists("id", "name").then(function (lists) {
        //retrieve list name from list id
        lists.map((key) => {
          for (var prop in holder) {
            console.log("holder[prop]: ", holder[prop]);
            if (key.id == prop) {
              console.log("holder2[prop]: ", holder2[prop]);
              obj2.push({
                nameList: key.name,
                value: holder[prop],
                value2: holder2[prop],
              });
            }
          }
        });
        console.log("obj2:", obj2);
        // t.set('board', 'shared','obj2size', obj2);
        return t.boardBar({
          title: "Calculated Points",
          url: "./results.html",
          args: { message: obj2 },
        });
      });
    });
  });
};

// function onBtnClickTwo(t) {
//   // get all lists on the board
//   return t.lists("all").then(function (lists) {
//     lists.forEach(function (list) {
//       console.log("List name: ", list.name);
//       // get all cards in the list
//       t.cards("all", list.id).then(function (cards) {
//         let totalSize = 0;
//         // dictionary to hold points per category
//         let categoryPoints = {};
//         let categories = {}
//         cards.forEach(function (card) {
//           // retrieve memberSizing from the card
//           Promise.all([t.get(card.id, "shared", "memberSizing"),t.get(card.id, "shared", "category") ]).then(function (
//             memberSizing, category
//           ) {
//             // calculate total points
//             totalSize += memberSizing && memberSizing.reduce((acc, element) => Number(acc) + Number(element.sizing))
//             if(category) {
//               if(category in categories) {
//                 categories[]
//               }
//             }
            
//           });
//         });
//         // log the totals
//         console.log("Total points for list: ", totalSize);
//         console.log("Category points: ", categoryPoints);
//       });
//     });
//   });
// }

function removeMemberBadge(t, indexToRemove) {
  return t.get("card", "shared", "memberSizing").then(function (memberSizing) {
    // Remove the element at indexToRemove from memberSizing
    const updatedMemberSizing = memberSizing.filter(
      (_, index) => index !== indexToRemove
    );
    // Update the memberSizing data in Trello
    return t.set("card", "shared", "memberSizing", updatedMemberSizing);
  });
}
function removeAccountBadge(t) {
  return t.get("card", "shared", "account").then(function () {
    return t.remove("card", "shared", "account");
  });
}
function removeCategoryBadge(t) {
  return t.get("card", "shared", "category").then(function () {
    return t.remove("card", "shared", "category");
  });
}
window.TrelloPowerUp.initialize({
  "board-buttons": function (t, opts) {
    console.log(opts);

    return [
      {
        // we can either provide a button that has a callback function
        icon: {
          dark: DISRUPTEM_ICON3,
          light: DISRUPTEM_ICON3,
        },
        text: "Disrupt'em",
        condition: "always",
        callback: function (t) {
          return onBtnClick(t);
        },
      },
    ];
  },

  "card-buttons": function (t, options) {
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
      {
        // icon is the URL to an image to be used as the button's icon.
        // The image should be 24x24 pixels.
        icon: "https://icons.veryicon.com/png/o/commerce-shopping/icon-of-lvshan-valley-mobile-terminal/home-category.png",

        // text is the name of the button.
        text: "Category",

        // callback is a function that is called when the button is clicked.
        callback: function (t) {
          // Popup an iframe when the button is clicked.
          // The iframe will load the URL provided and display it in a modal.
          return t.popup({
            // Title of the popup
            title: "Categories",

            // URL of the page to load into the iframe
            url: "./category.html",

            // Height of the popup in pixels
            height: 184,
          });
        },
      },
      {
        // icon is the URL to an image to be used as the button's icon.
        // The image should be 24x24 pixels.
        icon: "https://icons.veryicon.com/png/o/miscellaneous/administration/account-25.png",

        // text is the name of the button.
        text: "Accounts",

        // callback is a function that is called when the button is clicked.
        callback: function (t) {
          // Popup an iframe when the button is clicked.
          // The iframe will load the URL provided and display it in a modal.
          return t.popup({
            // Title of the popup
            title: "Account",

            // URL of the page to load into the iframe
            url: "./account.html",

            // Height of the popup in pixels
            height: 184,
          });
        },
      },
    ];
  },

  //   didn't need it
  // 1. use t.set(board, shared, estimate-ListID_cardID,value) instead of t.set(card,shared,key)
  // 2. use t.get(board, shared ) to get all listIDs on the board-button level
  // 3. add all values for each estimate-listID_ match
  // 4. display the added value for each list with list name and value addition
  "card-badges": function (t, options) {
    // Use t.get to retrieve the stored data
    return Promise.all([
      t.get("card", "shared", "account"),
      t.get("card", "shared", "category"),
    ]).then(function ([account, category]) {
      return [
        account && { text: account.accountName, color: "yellow" },
        category && {
          // Display the member ID and sizing as the badge text
          title: "Category",
          text: "Name: " + category.categoryName,
          color: "lime",
        },
      ];
    });
  },
  // return memberSizing.map(function (ms) {
  //         console.log(ms);
  //         return {
  //           // Display the member ID and sizing as the badge text
  //           text: ms.memberName + " Sizing: " + ms.sizing,
  //           color: "red",
  //           // You could also set color and icon properties
  //         };
  //       });
  "card-detail-badges": function (t, options) {
    // Use t.get to retrieve the stored data
    return Promise.all([
      t.get("card", "shared", "memberSizing"),
      t.get("card", "shared", "account"),
      t.get("card", "shared", "category"),
    ]).then(function ([memberSizing, account, category]) {
      console.log(memberSizing, account);
      // memberSizing is an array of member sizing objects
      // Map each member sizing to a badge
      const members = memberSizing
        ? memberSizing.map(function (ms, index) {
            return {
              // Display the member ID and sizing as the badge text
              title: ms.memberName,
              text: "Sizing: " + ms.sizing,
              color: "red",
              callback: function (t, opts) {
                return removeMemberBadge(t, index);
              },
              // You could also set color and icon properties
            };
          })
        : [];
      const result = [
        ...members,
        account && {
          // Display the member ID and sizing as the badge text
          title: "Account",
          text: "Name: " + account.accountName,
          color: "yellow",
          callback: function (t, opts) {
            return removeAccountBadge(t);
          },
        },
        category && {
          // Display the member ID and sizing as the badge text
          title: "Category",
          text: "Name: " + category.categoryName,
          color: "lime",
          callback: function (t, opts) {
            return removeCategoryBadge(t);
          },
        },
      ];
      return result;
    });
  },
  // "card-detail-badges": function (t, options) {
  //   // return t.get('card', 'shared', 'backend_estimate')
  //   return t.getAll().then(function (estimates) {
  //     var backend_estimate = estimates["card"]["shared"]["backend_estimate"];
  //     var frontend_estimate = estimates["card"]["shared"]["frontend_estimate"];
  //     return [
  //       {
  //         title: "Backend Estimate",
  //         color:
  //           backend_estimate == null || backend_estimate == 0 ? null : "blue",
  //         text:
  //           backend_estimate == null || backend_estimate == 0
  //             ? null
  //             : backend_estimate,
  //         callback: function (t) {
  //           return t.popup({
  //             title: "Backend Estimation",
  //             url: "estimate.html",
  //           });
  //         },
  //       },
  //       {
  //         title: "Frontend Estimate",
  //         color:
  //           frontend_estimate == null || frontend_estimate == 0
  //             ? null
  //             : "orange",
  //         text:
  //           frontend_estimate == null || frontend_estimate == 0
  //             ? null
  //             : frontend_estimate,
  //         callback: function (t) {
  //           return t.popup({
  //             title: "Frontend Estimation",
  //             url: "estimate.html",
  //           });
  //         },
  //       },
  //     ];
  //   });
  // },
});
