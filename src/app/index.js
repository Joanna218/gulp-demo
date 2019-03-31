$("#main-banner").sliderPro({
  width: "100%",
  height: 500,
  arrows: true,
  buttons: false,
  waitForLayers: true,
  thumbnailWidth: 200,
  thumbnailHeight: 100,
  thunbnailPointer: true,
  autoplay: false,
  autoScaleLayers: false
});

$(".popup-gallery").magnificPopup({
  delegate: "a",
  type: "image",
  tLoading: "Loading image ....",
  mainClass: "mip-img-mobile",
  gallery: {
    enable: true,
    navigateByImgClick: true,
    preload: [0, 1]
  },
  image: {
    tError: '<a href="%url%> The image...</a> could not be ~',
    titleSrc: function(item) {
      return itemel.attr("title") + "<small>by Marsel Van ~</small>";
    }
  }
});

// (function () {
//   "use strict";

//   $("#main-banner").sliderPro({
//     width: "100%",
//     height: 500,
//     arrows: true,
//     buttons: false,
//     waitForLayers: true,
//     thumbnailWidth: 200,
//     thumbnailHeight: 100,
//     thunbnailPointer: true,
//     autoplay: false,
//     autoScaleLayers: false
//   });

//   $(".popup-gallery").magnificPopup({
//     delegate: "a",
//     type: "image",
//     tLoading: "Loading image ....",
//     mainClass: "mip-img-mobile",
//     gallery: {
//       enable: true,
//       navigateByImgClick: true,
//       preload: [0, 1]
//     },
//     image: {
//       tError: '<a href="%url%> The image...</a> could not be ~',
//       titleSrc: function(item) {
//         return itemel.attr("title") + "<small>by Marsel Van ~</small>";
//       }
//     }
//   });
// });
