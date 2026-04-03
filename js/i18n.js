/* ============================================
   Pasquil's hack overval — i18n System
   ============================================ */

const translations = {
  // ===================== SHARED =====================
  "back-to-levels": {
    nl: "← Terug naar levels",
    en: "← Back to levels"
  },
  "enter-password": {
    nl: "🔐 Voer het wachtwoord in",
    en: "🔐 Enter the password"
  },
  "enter-complete-password": {
    nl: "🔐 Voer het volledige wachtwoord in",
    en: "🔐 Enter the complete password"
  },
  "password-placeholder": {
    nl: "Typ het wachtwoord hier...",
    en: "Type the password here..."
  },
  "password-placeholder-combine": {
    nl: "Combineer alle 3 delen...",
    en: "Combine all 3 parts..."
  },
  "btn-submit": {
    nl: "Controleer →",
    en: "Check →"
  },
  "btn-hint": {
    nl: "💡 Hint nodig?",
    en: "💡 Need a hint?"
  },
  "no-more-hints": {
    nl: "Geen hints meer! Je staat er alleen voor 🫡",
    en: "No more hints! You're on your own 🫡"
  },
  "footer-text": {
    nl: 'Gemaakt met 💙 door <a href="https://pasquil.nl" target="_blank" rel="noopener">Pasquil.nl</a> — Security en privacy op een leuke manier.',
    en: 'Built with 💙 by <a href="https://pasquil.nl" target="_blank" rel="noopener">Pasquil.nl</a> — Security and privacy in a fun way.'
  },
  "footer-text-short": {
    nl: 'Gemaakt met 💙 door <a href="https://pasquil.nl" target="_blank" rel="noopener">Pasquil.nl</a>',
    en: 'Built with 💙 by <a href="https://pasquil.nl" target="_blank" rel="noopener">Pasquil.nl</a>'
  },
  "type-something": {
    nl: "Typ eerst iets! Zelfs Pasquino kan dat. ⌨️",
    en: "Type something first! Even Pasquino can do that. ⌨️"
  },

  // Wrong password messages
  "wrong-1": {
    nl: "Nee hoor! Pasquino's geheimen zijn veilig... voorlopig. 🔒",
    en: "Nope! Pasquino's secrets are safe... for now. 🔒"
  },
  "wrong-2": {
    nl: "Fout! Heb je al beter gekeken? 👀",
    en: "Wrong! Have you tried looking harder? 👀"
  },
  "wrong-3": {
    nl: "Toegang geweigerd. Pasquino lacht je uit. 😂",
    en: "Access Denied. Pasquino is laughing at you. 😂"
  },
  "wrong-4": {
    nl: "Niet eens in de buurt! Pasquino's beveiliging houdt stand! 💪",
    en: "Not even close! Pasquino's security prevails! 💪"
  },
  "wrong-5": {
    nl: "Probeer opnieuw! Het wachtwoord verstopt zich in het volle zicht... 🙈",
    en: "Try again! The password is hiding in plain sight... 🙈"
  },
  "wrong-6": {
    nl: "Onjuist! Pasquino doet een vrolijk dansje. 💃",
    en: "Incorrect! Pasquino does a little victory dance. 💃"
  },

  // Success message template (use {levelName})
  "success-msg": {
    nl: "✅ WACHTWOORD CORRECT! Je hebt Pasquino's {levelName} gekraakt! ",
    en: "✅ PASSWORD CORRECT! You cracked Pasquino's {levelName}! "
  },
  "success-proceed": {
    nl: "Ga door naar de volgende uitdaging.",
    en: "Proceed to the next challenge."
  },
  "success-complete": {
    nl: "Je hebt de heist voltooid!",
    en: "You've completed the heist!"
  },

  // Card statuses
  "status-locked": {
    nl: '<span class="lock">🔒</span> Vergrendeld',
    en: '<span class="lock">🔒</span> Locked'
  },
  "status-unlocked": {
    nl: '<span class="lock">🔓</span> Ontgrendeld',
    en: '<span class="lock">🔓</span> Unlocked'
  },
  "status-completed": {
    nl: '<span class="lock">✅</span> Voltooid!',
    en: '<span class="lock">✅</span> Completed!'
  },

  // ===================== INDEX PAGE =====================
  "hero-title": {
    nl: "Pasquil's hack overval",
    en: "Pasquil's hack heist"
  },
  "hero-subtitle": {
  nl: 'Je hebt toegang gekregen tot 5 zogenaamd "beveiligde" webpagina\'s van Pasquino. Jouw missie: Hack elk level door het verborgen wachtwoord te achterhalen en in te voeren.',
  en: 'You have gained access to 5 supposedly "secure" web pages built by Pasquino. Your mission: Hack each level by uncovering the hidden password and use to to unlock the next level.'
},
"intro-text": {
  nl: 'Welkom bij Pasquil\'s Hackers Playground! Je bent binnengedrongen in het digitale prutswerk van onze knullige stagiair, <strong>Pasquino</strong>. Hij heeft interne webapplicatie gebouwd... en laten we zeggen dat zijn beveiligingspraktijken <em>"creatief"</em> zijn. Jouw missie is simpel: hack je een weg door Pasquino\'s webpagina\'s en vind op elk level het verborgen wachtwoord. Elk gevonden wachtwoord geeft je toegang tot het volgende level. Kun jij alle vijf levels kraken voordat Pasquino doorheeft dat je in zijn systemen zit?',
  en: 'Welcome to Pasquil\'s Hackers Playground! You have breached the digital mess of our clumsy intern, <strong>Pasquino</strong>. He has been building internal webapplications... and let\'s just say his security practices are <em>"creative."</em> Your mission is simple: hack your way through Pasquino\'s web pages and find the hidden password on each level. Each password unlocks the next level. Can you crack all five before Pasquino realizes you are inside his systems?'
},
  "rules-title": {
    nl: "🔧 Zo speel je",
    en: "🔧 How to play"
  },
  "rules-text": {
    nl: ' Je hebt alleen een hackermindset en een moderne browser met DevTools nodig (druk op <strong>F12</strong>). Geen externe tools, geen server-hacking — alles zit in de browser. Elk level verbergt een wachtwoord met echte security-flaws. Vind het, typ het in, en ontgrendel de volgende uitdaging. Succes, hacker!',
    en: 'All you need is a hacker mindset and a modern browser with DevTools (press <strong>F12</strong>). No external tools, no server hacking — everything is in the browser. Each level hides a password using a real security flaws. Find it, type it in, and unlock the next challenge. Good luck, hacker!'
  },

  // ===================== LEVEL 1 =====================
  "l1-title": {
    nl: "📖 Pasquino's geheime dagboek",
    en: "📖 Pasquino's secret diary"
  },
  "l1-subtitle": {
    nl: "HTML-broncode inspecteren — welke geheimen zitten er in de broncode?",
    en: "HTML source code inspection — what secrets lurk in the source?"
  },
  "l1-Pasquino": {
    nl: '<strong>Pasquino zegt:</strong> "Ik bewaar al mijn persoonlijke notities gewoon in de code. Super privé — niemand kijkt ooit naar HTML, toch?"',
    en: '<strong>Pasquino says:</strong> "I keep all my personal notes right in the code. Super private — nobody ever looks at HTML, right?"'
  },
  "l1-diary1-date": {
    nl: "📅 15 januari 2026",
    en: "📅 January 15, 2026"
  },
  "l1-diary1-text": {
    nl: '<p>Dag 1 bij Pasquil! Ze hebben me een eigen bureau gegeven en alles. Ik vertelde ze dat ik een <em>"Full-Stack Security Engineer"</em> ben en ze geloofden me! Vandaag heb ik het WiFi-wachtwoord van het bedrijf ingesteld. Ik heb het echt veilig gemaakt: <strong>password123</strong>. Wacht, ik moet dat waarschijnlijk veranderen...</p>',
    en: '<p>Day 1 at Pasquil! They gave me my own desk and everything. I told them I\'m a <em>"Full-Stack Security Engineer"</em> and they believed me! Today I set up the company WiFi password. I made it really secure: <strong>password123</strong>. Wait, I should probably change that...</p>'
  },
  "l1-diary2-date": {
    nl: "📅 3 februari 2026",
    en: "📅 February 3, 2026"
  },
  "l1-diary2-text": {
    nl: "<p>Mijn kat, Tulip, loopt steeds over mijn toetsenbord. Ze typte \"asdfjkl;\" en eerlijk gezegd is dat veiliger dan de meeste van mijn wachtwoorden. Misschien moet ik haar de beveiligingsconsultant maken. 🐱</p>",
    en: "<p>My cat, Tulip, keeps walking on my keyboard. She typed \"asdfjkl;\" and honestly, that's more secure than most of my passwords. Maybe I should let her be the security consultant. 🐱</p>"
  },
  "l1-diary3-date": {
    nl: "📅 28 februari 2026",
    en: "📅 February 28, 2026"
  },
  "l1-diary3-text": {
    nl: '<p>De baas vroeg me om "tweefactorauthenticatie te implementeren." Ik heb TWEE wachtwoordvelden op de loginpagina gezet. Dat zijn twee factoren, toch? <em>Geregeld.</em> 💪</p>',
    en: '<p>Boss asked me to "implement two-factor authentication." I put TWO password fields on the login page. That\'s two factors, right? <em>Nailed it.</em> 💪</p>'
  },
  "l1-diary4-date": {
    nl: "📅 15 maart 2026",
    en: "📅 March 15, 2026"
  },
  "l1-diary4-text": {
    nl: '<p>Ik las online dat je "wachtwoorden nooit in platte tekst moet opslaan." Dus heb ik ze op een sticky note geschreven. Probleem opgelost! De notitie hangt op mijn monitor waar niemand het kan zien... behalve iedereen op kantoor. Maakt niet uit, is prima. 🙃</p>',
    en: '<p>I read online that you should "never store passwords in plain text." So I wrote them on a sticky note instead. Problem solved! The note is on my monitor where nobody can see it... except everyone in the office. Whatever, it\'s fine. 🙃</p>'
  },
  "l1-hint1": {
    nl: "<p>Pasquino schrijft notities voor zichzelf die alleen hij kan lezen... of toch niet?</p>",
    en: "<p>Pasquino writes notes to himself that only he can see... or can he?</p>"
  },
  "l1-hint2": {
    nl: "<p>Wat je ziet is niet alles. Probeer te kijken wat er achter het gordijn zit.</p>",
    en: "<p>What you see isn't everything. Try viewing what's behind the curtain.</p>"
  },
  "l1-hint3": {
    nl: "<p>Rechtermuisklik → \"Paginabron bekijken\" en zoek naar Pasquino's notities.</p>",
    en: "<p>Right-click → \"View Page Source\" and look for Pasquino's notes.</p>"
  },
  "l1-next": {
    nl: "Ga naar Level 2 — De onzichtbare kluis →",
    en: "Proceed to Level 2 — The invisible vault →"
  },

  // ===================== LEVEL 2 =====================
  "l2-title": {
    nl: "👻 De onzichtbare kluis",
    en: "👻 The invisible vault"
  },
  "l2-subtitle": {
    nl: "CSS-verborgen inhoud — kun jij zien wat er echt op deze pagina staat?",
    en: "CSS-hidden content — can you see what's really on this page?"
  },
  "l2-sjonnie": {
    nl: '<strong>Pasquino zegt:</strong> "Ik heb deze pagina ONZICHTBAAR-proof gemaakt. Zelfs als je ernaar kijkt, zie je niks. Mijn CSS-skills zijn ongeëvenaard!"',
    en: '<strong>Pasquino says:</strong> "I\'ve made this page INVISIBLE-proof. Even if you look at it, you won\'t see anything. My CSS skills are unmatched!"'
  },
  "l2-warning1": {
    nl: "⚠️ ALLEEN BEVOEGD PERSONEEL ⚠️",
    en: "⚠️ AUTHORIZED PERSONNEL ONLY ⚠️"
  },
  "l2-classified": {
    nl: "GEHEIM",
    en: "CLASSIFIED"
  },
  "l2-text1": {
    nl: "Dit is Pasquino's Maximum Security Kluis. Niks te zien hier. Helemaal niks. Doe niet eens de moeite om te kijken. Het wachtwoord is zo goed verstopt dat zelfs Pasquino niet meer weet waar hij het heeft gelaten. (Maar eigenlijk wel. Hij is gewoon slecht in dingen verstoppen.)",
    en: "This is Pasquino's Maximum Security Vault. Nothing to see here. Absolutely nothing. Don't even bother looking. The password is hidden so well that not even Pasquino remembers where he put it. (He does, though. He's just bad at hiding things.)"
  },
  "l2-warning2": {
    nl: "🚫 INSPECTEER DEZE PAGINA NIET 🚫",
    en: "🚫 DO NOT INSPECT THIS PAGE 🚫"
  },
  "l2-redherring1": {
    nl: "Goed geprobeerd! Maar dit is niet het wachtwoord. Zoek verder...",
    en: "Nice try! But this isn't the password. Keep looking..."
  },
  "l2-redherring2": {
    nl: "Je wordt warmer! Maar hier ook niet.",
    en: "Getting warmer! But not here either."
  },
  "l2-text2": {
    nl: 'Pasquino heeft 3 hele uren besteed om deze kluis ondoordringbaar te maken. Hij vroeg zelfs ChatGPT hoe je dingen op een webpagina kunt verstoppen. Het antwoord was "gebruik CSS" en Pasquino zei "perfect, niemand kent CSS."',
    en: 'Pasquino spent 3 whole hours making sure this vault is impenetrable. He even asked ChatGPT how to hide things on a webpage. The answer was "use CSS" and Pasquino said "perfect, nobody knows CSS."'
  },
  "l2-text3": {
    nl: 'Onthoud: echte beveiliging betekent dingen onzichtbaar maken. Als niemand het kan zien, kan niemand het hacken. Dat heeft Pasquino geleerd van een YouTube tutorial genaamd "CSS Security for beginners (UNHACKABLE)."',
    en: 'Remember: true security means making things invisible. If nobody can see it, nobody can hack it. That\'s what Pasquino learned from a YouTube tutorial titled "CSS Security for beginners (UNHACKABLE)."'
  },
  "l2-hint1": {
    nl: "<p>Alleen omdat je het niet kunt zien, betekent niet dat het er niet is.</p>",
    en: "<p>Just because you can't see it doesn't mean it's not there.</p>"
  },
  "l2-hint2": {
    nl: "<p>Open de inspector en doorzoek de elementen. Sommige dingen verstoppen zich in het volle zicht... of beter gezegd, in de HTML.</p>",
    en: "<p>Open the inspector and search the elements. Some things are hiding in plain sight... or rather, hiding in plain HTML.</p>"
  },
  "l2-hint3": {
    nl: '<p>Zoek naar elementen met verdachte classes. Probeer Ctrl+F in de Inspector en zoek naar "password".</p>',
    en: '<p>Look for elements with suspicious classes. Try Ctrl+F in the Inspector and search for "password".</p>'
  },
  "l2-next": {
    nl: "Ga naar Level 3 — Console cowboys →",
    en: "Proceed to Level 3 — Console cowboys →"
  },

  // ===================== LEVEL 3 =====================
  "l3-title": {
    nl: "🤠 Console cowboys",
    en: "🤠 Console cowboys"
  },
  "l3-subtitle": {
    nl: "JavaScript-geheimen — wat verstopt zich in de code?",
    en: "JavaScript secrets — what's hiding in the code?"
  },
  "l3-sjonnie": {
    nl: '<strong>Pasquino zegt:</strong> "Dit wachtwoord is beschermd door mijn Ultra-Secure JavaScript Encryption™. Het gebruikt military-grade ROT-13 quantum algoritmes. ONKRAAKBAAR."',
    en: '<strong>Pasquino says:</strong> "This password is protected by my Ultra-Secure JavaScript Encryption™. It uses military-grade ROT-13 quantum algorithms. UNBREAKABLE."'
  },
  "l3-terminal-cmd": {
    nl: "cat beveiligingsstatus.txt",
    en: "cat security_status.txt"
  },
  "l3-report-title": {
    nl: "// PASQUINO'S BEVEILIGINGSSTATUSRAPPORT",
    en: "// PASQUINO'S SECURITY STATUS REPORT"
  },
  "l3-firewall": {
    nl: "Firewall: AAN (het is een foto van een muur in brand 🔥)",
    en: "Firewall: ON (it's a picture of a wall on fire 🔥)"
  },
  "l3-encryption": {
    nl: "Encryptie: MAXIMAAL (ik heb het bestand hernoemd naar .encrypted)",
    en: "Encryption: MAXIMUM (I renamed the file to .encrypted)"
  },
  "l3-storage": {
    nl: "Wachtwoord Opslag: ULTRA VEILIG (het zit in een variabele)",
    en: "Password Storage: ULTRA SECURE (it's in a variable)"
  },
  "l3-backup": {
    nl: "Backup Plan: geef de stagiair de schuld (wacht, IK ben de stagiair)",
    en: "Backup Plan: blame the intern (wait, I AM the intern)"
  },
  "l3-taunt-title": {
    nl: "🔒 Onkraakbare wachtwoord checker",
    en: "🔒 Unbreakable password checker"
  },
  "l3-taunt-sub": {
    nl: "Beschermd door Pasquino's Ultra-Secure JavaScript Encryption™",
    en: "Protected by Pasquino's Ultra-Secure JavaScript Encryption™"
  },
  "l3-funfact1": {
    nl: "// Leuk weetje: Pasquino slaat al zijn geheimen op in JavaScript",
    en: "// Fun fact: Pasquino stores all his secrets in JavaScript"
  },
  "l3-funfact2": {
    nl: '// variabelen omdat "niemand ooit JavaScript leest."',
    en: '// variables because "nobody ever reads JavaScript."'
  },
  "l3-funfact3": {
    nl: "// Hij heeft ook de gewoonte om tegen zichzelf te praten in console.log",
    en: "// He also has a habit of talking to himself in console.log"
  },
  "l3-funfact4": {
    nl: "// statements. Developers zijn nu eenmaal praatgraag.",
    en: "// statements. Developers are chatty like that."
  },
  "l3-quote1": {
    nl: '"Het wachtwoord is veilig. Ik heb het in een object gestopt. Objecten zijn privé, toch?"',
    en: '"The password is safe. I put it in an object. Objects are private, right?"'
  },
  "l3-quote2": {
    nl: '"— Pasquino, vlak voor de ramp"',
    en: '"— Pasquino, moments before disaster"'
  },
  "l3-hint1": {
    nl: "<p>Pasquino praat veel tegen zichzelf. Heb je al gekeken waar developers meestal praten?</p>",
    en: "<p>Pasquino talks to himself a lot. Have you checked where developers usually talk?</p>"
  },
  "l3-hint2": {
    nl: "<p>Open het Console tabblad in DevTools. Pasquino heeft misschien een berichtje voor je achtergelaten.</p>",
    en: "<p>Open the Console tab in DevTools. Pasquino might have left a message for you.</p>"
  },
  "l3-hint3": {
    nl: "<p>Typ <code>PasquinoVault</code> in de console en druk op Enter.</p>",
    en: "<p>Type <code>PasquinoVault</code> in the console and press Enter.</p>"
  },
  "l3-next": {
    nl: "Ga naar Level 4 — Cookie monster →",
    en: "Proceed to Level 4 — Cookie monster →"
  },

  // ===================== LEVEL 4 =====================
  "l4-title": {
    nl: "🍪 Cookie monster",
    en: "🍪 Cookie monster"
  },
  "l4-subtitle": {
    nl: "Client-side opslag — cookies, localStorage en geheimen",
    en: "Client-side storage — cookies, localStorage, and secrets"
  },
  "l4-sjonnie": {
    nl: '<strong>Pasquino zegt:</strong> "Ik heb de meest beveiligde cookies van het internet gebakken. Niemand kan cookies lezen, daarom heten ze cookies — ze verkruimelen voordat je ze kunt lezen. Zo werkt het toch?"',
    en: '<strong>Pasquino says:</strong> "I baked the most secure cookies on the internet. Nobody can read cookies, that\'s why they\'re called cookies — they crumble before you can read them. That\'s how it works, right?"'
  },
  "l4-welcome-title": {
    nl: "🏪 Welkom bij Pasquino's cookie corner!",
    en: "🏪 Welcome to Pasquino's cookie corner!"
  },
  "l4-welcome-text": {
    nl: "Thuisbasis van de lekkerste digitale koekjes van heel Nederland! Elke bezoeker krijgt een gratis batch cookies — vers gebakken en opgeslagen in je browser. We nemen je privacy heel serieus (we eten alle koekjes zelf op 🍪).",
    en: "Home of the finest digital cookies in all of the Netherlands! Every visitor gets a complimentary batch of cookies — freshly baked and stored right in your browser. We take your privacy very seriously (we eat all the cookies ourselves 🍪)."
  },
  "l4-pun1": {
    nl: '🧑‍🍳 "Een slim koekje controleert altijd de koektrommel." — Oud bakkerspreekwoord',
    en: '🧑‍🍳 "A smart cookie always checks the jar." — Ancient baking proverb'
  },
  "l4-menu-title": {
    nl: "📋 Menu van vandaag",
    en: "📋 Today's menu"
  },
  "l4-menu-text": {
    nl: "<strong>🍫 Pure chocolade chip</strong> — Klassiek en veilig<br><strong>🧇 Stroopwafels</strong> — Een Nederlandse specialiteit, lokaal opgeslagen<br><strong>🔐 Geheim recept</strong> — Ons prijswinnende recept, gecodeerd voor de veiligheid<br><strong>🍪 Tracking Cookies</strong> — Grapje! Nee bedankt.",
    en: "<strong>🍫 Dark chocolate chip</strong> — Classic and secure<br><strong>🧇 Stroopwafels</strong> — A Dutch specialty, stored locally<br><strong>🔐 Secret recipe</strong> — Our prize-winning recipe, encoded for safe-keeping<br><strong>🍪 Tracking Cookies</strong> — Just kidding! No thanks."
  },
  "l4-pun2": {
    nl: '💡 "Het bewijs zit in de pudding, maar het wachtwoord zit in de cookie." — Pasquino',
    en: '💡 "The proof is in the pudding, but the password is in the cookie." — Pasquino'
  },
  "l4-baker-title": {
    nl: "🤫 Een woord van onze bakker",
    en: "🤫 A word from our baker"
  },
  "l4-baker-text": {
    nl: "Pasquino is erg trots op zijn cookie-opslagsysteem. Hij slaat alles op in de browser — sessiedata, gebruikersvoorkeuren, en misschien zelfs een geheimpje of twee. Hij hoorde dat Base64 \"militaire encryptie\" is van een Reddit-bericht, dus natuurlijk gebruikt hij dat voor zijn kostbaarste recept.",
    en: 'Pasquino is very proud of his cookie storage system. He stores everything in the browser — session data, user preferences, and maybe even a secret or two. He heard that Base64 is "military-grade encryption" from a Reddit post, so naturally, that\'s what he uses for his most precious recipe.'
  },
  "l4-pun3": {
    nl: '🍪 "Zo kruimelt de koek... in je Application-tabblad." 🍪',
    en: '🍪 "That\'s the way the cookie crumbles... into your Application tab." 🍪'
  },
  "l4-hint1": {
    nl: "<p>Pasquino is dol op koekjes. Je browser ook. Heb je al gecheckt welke cookies deze pagina heeft achtergelaten?</p>",
    en: "<p>Pasquino loves cookies. So does your browser. Have you checked what cookies this page left behind?</p>"
  },
  "l4-hint2": {
    nl: "<p>Ga naar DevTools → Application tab → Cookies. Een van deze cookies ziet er een beetje... gecodeerd uit.</p>",
    en: "<p>Go to DevTools → Application tab → Cookies. One of these cookies looks a bit... encoded.</p>"
  },
  "l4-hint3": {
    nl: "<p>De <code>secret_recipe</code> cookie is Base64-gecodeerd. Decodeer het met <code>atob('SzAwS0pFU19NT05TVEVS')</code> in de console.</p>",
    en: "<p>The <code>secret_recipe</code> cookie is Base64-encoded. Decode it with <code>atob('SzAwS0pFU19NT05TVEVS')</code> in the console.</p>"
  },
  "l4-next": {
    nl: "Ga naar Level 5 — De laaste Heist →",
    en: "Proceed to Level 5 — The final heist →"
  },

  // ===================== LEVEL 5 =====================
  "l5-title": {
    nl: "🏆 De laatste overval",
    en: "🏆 The final heist"
  },
  "l5-subtitle": {
  nl: "Meerlagig onderzoek: combineer alles wat je hebt geleerd",
  en: "Multi-layered investigation: combine everything you've learned"
  },
  "l5-sjonnie": {
    nl: '<strong>Pasquino zegt:</strong> "Je bent ver gekomen, maar deze pagina is ONKRAAKBAAR. Ik heb elke beveiligingsmaatregel gebruikt die ik ken: onzichtbare tekst, versleutelde cookies, verduisterde code... je vindt deze nooit."',
    en: '<strong>Pasquino says:</strong> "You\'ve made it this far, but this page is UNBREAKABLE. I\'ve used every security measure I know: invisible text, encrypted cookies, obfuscated code... you\'ll never find this one."'
  },
  "l5-challenge-title": {
    nl: "🎯 De ultieme uitdaging",
    en: "🎯 The ultimate challenge"
  },
  "l5-challenge-text": {
    nl: "Denk je dat je een hacker bent? Bewijs het. Vind alle drie de delen.",
    en: "You think you're a hacker? Prove it. Find all three pieces."
  },
  "l5-part": {
    nl: "Deel",
    en: "Part"
  },
  "l5-info1": {
  nl: "Dit is het. Het Pasquil Maximum Security Office. Pasquino haalt alles uit de kast. Hij heeft het wachtwoord opgesplitst in <strong>drie delen</strong> en verspreid over de pagina. Elk deel is verborgen met een andere techniek die je in eerdere levels bent tegengekomen.",
  en: "This is it. The Pasquil Maximum Security Office. Pasquino's pulling out all the stops. He's split the password into <strong>three parts</strong> and scattered them across the page. Each part is hidden using a different technique you've encountered in previous levels."
  },
  "l5-info2": {
    nl: "Om deze kluis te kraken, moet je denken als een echte security researcher: controleer de broncode, inspecteer de elementen, lees de scripts, en onderzoek de metadata. Laat geen steen onaangeroerd.",
    en: "To crack this vault, you'll need to think like a real security researcher: check the source, inspect the elements, read the scripts, and examine the metadata. Leave no stone unturned."
  },
 "l5-taunt": {
    nl: '<strong>⚠️ Pasquino\'s laatste uitdaging:</strong> "Ik heb de stukken zo goed verstopt, zelfs ik vergat waar ik deel 2 had gelaten. Grapje. Het zit op een heel logische plek. Als je HTML kent, tenminste. Wat je waarschijnlijk niet doet. 😏"',
    en: '<strong>⚠️ Pasquino\'s final taunt:</strong> "I\'ve hidden the pieces so well, even I forgot where I put part 2. Just kidding. It\'s in a very logical place. If you know HTML, that is. Which you don\'t. Probably. 😏"'
  },
  "l5-completion": {
    nl: "🎉 Je hebt Pasquil's hack overval voltooid!",
    en: "🎉 You've completed Pasquil's hack heist!"
  },
  "l5-hint1": {
    nl: "<p>Het wachtwoord is opgesplitst in drie delen. Je moet overal zoeken: broncode, scripts, elementen en metadata.</p>",
    en: "<p>The password is split into three parts. You'll need to search everywhere: source, scripts, elements, and metadata.</p>"
  },
  "l5-hint2": {
    nl: "<p>Deel 1 zit in een JS-bestand. Deel 2 verstopt zich in een data-attribuut. Deel 3 zit in de pagina-metadata.</p>",
    en: "<p>Part 1 is in a JS file. Part 2 is hiding in a data attribute. Part 3 is in the page metadata.</p>"
  },
  "l5-hint3": {
    nl: "<p>Drie delen: 2 tekens (JS), 6 tekens (data‑attribuut) en 6 tekens (meta‑tag). Combineer ze.</p>",
    en: "<p>Three parts: 2 characters (JS), 6 characters (data attribute), and 6 characters (meta tag). Combine them.</p>"
  },


  // ===================== VICTORY =====================
  "victory-title": {
    nl: "🎉 JE HEBT HET GEDAAN!",
    en: "🎉 YOU DID IT!"
  },
  "victory-subtitle": {
    nl: 'Je hebt alle 5 van Pasquino\'s "beveiligde" pagina\'s gehackt!',
    en: 'You hacked all 5 of Pasquino\'s "secure" pages!'
  },
  "victory-l1": {
    nl: "HTML-comments zijn niet geheim",
    en: "HTML comments aren't secret"
  },
  "victory-l2": {
    nl: "CSS kan inhoud niet verbergen voor de DOM",
    en: "CSS can't hide content from the DOM"
  },
  "victory-l3": {
    nl: "JavaScript-variabelen zijn openbaar",
    en: "JavaScript variables are public"
  },
  "victory-l4": {
    nl: "Browseropslag is niet veilig",
    en: "Browser storage is not secure"
  },
  "victory-l5": {
    nl: "Echte beveiliging vereist verdediging in de diepte",
    en: "Real security requires defense in depth"
  },
  "victory-learn-more": {
    nl: "Wil je meer leren over echte webbeveiliging?",
    en: "Want to learn more about real web security?"
  },
  "victory-cta": {
    nl: "Bezoek Pasquil.nl →",
    en: "Visit Pasquil.nl →"
  }
};

