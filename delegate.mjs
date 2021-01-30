function clickOn(className) {
  const playerControls = document.getElementsByClassName("player-controls")[0];
  playerControls.getElementsByClassName(className)[0].click();
}

const port = chrome.runtime.connect("bjfkhmdfgmkocdelkdjcbciajmcaonnh", {
  name: "channel",
});

port.onMessage.addListener((message) => {
  const { method } = message;
  switch (method) {
    case "play":
      clickOn("player-controls__btn_play");
      break;
    case "pause":
      clickOn("player-controls__btn_pause");
      break;
    case "nextTrack":
      clickOn("player-controls__btn_next");
      break;
    case "prevTrack":
      clickOn("player-controls__btn_prev");
      break;
  }
});
