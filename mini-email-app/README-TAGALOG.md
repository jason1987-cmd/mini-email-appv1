# Mini Email App (SMTP + IMAP) - Paliwanag ng mga File

Ang proyektong ito ay isang simpleng demo app na kayang:
- magpadala ng email gamit ang Gmail SMTP
- magbasa ng inbox gamit ang Gmail IMAP
- gumamit ng Netlify Functions bilang backend

## Estruktura ng mga File

### package.json
Ito ang configuration file ng project sa Node.js.
Dito nakalagay ang pangalan ng app, version, scripts, at mga dependencies tulad ng:
- nodemailer para sa SMTP sending
- imap-simple para sa pagbasa ng inbox
- mailparser para i-parse ang email content

### netlify.toml
Ito ang configuration file ng Netlify.
Sinasabi nito:
- kung saan ang public files ng frontend
- kung saan ang folder ng Netlify Functions

### .gitignore
Ito ang listahan ng mga file at folder na hindi dapat isama sa Git.
Karaniwan dito ang:
- node_modules
- .env
- .netlify

### .env.example
Sample lamang ito ng environment variables.
Dito makikita kung anong credentials ang kailangan:
- GMAIL_USER
- GMAIL_APP_PASSWORD

Hindi ito ang tunay na `.env`; template lang ito para alam mo ang format.

## Folder: netlify/functions
Narito ang backend logic ng app.

### sendMail.js
Ito ang function na tumatanggap ng email details mula sa frontend at nagpapadala ng email gamit ang Gmail SMTP.
Responsibilidad nito:
- tumanggap ng recipient, subject, at message
- i-validate ang data
- gamitin ang Gmail credentials sa environment variables
- ibalik ang result kung success o error

### readInbox.js
Ito ang function na kumokonekta sa Gmail inbox gamit ang IMAP.
Responsibilidad nito:
- mag-login sa Gmail inbox
- buksan ang INBOX
- kunin ang mga latest emails
- i-parse ang subject, sender, petsa, at preview text
- ibalik ang listahan bilang JSON

## Folder: public
Narito ang frontend ng app.

### index.html
Ito ang main page ng application.
Makikita rito ang:
- form para mag-send ng email
- button para i-refresh ang inbox
- lalagyan ng inbox results

### style.css
Ito ang design at layout ng app.
Responsibilidad nito:
- ayusin ang spacing
- gawing presentable ang form at inbox
- lagyan ng cards, buttons, colors, at responsive layout

### app.js
Ito ang frontend logic sa JavaScript.
Responsibilidad nito:
- kunin ang laman ng form
- ipadala ang request sa sendMail function
- kunin ang inbox mula sa readInbox function
- ipakita ang result sa page
- i-handle ang success at error messages

## Paano nagtutulungan ang mga file
1. Binubuksan ng user ang `index.html`.
2. Ang `style.css` ang nag-aayos ng itsura.
3. Ang `app.js` ang kumokontrol sa actions ng user.
4. Kapag nag-send ng email, tatawag ang frontend sa `sendMail.js`.
5. Kapag nag-load ng inbox, tatawag ang frontend sa `readInbox.js`.
6. Ang Gmail credentials ay kukunin mula sa environment variables.
7. Ang Netlify ang magho-host ng frontend at magpapatakbo ng functions.

## Bakit maganda itong demo
Magandang demo ito dahil ipinapakita nito na kaya mong gumawa ng:
- frontend UI
- backend functions
- email sending
- email reading
- deployment-ready app sa Netlify

## Paalala
Para gumana ito nang tama, kailangan mong:
- i-enable ang 2-Step Verification sa Gmail
- gumawa ng App Password
- ilagay ang tunay na credentials sa `.env` o sa Netlify environment variables
