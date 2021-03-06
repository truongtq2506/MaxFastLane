const plist = require("plist");
const semver = require("semver");
const fs = require("fs");
const path = require("path");
const child_process = require("child_process");
const VERSION_JSON = "version.json";
const PROJECT_DIR = process.cwd();
const packageJson = require(path.join(PROJECT_DIR, "package.json"));

const IOS_PROJECT_DIR = path.join("ios", "MaxFastlane");

const PLIST_FILE = "Info.plist";

const PLIST_VERSION_STRING_PARAM = "CFBundleShortVersionString";
const PLIST_BUNDLE_VERSION_PARAM = "CFBundleVersion";

const PACKAGE_JSON_VERSION_PARAM = packageJson.version;

function increaseVersion(version) {
  console.log("increaseVersion run", version);
  if (!semver.valid(version)) throw new Error("Wrong Version, use sever valid version");
  let parsePlist;
  try {
    parsePlist = plist.parse(fs.readFileSync(path.join(PROJECT_DIR, IOS_PROJECT_DIR, PLIST_FILE), "utf8"));
  } catch (e) {
    throw new Error(e);
  }
  if (typeof parsePlist == "object") {
    child_process.execSync(`plutil -replace ${PLIST_BUNDLE_VERSION_PARAM} -string "${parseInt(parsePlist[PLIST_BUNDLE_VERSION_PARAM], 10) + 1}" ${IOS_PROJECT_DIR}/${PLIST_FILE}`)
    child_process.execSync(`plutil -replace ${PLIST_VERSION_STRING_PARAM} -string "${version}" ${IOS_PROJECT_DIR}/${PLIST_FILE}`)
  }
  fs.writeFileSync(path.join(PROJECT_DIR, VERSION_JSON), `{ "version": "${PACKAGE_JSON_VERSION_PARAM}"}`);
}

increaseVersion(PACKAGE_JSON_VERSION_PARAM);
