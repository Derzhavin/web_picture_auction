export function setupHeader() {
  $("#header").children().get().forEach(button => {
    if ($(button).text() === $("title").text()) {
      $(button).css("background-color", "olivedrab");
    }
  });
}