"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AlgemeneVoorwaardenPage() {
  return (
    <div className="min-h-screen px-4 py-12 pt-32 md:pt-40">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              Algemene Voorwaarden
            </h1>
            <p className="text-foreground/90 text-lg">
              Het Energielabel Loket
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none bg-foreground/5 backdrop-blur-sm p-8 md:p-12 rounded-2xl border border-primary/10 space-y-8">
            {/* Artikel 1 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-primary">Artikel 1 – Definities en toepasselijkheid</h2>
              <div className="space-y-3 text-foreground/90">
                <p>
                  <strong>1.1</strong> Het Energielabel Loket, gevestigd te Wijdewormer, ingeschreven bij de Kamer van Koophandel onder nummer KvK 88594572 wordt hierna aangeduid als Het Energielabel Loket.
                </p>
                <p>
                  <strong>1.2</strong> Opdrachtgever: iedere natuurlijke of rechtspersoon die een overeenkomst sluit met Het Energielabel Loket.
                </p>
                <p>
                  <strong>1.3</strong> Deze voorwaarden zijn van toepassing op alle offertes, opdrachten en overeenkomsten tussen Het Energielabel Loket en opdrachtgever, tenzij schriftelijk anders overeengekomen.
                </p>
                <p>
                  <strong>1.4</strong> Eventuele algemene voorwaarden van de opdrachtgever worden uitdrukkelijk van de hand gewezen, tenzij schriftelijk anders overeengekomen.
                </p>
              </div>
            </section>

            <div className="border-t border-primary/10 my-8"></div>

            {/* Artikel 2 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-primary">Artikel 2 – Offertes en totstandkoming van de overeenkomst</h2>
              <div className="space-y-3 text-foreground/90">
                <p>
                  <strong>2.1</strong> Alle offertes en prijsopgaven zijn vrijblijvend, tenzij uitdrukkelijk anders vermeld.
                </p>
                <p>
                  <strong>2.2</strong> Offertes zijn geldig gedurende 30 dagen.
                </p>
                <p>
                  <strong>2.3</strong> De overeenkomst komt tot stand zodra de opdrachtgever de offerte schriftelijk, per e-mail of via de website heeft bevestigd.
                </p>
                <p>
                  <strong>2.4</strong> Alle prijzen zijn in euro's en inclusief BTW, tenzij anders aangegeven.
                </p>
              </div>
            </section>

            <div className="border-t border-primary/10 my-8"></div>

            {/* Artikel 3 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-primary">Artikel 3 – Uitvoering van de overeenkomst</h2>
              <div className="space-y-3 text-foreground/90">
                <p>
                  <strong>3.1</strong> Het Energielabel Loket voert de opdracht naar beste inzicht, vermogen en volgens de geldende wettelijke eisen en kwaliteitsrichtlijnen uit.
                </p>
                <p>
                  <strong>3.2</strong> De opdrachtgever zorgt dat alle benodigde informatie op het meegestuurde intakeformulier (historie (ver)bouw woning, denk hierbij aan; facturen en/of foto's van isolatiedikte, type glas, zonnepanelen, warmtepomp, bouwtekeningen, adresgegevens, woningtoegang) tijdig en correct wordt aangeleverd. Mochten er dingen zijn die niet aangetoond kunnen worden en door de adviseur niet waarneembaar zijn in de woning kan hier niet mee gerekend worden.
                </p>
                <p>
                  <strong>3.3</strong> Als noodzakelijke informatie niet tijdig wordt aangeleverd of als toegang tot het pand niet mogelijk is, heeft Het Energielabel Loket het recht om de uitvoering uit te stellen en eventuele extra kosten door te berekenen.
                </p>
                <p>
                  <strong>3.4</strong> Vermelde uitvoerdata zijn indicatief en geen fatale termijnen.
                </p>
              </div>
            </section>

            <div className="border-t border-primary/10 my-8"></div>

            {/* Artikel 4 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-primary">Artikel 4 – Wijziging of annulering van de afspraak</h2>
              <div className="space-y-3 text-foreground/90">
                <p>
                  <strong>4.1</strong> De opdrachtgever kan een afspraak tot 48 uur voor het geplande bezoek kosteloos verzetten of annuleren.
                </p>
                <p>
                  <strong>4.2</strong> Bij annulering binnen 48 uur of bij afwezigheid op het afgesproken tijdstip kan Het Energielabel Loket kosten in rekening brengen, met een maximum van 25% van het afgesproken tarief.
                </p>
                <p>
                  <strong>4.3</strong> Indien Het Energielabel Loket door onvoorziene omstandigheden (zoals ziekte of technische problemen) niet kan uitvoeren, zal een nieuwe afspraak in overleg worden ingepland.
                </p>
              </div>
            </section>

            <div className="border-t border-primary/10 my-8"></div>

            {/* Artikel 5 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-primary">Artikel 5 – Betaling</h2>
              <div className="space-y-3 text-foreground/90">
                <p>
                  <strong>5.1</strong> Betaling dient te geschieden binnen 14 dagen na factuurdatum, tenzij schriftelijk anders overeengekomen.
                </p>
                <p>
                  <strong>5.2</strong> Bij niet-tijdige betaling is de opdrachtgever wettelijke rente verschuldigd en – na aanmaning – buitengerechtelijke incassokosten conform de wettelijke staffel (Besluit vergoeding voor buitengerechtelijke incassokosten).
                </p>
                <p>
                  <strong>5.3</strong> Het Energielabel Loket blijft eigenaar van de geleverde rapporten totdat de factuur volledig is betaald.
                </p>
              </div>
            </section>

            <div className="border-t border-primary/10 my-8"></div>

            {/* Artikel 6 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-primary">Artikel 6 – Aansprakelijkheid</h2>
              <div className="space-y-3 text-foreground/90">
                <p>
                  <strong>6.1</strong> Het Energielabel Loket is niet aansprakelijk voor schade die is ontstaan doordat de opdrachtgever onjuiste of onvolledige gegevens heeft verstrekt.
                </p>
                <p>
                  <strong>6.2</strong> De aansprakelijkheid van Het Energielabel Loket is beperkt tot het bedrag dat door haar aansprakelijkheidsverzekering wordt uitgekeerd. Indien geen uitkering plaatsvindt, is de aansprakelijkheid beperkt tot het bedrag van de betreffende factuur.
                </p>
                <p>
                  <strong>6.3</strong> Het Energielabel Loket is niet aansprakelijk voor indirecte schade, zoals gevolgschade, gederfde winst of reputatieschade, tenzij sprake is van opzet of grove schuld.
                </p>
                <p>
                  <strong>6.4</strong> Eventuele klachten of aanspraken dienen binnen redelijke termijn na ontdekking, doch uiterlijk binnen 30 dagen na oplevering, schriftelijk te worden gemeld.
                </p>
              </div>
            </section>

            <div className="border-t border-primary/10 my-8"></div>

            {/* Artikel 7 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-primary">Artikel 7 – Intellectuele eigendom en gebruik van rapporten</h2>
              <div className="space-y-3 text-foreground/90">
                <p>
                  <strong>7.1</strong> Alle rapporten, adviezen en andere documenten die door Het Energielabel Loket worden verstrekt, blijven eigendom van Het Energielabel Loket.
                </p>
                <p>
                  <strong>7.2</strong> De opdrachtgever mag deze uitsluitend gebruiken voor het doel waarvoor ze zijn verstrekt (bijv. verkoop, verhuur of energiebesparingsadvies van het betreffende pand).
                </p>
                <p>
                  <strong>7.3</strong> Zonder schriftelijke toestemming van Het Energielabel Loket mogen rapporten niet worden gewijzigd, verveelvoudigd of aan derden verstrekt.
                </p>
              </div>
            </section>

            <div className="border-t border-primary/10 my-8"></div>

            {/* Artikel 8 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-primary">Artikel 8 – Overmacht</h2>
              <div className="space-y-3 text-foreground/90">
                <p>
                  <strong>8.1</strong> Onder overmacht wordt verstaan: iedere omstandigheid buiten de wil van Het Energielabel Loket waardoor uitvoering van de overeenkomst geheel of gedeeltelijk wordt verhinderd, zoals ziekte, storingen in netwerken, overheidsmaatregelen of extreme weersomstandigheden.
                </p>
                <p>
                  <strong>8.2</strong> In geval van overmacht worden verplichtingen opgeschort zolang de overmacht voortduurt. Indien de overmacht langer dan 30 dagen aanhoudt, kunnen beide partijen de overeenkomst ontbinden zonder schadevergoeding.
                </p>
              </div>
            </section>

            <div className="border-t border-primary/10 my-8"></div>

            {/* Artikel 9 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-primary">Artikel 9 – Toepasselijk recht en geschillen</h2>
              <div className="space-y-3 text-foreground/90">
                <p>
                  <strong>9.1</strong> Op alle overeenkomsten is uitsluitend Nederlands recht van toepassing.
                </p>
                <p>
                  <strong>9.2</strong> Geschillen worden in eerste instantie in onderling overleg opgelost.
                </p>
                <p>
                  <strong>9.3</strong> Indien dit niet lukt, wordt het geschil voorgelegd aan de bevoegde rechter in het arrondissement van Wijdewormer, tenzij de opdrachtgever consument is – in dat geval geldt de rechter van de woonplaats van de consument.
                </p>
              </div>
            </section>

            <div className="border-t border-primary/10 my-8"></div>

            {/* Artikel 10 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-primary">Artikel 10 – Slotbepalingen</h2>
              <div className="space-y-3 text-foreground/90">
                <p>
                  <strong>10.1</strong> Indien één of meer bepalingen van deze voorwaarden nietig of vernietigbaar blijken, blijven de overige bepalingen onverminderd van kracht.
                </p>
                <p>
                  <strong>10.2</strong> De meest recente versie van deze algemene voorwaarden is steeds van toepassing.
                </p>
              </div>
            </section>
          </div>

          {/* Back Button */}
          <div className="flex justify-center pt-8">
            <Link href="/">
              <Button size="lg" className="min-w-[200px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m12 19-7-7 7-7" />
                  <path d="M19 12H5" />
                </svg>
                Terug naar home
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

