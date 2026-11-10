// Pasquino's FINAL defense layer
// "I split the password into pieces. Even if they find one, they'll never find them all!" — Pasquino

(function() {
  // Part 1 is right here, if you can find it
  const _0x1 = "P4"; // Part 1 of 3

  // Part 2? I hid that somewhere you'd never expect...
  // Hint: some HTML elements carry secret data-* attributes. Inspect every <span> you see.

  // Part 3? Hah! Good luck. It's hiding in plain sight — right in the <head>.
  // Check the meta tags. Who reads those anyway?

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
