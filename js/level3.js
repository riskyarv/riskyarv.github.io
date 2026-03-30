// Sjonnie's Ultra-Secure Password Vault™
// "Nobody ever looks in the console, right?" — Sjonnie

const sjonnieVault = {
  name: "Sjonnie's Secret Stash",
  created: "2026-01-01",
  encryption: "military-grade-256-bit-rot13-quantum", // Very real. Very secure.
  _secret_password: "STROOPWAFEL42",
  motd: "If you're reading this, I should probably find a new hiding spot..."
};

function checkPassword(input) {
  if (input === sjonnieVault._secret_password) {
    return true;
  }
  return false;
}

// Debug helper — definitely remove before production!!
console.log("%c🔐 Psst... Sjonnie left something interesting in the global scope. Try typing 'sjonnieVault' in the console.", "color: #ff6b35; font-size: 14px; font-weight: bold;");
