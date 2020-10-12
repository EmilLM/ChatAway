import React from "react"

const Footer = React.memo(() => {
  return (
    <footer>
  <a
    href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
    target="_blank"
    rel="noopener noreferrer"
  > 
  Powered by{' '}  <img src="/vercel.svg" alt="Vercel Logo" className="logo" />
  </a>

    <style jsx>{`
  
      footer {
        width: 100%;
        height: 10.05vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(to top, #2980b9, #6dd5fa, #ffffff);
      }

      footer img {
        margin-left: 0.5rem;
        height: 20px;
      }

      footer a {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      a {
        color: inherit;
        text-decoration: none;
      }
    `}</style>
    </footer>
  )
});

export default Footer;