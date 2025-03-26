import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata = {
  title: "Global Kokani Committees' Council",
  description: "Global Kokani Committees",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="title" content={metadata.title} />
        <meta name="description" content={metadata.description} />
        {/* If you want to set an image icon for the page */}
        <link rel="icon" href="/images/gkcclogo.png" />
      </head>
      <body className="antialiased">

        {children} 
        <ToastContainer />
      </body>
    </html>
  );
}