// ===================== i18n ENGINE =====================

function getLang() {
  return localStorage.getItem("pasquil_lang") || "nl";
}

function setLang(lang) {
  localStorage.setItem("pasquil_lang", lang);
  applyTranslations();
  updateLangSwitcher();
}

function t(key) {
  const lang = getLang();
  const entry = translations[key];
  if (!entry) return null;
  return entry[lang] || entry["nl"] || null;
}

function applyTranslations() {
  const lang = getLang();

  // Update html lang attribute
  document.documentElement.lang = lang;

  // Translate all data-i18n elements
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    const val = t(key);
    if (val !== null) {
      el.innerHTML = val;
    }
  });

  // Translate data-i18n-placeholder
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    const val = t(key);
    if (val !== null) {
      el.placeholder = val;
    }
  });
}

function updateLangSwitcher() {
  const lang = getLang();
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
  });
}

function createLangSwitcher() {
  const switcher = document.createElement("div");
  switcher.className = "lang-switcher";
  switcher.innerHTML = `<button class="lang-btn" data-lang="nl" onclick="setLang('nl')">NL</button><button class="lang-btn" data-lang="en" onclick="setLang('en')">EN</button>`;
  document.body.appendChild(switcher);
  updateLangSwitcher();
}

// Init on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  createLangSwitcher();
  applyTranslations();
});
