// just two payments options


export default function SubscriptionPage() {
    return (
        <div className="h-max flex flex-col items-center justify-center p-8 bg-white rounded-lg">
            <div className="max-w-2xl w-full text-center">
            <header className="mb-6">
                <h1 className="text-2xl font-semibold">{`Vous n'avez pas d'abonnement actif`}</h1>
                <p className="text-sm text-gray-600 mt-2">
                {`Vous n'avez pas d'abonnement actif. Abonnez-vous pour débloquer des fonctionnalités premium et des limites plus élevées.
                `}</p>
            </header>

            <div className="mt-6">
                <a
                href="/subscribe"
                className="inline-block bg-teal-500 text-white rounded px-5 py-2 hover:bg-teal-600 transition"
                >
                {`Allez à la page d'abonnement`}
                </a>
            </div>

            <p className="text-xs text-gray-500 mt-4">
                {`Vous pouvez annuler à tout moment depuis les paramètres de votre compte après vous être abonné.`}
            </p>
            </div>
        </div>
    );
}
