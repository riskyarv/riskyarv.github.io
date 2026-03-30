// Sjonnie's FINAL defense layer
// "I split the password into pieces. Even if they find one, they'll never find them all!" — Sjonnie

(function() {
  // Part 1 is right here, if you can find it
  const _0x1 = "P4"; // Part 1 of 3

  // Part 2? I hid that somewhere you'd never expect...
  // Hint: data can live in the strangest HTML attributes.

  // Part 3? Hah! Good luck. Check the network response headers.
  // ...oh wait, this is a static site. I meant the meta tags. Same thing, right?

  window.__heistStatus = {
    partsFound: 0,
    totalParts: 3,
    assemble: function(p1, p2, p3) {
      const result = p1 + p2 + p3;
      console.log("🔐 Assembled password: " + result);
      return result;
    }
  };
})();
