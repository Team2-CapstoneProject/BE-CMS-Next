"use client"

import { Inter } from 'next/font/google'

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

import { Provider } from "react-redux";
import Store from "./store";

// export const metadata = {
//   title: 'Azura Voyage',
//   description: 'A fullstack web and mobile apps for vila reservation.',
// }

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* <body className={inter.className}>{children}</body> */}
      <body>
        <Provider store={Store}>{children}</Provider>
      </body>
    </html>
  )
}

