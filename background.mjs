const RCID = "RCID";
let JSONRPCMID = 0;
let ports = [];

Pusher.logToConsole = true;

const last = arr => arr[arr.length - 1];

const shuffle = ([...arr]) => {
  let m = arr.length;
  while (m) {
    const i = Math.floor(Math.random() * m--);
    [arr[m], arr[i]] = [arr[i], arr[m]];
  }
  return arr;
};

function generatePin(pinLength) {
  var pinCodeArray = [];
  const seed = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  if (!pinLength) {
    throw new Error("Missing required param: pinLength");
  }

  if (pinLength !== parseInt(pinLength, 10) || parseInt(pinLength, 10) < 0) {
    throw new Error("pinLength is not a whole number");
  }

  for (var i = 0; i < pinLength; i++) {
    const random = shuffle(seed.slice(0));
    pinCodeArray.push(random[0]);
  }

  return pinCodeArray.join("");
}

const pusher = new Pusher("3f43dc4d450902026e31", {
  cluster: "eu",
  forceTLS: true,
  disableStats: true
});

chrome.storage.sync.get([RCID], ({ [RCID]: value }) => {
  if (value == null) {
    value = generatePin(8);
    chrome.storage.sync.set({
      [RCID]: value
    });
  }

  const channel = pusher.subscribe(`${RCID}-${value}`);

  const createSendMessageHandler = method => () => {
    const port = last(ports);
    if (port) {
      port.postMessage({
        id: JSONRPCMID++,
        method,
        params: []
      });
    }
  };

  const proxyEvent = event => {
    channel.bind(event, createSendMessageHandler(event));
  };

  proxyEvent("play");
  proxyEvent("pause");
  proxyEvent("nextTrack");
  proxyEvent("prevTrack");
});

chrome.runtime.onConnect.addListener(port => {
  const idx = ports.length;
  ports.push(port);

  port.onDisconnect.addListener(() => {
    ports.splice(idx, 1);
  });
});
