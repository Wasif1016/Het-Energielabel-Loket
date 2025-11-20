"use client"

import { useState } from "react";

interface FAQItem {
    q: string;
    a: string;
}

export default function FAQ() {
    const [openQuestion, setOpenQuestion] = useState<number | null>(null);

    const faq: FAQItem[] = [
        {
            q: "Wat is een energielabel en waarom heb ik het nodig?",
            a: "Een energielabel geeft de energieprestatie van uw woning aan, van A++++ (zeer energiezuinig) tot G (zeer energieonzuinig). Bij de verkoop of verhuur van een woning is het verplicht om een energielabel te overleggen. Het label helpt kopers en huurders om inzicht te krijgen in de energie-efficiëntie van de woning."
        },
        {
            q: "Hoe krijg ik een energielabel voor mijn woning?", 
            a: "Wij stellen het energielabel voor uw woning op door een woningopname door onze gecertificeerde adviseurs. We kijken naar factoren zoals isolatie, verwarmingssystemen en ramen. Na de opname ontvangt u snel het energielabel."
        },
        {
            q: "Hoe kan ik mijn energielabel verbeteren?",
            a: "Er zijn verschillende maatregelen waarmee u uw energielabel kunt verbeteren, zoals betere isolatie van muren, vloeren en daken, het installeren van zonnepanelen, het vervangen van oude ramen door HR++ glas, of het plaatsen van een warmtepomp. Ons duurzaamheidsadvies helpt u bij het kiezen van de juiste maatregelen."
        },
        {
            q: "Wat is de WWS puntentelling en waarom heb ik het nodig?",
            a: "De WWS puntentelling wordt gebruikt om de huurprijs van een woning te berekenen volgens het Woningwaarderingsstelsel. Het aantal punten bepaalt in welke sector de woning valt (sociale of vrije sector). Het is verplicht voor verhuurders van sociale huurwoningen."
        },
        {
            q: "Hoe kan ik mijn woning verduurzamen?",
            a: "Wij bieden advies op maat voor het verduurzamen van uw woning. Dit kan onder andere door het verbeteren van isolatie, het installeren van zonnepanelen of het vervangen van oude verwarmingssystemen door energiezuinige alternatieven zoals warmtepompen. Onze experts helpen u met de juiste keuzes voor uw situatie."
        },
        {
            q: "Kan ik subsidies krijgen voor het verduurzamen van mijn woning?",
            a: "Ja, er zijn verschillende subsidies en regelingen beschikbaar voor verduurzamingsmaatregelen, zoals de investeringssubsidie duurzame energie (ISDE) en de subsidie energiebesparing eigen huis (SEEH)."
        },
        {
            q: "Hoe snel kan ik mijn energielabel ontvangen?",
            a: "De opname voor het energielabel kan meestal binnen enkele dagen worden ingepland. Na de opname ontvangt u het energielabel doorgaans binnen 3-5 werkdagen."
        },
        {
            q: "Wat kost een energielabel voor mijn woning?",
            a: "De kosten voor het energielabel variëren afhankelijk van de grootte en locatie van uw woning. Neem contact met ons op voor een transparante offerte die specifiek is afgestemd op uw situatie."
        },
        {
            q: "Ik heb mijn energielabel sneller nodig, is dat mogelijk?",
            a: "Ja, als u uw energielabel sneller nodig heeft, bieden wij de mogelijkheid om dit binnen 1-2 werkdagen te leveren. Dit kan tegen een spoedtarief vanwege de versnelde service. Neem contact met ons op om een spoedaanvraag te doen en wij zorgen ervoor dat u het energielabel snel en efficiënt ontvangt."
        }
    ];

    return (
        <div id="faq" className="px-4 py-32 ">
            <div className="max-w-4xl mx-auto">
                {/* FAQ Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl  font-bold mb-4">
                        Veelgestelde Vragen
                    </h2>
                </div>

                {/* FAQ Questions */}
                <div className="space-y-3">
                    {faq.map((qa, index) => (
                        <div
                            key={index}
                            className="border border-border rounded-2xl overflow-hidden bg-foreground/[0.05]"
                        >
                            {/* Question Header */}
                            <button
                                onClick={() => setOpenQuestion(openQuestion === index ? null : index)}
                                className="w-full px-6 py-4 flex items-center justify-between text-left"
                            >
                                <span className="text-lg font-medium">{qa.q}</span>
                                <span className="text-2xl transform transition-transform duration-200" style={{
                                    transform: openQuestion === index ? 'rotate(180deg)' : 'rotate(0deg)'
                                }}>
                                    ↓
                                </span>
                            </button>

                            {/* Answer */}
                            <div
                                className="overflow-hidden transition-all duration-200"
                                style={{
                                    maxHeight: openQuestion === index ? '400px' : '0',
                                    opacity: openQuestion === index ? 1 : 0
                                }}
                            >
                                <div className="px-6 py-4 border-t border-border bg-primary/[0.02]">
                                    <p className="text-lg">{qa.a}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}