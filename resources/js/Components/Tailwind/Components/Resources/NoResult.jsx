export const NoResults = ({ message = "No se encontraron resultados" }) => {
    return (
        <div className="col-span-2 md:col-span-3 flex flex-col items-center justify-center h-full w-full p-4 space-y-4">
            <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <p className="text-center text-gray-500 text-lg">{message}</p>
        </div>
    )
}

