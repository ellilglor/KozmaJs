const text = new Map([
  ['English',{
    title: 'Here are all my commands:',
    desc: 'If you notice a problem please contact',
    bookChance: 'Get the % chance you have of getting at least 1 Book of Dark Rituals.' +
      '\n`kats` Amount of Black Kats you encountered.',
    clear: 'Deletes all the messages the bot has sent you.',
    convert: 'Convert your currency. (glorified calculator)' +
      '\n`amount` Amount you want to convert.' +
      '\n`rate` Optional custom conversion rate.',
    findLogs: 'Makes the bot search the database for your item.' +
      '\n`item` Item the bot should look for.' +
      '\n`months` How far back the bot should search. Default: 6 months.' +
      '\n`variants` Check for color variants / item family tree. Default: yes.' +
      '\n`clean` Filter out high value uvs. Default: no.' +
      '\n`mixed` Check the mixed-trades channel. Default: yes.',
    lockbox: 'Gives information about a lockbox or tells you what box drops your item.' +
      '\n`boxes` Get the odds from a lockbox.' +
      '\n`slime` Find where you can find a special themed box.' +
      '\n`item` Find which lockbox drops your item.',
    punch: 'Craft items and roll for Unique Variants without draining your wallet.' +
      '\n`item` Select the item you want to craft.',
    rate: 'Tells you the crowns per energy rate currently in use.',
    unbox: 'Simulate opening a box and be disappointed for free.' +
      '\n`box` Select the box you want to open.'
  }],
  ['nl',{
    title: "Hier zijn al mijn commando's:",
    desc: 'Als je een probleem opmerkt contacteer dan',
    bookChance: 'Krijg de kans (in %) om minstens 1 Book of Dark Rituals te krijgen.' +
      '\n`kats` Hoeveel Black Kats je al gezien hebt.',
    clear: 'Verwijder alle berichten dat de bot je heeft gestuurd.',
    convert: 'Converteer je crowns/energy.' +
      '\n`amount` Hoeveel je wilt converteren.' +
      '\n`rate` Optionele conversie rate.',
    findLogs: 'Laat de bot de database doorzoeken naar een item' +
      '\n`item` Voorwerp dat de bot naar moet zoeken.' +
      '\n`months` In hoever de bot terug moet zoeken. standaard: 6 maand.' +
      '\n`variants` Kijk voor gelijkwaardige varianten / voorwerpen uit dezelfde familie. standaard: ja.' +
      '\n`clean` Filter UVs met hogere waarden uit. Standaard: nee.' +
      '\n`mixed` Controleer het mixed-trades kanaal. Standaard: Ja.',
    lockbox: 'Geeft informatie over een lockbox of zegt welke box jouw item dropt.' +
      '\n`boxes` Krijg de kansen van een lockbox.' +
      '\n`slime` Vind waar je een speciale box kan vinden.' +
      '\n`item` Vind welke lockbox jouw voorwerpt dropt.',
    punch: 'creëer voorwerpen en rol voor Unique Variants zonder je portefeuille leeg te maken.' +
      '\n`item` Selecteer het voorwerp dat je wilt creëren.',
    rate: 'Vertelt de huidige crowns per energy verhouding',
    unbox: 'Simuleer het openen van een box en wees gratis teleurgesteld.' +
      '\n`box` Selecteer de box dat je wilt openen.'
  }],
  ['it',{ // thank you Top-Platinum#6560 for translating
    title: 'Ecco qua tutti i miei comandi:',
    desc: 'Se noti un problema, contatta',
    bookChance: 'Ottieni la % di probabilità di ottenere almeno 1 Book of Dark Rituals.' +
      '\n`kats` Quantità di Black Kats che hai incontrato.',
    clear: 'Elimina tutti i messaggi che il bot ti ha inviato.',
    convert: 'Converti una valuta. (glorified calculator)' +
      '\n`amount` Importo che desideri convertire.' +
      '\n`rate` Personalizza il tasso di conversione.',
    findLogs: 'Il bot cercherà un item da te specificato nel database.' +
      "\n`item` L'item che il bot deve cercare." +
      '\n`months` Quanto indietro deve cercare il bot. Default: 6 months.' +
      "\n`variants` Cerca le varianti di colore / albero genealogico dell'item. Default: yes." +
      '\n`clean` Filtra gli UVs di alto valore. Default: no.' +
      '\n`mixed` Cerca nel canale mixed-trades. Default: yes.',
    lockbox: 'Fornisce informazioni su una lockbox o ti dice quale lockbox droppa un item da te specificato' +
      '\n`boxes` Ottieni le probabilità da una lockbox.' +
      '\n`slime` Scopri dove puoi trovare una box speciale a tema.' +
      '\n`item` Scopri quale lockbox droppa il tuo item',
    punch: 'Crafta items e rolla Unique Variants senza prosciugarti il portafoglio' +
      "\n`item` Seleziona l'item che vuoi craftare.",
    rate: 'Ti dice il tasso di crowns per energy attualmente in uso.',
    unbox: "Simula l'apertura di una lockbox e rimani deluso gratuitamente." +
      '\n`box` Seleziona la box che desideri aprire.'
  }],
  ['el',{ // thank you Ultron#5519 for translating
    title: 'Εδώ είναι όλες οι εντολές μου:',
    desc: 'Αν βρεις κάποιο πρόβλημα, επικοινώνησε μαζί μας',
    bookChance: 'Μάθε την πιθανότητα % να πάρεις τουλάχιστον 1 βιβλίο με Μαύρες Λειτουργίες.' +
      '\n`kats` Ο αριθμός των μαύρων γατών που έχεις συναντήσει.',
    clear: 'Διαγράφει όλα τα μηνύματα που σου έχει στείλει το μποτ.',
    convert: 'Μετάτρεψε τα χρήματα σου. (Δοξασμένο κομπιουτεράκι)' +
      '\n`amount` Ποσότητα που θες να μετατρέψεις.' +
      '\n`rate` Προαιρετικό, συγκεκριμένη αναλογία.',
    findLogs: 'Κάνει το μποτ να ψάξει την βάση δεδομένων για το αντικείμενό σου.' +
      '\n`item` Το αντικέιμενο για το οποίο θες να ψάξει το μποτ.' +
      '\n`months` Πόσους μήνες πίσω πρέπει να ψάξει το μποτ. Προεπιλογή: 6 μήνες.' +
      '\n`variants` Ψάξε για διάφορα χρώματα / οικογένεια αντικειμένων. Προεπιλογή: ναι.' +
      '\n`clean` Απέκλεισε UVs με μεγάλη αξία. Προεπιλογή: όχι.' +
      '\n`mixed` Ψάξε και στο κανάλι με μεικτές ανταλλαγές. Προεπιλογή: ναι.',
    lockbox: 'Σου δίνει πληροφορίες για ένα κλειδωμένο κουτί, ή σου λέει ποιο κλειδωμένο κουτί περιέχει το αντικείμενο σου.' +
      '\n`boxes` Πάρε τις τα ποσοστά από ένα κουτί.' +
      '\n`slime` Βρες πού μπορείς να βρεις ένα κουτί με ειδικό θέμα.' +
      '\n`item` Βρες ποιο κλειδωμένο κουτί δίνει το αντικείμενό σου.',
    punch: 'Δημιούργησε αντικείμενα και δώσε τους UVs χωρίς να αδειάσεις το πορτοφόλι σου.' +
      '\n`item` Επίλεξε το αντικείμενο που θες να φτιάξεις.',
    rate: 'Σου λέει την αναλογία κορώνων ανά ενέργεια που χρησιμοποιείται.',
    unbox: 'Προσομοιώσε το άνοιγμα ενός κουτιού και απογοητέψου τσάμπα (δωρεάν).' +
      '\n`box` Επίλεξε το κουτί που θες να ανοίξεις.'
  }]
]);

module.exports = {
  text
}