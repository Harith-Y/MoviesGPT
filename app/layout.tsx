import "./global.css"

export const metadata = {
    title: "MoviesGPT",
    description: "The place to go to, to get Movies recent data"
}

const RootLayout = ({ children }) => {
    return (
        <html lang="en">
            <head>
                <title>MoviesGPT</title>
            </head>
            <body>{children}</body>
        </html>
    )
}

export default RootLayout