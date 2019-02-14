const qrCode = new QRCode("qrcode");

chrome.storage.sync.get(["RCID"], function({ RCID: value }) {
  const href = `http://ymrc.netlify.com/${value}`;
  qrCode.makeCode(href);
  link.textContent = href;
  link.href = href;
  pincode.textContent = value;
});
