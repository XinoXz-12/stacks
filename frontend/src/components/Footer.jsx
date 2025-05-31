import React from 'react';

const Footer = () => {
    return (
        <footer className="w-full py-6 px-6 bg-[var(--sec)] flex flex-col md:flex-row justify-between items-center overflow-x-hidden">
            <small className="text-sm mb-4 md:mb-0">© 2025 Stacks. Todos los derechos reservados.</small>
            <ul className="flex flex-wrap justify-center gap-6">
                <li>
                    <a href="" rel="noopener noreferrer" className="hover:text-pink-500 transition-colors">
                        <i className="fa-brands fa-instagram text-xl"></i>
                    </a>
                </li>
                <li>
                    <a href="" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                        <i className="fa-brands fa-x-twitter text-xl"></i>
                    </a>
                </li>
                <li>
                    <a href="" rel="noopener noreferrer" className="hover:text-[var(--white)] transition-colors">
                        <i className="fa-brands fa-tiktok text-xl"></i>
                    </a>
                </li>
                <li>
                    <a href="" rel="noopener noreferrer" className="hover:text-purple-500 transition-colors">
                        <i className="fa-brands fa-twitch text-xl"></i>
                    </a>
                </li>
                <li>
                    <a href="" rel="noopener noreferrer" className="hover:text-indigo-500 transition-colors">
                        <i className="fa-brands fa-discord text-xl"></i>
                    </a>
                </li>
            </ul>
        </footer>
    );
};

export default Footer;
