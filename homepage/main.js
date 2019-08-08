// When the user scrolls down 20px from the top of the document, slide down the navbar
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 24 || document.documentElement.scrollTop > 24) {
    document.getElementById("scroll-nav").style.top = "0";
  } else {
    document.getElementById("scroll-nav").style.top = "-3em";
  }
}