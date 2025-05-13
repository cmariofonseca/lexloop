import { Metadata } from 'next';

import FlashcardDeck from '../../components/flashcardDeck';

export const metadata: Metadata = {
    title: "Cards",
    description: "Swipe through your English vocabulary flashcards to practice and memorize them effectively.",
};

export default function CardsPage() {
    return (
        <main className="bg-gray-100 w-full h-full">
            <FlashcardDeck />
        </main>
    );
}
