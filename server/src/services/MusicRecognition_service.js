const crypto = require("crypto");
const request = require("request");

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

function identify(data, options, cb) {
  const timestamp = Math.floor(new Date().getTime() / 1000);

  console.log("Data buffer:", Buffer.isBuffer(data));
  console.log("options:", options);
  const stringToSign = buildStringToSign(
    "POST",
    options.endpoint,
    options.access_key,
    options.data_type,
    options.signature_version,
    timestamp
  );
  console.log("String to sign:", stringToSign);
  console.log("Access key:", options.access_key);
  const signature = sign(stringToSign, options.access_secret);
  console.log("Signature:", signature);
  console.log("Signature length:", signature.length);
  const formData = {
    sample: data,
    access_key: options.access_key,
    data_type: options.data_type,
    signature_version: options.signature_version,
    signature: signature,
    sample_bytes: data.length,
    timestamp: timestamp,
  };
  console.log("Form data:", formData);
  console.log("Form data length:", Object.keys(formData).length);

  request.post(
    {
      url: `http://${options.host}${options.endpoint}`,
      method: "POST",
      formData: formData,
    },
    cb
  );
}

module.exports = {
  identify,
};
