var crypto = require("crypto");
//npm install request
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
async function identify(data, options, cb) {
  var current_data = new Date();
  var timestamp = current_data.getTime() / 1000;

  var stringToSign = buildStringToSign(
    "POST",
    options.endpoint,
    options.access_key,
    options.data_type,
    options.signature_version,
    timestamp
  );

  var signature = sign(stringToSign, options.access_secret);
  try {
    var form = new FormData();
    form.append("sample", data);
    form.append("sample_bytes", data.length);
    form.append("access_key", options.access_key);
    form.append("data_type", options.data_type);
    form.append("signature_version", options.signature_version);
    form.append("signature", signature);
    form.append("timestamp", timestamp);
    // console.log("Form data:", form);
    const result = await axios.post(
      "http://" + options.host + options.endpoint,
      form,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log("Result:", result.data);
    return cb(null, result.data);
  } catch (err) {
    console.error("Error:", err);

    return cb(err, null);
  }
}

module.exports = {
  identify,
};
