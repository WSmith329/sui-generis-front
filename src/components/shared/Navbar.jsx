import { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import routes from '../../routes';


export default function Navbar() {
    const [show, setShow] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)
    const [isOpaque, setIsOpaque] = useState(false)
  
    useEffect(() => {
      const handleScroll = () => {
        const currentScrollY = window.scrollY

        setShow(currentScrollY < lastScrollY || currentScrollY < 10)

        setIsOpaque(currentScrollY > window.innerHeight)

        setLastScrollY(currentScrollY)
      }
  
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }, [lastScrollY])

    return (
        <div id='navbar-container' className={`transition-transform duration-300 ${show ? 'translate-y-0' : '-translate-y-full'}`}>
            <nav className={`w-4xl h-16 mt-8 bg-white rounded-full flex items-center py-2.5 roboto transition-colors duration-300 ${isOpaque ? 'bg-white/50 backdrop-blur-lg shadow-md' : 'bg-transparent'}`}>
                <div className='w-1/3 h-full pl-4 flex items-center gap-x-1 font-medium text-black'>
                    <div className='navbar-button'>Products</div>
                    <div className='navbar-button'>Discover</div>
                    <div className='navbar-button'>About</div>
                </div>
                <Link to={routes.home.path} className='w-1/3 h-full flex justify-center'>
                    <img src='/images/!E-grey.png' className='h-full object-contain hover:animate-spin'></img>
                </Link>
                <div className='w-1/3'></div>
            </nav>
        </div>
    )
}