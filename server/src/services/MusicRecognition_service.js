var crypto = require("crypto");
const axios = require("axios");
const FormData = require("form-data");

function buildStringToSign(
  method,
  uri,
  accessKey,
  dataType,
  signatureVersion,
  timestamp
) {
  return [method, uri, accessKey, dataType, signatureVersion, timestamp].join(
    "\n"
  );
}

function sign(signString, accessSecret) {
  return crypto
    .createHmac("sha1", accessSecret)
    .update(Buffer.from(signString, "utf-8"))
    .digest()
    .toString("base64");
}

/**
 * Identifies a sample of bytes
 */
function identify(data, options, cb) {
  var current_data = new Date();
  var timestamp = current_data.getTime() / 1000;
  console.log("options:", options);
  console.log("data received:", data);
  var stringToSign = buildStringToSign(
    "POST",
    options.endpoint,
    options.access_key,
    options.data_type,
    options.signature_version,
    timestamp
  );
  console.log("String to sign:", stringToSign);

  var signature = sign(stringToSign, options.access_secret);
  console.log("Signature:", signature);
  // const blobData = new Blob([data], { type: "application/octet-stream" });
  // console.log("Blob data created:", blobData);
  var form = new FormData();
  form.append("sample", data, {
    filename: "sample.wav",
    contentType: "audio/wav",
  });
  form.append("sample_bytes", data.length);
  form.append("access_key", options.access_key);
  form.append("data_type", options.data_type);
  form.append("signature_version", options.signature_version);
  form.append("signature", signature);
  form.append("timestamp", timestamp);
  console.log("Form data prepared:", form);
  axios
    .post("http://" + options.host + options.endpoint, form, {
      headers: form.getHeaders(),
    })
    .then((response) => {
      console.log("ACRCloud response:", response.data);
      cb(null, response.data);
    })
    .catch((error) => {
      console.error("Error during ACRCloud request:", error);
      cb(error, null);
    });

  //fetch("http://"+options.host + options.endpoint,
  //      {method: 'POST', body: form })
  //      .then((res) => {return res.text()})
  //      .then((res) => {cb(res, null)})
  //      .catch((err) => {cb(null, err)});
}

module.exports = identify;
