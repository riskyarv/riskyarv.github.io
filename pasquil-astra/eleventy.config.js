export default function (config) {
  config.addPassthroughCopy({ public: "." });
  config.addWatchTarget("content");
  config.setServerOptions({ showAllHosts: false });
  return { dir: { input: "src", output: "dist" }, templateFormats: ["11ty.js"] };
}
